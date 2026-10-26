/**
 * Project inquiry schema shared by the client form and the API route, so the
 * same rules are enforced on both sides. No path aliases: unit-tested directly.
 */

export const contactMethods = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone call" },
  { id: "either", label: "Either" },
] as const;

export const inquiryProjectTypes = [
  { id: "new-house", label: "New house construction", group: "build" },
  { id: "villa", label: "Luxury villa", group: "build" },
  { id: "multi-unit", label: "Apartments / multi-unit", group: "build" },
  { id: "commercial", label: "Commercial building or fit-out", group: "build" },
  { id: "renovation", label: "Renovation", group: "renovation" },
  { id: "interior", label: "Interior finishing", group: "renovation" },
  { id: "specialist", label: "Specialist trade work", group: "specialist" },
  { id: "design-only", label: "Design & drawings only", group: "design" },
  { id: "other", label: "Something else", group: "other" },
] as const;

export const budgetRanges = [
  { id: "under-25k", label: "Under 25,000" },
  { id: "25-100k", label: "25,000 – 100,000" },
  { id: "100-300k", label: "100,000 – 300,000" },
  { id: "300k-1m", label: "300,000 – 1,000,000" },
  { id: "over-1m", label: "Over 1,000,000" },
  { id: "unsure", label: "Not sure yet" },
] as const;

export const startTimeframes = [
  { id: "asap", label: "As soon as possible" },
  { id: "3-months", label: "Within 3 months" },
  { id: "3-6-months", label: "In 3 – 6 months" },
  { id: "6-12-months", label: "In 6 – 12 months" },
  { id: "later", label: "More than a year away" },
  { id: "unsure", label: "Not sure yet" },
] as const;

export const plotStatuses = [
  { id: "owned", label: "I own the plot" },
  { id: "buying", label: "Purchase in progress" },
  { id: "searching", label: "Still looking" },
] as const;

export const drawingStatuses = [
  { id: "none", label: "No drawings yet" },
  { id: "concept", label: "Concept sketches" },
  { id: "complete", label: "Full drawings" },
] as const;

export const occupancyOptions = [
  { id: "occupied", label: "Occupied during works" },
  { id: "vacant", label: "Vacant during works" },
  { id: "unsure", label: "Not decided" },
] as const;

export const specialistTrades = [
  { id: "electrical", label: "Electrical" },
  { id: "plumbing", label: "Plumbing & water" },
  { id: "hvac", label: "HVAC & mechanical" },
  { id: "stone-tile", label: "Marble, stone & tiling" },
  { id: "solar", label: "Solar & energy" },
  { id: "fire-security", label: "Fire safety & security" },
  { id: "other", label: "Other trade" },
] as const;

export type InquiryInput = {
  fullName: string;
  email: string;
  phone: string;
  contactMethod: string;
  projectType: string;
  location: string;
  area: string;
  areaUnit: "sqm" | "sqft";
  budget: string;
  start: string;
  services: string[];
  description: string;
  plotStatus: string;
  drawings: string;
  occupancy: string;
  trade: string;
  consent: boolean;
  estimateSummary: string;
  /** Honeypot. Humans never see or fill this field. */
  website: string;
};

export type InquiryField = keyof InquiryInput;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export const emptyInquiry: InquiryInput = {
  fullName: "",
  email: "",
  phone: "",
  contactMethod: "email",
  projectType: "",
  location: "",
  area: "",
  areaUnit: "sqm",
  budget: "",
  start: "",
  services: [],
  description: "",
  plotStatus: "",
  drawings: "",
  occupancy: "",
  trade: "",
  consent: false,
  estimateSummary: "",
  website: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-.\s\d]{7,20}$/;

const has = (list: readonly { id: string }[], value: string) =>
  list.some((option) => option.id === value);

export function projectGroup(projectType: string) {
  return inquiryProjectTypes.find((type) => type.id === projectType)?.group ?? null;
}

