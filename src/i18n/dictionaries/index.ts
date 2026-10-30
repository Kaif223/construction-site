import type { LanguageCode } from "@/config/markets";
import { en, type Dictionary } from "./en";
import { ar } from "./ar";

const dictionaries: Record<LanguageCode, Dictionary> = { en, ar };

export function getDictionary(language: LanguageCode): Dictionary {
  return dictionaries[language];
}

/** Sections used by Client Components. Only these are serialized to the browser. */
const CLIENT_SECTIONS = [
  "common",
  "nav",
  "units",
  "plurals",
  "hero",
  "home",
  "journey",
  "gallery",
  "projects",
  "services",
  "materialsPage",
  "estimator",
  "quote",
  "errors",
] as const;

export type ClientDictionary = Pick<Dictionary, (typeof CLIENT_SECTIONS)[number]>;

export function clientDictionary(dict: Dictionary): ClientDictionary {
  return Object.fromEntries(CLIENT_SECTIONS.map((key) => [key, dict[key]])) as ClientDictionary;
}

export type { Dictionary };
