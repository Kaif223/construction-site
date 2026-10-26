"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useSearchParam } from "@/hooks/useBrowserValue";

type Filter = "All" | ProjectCategory;

/** Asymmetric rhythm: alternating wide and narrow columns. */
const layout = [
  "md:col-span-7",
  "md:col-span-5 md:mt-24",
  "md:col-span-5",
  "md:col-span-7 md:mt-16",
];

export function ProjectGrid({ projects, categories }: { projects: Project[]; categories: ProjectCategory[] }) {
  const fromUrl = useSearchParam("category");
  const [chosen, setChosen] = useState<Filter | null>(null);
  // An explicit choice wins; otherwise honour a shared ?category= link.
  const filter: Filter = chosen ?? (categories.find((category) => category === fromUrl) ?? "All");
  const visible = filter === "All" ? projects : projects.filter((project) => project.category === filter);

  function choose(next: Filter) {
    setChosen(next);
    const url = new URL(window.location.href);
    if (next === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(window.history.state, "", url);
  }

  const options: Filter[] = ["All", ...categories];

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {options.map((option) => {
            const count =
              option === "All" ? projects.length : projects.filter((project) => project.category === option).length;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={filter === option}
                onClick={() => choose(option)}
                className="choice aria-pressed:border-charcoal aria-pressed:bg-charcoal aria-pressed:text-ivory"
              >
                {option}
                <span className="font-mono text-[0.68rem] opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <p className="eyebrow text-ink-muted" aria-live="polite">
          Showing {visible.length} of {projects.length} concept projects
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="grid place-items-center py-24 text-center">
          <p className="font-display text-3xl">No projects in this category yet.</p>
          <button type="button" className="btn btn-ghost-dark mt-6" onClick={() => choose("All")}>
            Show all projects
          </button>
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-20">
          {visible.map((project, index) => (
            <li key={project.slug} className={layout[index % layout.length]}>
              <ProjectCard
                project={project}
                headingLevel="h2"
                aspect={index % 4 === 0 || index % 4 === 3 ? "aspect-[3/2]" : "aspect-[4/5]"}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
