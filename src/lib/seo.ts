import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { defaultLocale, parseLocale, siblingLocales } from "@/i18n/locales";
import { getI18n } from "@/i18n/server";

/**
 * Localized page metadata: title, description, canonical URL and hreflang
 * alternates for every language of the current market (plus x-default).
 */
export async function pageMetadata({
  path,
  title,
  description,
  image,
  imageAlt,
  absoluteTitle = false,
  noindex = false,
}: {
  path: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Promise<Metadata> {
  const { locale, tag } = await getI18n();
  const suffix = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const sibling of siblingLocales(locale)) {
    const parsed = parseLocale(sibling);
    if (parsed) languages[parsed.tag] = `/${sibling}${suffix}`;
  }
  languages["x-default"] = `/${defaultLocale}${suffix}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: `/${locale}${suffix}`, languages },
    openGraph: {
      title,
      description,
      url: `/${locale}${suffix}`,
      locale: tag.replace("-", "_"),
      siteName: siteConfig.name,
      ...(image ? { images: [{ url: image, alt: imageAlt ?? "" }] } : {}),
    },
    ...(noindex ? { robots: { index: false } } : {}),
  };
}
