import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categoryEnabled, enabledMarkets } from "@/config/markets";
import { parseLocale, siblingLocales } from "@/i18n/locales";
import { serviceCategories } from "@/data/services";
import { projects } from "@/data/projects";

/**
 * One entry per page per enabled locale, each listing its language
 * alternates. Markets that are not enabled contribute nothing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const pages: [string, number][] = [
    ["", 1],
    ["/services", 0.9],
    ["/projects", 0.7],
    ["/process", 0.6],
    ["/planning", 0.7],
    ["/materials", 0.6],
    ["/estimate", 0.7],
    ["/quote", 0.8],
    ["/contact", 0.7],
    ["/about", 0.6],
    ["/faq", 0.6],
    ["/privacy", 0.2],
    ["/terms", 0.2],
  ];

  return enabledMarkets.flatMap((market) => {
    const marketPages: [string, number][] = [
      ...pages,
      ...serviceCategories
        .filter((category) => categoryEnabled(market, category.slug))
        .map((category): [string, number] => [`/services/${category.slug}`, 0.8]),
      ...projects.map((project): [string, number] => [`/projects/${project.slug}`, 0.5]),
    ];
    const marketLocales = market.languages.map((language) => `${language}-${market.id}`);

    return marketLocales.flatMap((locale) =>
      marketPages.map(([path, priority]) => ({
        url: url(`/${locale}${path}`),
        priority,
        alternates: {
          languages: Object.fromEntries(
            siblingLocales(locale).map((sibling) => [parseLocale(sibling)!.tag, url(`/${sibling}${path}`)]),
          ),
        },
      })),
    );
  });
}
