import { notFound } from "next/navigation";
import { locale as localeParam } from "next/root-params";
import { localize, type Localized } from "@/config/markets";
import { localizePath, parseLocale } from "./locales";
import { getDictionary } from "./dictionaries";
import { format, plural, type PluralForms } from "./format";

/**
 * Locale, market and dictionary for the current request, read from the
 * `[locale]` root segment. Usable from any Server Component without props.
 */
export async function getI18n() {
  const locale = await localeParam();
  const parsed = parseLocale(locale ?? "");
  if (!parsed) notFound();
  const dict = getDictionary(parsed.language);
  return {
    ...parsed,
    dict,
    t: format,
    p: (forms: PluralForms, count: number) => plural(forms, count, parsed.tag),
    href: (path: string) => localizePath(parsed.locale, path),
    l: <T,>(value: Localized<T>) => localize(value, parsed.language),
  };
}

export type I18n = Awaited<ReturnType<typeof getI18n>>;
