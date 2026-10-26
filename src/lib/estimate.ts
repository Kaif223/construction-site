/**
 * Preliminary construction budget calculator.
 *
 * Pure functions only — no React, no path aliases — so the logic can be unit
 * tested with Node's built-in test runner and reused on the server later.
 */

export const SQFT_TO_SQM = 0.09290304;

export type Range = readonly [low: number, high: number];
export type AreaUnit = "sqm" | "sqft";

export type ProjectTypeOption = {
  id: string;
  label: string;
  description: string;
  /** Example cost per square metre at "standard" finish for new construction. */
  ratePerSqm: Range;
  maxFloors: number;
  included: string[];
};

export type Multiplier = { id: string; label: string; description: string; factor: number };

export type AddOn = {
  id: string;
  label: string;
  description: string;
} & (
  | { kind: "perArea"; ratePerSqm: Range }
  | { kind: "lumpSum"; amount: Range }
  | { kind: "percent"; percent: Range }
);

export type EstimatorConfig = {
  currency: { code: string; locale: string };
  /** Shown beside every figure so nobody mistakes them for quotes. */
  rateDisclaimer: string;
  area: { minSqm: number; maxSqm: number };
  /** Extra cost per floor above the first (structure, access, lifting). */
  perAdditionalFloor: number;
  roundTo: number;
  projectTypes: ProjectTypeOption[];
  workTypes: (Multiplier & { includedOverride?: string[] })[];
  finishLevels: Multiplier[];
  markets: Multiplier[];
  specialistServices: AddOn[];
  additionalRequirements: AddOn[];
  exclusions: string[];
};

export type EstimateInput = {
  projectType: string;
  area: number | null;
  unit: AreaUnit;
  floors: number | null;
  workType: string;
  finishLevel: string;
  market: string;
  specialistServices: string[];
  additionalRequirements: string[];
};

export type EstimateErrors = Partial<Record<keyof EstimateInput, string>>;

export type EstimateLine = { label: string; low: number; high: number };

export type EstimateResult = {
  areaSqm: number;
  areaSqft: number;
  low: number;
  high: number;
  lines: EstimateLine[];
  included: string[];
  exclusions: string[];
};

export function toSquareMetres(area: number, unit: AreaUnit) {
  return unit === "sqft" ? area * SQFT_TO_SQM : area;
}

export function fromSquareMetres(areaSqm: number, unit: AreaUnit) {
  return unit === "sqft" ? areaSqm / SQFT_TO_SQM : areaSqm;
}

/** Converts an entered area to the other unit, keeping a sensible precision. */
export function convertArea(area: number, from: AreaUnit, to: AreaUnit) {
  if (from === to) return area;
  return Math.round(fromSquareMetres(toSquareMetres(area, from), to));
}

export function validateEstimateInput(
  input: EstimateInput,
  config: EstimatorConfig,
): EstimateErrors {
  const errors: EstimateErrors = {};
  const projectType = config.projectTypes.find((type) => type.id === input.projectType);

  if (!projectType) errors.projectType = "Choose a project type.";
  if (!config.workTypes.some((type) => type.id === input.workType))
    errors.workType = "Choose new construction or renovation.";
  if (!config.finishLevels.some((level) => level.id === input.finishLevel))
    errors.finishLevel = "Choose a finishing level.";
  if (!config.markets.some((market) => market.id === input.market))
    errors.market = "Choose a market.";

  if (input.area === null || !Number.isFinite(input.area)) {
    errors.area = "Enter the approximate covered area.";
  } else {
    const sqm = toSquareMetres(input.area, input.unit);
    const min = Math.ceil(fromSquareMetres(config.area.minSqm, input.unit));
    const max = Math.floor(fromSquareMetres(config.area.maxSqm, input.unit));
    const unitLabel = input.unit === "sqm" ? "m²" : "ft²";
    if (sqm < config.area.minSqm) errors.area = `Enter at least ${min.toLocaleString("en")} ${unitLabel}.`;
    else if (sqm > config.area.maxSqm)
      errors.area = `For areas above ${max.toLocaleString("en")} ${unitLabel}, please request a detailed quotation.`;
  }

  const maxFloors = projectType?.maxFloors ?? 1;
  if (input.floors === null || !Number.isInteger(input.floors) || input.floors < 1) {
    errors.floors = "Enter a whole number of floors (1 or more).";
  } else if (input.floors > maxFloors) {
    errors.floors = `This estimator supports up to ${maxFloors} floors for this project type.`;
  }

  return errors;
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function calculateEstimate(
  input: EstimateInput,
  config: EstimatorConfig,
): { ok: true; result: EstimateResult } | { ok: false; errors: EstimateErrors } {
  const errors = validateEstimateInput(input, config);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // Validation guarantees these lookups succeed.
  const projectType = config.projectTypes.find((type) => type.id === input.projectType)!;
  const workType = config.workTypes.find((type) => type.id === input.workType)!;
  const finish = config.finishLevels.find((level) => level.id === input.finishLevel)!;
  const market = config.markets.find((item) => item.id === input.market)!;

  const areaSqm = toSquareMetres(input.area!, input.unit);
  const floorFactor = 1 + config.perAdditionalFloor * (input.floors! - 1);
  const factor = workType.factor * finish.factor * market.factor * floorFactor;

  const baseLow = projectType.ratePerSqm[0] * areaSqm * factor;
  const baseHigh = projectType.ratePerSqm[1] * areaSqm * factor;

  const lines: EstimateLine[] = [
    { label: `${projectType.label} — ${workType.label.toLowerCase()}`, low: baseLow, high: baseHigh },
  ];

  const addOns = [
    ...config.specialistServices.filter((addOn) => input.specialistServices.includes(addOn.id)),
    ...config.additionalRequirements.filter((addOn) =>
      input.additionalRequirements.includes(addOn.id),
    ),
  ];

  for (const addOn of addOns) {
    let low: number;
    let high: number;
    if (addOn.kind === "perArea") {
      low = addOn.ratePerSqm[0] * areaSqm * market.factor;
      high = addOn.ratePerSqm[1] * areaSqm * market.factor;
    } else if (addOn.kind === "lumpSum") {
      low = addOn.amount[0] * market.factor;
      high = addOn.amount[1] * market.factor;
    } else {
      low = baseLow * addOn.percent[0];
      high = baseHigh * addOn.percent[1];
    }
    lines.push({ label: addOn.label, low, high });
  }

  const roundedLines = lines.map((line) => ({
    ...line,
    low: roundTo(line.low, config.roundTo),
    high: roundTo(line.high, config.roundTo),
  }));

  return {
    ok: true,
    result: {
      areaSqm,
      areaSqft: areaSqm / SQFT_TO_SQM,
      low: roundedLines.reduce((sum, line) => sum + line.low, 0),
      high: roundedLines.reduce((sum, line) => sum + line.high, 0),
      lines: roundedLines,
      included: [
        ...(workType.includedOverride ?? projectType.included),
        ...addOns.map((addOn) => addOn.label),
      ],
      exclusions: config.exclusions,
    },
  };
}

export function formatMoney(value: number, currency: EstimatorConfig["currency"]) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}
