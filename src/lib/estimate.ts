/**
 * Preliminary construction budget calculator.
 *
 * Pure functions only — no React, no path aliases — so the logic can be unit
 * tested with Node's built-in test runner and reused on the server.
 *
 * Rates come from a per-market RateTable (src/data/rates). A missing rate is
 * never filled in: the result is `kind: "no-rates"` and the UI offers a
 * quotation instead of a number. Labels are not stored here; the UI looks
 * them up by id in the active language's dictionary.
 */

export const SQFT_PER_SQM = 10.763910416709722;

export type Range = readonly [low: number, high: number];
export type AreaUnit = "sqm" | "sqft";
export type FinishLevel = "essential" | "standard" | "premium" | "luxury";

export const finishLevels: FinishLevel[] = ["essential", "standard", "premium", "luxury"];

export type RateAddOn = {
  id: string;
  group: "specialist" | "materials" | "site";
} & (
  | { kind: "perArea"; rate: Range }
  | { kind: "lumpSum"; amount: Range }
  | { kind: "percent"; percent: Range }
);

export type RateTable = {
  id: string;
  market: string;
  currency: string;
  /** "example" figures are illustrative and must never be presented as prices. */
  status: "example" | "verified";
  /** ISO date the rates were last reviewed; null when never reviewed. */
  reviewedOn: string | null;
  source: string | null;
  /** The area unit that per-area rates are expressed in. */
  unit: AreaUnit;
  taxIncluded: boolean;
  includes: { design: boolean; permits: boolean; materials: boolean; specialistServices: boolean };
  /** Accepted total covered area, in square metres. */
  areaSqm: { min: number; max: number };
  perAdditionalFloor: number;
  roundTo: number;
  projectTypes: {
    id: string;
    maxFloors: number;
    /** Rates per `unit` for each finish level. A missing level has no rate. */
    rates: Partial<Record<FinishLevel, Range>>;
    included: string[];
  }[];
  workTypes: { id: string; factor: number; included?: string[] }[];
  addOns: RateAddOn[];
  /** Optional location adjustments. Absent regions are not adjusted. */
  regionFactors: Record<string, number>;
  assumptions: string[];
  exclusions: string[];
};

export type EstimateInput = {
  projectType: string;
  area: number | null;
  unit: AreaUnit;
  floors: number | null;
  workType: string;
  finishLevel: FinishLevel;
  region: string | null;
  addOns: string[];
};

export type EstimateErrorCode =
  | "required"
  | "invalid"
  | "areaMin"
  | "areaMax"
  | "floorsWhole"
  | "floorsMax";

export type EstimateError = { code: EstimateErrorCode; values?: Record<string, number | string> };
export type EstimateErrors = Partial<Record<keyof EstimateInput, EstimateError>>;

export type EstimateLine = { id: string; low: number; high: number };

export type EstimateResult = {
  kind: "estimate";
  status: RateTable["status"];
  reviewedOn: string | null;
  currency: string;
  taxIncluded: boolean;
  areaSqm: number;
  areaSqft: number;
  low: number;
  high: number;
  lines: EstimateLine[];
  included: string[];
  exclusions: string[];
  assumptions: string[];
  includes: RateTable["includes"];
};

export type EstimateOutcome =
  | { ok: false; errors: EstimateErrors }
  | { ok: true; result: EstimateResult }
  | { ok: true; result: { kind: "no-rates"; projectType: string; finishLevel: FinishLevel } };

export function toSquareMetres(area: number, unit: AreaUnit) {
  return unit === "sqft" ? area / SQFT_PER_SQM : area;
}

export function fromSquareMetres(areaSqm: number, unit: AreaUnit) {
  return unit === "sqft" ? areaSqm * SQFT_PER_SQM : areaSqm;
}

/** Converts an entered area to another unit, rounded to a whole number. */
export function convertArea(area: number, from: AreaUnit, to: AreaUnit) {
  if (from === to) return area;
  return Math.round(fromSquareMetres(toSquareMetres(area, from), to));
}

