import { siteConfig } from "@/config/site";
import { normaliseInquiry, parseInquiry, validateInquiry } from "@/lib/inquiry";

const MAX_BODY_BYTES = 20_000;

function reference() {
  return `INQ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * Project inquiry endpoint.
 *
 * Validates with the same rules as the browser form. If INQUIRY_WEBHOOK_URL is
 * configured, the inquiry is forwarded there (CRM, email service, automation
 * webhook…). Otherwise the response says plainly that nothing was delivered,
 * and the UI tells the visitor so — no fake "sent" messages.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ status: "error", message: "The inquiry is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ status: "error", message: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseInquiry(body);
  if (!parsed) {
    return Response.json({ status: "error", message: "Invalid request body." }, { status: 400 });
  }

  const inquiry = normaliseInquiry(parsed);
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length > 0) {
    return Response.json({ status: "invalid", errors }, { status: 422 });
  }

  const ref = reference();

  // Honeypot filled: respond like a normal unconfigured submission, deliver nothing.
  if (inquiry.website) {
    return Response.json({ status: "not-configured", reference: ref });
  }

  if (!siteConfig.inquiryEndpoint) {
    return Response.json({ status: "not-configured", reference: ref });
  }

  try {
    const { website: _honeypot, ...fields } = inquiry;
    void _honeypot;
    const response = await fetch(siteConfig.inquiryEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": request.headers.get("Idempotency-Key") ?? ref,
      },
      body: JSON.stringify({ reference: ref, receivedAt: new Date().toISOString(), ...fields }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Upstream responded ${response.status}`);
    return Response.json({ status: "delivered", reference: ref });
  } catch (error) {
    console.error("[inquiry] delivery failed", error);
    return Response.json(
      { status: "error", message: "The inquiry service is temporarily unavailable." },
      { status: 502 },
    );
  }
}
