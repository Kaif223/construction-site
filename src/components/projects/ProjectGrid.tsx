"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useSearchParam } from "@/hooks/useBrowserValue";
import { useI18n } from "@/i18n/client";

type CategoryFilter = "all" | ProjectCategory;
/** "all", "concept" (no location) or an ISO country code. */
type LocationFilter = string;

/** Asymmetric rhythm: alternating wide and narrow columns. */
const layout = ["md:col-span-7", "md:col-span-5 md:mt-24", "md:col-span-5", "md:col-span-7 md:mt-16"];

export function ProjectGrid({ projects, categories }: { projects: Project[]; categories: ProjectCategory[] }) {
  const { dict, href, market, t, tag } = useI18n();
  const fromUrl = useSearchParam("category");
  const [chosen, setChosen] = useState<CategoryFilter | null>(null);
  const [location, setLocation] = useState<LocationFilter>("all");
  // An explicit choice wins; otherwise honour a shared ?category= link.
  const category: CategoryFilter = chosen ?? categories.find((item) => item === fromUrl) ?? "all";

  // The current market's projects come first; future markets can be filtered by country.
  const ordered = [...projects].sort(
    (a, b) => Number(b.country === market.countryCode) - Number(a.country === market.countryCode),
  );
  const locationKey = (project: Project) => project.country ?? "concept";
  const locations = Array.from(new Set(ordered.map(locationKey)));
  const countryName = (code: string) =>
    code === "concept" ? dict.projects.conceptLocation : (new Intl.DisplayNames([tag], { type: "region" }).of(code) ?? code);

  const visible = ordered.filter(
    (project) =>
      (category === "all" || project.category === category) && (location === "all" || locationKey(project) === location),
  );

  function chooseCategory(next: CategoryFilter) {
    setChosen(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(window.history.state, "", url);
  }

  const options: CategoryFilter[] = ["all", ...categories];

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <div role="group" aria-label={dict.projects.filterCategory} className="flex flex-wrap gap-2">
            {options.map((option) => {
              const count =
                option === "all" ? projects.length : projects.filter((project) => project.category === option).length;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={category === option}
                  onClick={() => chooseCategory(option)}
                  className="choice aria-pressed:border-charcoal aria-pressed:bg-charcoal aria-pressed:text-ivory"
                >
                  {option === "all" ? dict.projects.all : dict.projects.categories[option]}
                  <span className="font-mono text-[0.68rem] opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          {locations.length > 1 && (
            <div role="group" aria-label={dict.projects.filterCountry} className="flex flex-wrap gap-2">
              {["all", ...locations].map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={location === option}
                  onClick={() => setLocation(option)}
                  className="choice !min-h-10 aria-pressed:border-charcoal aria-pressed:bg-charcoal aria-pressed:text-ivory"
                >
                  {option === "all" ? dict.projects.allLocations : countryName(option)}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="eyebrow text-ink-muted" aria-live="polite">
          {t(dict.projects.showing, { shown: visible.length, total: projects.length })}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="grid place-items-center py-24 text-center">
          <p className="font-display text-3xl">{dict.projects.empty}</p>
          <button
            type="button"
            className="btn btn-ghost-dark mt-6"
            onClick={() => {
              chooseCategory("all");
              setLocation("all");
            }}
          >
            {dict.projects.showAll}
          </button>
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-20">
          {visible.map((project, index) => (
            <li key={project.slug} className={layout[index % layout.length]}>
              <ProjectCard
                project={project}
                href={href(`/projects/${project.slug}`)}
                statusLabel={dict.projects.status[project.status]}
                categoryLabel={dict.projects.categories[project.category]}
                cursorLabel={dict.cursor.viewProject}
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
