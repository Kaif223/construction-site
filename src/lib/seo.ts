import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { shareCardSize } from "@/lib/share-card-size";
import { defaultLocale, parseLocale, siblingLocales } from "@/i18n/locales";
import { getI18n } from "@/i18n/server";

/**
 * Localized page metadata: title, description, canonical URL, hreflang
 * alternates for every language of the current market (plus x-default) and
 * the share card. A page's openGraph replaces the layout's rather than
 * merging with it, so every page names its card here: the locale's default
 * card (app/[locale]/opengraph-image) unless `shareImagePath` points at a
 * more specific one, relative to the locale.
 */
export async function pageMetadata({
  path,
  title,
  description,
  shareImagePath = "",
  shareImageAlt,
  absoluteTitle = false,
  noindex = false,
}: {
  path: string;
  title: string;
  description?: string;
  shareImagePath?: string;
  shareImageAlt?: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Promise<Metadata> {
  const { locale, tag, dict } = await getI18n();
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
      images: [
        {
          url: `/${locale}${shareImagePath}/opengraph-image`,
          width: shareCardSize.width,
          height: shareCardSize.height,
          alt: shareImageAlt ?? `${siteConfig.name} — ${dict.hero.eyebrow}`,
        },
      ],
    },
    ...(noindex ? { robots: { index: false } } : {}),
  };
}
