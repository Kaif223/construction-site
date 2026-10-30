import { notFound } from "next/navigation";
import { locales, parseLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { format, plural } from "@/i18n/format";
import { getCategory } from "@/content";
import { serviceCategories } from "@/data/services";
import { shareCard, shareCardContentType, shareCardSize } from "@/lib/share-card";

/** Share card for a service discipline: its name, summary and photograph. */
export const alt = "A CONSTRUKT service discipline";
export const size = shareCardSize;
export const contentType = shareCardContentType;

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceCategories.map((category) => ({ locale, slug: category.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const parsed = parseLocale(locale);
  const category = parsed && getCategory(parsed.language, slug);
  if (!parsed || !category) notFound();
  const dict = getDictionary(parsed.language);

  return shareCard({
    language: parsed.language,
    eyebrow: format(dict.category.eyebrow, { code: category.code }),
    title: category.title,
    subtitle: category.summary,
    footer: `${plural(dict.plurals.service, category.services.length, parsed.tag)} · ${dict.hero.tagline}`,
    image: category.image,
  });
}
