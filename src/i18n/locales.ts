/**
 * Locale = language + market, written as "<language>-<market>" (e.g. "en-ae").
 * Routes are prefixed with it: /en-ae/services, /ar-ae/services. The list is
 * derived from enabled markets, so a market that is not live has no routes.
 */

import { enabledMarkets, type LanguageCode, type MarketConfig } from "../config/markets.ts";

export type Direction = "ltr" | "rtl";

export const locales: string[] = enabledMarkets.flatMap((market) =>
  market.languages.map((language) => `${language}-${market.id}`),
);

export const defaultLocale = "en-ae";

export const rtlLanguages: LanguageCode[] = ["ar"];

export type ParsedLocale = {
  locale: string;
  language: LanguageCode;
  market: MarketConfig;
  dir: Direction;
  /** BCP 47 tag for Intl formatting and hreflang, e.g. "ar-AE". */
  tag: string;
};

export function isLocale(value: string): boolean {
  return locales.includes(value);
}

export function parseLocale(locale: string): ParsedLocale | null {
  if (!isLocale(locale)) return null;
  const [language, marketId] = locale.split("-") as [LanguageCode, string];
  const market = enabledMarkets.find((item) => item.id === marketId);
  if (!market) return null;
  return {
    locale,
    language,
    market,
    dir: rtlLanguages.includes(language) ? "rtl" : "ltr",
    tag: `${language}-${market.countryCode}`,
  };
}

/** Prefixes an internal path with the locale. Keeps query strings and hashes. */
export function localizePath(locale: string, path: string) {
  if (!path.startsWith("/")) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Swaps the locale prefix of a pathname, e.g. for the language switcher. */
export function switchLocalePath(pathname: string, nextLocale: string) {
  const segments = pathname.split("/");
  if (isLocale(segments[1] ?? "")) segments[1] = nextLocale;
  else segments.splice(1, 0, nextLocale);
  return segments.join("/") || `/${nextLocale}`;
}

/** Other locales of the same market (for the language switcher and hreflang). */
export function siblingLocales(locale: string) {
  const parsed = parseLocale(locale);
  if (!parsed) return [];
  return parsed.market.languages.map((language) => `${language}-${parsed.market.id}`);
}
