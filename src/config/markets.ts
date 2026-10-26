/**
 * Market configuration — the single place where country-specific behaviour
 * lives. Components never hardcode a currency, country, region, tax rule or
 * contact detail; they read the active market from here.
 *
 * Adding a market: add an entry below, provide its translations and rate
 * table, and set `enabled: true` only after its services, pricing, contact
 * details and legal content have been confirmed. Disabled markets produce no
 * routes, sitemap entries or UI.
 *
 * Every `null` means "not supplied yet". The UI hides or neutrally labels
 * unconfigured values instead of inventing them.
 */

import type { AreaUnit } from "../lib/estimate";

export type LanguageCode = "en" | "ar";

/** Text in each supported language. Missing languages fall back to English. */
export type Localized<T = string> = { en: T } & Partial<Record<Exclude<LanguageCode, "en">, T>>;

/** Whether the business provides a service in a market. */
export type AvailabilityStatus = "available" | "partner" | "not-offered" | "unconfirmed";

/** Whether the business covers a region. Unconfirmed regions are selectable but never advertised. */
export type RegionCoverage = "served" | "not-served" | "unconfirmed";

export type Region = {
  id: string;
  name: Localized;
  coverage: RegionCoverage;
  /** Optional finer-grained areas for future use. */
  areas?: { id: string; name: Localized }[];
};

export type VerifiedClaim = {
  title: Localized;
  detail: Localized;
  /** Issuing body or document reference, shown with the claim. */
  reference: string | null;
  /** ISO date the supporting document was checked. Claims without it are never shown. */
  verifiedOn: string;
};

export type TrustConfig = {
  registration: VerifiedClaim | null;
  licenses: VerifiedClaim[];
  certifications: VerifiedClaim[];
  insurance: VerifiedClaim | null;
  warranty: VerifiedClaim | null;
  workmanshipPolicy: VerifiedClaim | null;
  healthAndSafety: VerifiedClaim | null;
  qualityControl: VerifiedClaim | null;
  materialSourcing: VerifiedClaim | null;
  /** How work is staffed, e.g. in-house teams vs. specialist partners. */
  workforce: VerifiedClaim | null;
};

export type MarketConfig = {
  id: string;
  countryCode: string;
  enabled: boolean;
  name: Localized;
  languages: LanguageCode[];
  defaultLanguage: LanguageCode;
  currency: { code: string; fractionDigits: number };
  units: { area: AreaUnit[]; defaultArea: AreaUnit };
  regionLabel: Localized;
  regions: Region[];
  contact: {
    email: string | null;
    /** E.164, e.g. "+9714XXXXXXX". Never fill with a placeholder number. */
    phone: string | null;
    /** E.164 WhatsApp Business number. WhatsApp actions are hidden while null. */
    whatsapp: string | null;
    address: Localized | null;
    hours: { days: Localized; time: Localized | null }[];
    phoneHint: string;
  };
  services: {
    /** Category slugs offered in this market, or "all". */
    enabledCategories: string[] | "all";
    defaultAvailability: AvailabilityStatus;
    byCategory: Record<string, AvailabilityStatus>;
    byService: Record<string, AvailabilityStatus>;
  };
  tax: {
    name: Localized;
    /** Leave null until the applicable treatment has been reviewed. */
    rate: number | null;
    reviewed: boolean;
    includedInEstimates: boolean;
    referenceUrl: string | null;
  };
  /** Id of the rate table in src/data/rates, or null when none exists. */
  rateTable: string | null;
  quotation: {
    /** Budget bands in the market currency. null = open-ended. */
    budgetRanges: { id: string; min: number | null; max: number | null }[];
    paymentTerms: Localized | null;
    validityDays: number | null;
  };
  uploads: {
    /** Secure upload endpoint (e.g. a signed-URL service). Uploads are disabled while null. */
    endpoint: string | null;
    maxFiles: number;
    maxFileSizeMb: number;
    acceptedExtensions: string[];
  };
  trust: TrustConfig;
  seo: { description: Localized };
  legal: { governingLaw: Localized | null; dataProtection: Localized | null };
};

const noTrust: TrustConfig = {
  registration: null,
  licenses: [],
  certifications: [],
  insurance: null,
  warranty: null,
  workmanshipPolicy: null,
  healthAndSafety: null,
  qualityControl: null,
  materialSourcing: null,
  workforce: null,
};

