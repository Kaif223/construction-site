import type { RateTable } from "../../lib/estimate";

/**
 * ILLUSTRATIVE EXAMPLE RATES — NOT UAE MARKET PRICES.
 *
 * These numbers exist only to demonstrate how the estimator calculates. They
 * have not been researched or reviewed (`reviewedOn: null`), and the UI only
 * shows results from this table after the visitor explicitly chooses to
 * preview illustrative figures. Replace with reviewed rates and set
 * `status: "verified"` and `reviewedOn` before showing estimates by default.
 *
 * Gaps are intentional: where a finish level has no rate, the estimator says
 * so instead of calculating one.
 */
export const aeExampleRates: RateTable = {
  id: "ae-example",
  market: "ae",
  currency: "AED",
  status: "example",
  reviewedOn: null,
  source: null,
  unit: "sqft",
  taxIncluded: false,
  includes: { design: false, permits: false, materials: true, specialistServices: false },
  areaSqm: { min: 10, max: 20000 },
  perAdditionalFloor: 0.035,
  roundTo: 1000,
  projectTypes: [
    {
      id: "villa",
      maxFloors: 4,
      rates: { essential: [180, 240], standard: [240, 320], premium: [320, 450], luxury: [450, 700] },
      included: ["groundworks", "structure", "mep", "finishes", "fixtures"],
    },
    {
      id: "residential-building",
      maxFloors: 15,
      rates: { essential: [160, 210], standard: [210, 280], premium: [280, 380] },
      included: ["groundworks", "structure", "commonAreas", "unitServices"],
    },
    {
      id: "commercial",
      maxFloors: 15,
      rates: { essential: [170, 220], standard: [220, 300], premium: [300, 420] },
      included: ["groundworks", "structure", "coreServices", "shellFinishes"],
    },
    {
      id: "warehouse",
      maxFloors: 3,
      rates: { essential: [110, 150], standard: [150, 200] },
      included: ["industrialSlab", "portalFrame", "basicServices", "loadingAreas"],
    },
    {
      id: "interior-fit-out",
      maxFloors: 15,
      rates: { essential: [90, 140], standard: [140, 220], premium: [220, 350], luxury: [350, 600] },
      included: ["partitions", "distribution", "finishes", "joinery"],
    },
  ],
  workTypes: [
    { id: "new", factor: 1 },
    { id: "major-renovation", factor: 0.6, included: ["stripOut", "repairs", "newServices", "finishes"] },
    { id: "light-renovation", factor: 0.32, included: ["surfacePrep", "floorWallFinishes", "painting", "fixtureReplacement"] },
  ],
  addOns: [
    { id: "hvac", group: "specialist", kind: "perArea", rate: [12, 22] },
    { id: "smart-home", group: "specialist", kind: "perArea", rate: [5, 12] },
    { id: "fire-security", group: "specialist", kind: "perArea", rate: [3, 8] },
    { id: "solar", group: "specialist", kind: "lumpSum", amount: [25000, 60000] },
    { id: "pool", group: "specialist", kind: "lumpSum", amount: [90000, 220000] },
    { id: "landscaping", group: "specialist", kind: "lumpSum", amount: [30000, 120000] },
    { id: "natural-stone", group: "materials", kind: "perArea", rate: [40, 90] },
    { id: "custom-joinery", group: "materials", kind: "percent", percent: [0.04, 0.09] },
    { id: "design", group: "site", kind: "percent", percent: [0.04, 0.08] },
    { id: "demolition", group: "site", kind: "perArea", rate: [8, 20] },
    { id: "basement", group: "site", kind: "percent", percent: [0.12, 0.22] },
    { id: "difficult-site", group: "site", kind: "percent", percent: [0.05, 0.12] },
  ],
  regionFactors: {},
  assumptions: ["standardSoil", "normalAccess", "currentDesign", "noUnusualSpecs"],
  exclusions: ["land", "permits", "tax", "furniture", "groundConditions", "priceChanges"],
};
