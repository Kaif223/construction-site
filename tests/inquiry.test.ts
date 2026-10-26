import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyInquiry,
  inquiryToText,
  normaliseInquiry,
  parseInquiry,
  validateInquiry,
  type InquiryInput,
} from "../src/lib/inquiry.ts";

const valid: InquiryInput = {
  ...emptyInquiry,
  fullName: "Alex Example",
  email: "alex@example.com",
  projectType: "renovation",
  location: "Test City",
  description: "Full kitchen and bathroom renovation in a two-bedroom flat.",
};

test("accepts a complete inquiry", () => {
  assert.deepEqual(validateInquiry(valid), {});
});

test("requires name, email, project type, location and description", () => {
  const errors = validateInquiry(emptyInquiry);
  for (const field of ["fullName", "email", "projectType", "location", "description"]) {
    assert.ok(field in errors, `expected an error for ${field}`);
  }
});

test("requires a phone number when phone contact is preferred", () => {
  assert.ok(validateInquiry({ ...valid, contactMethod: "phone" }).phone);
  assert.equal(validateInquiry({ ...valid, contactMethod: "phone", phone: "+1 555 0100" }).phone, undefined);
});

test("requires a trade for specialist work only", () => {
  assert.ok(validateInquiry({ ...valid, projectType: "specialist" }).trade);
  assert.equal(validateInquiry({ ...valid, projectType: "specialist", trade: "electrical" }).trade, undefined);
});

test("rejects invalid email and area", () => {
  const errors = validateInquiry({ ...valid, email: "not-an-email", area: "-4" });
  assert.ok(errors.email);
  assert.ok(errors.area);
});

test("normalise drops conditional answers that no longer apply", () => {
  const result = normaliseInquiry({ ...valid, trade: "electrical", plotStatus: "owned", occupancy: "vacant" });
  assert.equal(result.trade, "");
  assert.equal(result.plotStatus, "");
  assert.equal(result.occupancy, "vacant");
});

test("parse ignores unexpected types from untrusted JSON", () => {
  const parsed = parseInquiry({ fullName: 42, services: ["a", 3, null], consent: "yes", areaUnit: "acres" });
  assert.ok(parsed);
  assert.equal(parsed.fullName, "");
  assert.deepEqual(parsed.services, ["a"]);
  assert.equal(parsed.consent, false);
  assert.equal(parsed.areaUnit, "sqm");
  assert.equal(parseInquiry("nope"), null);
});

test("plain-text summary includes key details", () => {
  const text = inquiryToText(valid);
  assert.match(text, /Alex Example/);
  assert.match(text, /Renovation/);
  assert.match(text, /Project description:/);
});
