import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { serviceCategories } from "@/data/services";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const pages: [string, number][] = [
    ["/", 1],
    ["/services", 0.9],
    ["/projects", 0.8],
    ["/process", 0.7],
    ["/materials", 0.7],
    ["/estimate", 0.8],
    ["/about", 0.6],
    ["/contact", 0.8],
    ["/faq", 0.6],
    ["/privacy", 0.2],
    ["/terms", 0.2],
  ];

  return [
    ...pages.map(([path, priority]) => ({ url: url(path), priority })),
    ...serviceCategories.map((category) => ({ url: url(`/services/${category.slug}`), priority: 0.8 })),
    ...projects.map((project) => ({ url: url(`/projects/${project.slug}`), priority: 0.5 })),
  ];
}
