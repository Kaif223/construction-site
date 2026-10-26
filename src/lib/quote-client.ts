import type { QuoteErrors, QuoteInput } from "@/lib/quote";

export type SubmitOutcome =
  | { status: "delivered"; reference: string }
  | { status: "not-configured"; reference: string }
  | { status: "invalid"; errors: QuoteErrors }
  | { status: "error"; reason: "rate-limited" | "timeout" | "network" | "server" };

/**
 * Posts a quotation request to the site's API route. The idempotency key lets
 * a real backend discard accidental duplicates if a request is retried.
 */
export async function submitQuote(payload: QuoteInput, idempotencyKey: string): Promise<SubmitOutcome> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => null)) as
      | { status?: string; reference?: string; errors?: QuoteErrors }
      | null;

    if (response.status === 429) return { status: "error", reason: "rate-limited" };
    if (response.status === 422 && data?.errors) return { status: "invalid", errors: data.errors };
    if (response.ok && data?.status === "delivered") return { status: "delivered", reference: data.reference ?? "" };
    if (response.ok && data?.status === "not-configured") return { status: "not-configured", reference: data.reference ?? "" };
    return { status: "error", reason: "server" };
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    return { status: "error", reason: aborted ? "timeout" : "network" };
  } finally {
    window.clearTimeout(timeout);
  }
}
