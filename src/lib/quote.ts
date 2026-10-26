/**
 * Quotation request schema shared by the multi-step form and the API route,
 * so both enforce the same rules. Validation returns error codes; the UI maps
 * them to messages in the active language. No path aliases: unit-tested
 * directly with node:test.
 *
 * Supporting documents are NOT part of this payload. Files are only uploaded
 * once a secure storage endpoint is configured (see README "Integrations").
 */

import type { AreaUnit } from "./estimate";

export type ProjectGroup = "build" | "renovation" | "trade" | "maintenance" | "other";

/** Project types offered in step 1, with the service category each relates to. */
export const quoteProjectTypes: { id: string; group: ProjectGroup; category: string }[] = [
  { id: "villa-construction", group: "build", category: "residential-construction" },
  { id: "residential-building", group: "build", category: "residential-construction" },
  { id: "commercial-construction", group: "build", category: "commercial-construction" },
  { id: "apartment-renovation", group: "renovation", category: "renovation-restoration" },
  { id: "kitchen-renovation", group: "renovation", category: "kitchens-bathrooms" },
  { id: "bathroom-renovation", group: "renovation", category: "kitchens-bathrooms" },
  { id: "interior-finishing", group: "renovation", category: "interior-finishing" },
  { id: "marble-tiles", group: "trade", category: "marble-stone" },
  { id: "electrical", group: "trade", category: "electrical" },
  { id: "plumbing", group: "trade", category: "plumbing-drainage" },
  { id: "hvac", group: "trade", category: "hvac-mechanical" },
  { id: "painting", group: "trade", category: "painting-decorating" },
  { id: "landscaping", group: "trade", category: "landscaping-exterior" },
  { id: "waterproofing", group: "trade", category: "roofing-waterproofing" },
  { id: "maintenance", group: "maintenance", category: "property-maintenance" },
  { id: "other", group: "other", category: "specialist-services" },
];

export const siteTypes = ["villa", "townhouse", "apartment", "building", "office", "retail", "warehouse", "plot", "other"];
export const workTypes = ["new", "renovation", "repair"];
export const siteConditions = ["empty-plot", "under-construction", "occupied", "vacant", "needs-repair"];
export const startTimeframes = ["asap", "3-months", "3-6-months", "6-12-months", "later", "unsure"];
export const contactChannels = ["email", "phone", "whatsapp"] as const;
export const budgetFallbacks = ["advice", "prefer-not"];

export type QuoteInput = {
  intent: "quote" | "consultation";
  projectType: string;
  market: string;
  region: string;
  cityArea: string;
  siteType: string;
  area: string;
  areaUnit: AreaUnit;
  floors: string;
  workType: string;
  services: string[];
  materials: string[];
  start: string;
  condition: string;
  requirements: string;
  budget: string;
  fullName: string;
  email: string;
  phone: string;
  contactMethod: string;
  whatsappOptIn: boolean;
  notes: string;
  consent: boolean;
  marketingConsent: boolean;
  estimateSummary: string;
  /** Honeypot. Humans never see or fill this field. */
  website: string;
};

export type QuoteField = keyof QuoteInput;

export type QuoteErrorCode =
  | "required"
  | "invalid"
  | "email"
  | "phone"
  | "minLength"
  | "maxLength"
  | "positive"
  | "tooLarge"
  | "floorsWhole"
  | "consent";

export type QuoteError = { code: QuoteErrorCode; values?: Record<string, number> };
export type QuoteErrors = Partial<Record<QuoteField, QuoteError>>;

/** Allowed values that depend on the market configuration. */
export type QuoteContext = {
  markets: string[];
  regions: Record<string, string[]>;
  budgets: Record<string, string[]>;
  serviceCategories: string[];
  materials: string[];
};

export const STEPS = ["type", "location", "details", "budget", "documents", "contact", "review"] as const;
export type StepId = (typeof STEPS)[number];

