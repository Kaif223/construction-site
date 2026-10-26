import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateEstimate,
  convertArea,
  SQFT_TO_SQM,
  toSquareMetres,
  type EstimateInput,
} from "../src/lib/estimate.ts";
import { estimatorConfig } from "../src/data/estimator.ts";

const base: EstimateInput = {
  projectType: "house",
  area: 200,
  unit: "sqm",
  floors: 1,
  workType: "new",
  finishLevel: "standard",
  market: "average",
  specialistServices: [],
  additionalRequirements: [],
};

test("converts square feet to square metres", () => {
  assert.equal(toSquareMetres(1000, "sqft"), 1000 * SQFT_TO_SQM);
  assert.equal(convertArea(100, "sqm", "sqft"), 1076);
  assert.equal(convertArea(1076, "sqft", "sqm"), 100);
});

test("base estimate uses the configured rate range", () => {
  const outcome = calculateEstimate(base, estimatorConfig);
  assert.ok(outcome.ok);
  // 200 m² × 700–1000 per m², all multipliers at 1.
  assert.equal(outcome.result.low, 140000);
  assert.equal(outcome.result.high, 200000);
});

test("same area in sqft and sqm produces the same estimate", () => {
  const metric = calculateEstimate({ ...base, area: 185.806 }, estimatorConfig);
  const imperial = calculateEstimate({ ...base, area: 2000, unit: "sqft" }, estimatorConfig);
  assert.ok(metric.ok && imperial.ok);
  assert.equal(metric.result.low, imperial.result.low);
  assert.equal(metric.result.high, imperial.result.high);
});

test("multipliers and add-ons increase the range", () => {
  const outcome = calculateEstimate(
    { ...base, finishLevel: "luxury", floors: 2, specialistServices: ["solar"] },
    estimatorConfig,
  );
  assert.ok(outcome.ok);
  assert.equal(outcome.result.lines.length, 2);
  assert.ok(outcome.result.low > 140000 * 1.8);
  assert.ok(outcome.result.included.includes("Solar energy system"));
});

test("renovation is cheaper than new construction", () => {
  const renovation = calculateEstimate({ ...base, workType: "light-renovation" }, estimatorConfig);
  assert.ok(renovation.ok);
  assert.ok(renovation.result.high < 200000);
});

test("rejects invalid input instead of calculating", () => {
  const cases: Partial<EstimateInput>[] = [
    { area: null },
    { area: Number.NaN },
    { area: 2 },
    { area: 5_000_000 },
    { floors: 0 },
    { floors: 1.5 },
    { floors: 40 },
    { projectType: "spaceship" },
  ];
  for (const change of cases) {
    const outcome = calculateEstimate({ ...base, ...change }, estimatorConfig);
    assert.equal(outcome.ok, false, JSON.stringify(change));
  }
});
