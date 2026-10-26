import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateEstimate,
  convertArea,
  formatMoney,
  SQFT_PER_SQM,
  toSquareMetres,
  type EstimateInput,
  type RateTable,
} from "../src/lib/estimate.ts";
import { aeExampleRates } from "../src/data/rates/ae-example.ts";

const regions = ["dubai", "abu-dhabi"];

const base: EstimateInput = {
  projectType: "villa",
  area: 3000,
  unit: "sqft",
  floors: 1,
  workType: "new",
  finishLevel: "standard",
  region: null,
  addOns: [],
};

test("converts between square feet and square metres", () => {
  assert.ok(Math.abs(toSquareMetres(1076.391, "sqft") - 100) < 1e-3);
  assert.equal(convertArea(100, "sqm", "sqft"), 1076);
  assert.equal(convertArea(1076, "sqft", "sqm"), 100);
  assert.equal(convertArea(250, "sqm", "sqm"), 250);
  assert.ok(Math.abs(SQFT_PER_SQM - 10.7639104) < 1e-6);
});

test("uses the rate table's unit and range", () => {
  const outcome = calculateEstimate(base, aeExampleRates, regions);
  assert.ok(outcome.ok && outcome.result.kind === "estimate");
  // 3,000 ft² × AED 240–320 per ft² (standard villa), no multipliers.
  assert.equal(outcome.result.low, 720000);
  assert.equal(outcome.result.high, 960000);
  assert.equal(outcome.result.currency, "AED");
});

test("square metres and square feet give the same estimate", () => {
  const sqft = calculateEstimate({ ...base, area: 1076.391 * 3, unit: "sqft" }, aeExampleRates, regions);
  const sqm = calculateEstimate({ ...base, area: 300, unit: "sqm" }, aeExampleRates, regions);
  assert.ok(sqft.ok && sqm.ok && sqft.result.kind === "estimate" && sqm.result.kind === "estimate");
  assert.equal(sqft.result.low, sqm.result.low);
  assert.equal(sqft.result.high, sqm.result.high);
});

test("example rates are always flagged as examples, and tax is never added", () => {
  const outcome = calculateEstimate(base, aeExampleRates, regions);
  assert.ok(outcome.ok && outcome.result.kind === "estimate");
  assert.equal(outcome.result.status, "example");
  assert.equal(outcome.result.reviewedOn, null);
  assert.equal(outcome.result.taxIncluded, false);
  assert.ok(outcome.result.exclusions.includes("tax"));
});

test("missing rates produce no figures instead of a fabricated estimate", () => {
  const outcome = calculateEstimate(
    { ...base, projectType: "warehouse", finishLevel: "luxury" },
    aeExampleRates,
    regions,
  );
  assert.ok(outcome.ok);
  assert.equal(outcome.result.kind, "no-rates");
  assert.equal("low" in outcome.result, false);
});

test("an empty rate table never produces numbers", () => {
  const empty: RateTable = {
    ...aeExampleRates,
    projectTypes: aeExampleRates.projectTypes.map((type) => ({ ...type, rates: {} })),
  };
  for (const projectType of empty.projectTypes) {
    const outcome = calculateEstimate({ ...base, projectType: projectType.id }, empty, regions);
    assert.ok(outcome.ok && outcome.result.kind === "no-rates", projectType.id);
  }
});

test("region factors apply only when configured", () => {
  const plain = calculateEstimate({ ...base, region: "dubai" }, aeExampleRates, regions);
  const adjusted = calculateEstimate(
    { ...base, region: "dubai" },
    { ...aeExampleRates, regionFactors: { dubai: 1.1 } },
    regions,
  );
  assert.ok(plain.ok && adjusted.ok && plain.result.kind === "estimate" && adjusted.result.kind === "estimate");
  assert.equal(plain.result.low, 720000);
  assert.equal(adjusted.result.low, 792000);
});

test("add-ons, floors and renovation factors change the range", () => {
  const outcome = calculateEstimate(
    { ...base, floors: 2, addOns: ["solar", "hvac"], workType: "major-renovation" },
    aeExampleRates,
    regions,
  );
  assert.ok(outcome.ok && outcome.result.kind === "estimate");
  assert.equal(outcome.result.lines.length, 3);
  assert.ok(outcome.result.included.includes("solar"));
  assert.ok(outcome.result.low < 960000 * 1.2);
});

test("rejects invalid input instead of calculating", () => {
  const cases: Partial<EstimateInput>[] = [
    { area: null },
    { area: Number.NaN },
    { area: 50 },
    { area: 50_000_000 },
    { floors: 0 },
    { floors: 1.5 },
    { floors: 40 },
    { projectType: "spaceship" },
    { region: "atlantis" },
    { addOns: ["teleporter"] },
  ];
  for (const change of cases) {
    const outcome = calculateEstimate({ ...base, ...change }, aeExampleRates, regions);
    assert.equal(outcome.ok, false, JSON.stringify(change));
  }
});

test("formats AED for English and Arabic", () => {
  assert.match(formatMoney(720000, "AED", "en-AE"), /AED\s?720,000/);
  assert.match(formatMoney(720000, "AED", "ar-AE"), /720,000|٧٢٠٬٠٠٠/);
});
