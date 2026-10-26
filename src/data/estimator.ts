import type { EstimatorConfig } from "../lib/estimate";

/**
 * EXAMPLE RATES ONLY.
 *
 * These figures exist to demonstrate how the estimator works. They are not
 * researched or verified market prices for any country or city. Before launch,
 * replace them with rates the business has validated for the markets it
 * actually serves — every number the UI shows is derived from this object.
 */
export const estimatorConfig: EstimatorConfig = {
  currency: { code: "USD", locale: "en-US" },
  rateDisclaimer:
    "Calculated from illustrative example rates, not verified current market prices.",
  area: { minSqm: 10, maxSqm: 20000 },
  perAdditionalFloor: 0.035,
  roundTo: 500,
  projectTypes: [
    {
      id: "house",
      label: "Family house",
      description: "Detached or semi-detached home",
      ratePerSqm: [700, 1000],
      maxFloors: 4,
      included: [
        "Groundworks and foundations",
        "Structure, walls and roof",
        "Electrical and plumbing installation",
        "Plastering, flooring and painting",
        "Standard doors, windows and sanitaryware",
      ],
    },
    {
      id: "villa",
      label: "Luxury villa",
      description: "High-specification residence",
      ratePerSqm: [1000, 1500],
      maxFloors: 4,
      included: [
        "Groundworks and foundations",
        "Structure, walls and roof",
        "Electrical, plumbing and lighting design",
        "Premium flooring and stone allowances",
        "Joinery, doors, windows and sanitaryware",
      ],
    },
    {
      id: "multi-unit",
      label: "Apartments / multi-unit",
      description: "Residential building with several units",
      ratePerSqm: [800, 1150],
      maxFloors: 12,
      included: [
        "Groundworks and foundations",
        "Structural frame and envelope",
        "Common areas and circulation",
        "Unit services and finishes",
      ],
    },
    {
      id: "commercial",
      label: "Commercial building",
      description: "Office, retail or mixed-use",
      ratePerSqm: [900, 1400],
      maxFloors: 12,
      included: [
        "Groundworks and foundations",
        "Structural frame and façade",
        "Core services and distribution",
        "Shell-and-core finishes",
      ],
    },
    {
      id: "industrial",
      label: "Warehouse / industrial",
      description: "Large-span storage or light industry",
      ratePerSqm: [450, 750],
      maxFloors: 3,
      included: [
        "Groundworks and industrial slab",
        "Portal frame and cladding",
        "Basic electrical and drainage",
        "Loading areas allowance",
      ],
    },
    {
      id: "fit-out",
      label: "Interior fit-out",
      description: "Finishing an existing shell",
      ratePerSqm: [350, 650],
      maxFloors: 12,
      included: [
        "Partitions and ceilings",
        "Electrical and plumbing distribution",
        "Flooring, wall finishes and painting",
        "Joinery and fixtures allowance",
      ],
    },
  ],
  workTypes: [
    {
      id: "new",
      label: "New construction",
      description: "Building from an empty site or shell",
      factor: 1,
    },
    {
      id: "major-renovation",
      label: "Major renovation",
      description: "Strip-out, services renewal and refinishing",
      factor: 0.6,
      includedOverride: [
        "Strip-out and disposal",
        "Repairs to existing structure (allowance)",
        "New electrical and plumbing installation",
        "Plastering, flooring and painting",
      ],
    },
    {
      id: "light-renovation",
      label: "Light renovation",
      description: "Refinishing without major services changes",
      factor: 0.32,
      includedOverride: [
        "Surface preparation and minor repairs",
        "Flooring and wall finishes",
        "Painting",
        "Fixture replacement allowance",
      ],
    },
  ],
  finishLevels: [
    { id: "essential", label: "Essential", description: "Durable, cost-conscious finishes", factor: 0.85 },
    { id: "standard", label: "Standard", description: "Good-quality mid-range finishes", factor: 1 },
    { id: "premium", label: "Premium", description: "Stone, engineered timber, designer fittings", factor: 1.35 },
    { id: "luxury", label: "Luxury", description: "Bespoke joinery, marble, specialist lighting", factor: 1.8 },
  ],
  markets: [
    { id: "lower", label: "Lower-cost market", description: "Below-average labour and material costs", factor: 0.8 },
    { id: "average", label: "Average market", description: "Typical regional costs", factor: 1 },
    { id: "higher", label: "Higher-cost market", description: "Above-average costs", factor: 1.25 },
    { id: "metro", label: "Major metropolitan", description: "Dense city with access constraints", factor: 1.5 },
  ],
  specialistServices: [
    { id: "design", label: "Architectural & structural design", description: "Drawings and engineering", kind: "percent", percent: [0.05, 0.08] },
    { id: "hvac", label: "Central HVAC system", description: "Ducted cooling and heating", kind: "perArea", ratePerSqm: [60, 120] },
    { id: "solar", label: "Solar energy system", description: "Panels, inverter and installation", kind: "lumpSum", amount: [6000, 15000] },
    { id: "smart-home", label: "Smart-home automation", description: "Lighting, climate and security control", kind: "perArea", ratePerSqm: [25, 60] },
    { id: "fire-security", label: "Fire & security systems", description: "Detection, alarms, CCTV, access", kind: "perArea", ratePerSqm: [15, 40] },
    { id: "pool", label: "Swimming pool", description: "Structure, finishes and filtration", kind: "lumpSum", amount: [30000, 70000] },
    { id: "landscaping", label: "Landscaping & outdoor works", description: "Hard and soft landscaping", kind: "lumpSum", amount: [8000, 30000] },
  ],
  additionalRequirements: [
    { id: "demolition", label: "Demolition of existing structure", description: "Removal and disposal", kind: "perArea", ratePerSqm: [30, 70] },
    { id: "basement", label: "Basement", description: "Excavation, retaining and waterproofing", kind: "percent", percent: [0.12, 0.22] },
    { id: "difficult-site", label: "Difficult site or access", description: "Slopes, poor soil or restricted access", kind: "percent", percent: [0.05, 0.12] },
  ],
  exclusions: [
    "Land purchase and legal costs",
    "Permits, approvals and authority fees",
    "Taxes and statutory charges",
    "Furniture, appliances and soft furnishings",
    "Unforeseen ground or structural conditions",
    "Price changes in materials and labour after the estimate date",
  ],
};
