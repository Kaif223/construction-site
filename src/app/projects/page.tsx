import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { projectCategories, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Concept Portfolio",
  description:
    "Concept projects across residential, commercial, interiors and outdoor work — luxury residences, family homes, offices, bathrooms, kitchens and stone installation.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Projects", href: "/projects" }]}
        eyebrow="Portfolio"
        title={["Concept Studies", <em key="e">in Craft.</em>]}
        intro={
          <p>
            A collection of concept projects that show how we think about space, structure, materials and detail.
            They are illustrative design studies, not completed client work — genuine case studies will be added as
            projects are delivered.
          </p>
        }
        meta={[
          { label: "Concept projects", value: projects.length },
          { label: "Categories", value: projectCategories.join(", ") },
        ]}
      />
      <section aria-label="Project list" className="bg-ivory py-16 md:py-24">
        <div className="container-x">
          <ProjectGrid projects={projects} categories={projectCategories} />
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