export function validateEstimateInput(
  input: EstimateInput,
  table: RateTable,
  regionIds: string[] = [],
): EstimateErrors {
  const errors: EstimateErrors = {};
  const projectType = table.projectTypes.find((type) => type.id === input.projectType);

  if (!projectType) errors.projectType = { code: "required" };
  if (!table.workTypes.some((type) => type.id === input.workType)) errors.workType = { code: "required" };
  if (!finishLevels.includes(input.finishLevel)) errors.finishLevel = { code: "required" };
  if (input.region !== null && !regionIds.includes(input.region)) errors.region = { code: "invalid" };
  if (input.addOns.some((id) => !table.addOns.some((addOn) => addOn.id === id))) errors.addOns = { code: "invalid" };

  if (input.area === null || !Number.isFinite(input.area)) {
    errors.area = { code: "required" };
  } else {
    const sqm = toSquareMetres(input.area, input.unit);
    if (sqm < table.areaSqm.min) {
      errors.area = { code: "areaMin", values: { min: Math.ceil(fromSquareMetres(table.areaSqm.min, input.unit)) } };
    } else if (sqm > table.areaSqm.max) {
      errors.area = { code: "areaMax", values: { max: Math.floor(fromSquareMetres(table.areaSqm.max, input.unit)) } };
    }
  }

  const maxFloors = projectType?.maxFloors ?? 1;
  if (input.floors === null || !Number.isInteger(input.floors) || input.floors < 1) {
    errors.floors = { code: "floorsWhole" };
  } else if (input.floors > maxFloors) {
    errors.floors = { code: "floorsMax", values: { max: maxFloors } };
  }

  return errors;
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function calculateEstimate(input: EstimateInput, table: RateTable, regionIds: string[] = []): EstimateOutcome {
  const errors = validateEstimateInput(input, table, regionIds);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // Validation guarantees these lookups succeed.
  const projectType = table.projectTypes.find((type) => type.id === input.projectType)!;
  const workType = table.workTypes.find((type) => type.id === input.workType)!;
  const rate = projectType.rates[input.finishLevel];
  if (!rate) {
    return { ok: true, result: { kind: "no-rates", projectType: projectType.id, finishLevel: input.finishLevel } };
  }

  const areaSqm = toSquareMetres(input.area!, input.unit);
  const areaInRateUnit = fromSquareMetres(areaSqm, table.unit);
  const regionFactor = (input.region && table.regionFactors[input.region]) || 1;
  const floorFactor = 1 + table.perAdditionalFloor * (input.floors! - 1);
  const factor = workType.factor * floorFactor * regionFactor;

  const baseLow = rate[0] * areaInRateUnit * factor;
  const baseHigh = rate[1] * areaInRateUnit * factor;
  const lines: EstimateLine[] = [{ id: "base", low: baseLow, high: baseHigh }];

  const selected = table.addOns.filter((addOn) => input.addOns.includes(addOn.id));
  for (const addOn of selected) {
    if (addOn.kind === "perArea") {
      lines.push({
        id: addOn.id,
        low: addOn.rate[0] * areaInRateUnit * regionFactor,
        high: addOn.rate[1] * areaInRateUnit * regionFactor,
      });
    } else if (addOn.kind === "lumpSum") {
      lines.push({ id: addOn.id, low: addOn.amount[0] * regionFactor, high: addOn.amount[1] * regionFactor });
    } else {
      lines.push({ id: addOn.id, low: baseLow * addOn.percent[0], high: baseHigh * addOn.percent[1] });
    }
  }

  const rounded = lines.map((line) => ({
    ...line,
    low: roundTo(line.low, table.roundTo),
    high: roundTo(line.high, table.roundTo),
  }));

  return {
    ok: true,
    result: {
      kind: "estimate",
      status: table.status,
      reviewedOn: table.reviewedOn,
      currency: table.currency,
      taxIncluded: table.taxIncluded,
      areaSqm,
      areaSqft: fromSquareMetres(areaSqm, "sqft"),
      low: rounded.reduce((sum, line) => sum + line.low, 0),
      high: rounded.reduce((sum, line) => sum + line.high, 0),
      lines: rounded,
      included: [...(workType.included ?? projectType.included), ...selected.map((addOn) => addOn.id)],
      exclusions: table.exclusions,
      assumptions: table.assumptions,
      includes: table.includes,
    },
  };
}

/** Locale-aware currency formatting, e.g. "AED 250,000" or "‏250,000 د.إ.‏". */
export function formatMoney(value: number, currency: string, localeTag: string, fractionDigits = 0) {
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatNumber(value: number, localeTag: string, fractionDigits = 0) {
  return new Intl.NumberFormat(localeTag, { maximumFractionDigits: fractionDigits }).format(value);
}
