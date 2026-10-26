"use client";

import { createContext, useContext, useMemo } from "react";
import { localize, type Localized } from "@/config/markets";
import { localizePath, parseLocale } from "./locales";
import type { ClientDictionary } from "./dictionaries";
import { format, plural, type PluralForms } from "./format";

type ClientI18n = NonNullable<ReturnType<typeof parseLocale>> & {
  dict: ClientDictionary;
  t: typeof format;
  p: (forms: PluralForms, count: number) => string;
  href: (path: string) => string;
  l: <T>(value: Localized<T>) => T;
};

const I18nContext = createContext<ClientI18n | null>(null);

/** Supplies the active locale and its dictionary to Client Components. */
export function I18nProvider({ locale, dict, children }: { locale: string; dict: ClientDictionary; children: React.ReactNode }) {
  const value = useMemo(() => {
    const parsed = parseLocale(locale);
    if (!parsed) throw new Error(`Unknown locale ${locale}`);
    return {
      ...parsed,
      dict,
      t: format,
      p: (forms: PluralForms, count: number) => plural(forms, count, parsed.tag),
      href: (path: string) => localizePath(locale, path),
      l: <T,>(item: Localized<T>) => localize(item, parsed.language),
    };
  }, [locale, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
  return context;
}
