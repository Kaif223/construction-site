import { test } from "node:test";
import assert from "node:assert/strict";
import { mailtoLink, telLink, whatsAppLink } from "../src/lib/contact.ts";
import { createRateLimiter } from "../src/lib/rate-limit.ts";

test("WhatsApp links use the configured number and encode the message", () => {
  const link = whatsAppLink("+971 4 123 4567", "Kitchen renovation — Dubai & Sharjah?");
  assert.equal(link, "https://wa.me/97141234567?text=Kitchen%20renovation%20%E2%80%94%20Dubai%20%26%20Sharjah%3F");
});

test("no WhatsApp or phone link without a valid configured number", () => {
  assert.equal(whatsAppLink(null, "hi"), null);
  assert.equal(whatsAppLink("0501234567"), null);
  assert.equal(telLink(null), null);
  assert.equal(telLink("+971 4 123 4567"), "tel:+97141234567");
});

test("mailto links encode subject and body", () => {
  assert.equal(mailtoLink(null), null);
  assert.equal(mailtoLink("a@example.com", "Hi there", "Line 1\nLine 2"), "mailto:a@example.com?subject=Hi%20there&body=Line%201%0ALine%202");
});

test("rate limiter blocks after the limit and resets after the window", () => {
  const check = createRateLimiter({ limit: 2, windowMs: 1000 });
  assert.equal(check("ip", 0).allowed, true);
  assert.equal(check("ip", 10).allowed, true);
  const blocked = check("ip", 20);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 1);
  assert.equal(check("other", 20).allowed, true);
  assert.equal(check("ip", 1001).allowed, true);
});
