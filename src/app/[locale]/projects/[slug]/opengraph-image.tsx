import { notFound } from "next/navigation";
import { locales, parseLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { getProject } from "@/content";
import { projects } from "@/data/projects";
import { shareCard, shareCardContentType, shareCardSize } from "@/lib/share-card";

/** Share card for a project: its name, type and cover photograph. */
export const alt = "A CONSTRUKT project";
export const size = shareCardSize;
export const contentType = shareCardContentType;

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const parsed = parseLocale(locale);
  const project = parsed && getProject(parsed.language, slug);
  if (!parsed || !project) notFound();
  const dict = getDictionary(parsed.language);

  return shareCard({
    language: parsed.language,
    eyebrow: `${project.number} · ${dict.projects.categories[project.category]}`,
    title: project.name,
    subtitle: project.summary,
    footer: `${project.type} · ${dict.projects.status[project.status]}`,
    image: project.cover.src,
  });
}
