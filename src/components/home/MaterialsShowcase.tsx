"use client";

import Image from "next/image";
import { useState } from "react";
import type { Material } from "@/data/content";

/**
 * Expanding material panels. Each panel is a button, so pointer hover,
 * keyboard focus and taps all select a material; the details for the selected
 * one are always rendered as text below the strip.
 */
export function MaterialsShowcase({ materials }: { materials: Material[] }) {
  const [active, setActive] = useState(0);
  const current = materials[active];

  return (
    <div>
      <div
        className="no-scrollbar -mx-[var(--gutter)] flex h-[22rem] gap-2 overflow-x-auto px-[var(--gutter)] md:mx-0 md:h-[30rem] md:overflow-visible md:px-0 lg:h-[34rem]"
        role="group"
        aria-label="Materials"
      >
        {materials.map((material, index) => {
          const selected = index === active;
          return (
            <button
              key={material.slug}
              type="button"
              aria-pressed={selected}
              aria-controls="material-detail"
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className={`group relative shrink-0 overflow-hidden text-left transition-[flex-grow,width] duration-[900ms] ease-[var(--ease-out-expo)] max-md:w-[11rem] md:min-w-0 ${
                selected ? "md:flex-[8_1_0%] max-md:w-[16rem]" : "md:flex-[1_1_0%]"
              }`}
            >
              <Image
                src={material.image}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 16rem"
                className={`object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] ${
                  selected ? "scale-100" : "scale-125 group-hover:scale-110"
                }`}
              />
              <span
                className={`absolute inset-0 transition-colors duration-700 ${
                  selected ? "bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" : "bg-charcoal/45"
                }`}
              />
              <span className="eyebrow absolute top-4 left-4 text-ivory/80">{material.code}</span>
              <span
                className={`absolute bottom-5 left-4 font-display text-2xl leading-none text-ivory transition-opacity duration-500 md:bottom-6 md:left-6 md:text-3xl ${
                  selected ? "opacity-100" : "max-md:opacity-100 md:opacity-0"
                }`}
              >
                {material.name}
              </span>
              {!selected && (
                <span className="eyebrow absolute bottom-6 left-1/2 hidden origin-left -rotate-90 whitespace-nowrap text-ivory md:block">
                  {material.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id="material-detail"
        className="mt-8 grid gap-6 border-t border-line-inverse pt-8 md:grid-cols-12"
      >
        <div className="md:col-span-4">
          <p className="eyebrow text-orange">
            {current.code} · {current.application}
          </p>
          <h3 className="display-md mt-3">{current.name}</h3>
        </div>
        <p className="leading-relaxed text-ivory/75 md:col-span-5">{current.description}</p>
        <ul className="flex flex-wrap content-start gap-2 md:col-span-3" aria-label={`Typical uses of ${current.name}`}>
          {current.uses.map((use) => (
            <li key={use} className="rounded-full border border-line-inverse px-3 py-1.5 text-xs text-ivory/80">
              {use}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