export const markets: MarketConfig[] = [
  {
    id: "ae",
    countryCode: "AE",
    enabled: true,
    name: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
    languages: ["en", "ar"],
    defaultLanguage: "en",
    currency: { code: "AED", fractionDigits: 0 },
    units: { area: ["sqft", "sqm"], defaultArea: "sqft" },
    regionLabel: { en: "Emirate", ar: "الإمارة" },
    regions: [
      { id: "abu-dhabi", name: { en: "Abu Dhabi", ar: "أبوظبي" }, coverage: "unconfirmed" },
      { id: "dubai", name: { en: "Dubai", ar: "دبي" }, coverage: "unconfirmed" },
      { id: "sharjah", name: { en: "Sharjah", ar: "الشارقة" }, coverage: "unconfirmed" },
      { id: "ajman", name: { en: "Ajman", ar: "عجمان" }, coverage: "unconfirmed" },
      { id: "umm-al-quwain", name: { en: "Umm Al Quwain", ar: "أم القيوين" }, coverage: "unconfirmed" },
      { id: "ras-al-khaimah", name: { en: "Ras Al Khaimah", ar: "رأس الخيمة" }, coverage: "unconfirmed" },
      { id: "fujairah", name: { en: "Fujairah", ar: "الفجيرة" }, coverage: "unconfirmed" },
    ],
    contact: {
      // example.com-style reserved domain: can never reach a real inbox.
      email: "hello@construkt.example",
      phone: null,
      whatsapp: null,
      address: null,
      hours: [],
      phoneHint: "+971 5X XXX XXXX",
    },
    services: {
      enabledCategories: "all",
      defaultAvailability: "unconfirmed",
      byCategory: {},
      byService: {},
    },
    tax: {
      name: { en: "VAT", ar: "ضريبة القيمة المضافة" },
      rate: null,
      reviewed: false,
      includedInEstimates: false,
      referenceUrl: "https://tax.gov.ae",
    },
    rateTable: "ae-example",
    quotation: {
      budgetRanges: [
        { id: "under-100k", min: null, max: 100_000 },
        { id: "100k-500k", min: 100_000, max: 500_000 },
        { id: "500k-1m", min: 500_000, max: 1_000_000 },
        { id: "1m-3m", min: 1_000_000, max: 3_000_000 },
        { id: "3m-10m", min: 3_000_000, max: 10_000_000 },
        { id: "over-10m", min: 10_000_000, max: null },
      ],
      paymentTerms: null,
      validityDays: null,
    },
    uploads: {
      endpoint: null,
      maxFiles: 10,
      maxFileSizeMb: 15,
      acceptedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".dwg", ".dxf"],
    },
    trust: noTrust,
    seo: {
      description: {
        en: "Construction, renovation, interior finishing and building services in the United Arab Emirates — design, build and finishing coordinated by one team.",
        ar: "خدمات البناء والتجديد والتشطيبات الداخلية وخدمات المباني في دولة الإمارات العربية المتحدة — التصميم والتنفيذ والتشطيب بإدارة فريق واحد.",
      },
    },
    legal: { governingLaw: null, dataProtection: null },
  },
  {
    // Prepared for expansion only. Not routed, listed or indexed until enabled.
    id: "sa",
    countryCode: "SA",
    enabled: false,
    name: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    languages: ["en", "ar"],
    defaultLanguage: "ar",
    currency: { code: "SAR", fractionDigits: 0 },
    units: { area: ["sqm", "sqft"], defaultArea: "sqm" },
    regionLabel: { en: "Region", ar: "المنطقة" },
    regions: [
      { id: "riyadh", name: { en: "Riyadh", ar: "الرياض" }, coverage: "unconfirmed" },
      { id: "makkah", name: { en: "Makkah", ar: "مكة المكرمة" }, coverage: "unconfirmed" },
      { id: "madinah", name: { en: "Madinah", ar: "المدينة المنورة" }, coverage: "unconfirmed" },
      { id: "eastern", name: { en: "Eastern Province", ar: "المنطقة الشرقية" }, coverage: "unconfirmed" },
      { id: "asir", name: { en: "Asir", ar: "عسير" }, coverage: "unconfirmed" },
      { id: "tabuk", name: { en: "Tabuk", ar: "تبوك" }, coverage: "unconfirmed" },
      { id: "qassim", name: { en: "Al Qassim", ar: "القصيم" }, coverage: "unconfirmed" },
      { id: "hail", name: { en: "Hail", ar: "حائل" }, coverage: "unconfirmed" },
      { id: "jazan", name: { en: "Jazan", ar: "جازان" }, coverage: "unconfirmed" },
      { id: "najran", name: { en: "Najran", ar: "نجران" }, coverage: "unconfirmed" },
      { id: "al-bahah", name: { en: "Al Bahah", ar: "الباحة" }, coverage: "unconfirmed" },
      { id: "al-jawf", name: { en: "Al Jawf", ar: "الجوف" }, coverage: "unconfirmed" },
      { id: "northern-borders", name: { en: "Northern Borders", ar: "الحدود الشمالية" }, coverage: "unconfirmed" },
    ],
    contact: { email: null, phone: null, whatsapp: null, address: null, hours: [], phoneHint: "+966 5X XXX XXXX" },
    services: { enabledCategories: [], defaultAvailability: "unconfirmed", byCategory: {}, byService: {} },
    tax: { name: { en: "VAT", ar: "ضريبة القيمة المضافة" }, rate: null, reviewed: false, includedInEstimates: false, referenceUrl: null },
    rateTable: null,
    quotation: { budgetRanges: [], paymentTerms: null, validityDays: null },
    uploads: { endpoint: null, maxFiles: 10, maxFileSizeMb: 15, acceptedExtensions: [".pdf", ".jpg", ".jpeg", ".png"] },
    trust: noTrust,
    seo: { description: { en: "", ar: "" } },
    legal: { governingLaw: null, dataProtection: null },
  },
];

export const enabledMarkets = markets.filter((market) => market.enabled);

export function getMarket(id: string) {
  const market = enabledMarkets.find((item) => item.id === id);
  if (!market) throw new Error(`Market "${id}" is not enabled`);
  return market;
}

/** Picks the value for a language, falling back to English. */
export function localize<T>(value: Localized<T>, language: LanguageCode): T {
  return value[language] ?? value.en;
}

export function serviceAvailability(market: MarketConfig, categorySlug: string, serviceId?: string): AvailabilityStatus {
  if (serviceId && market.services.byService[serviceId]) return market.services.byService[serviceId];
  return market.services.byCategory[categorySlug] ?? market.services.defaultAvailability;
}

export function categoryEnabled(market: MarketConfig, categorySlug: string) {
  const enabled = market.services.enabledCategories;
  return enabled === "all" || enabled.includes(categorySlug);
}

/** True when at least one trust claim has been supplied and verified. */
export function hasTrustClaims(trust: TrustConfig) {
  return Object.values(trust).some((value) => (Array.isArray(value) ? value.length > 0 : value !== null));
}