/** Which fields each step owns, for step-by-step validation. */
export const stepFields: Record<StepId, QuoteField[]> = {
  type: ["projectType"],
  location: ["market", "region", "cityArea", "siteType"],
  details: ["area", "floors", "workType", "services", "materials", "start", "condition", "requirements"],
  budget: ["budget"],
  documents: [],
  contact: ["fullName", "email", "phone", "contactMethod", "notes", "consent"],
  review: [],
};

export const emptyQuote: QuoteInput = {
  intent: "quote",
  projectType: "",
  market: "",
  region: "",
  cityArea: "",
  siteType: "",
  area: "",
  areaUnit: "sqft",
  floors: "",
  workType: "",
  services: [],
  materials: [],
  start: "",
  condition: "",
  requirements: "",
  budget: "",
  fullName: "",
  email: "",
  phone: "",
  contactMethod: "email",
  whatsappOptIn: false,
  notes: "",
  consent: false,
  marketingConsent: false,
  estimateSummary: "",
  website: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** International format: optional +, then 7–15 digits; spaces, dashes and brackets allowed. */
const PHONE = /^\+?[\d\s()-]{7,20}$/;

export function projectGroup(projectType: string): ProjectGroup | null {
  return quoteProjectTypes.find((type) => type.id === projectType)?.group ?? null;
}

/** Which conditional fields apply to a project type. */
export function applicableFields(projectType: string) {
  const group = projectGroup(projectType);
  return {
    floors: group === "build",
    siteType: group !== null,
    workType: group === "build" || group === "trade" || group === "other",
    condition: group !== "build" && group !== null,
  };
}

export function validateQuote(input: QuoteInput, context: QuoteContext): QuoteErrors {
  const errors: QuoteErrors = {};
  const applies = applicableFields(input.projectType);
  const text = (value: string) => value.trim();

  if (input.intent !== "quote" && input.intent !== "consultation") errors.projectType = { code: "invalid" };
  if (!projectGroup(input.projectType)) errors.projectType = { code: "required" };

  // Location
  if (!context.markets.includes(input.market)) errors.market = { code: "required" };
  else if (!(context.regions[input.market] ?? []).includes(input.region)) errors.region = { code: "required" };
  if (text(input.cityArea).length > 120) errors.cityArea = { code: "maxLength", values: { max: 120 } };
  if (input.siteType !== "" && !siteTypes.includes(input.siteType)) errors.siteType = { code: "invalid" };

  // Details
  if (text(input.area) !== "") {
    const area = Number(input.area);
    if (!Number.isFinite(area) || area <= 0) errors.area = { code: "positive" };
    else if (area > 10_000_000) errors.area = { code: "tooLarge" };
  }
  if (applies.floors && text(input.floors) !== "") {
    const floors = Number(input.floors);
    if (!Number.isInteger(floors) || floors < 1 || floors > 200) errors.floors = { code: "floorsWhole" };
  }
  if (input.workType !== "" && !workTypes.includes(input.workType)) errors.workType = { code: "invalid" };
  if (input.services.some((slug) => !context.serviceCategories.includes(slug))) errors.services = { code: "invalid" };
  if (input.materials.some((id) => !context.materials.includes(id))) errors.materials = { code: "invalid" };
  if (input.start !== "" && !startTimeframes.includes(input.start)) errors.start = { code: "invalid" };
  if (input.condition !== "" && !siteConditions.includes(input.condition)) errors.condition = { code: "invalid" };
  if (text(input.requirements).length > 3000) errors.requirements = { code: "maxLength", values: { max: 3000 } };

  // Budget
  const budgets = [...(context.budgets[input.market] ?? []), ...budgetFallbacks];
  if (!budgets.includes(input.budget)) errors.budget = { code: "required" };

  // Contact
  const name = text(input.fullName);
  if (name.length < 2) errors.fullName = { code: "required" };
  else if (name.length > 100) errors.fullName = { code: "maxLength", values: { max: 100 } };
  if (!EMAIL.test(text(input.email))) errors.email = { code: "email" };
  if (!contactChannels.includes(input.contactMethod as (typeof contactChannels)[number]))
    errors.contactMethod = { code: "required" };
  const phone = text(input.phone);
  const needsPhone = input.contactMethod === "phone" || input.contactMethod === "whatsapp" || input.whatsappOptIn;
  if (needsPhone && phone === "") errors.phone = { code: "required" };
  else if (phone !== "" && (!PHONE.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15))
    errors.phone = { code: "phone" };
  if (text(input.notes).length > 2000) errors.notes = { code: "maxLength", values: { max: 2000 } };
  if (input.consent !== true) errors.consent = { code: "consent" };

  return errors;
}

export function errorsForStep(errors: QuoteErrors, step: StepId): QuoteErrors {
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => stepFields[step].includes(field as QuoteField)),
  ) as QuoteErrors;
}

