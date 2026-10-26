import type { InquiryErrors, InquiryInput } from "@/lib/inquiry";

export type SubmitOutcome =
  | { status: "delivered"; reference: string }
  | { status: "not-configured"; reference: string }
  | { status: "invalid"; errors: InquiryErrors }
  | { status: "error"; message: string };

/**
 * Posts an inquiry to the site's API route. The idempotency key lets a real
 * backend discard accidental duplicates if a request is retried.
 */
export async function submitInquiry(payload: InquiryInput): Promise<SubmitOutcome> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => null)) as
      | { status?: string; reference?: string; errors?: InquiryErrors; message?: string }
      | null;

    if (response.status === 422 && data?.errors) return { status: "invalid", errors: data.errors };
    if (response.ok && data?.status === "delivered") return { status: "delivered", reference: data.reference ?? "" };
    if (response.ok && data?.status === "not-configured")
      return { status: "not-configured", reference: data.reference ?? "" };
    return { status: "error", message: data?.message ?? "The server could not process the request." };
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    return {
      status: "error",
      message: aborted ? "The request timed out." : "Check your connection and try again.",
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
