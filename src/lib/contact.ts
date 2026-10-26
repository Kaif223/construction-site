/**
 * Contact link builders. They only ever use numbers from the market
 * configuration, never customer data, and return null when a channel is not
 * configured so the UI can hide it.
 */

/** Digits of an E.164 number, e.g. "+971 4 123 4567" -> "97141234567". */
export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function isE164(phone: string) {
  const digits = phoneDigits(phone);
  return /^\+/.test(phone.trim()) && digits.length >= 8 && digits.length <= 15;
}

export function whatsAppLink(businessNumber: string | null, message?: string) {
  if (!businessNumber || !isE164(businessNumber)) return null;
  const base = `https://wa.me/${phoneDigits(businessNumber)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(businessNumber: string | null) {
  if (!businessNumber || !isE164(businessNumber)) return null;
  return `tel:+${phoneDigits(businessNumber)}`;
}

export function mailtoLink(address: string | null, subject?: string, body?: string) {
  if (!address) return null;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${address}${query ? `?${query}` : ""}`;
}
