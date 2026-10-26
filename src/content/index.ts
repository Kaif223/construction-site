/**
 * Localized content access. English data in src/data is the source; other
 * languages overlay translated fields by id and fall back to English for
 * anything not yet translated.
 */
import type { LanguageCode } from "@/config/markets";
import { serviceCategories, type ServiceCategory } from "@/data/services";
import { projects, type Project } from "@/data/projects";
import { benefits, faqs, journeyStages, materials, processSteps } from "@/data/content";
import { categoriesAr, servicesAr } from "./ar/services";
import { projectsAr } from "./ar/projects";
import { benefitsAr, faqsAr, journeyAr, materialsAr, processAr } from "./ar/content";

export function getCategories(language: LanguageCode): ServiceCategory[] {
  if (language !== "ar") return serviceCategories;
  return serviceCategories.map((category) => ({
    ...category,
    ...categoriesAr[category.slug],
    services: category.services.map((service) => ({ ...service, ...servicesAr[service.id] })),
  }));
}

export function getCategory(language: LanguageCode, slug: string) {
  return getCategories(language).find((category) => category.slug === slug);
}

/** Localized service lookup by id, with its category. */
export function getServiceIndex(language: LanguageCode) {
  const index = new Map<string, { name: string; summary: string; category: ServiceCategory }>();
  for (const category of getCategories(language)) {
    for (const service of category.services) index.set(service.id, { ...service, category });
  }
  return index;
}

export function getProjects(language: LanguageCode): Project[] {
  if (language !== "ar") return projects;
  return projects.map((project) => {
    const t = projectsAr[project.slug];
    if (!t) return project;
    const [coverAlt, ...galleryAlts] = t.alts;
    return {
      ...project,
      name: t.name,
      type: t.type,
      summary: t.summary,
      description: t.description,
      specs: t.specs,
      materials: t.materials,
      cover: { ...project.cover, alt: coverAlt ?? project.cover.alt },
      gallery: project.gallery.map((image, i) => ({ ...image, alt: galleryAlts[i] ?? image.alt })),
    };
  });
}

export function getProject(language: LanguageCode, slug: string) {
  return getProjects(language).find((project) => project.slug === slug);
}

export function getAdjacentProjects(language: LanguageCode, slug: string) {
  const list = getProjects(language);
  const index = list.findIndex((project) => project.slug === slug);
  return {
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}

export function getJourney(language: LanguageCode) {
  return language === "ar" ? journeyStages.map((stage) => ({ ...stage, ...journeyAr[stage.number] })) : journeyStages;
}

export function getProcess(language: LanguageCode) {
  return language === "ar" ? processSteps.map((step) => ({ ...step, ...processAr[step.number] })) : processSteps;
}

export function getMaterials(language: LanguageCode) {
  return language === "ar" ? materials.map((material) => ({ ...material, ...materialsAr[material.slug] })) : materials;
}

export function getBenefits(language: LanguageCode) {
  return language === "ar" ? benefits.map((benefit) => ({ ...benefit, ...benefitsAr[benefit.id] })) : benefits;
}

export function getFaqs(language: LanguageCode) {
  return language === "ar" ? faqs.map((faq) => ({ ...faq, ...faqsAr[faq.id] })) : faqs;
}
