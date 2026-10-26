import { test } from "node:test";
import assert from "node:assert/strict";
import { format, plural } from "../src/i18n/format.ts";
import { en } from "../src/i18n/dictionaries/en.ts";
import { ar } from "../src/i18n/dictionaries/ar.ts";

test("fills placeholders and leaves unknown ones", () => {
  assert.equal(format("{a} and {b}", { a: 1 }), "1 and {b}");
});

test("English plurals", () => {
  assert.equal(plural(en.plurals.service, 1, "en-AE"), "1 service");
  assert.equal(plural(en.plurals.service, 136, "en-AE"), "136 services");
});

test("Arabic plurals follow 1 / 2 / 3–10 / 11+ forms", () => {
  assert.equal(plural(ar.plurals.service, 1, "ar-AE"), "خدمة واحدة");
  assert.equal(plural(ar.plurals.service, 2, "ar-AE"), "خدمتان");
  assert.equal(plural(ar.plurals.service, 5, "ar-AE"), "5 خدمات");
  assert.equal(plural(ar.plurals.service, 19, "ar-AE"), "19 خدمة");
  assert.equal(plural(ar.plurals.service, 136, "ar-AE"), "136 خدمة");
});

test("every Arabic string keeps the same placeholders as English", () => {
  const walk = (a: unknown, b: unknown, path: string) => {
    if (typeof a === "string" && typeof b === "string") {
      const keys = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
      if (!path.startsWith("dict.plurals")) assert.equal(keys(b), keys(a), path);
      return;
    }
    if (a && typeof a === "object" && b && typeof b === "object") {
      for (const key of Object.keys(a)) walk((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], `${path}.${key}`);
    }
  };
  walk(en, ar, "dict");
});
