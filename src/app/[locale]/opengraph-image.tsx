import { notFound } from "next/navigation";
import { locales, parseLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { shareCard, shareCardContentType, shareCardSize } from "@/lib/share-card";

/** Default share card for every page in a locale; project pages have their own. */
export const alt = "CONSTRUKT — design, construction and finishing in the United Arab Emirates";
export const size = shareCardSize;
export const contentType = shareCardContentType;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const parsed = parseLocale((await params).locale);
  if (!parsed) notFound();
  const dict = getDictionary(parsed.language);

  return shareCard({
    language: parsed.language,
    eyebrow: dict.hero.eyebrow,
    title: dict.hero.lines,
    subtitle: dict.hero.copy,
    footer: dict.hero.tagline,
    image: "/images/hero/residence-dusk.jpg",
  });
}