export function validateInquiry(input: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = input.fullName.trim();
  const phone = input.phone.trim();

  if (name.length < 2) errors.fullName = "Please enter your full name.";
  else if (name.length > 100) errors.fullName = "Name must be 100 characters or fewer.";

  if (!EMAIL.test(input.email.trim())) errors.email = "Enter a valid email address, like name@example.com.";

  if (!has(contactMethods, input.contactMethod)) errors.contactMethod = "Choose how we should contact you.";
  const needsPhone = input.contactMethod === "phone" || input.contactMethod === "either";
  if (needsPhone && phone === "") errors.phone = "Add a phone number so we can call you.";
  else if (phone !== "" && !PHONE.test(phone))
    errors.phone = "Use digits, spaces and + ( ) - only, 7 to 20 characters.";

  if (!has(inquiryProjectTypes, input.projectType)) errors.projectType = "Choose a project type.";

  if (input.location.trim().length < 2) errors.location = "Tell us the city or area of the project.";
  else if (input.location.length > 120) errors.location = "Keep the location under 120 characters.";

  if (input.area.trim() !== "") {
    const area = Number(input.area);
    if (!Number.isFinite(area) || area <= 0) errors.area = "Enter the area as a positive number.";
    else if (area > 1_000_000) errors.area = "That area looks too large — please check it.";
  }

  if (input.budget !== "" && !has(budgetRanges, input.budget)) errors.budget = "Choose a budget range.";
  if (input.start !== "" && !has(startTimeframes, input.start)) errors.start = "Choose a start timeframe.";

  const description = input.description.trim();
  if (description.length < 20)
    errors.description = "Please describe the project in at least 20 characters.";
  else if (description.length > 3000) errors.description = "Keep the description under 3,000 characters.";

  const group = projectGroup(input.projectType);
  if (group === "specialist" && !has(specialistTrades, input.trade))
    errors.trade = "Choose the trade you need.";
  if (group === "build" && input.plotStatus !== "" && !has(plotStatuses, input.plotStatus))
    errors.plotStatus = "Choose an option.";

  return errors;
}

/** Trims strings and drops conditional answers that no longer apply. */
export function normaliseInquiry(input: InquiryInput): InquiryInput {
  const group = projectGroup(input.projectType);
  return {
    ...input,
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    location: input.location.trim(),
    area: input.area.trim(),
    description: input.description.trim(),
    plotStatus: group === "build" ? input.plotStatus : "",
    drawings: group === "build" || group === "renovation" ? input.drawings : "",
    occupancy: group === "renovation" ? input.occupancy : "",
    trade: group === "specialist" ? input.trade : "",
    estimateSummary: input.estimateSummary.slice(0, 2000),
  };
}

/** Coerces untrusted JSON into an InquiryInput shape (server side). */
export function parseInquiry(body: unknown): InquiryInput | null {
  if (typeof body !== "object" || body === null) return null;
  const source = body as Record<string, unknown>;
  const text = (key: InquiryField) => (typeof source[key] === "string" ? (source[key] as string) : "");
  return {
    fullName: text("fullName"),
    email: text("email"),
    phone: text("phone"),
    contactMethod: text("contactMethod"),
    projectType: text("projectType"),
    location: text("location"),
    area: text("area"),
    areaUnit: source.areaUnit === "sqft" ? "sqft" : "sqm",
    budget: text("budget"),
    start: text("start"),
    services: Array.isArray(source.services)
      ? source.services.filter((item): item is string => typeof item === "string").slice(0, 20)
      : [],
    description: text("description"),
    plotStatus: text("plotStatus"),
    drawings: text("drawings"),
    occupancy: text("occupancy"),
    trade: text("trade"),
    consent: source.consent === true,
    estimateSummary: text("estimateSummary"),
    website: text("website"),
  };
}

const labelFor = (list: readonly { id: string; label: string }[], id: string) =>
  list.find((option) => option.id === id)?.label ?? "";

/** Plain-text version of an inquiry, used for email drafts and clipboard copy. */
export function inquiryToText(input: InquiryInput, serviceLabels: Record<string, string> = {}) {
  const lines = [
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    input.phone && `Phone: ${input.phone}`,
    `Preferred contact: ${labelFor(contactMethods, input.contactMethod)}`,
    `Project type: ${labelFor(inquiryProjectTypes, input.projectType)}`,
    `Location: ${input.location}`,
    input.area && `Approximate area: ${input.area} ${input.areaUnit === "sqm" ? "m²" : "ft²"}`,
    input.budget && `Budget range: ${labelFor(budgetRanges, input.budget)}`,
    input.start && `Expected start: ${labelFor(startTimeframes, input.start)}`,
    input.plotStatus && `Plot: ${labelFor(plotStatuses, input.plotStatus)}`,
    input.drawings && `Drawings: ${labelFor(drawingStatuses, input.drawings)}`,
    input.occupancy && `Occupancy: ${labelFor(occupancyOptions, input.occupancy)}`,
    input.trade && `Trade: ${labelFor(specialistTrades, input.trade)}`,
    input.services.length > 0 &&
      `Services: ${input.services.map((id) => serviceLabels[id] ?? id).join(", ")}`,
    "\nProject description:",
    input.description,
    input.estimateSummary && `\nPreliminary estimate:\n${input.estimateSummary}`,
  ];
  return lines.filter((line) => line !== false && line !== "" && line !== undefined).join("\n");
}
