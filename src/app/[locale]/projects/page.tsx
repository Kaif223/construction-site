import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { projectCategories } from "@/data/projects";
import { getProjects } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/projects", title: dict.meta.projects.title, description: dict.meta.projects.description });
}

export default async function ProjectsPage() {
  const { dict, language } = await getI18n();
  const p = dict.projects;
  const projects = getProjects(language);

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.nav.projects, href: "/projects" }]}
        eyebrow={p.eyebrow}
        title={p.title}
        intro={<p>{p.intro}</p>}
        meta={[
          { label: p.meta.count, value: projects.length },
          { label: p.meta.categories, value: projectCategories.map((category) => p.categories[category]).join(" · ") },
        ]}
      />
      <section aria-label={dict.nav.projects} className="bg-ivory py-16 md:py-24">
        <div className="container-x">
          <Suspense>
            <ProjectGrid projects={projects} categories={projectCategories} />
          </Suspense>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
