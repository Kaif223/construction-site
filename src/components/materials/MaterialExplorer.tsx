"use client";

import Image from "next/image";
import { useState } from "react";
import type { Material } from "@/data/content";

type Filter = "All" | "Interior" | "Exterior";

function matches(material: Material, filter: Filter) {
  if (filter === "All") return true;
  return material.application === filter || material.application === "Interior & exterior";
}

export function MaterialExplorer({ materials }: { materials: Material[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = materials.filter((material) => matches(material, filter));

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter materials by application" className="flex flex-wrap gap-2">
          {(["All", "Interior", "Exterior"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className="choice aria-pressed:border-charcoal aria-pressed:bg-charcoal aria-pressed:text-ivory"
            >
              {option === "All" ? "All materials" : `${option} use`}
            </button>
          ))}
        </div>
        <p className="eyebrow text-ink-muted" aria-live="polite">
          {visible.length} materials
        </p>
      </div>

      <ul className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((material, index) => (
          <li key={material.slug} id={material.slug} className={`scroll-mt-28 ${index % 3 === 1 ? "lg:mt-16" : ""}`}>
            <article>
              <div className="group relative aspect-[4/5] overflow-hidden bg-ivory-deep">
                <Image
                  src={material.image}
                  alt={material.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
                <span className="eyebrow absolute top-4 left-4 rounded-full bg-ivory/90 px-3 py-1.5 text-charcoal">
                  {material.code}
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <h2 className="font-display text-3xl">{material.name}</h2>
                <span className="eyebrow text-ink-muted">{material.application}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{material.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Typical uses of ${material.name}`}>
                {material.uses.map((use) => (
                  <li key={use} className="rounded-full border border-line px-3 py-1 text-xs">
                    {use}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-muted">
                <span className="font-mono tracking-[0.1em] uppercase">Care · </span>
                {material.care}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
