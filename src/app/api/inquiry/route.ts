import { siteConfig } from "@/config/site";
import { enabledMarkets } from "@/config/markets";
import { serviceCategories } from "@/data/services";
import { materials } from "@/data/content";
import { normaliseQuote, parseQuote, validateQuote, type QuoteContext } from "@/lib/quote";
import { createRateLimiter } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 20_000;

/** Best-effort, per-instance limit. Production should also limit at the edge (see README). */
const rateLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const context: QuoteContext = {
  markets: enabledMarkets.map((market) => market.id),
  regions: Object.fromEntries(enabledMarkets.map((market) => [market.id, market.regions.map((region) => region.id)])),
  budgets: Object.fromEntries(
    enabledMarkets.map((market) => [market.id, market.quotation.budgetRanges.map((range) => range.id)]),
  ),
  serviceCategories: serviceCategories.map((category) => category.slug),
  materials: materials.map((material) => material.slug),
};

function reference() {
  return `Q-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Quotation request endpoint.
 *
 * Validates with the same rules as the browser form. If INQUIRY_WEBHOOK_URL is
 * configured, the request is forwarded there (CRM, email service, automation
 * webhook…). Otherwise the response says plainly that nothing was delivered,
 * and the UI shows a demonstration state — never a fake "sent" message.
 *
 * Documents are not accepted here; uploads need a separate secure storage
 * integration (see README).
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request));
  if (!limit.allowed) {
    return Response.json(
      { status: "error", reason: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ status: "error", reason: "too-large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ status: "error", reason: "invalid-body" }, { status: 400 });
  }

  const parsed = parseQuote(body);
  if (!parsed) return Response.json({ status: "error", reason: "invalid-body" }, { status: 400 });

  const quote = normaliseQuote(parsed);
  const errors = validateQuote(quote, context);
  if (Object.keys(errors).length > 0) return Response.json({ status: "invalid", errors }, { status: 422 });

  const ref = reference();

  // Honeypot filled: respond like a normal unconfigured submission, deliver nothing.
  if (quote.website || !siteConfig.inquiryEndpoint) {
    return Response.json({ status: "not-configured", reference: ref });
  }

  try {
    const { website: _honeypot, ...fields } = quote;
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
    console.error("[inquiry] delivery failed", error instanceof Error ? error.message : error);
    return Response.json({ status: "error", reason: "server" }, { status: 502 });
  }
}
