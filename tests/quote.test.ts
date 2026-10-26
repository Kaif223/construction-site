import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyQuote,
  errorsForStep,
  normaliseQuote,
  parseQuote,
  quoteToText,
  validateQuote,
  type QuoteContext,
  type QuoteInput,
} from "../src/lib/quote.ts";

const context: QuoteContext = {
  markets: ["ae"],
  regions: { ae: ["dubai", "sharjah"] },
  budgets: { ae: ["under-100k", "100k-500k"] },
  serviceCategories: ["kitchens-bathrooms", "electrical"],
  materials: ["marble", "wood"],
};

const valid: QuoteInput = {
  ...emptyQuote,
  projectType: "kitchen-renovation",
  market: "ae",
  region: "dubai",
  budget: "100k-500k",
  fullName: "Alex Example",
  email: "alex@example.com",
  consent: true,
};

test("accepts a complete request", () => {
  assert.deepEqual(validateQuote(valid, context), {});
});

test("requires type, emirate, budget, name, email and consent", () => {
  const errors = validateQuote({ ...emptyQuote }, context);
  for (const field of ["projectType", "market", "budget", "fullName", "email", "consent"]) {
    assert.ok(field in errors, `expected an error for ${field}`);
  }
  assert.equal(validateQuote({ ...valid, region: "" }, context).region?.code, "required");
  assert.equal(validateQuote({ ...valid, region: "atlantis" }, context).region?.code, "required");
});

test("allows budget advice when no range fits", () => {
  assert.equal(validateQuote({ ...valid, budget: "advice" }, context).budget, undefined);
});

test("requires a phone number for phone or WhatsApp contact", () => {
  assert.equal(validateQuote({ ...valid, contactMethod: "whatsapp" }, context).phone?.code, "required");
  assert.equal(validateQuote({ ...valid, whatsappOptIn: true }, context).phone?.code, "required");
  assert.equal(validateQuote({ ...valid, contactMethod: "phone", phone: "+971 50 123 4567" }, context).phone, undefined);
  assert.equal(validateQuote({ ...valid, phone: "call me" }, context).phone?.code, "phone");
});

test("validates numbers and allowed values", () => {
  const errors = validateQuote(
    { ...valid, area: "-4", services: ["teleportation"], materials: ["unobtainium"], start: "yesterday" },
    context,
  );
  assert.equal(errors.area?.code, "positive");
  assert.equal(errors.services?.code, "invalid");
  assert.equal(errors.materials?.code, "invalid");
  assert.equal(errors.start?.code, "invalid");
});

test("floors only apply to new-build types", () => {
  assert.equal(validateQuote({ ...valid, projectType: "villa-construction", floors: "1.5" }, context).floors?.code, "floorsWhole");
  assert.equal(normaliseQuote({ ...valid, floors: "3" }).floors, "");
  assert.equal(normaliseQuote({ ...valid, projectType: "villa-construction", floors: "3" }).floors, "3");
});

test("step filtering returns only that step's errors", () => {
  const errors = validateQuote({ ...emptyQuote }, context);
  assert.deepEqual(Object.keys(errorsForStep(errors, "type")), ["projectType"]);
  assert.deepEqual(Object.keys(errorsForStep(errors, "documents")), []);
});

test("parse ignores unexpected types from untrusted JSON", () => {
  const parsed = parseQuote({ fullName: 42, services: ["a", 3, null], consent: "yes", areaUnit: "acres", intent: "x" });
  assert.ok(parsed);
  assert.equal(parsed.fullName, "");
  assert.deepEqual(parsed.services, ["a"]);
  assert.equal(parsed.consent, false);
  assert.equal(parsed.areaUnit, "sqft");
  assert.equal(parsed.intent, "quote");
  assert.equal(parseQuote("nope"), null);
});

test("plain-text summary uses localized labels and groups sections", () => {
  const text = quoteToText(valid, (_field, value) => value.toUpperCase(), (field) => field);
  assert.match(text, /projectType: KITCHEN-RENOVATION/);
  assert.match(text, /region: DUBAI/);
  assert.match(text, /\n\nfullName: Alex Example/);
});