/** Trims strings and clears conditional answers that no longer apply. */
export function normaliseQuote(input: QuoteInput): QuoteInput {
  const applies = applicableFields(input.projectType);
  return {
    ...input,
    cityArea: input.cityArea.trim(),
    area: input.area.trim(),
    floors: applies.floors ? input.floors.trim() : "",
    workType: applies.workType ? input.workType : "",
    condition: applies.condition ? input.condition : "",
    requirements: input.requirements.trim(),
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    notes: input.notes.trim(),
    estimateSummary: input.estimateSummary.slice(0, 2000),
  };
}

/** Coerces untrusted JSON into a QuoteInput (server side). */
export function parseQuote(body: unknown): QuoteInput | null {
  if (typeof body !== "object" || body === null) return null;
  const source = body as Record<string, unknown>;
  const text = (key: QuoteField, max = 5000) =>
    typeof source[key] === "string" ? (source[key] as string).slice(0, max) : "";
  const list = (key: QuoteField) =>
    Array.isArray(source[key])
      ? (source[key] as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 30)
      : [];
  return {
    intent: source.intent === "consultation" ? "consultation" : "quote",
    projectType: text("projectType", 60),
    market: text("market", 10),
    region: text("region", 60),
    cityArea: text("cityArea", 200),
    siteType: text("siteType", 30),
    area: text("area", 20),
    areaUnit: source.areaUnit === "sqm" ? "sqm" : "sqft",
    floors: text("floors", 5),
    workType: text("workType", 30),
    services: list("services"),
    materials: list("materials"),
    start: text("start", 30),
    condition: text("condition", 30),
    requirements: text("requirements"),
    budget: text("budget", 30),
    fullName: text("fullName", 200),
    email: text("email", 200),
    phone: text("phone", 40),
    contactMethod: text("contactMethod", 20),
    whatsappOptIn: source.whatsappOptIn === true,
    notes: text("notes"),
    consent: source.consent === true,
    marketingConsent: source.marketingConsent === true,
    estimateSummary: text("estimateSummary", 2000),
    website: text("website", 200),
  };
}

/** Plain-text summary for email drafts and clipboard copy. `label` localizes values. */
export function quoteToText(
  input: QuoteInput,
  label: (field: QuoteField, value: string) => string,
  heading: (field: QuoteField) => string,
) {
  const line = (field: QuoteField, value: string) => (value ? `${heading(field)}: ${value}` : "");
  const project = [
    line("projectType", label("projectType", input.projectType)),
    line("region", label("region", input.region)),
    line("cityArea", input.cityArea),
    line("siteType", label("siteType", input.siteType)),
    line("area", input.area ? `${input.area} ${label("areaUnit", input.areaUnit)}` : ""),
    line("floors", input.floors),
    line("workType", label("workType", input.workType)),
    line("services", input.services.map((slug) => label("services", slug)).join(", ")),
    line("materials", input.materials.map((id) => label("materials", id)).join(", ")),
    line("start", label("start", input.start)),
    line("condition", label("condition", input.condition)),
    line("budget", label("budget", input.budget)),
    line("requirements", input.requirements),
  ];
  const contact = [
    line("fullName", input.fullName),
    line("email", input.email),
    line("phone", input.phone),
    line("contactMethod", label("contactMethod", input.contactMethod)),
    line("notes", input.notes),
  ];
  return [project, contact, [input.estimateSummary]]
    .map((group) => group.filter(Boolean).join("\n"))
    .filter(Boolean)
    .join("\n\n");
}
