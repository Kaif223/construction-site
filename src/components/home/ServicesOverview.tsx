"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ServiceCategory } from "@/data/services";

export type OverviewItem = {
  title: string;
  category: ServiceCategory;
  also?: ServiceCategory;
};

/**
 * Editorial service index. On large screens a sticky preview follows the row
 * under the pointer or keyboard focus; on smaller screens each row carries its
 * own image, so nothing depends on hover.
 */
export function ServicesOverview({ items }: { items: OverviewItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
      <ol className="border-t border-line-inverse lg:col-span-7" data-reveal="stagger">
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <li key={item.category.slug} className="border-b border-line-inverse">
              <Link
                href={`/services/${item.category.slug}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                data-cursor="Explore"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-4 py-6 md:gap-x-8 md:py-8"
              >
                <span
                  className={`eyebrow transition-colors duration-500 ${isActive ? "text-orange" : "text-ivory-muted"}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-display text-[clamp(1.9rem,4.2vw,3.6rem)] leading-none transition-[color,transform] duration-700 ease-[var(--ease-out-expo)] lg:group-hover:translate-x-3 ${
                    isActive ? "text-ivory" : "text-ivory/55 lg:text-ivory/45"
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-500 ${
                    isActive ? "border-orange bg-orange text-charcoal" : "border-ivory/25 text-ivory"
                  }`}
                >
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>
                {/* Inline media for touch and small screens */}
                <span className="col-span-3 grid gap-4 sm:grid-cols-[minmax(0,14rem)_1fr] lg:hidden">
                  <span className="relative block aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.category.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 14rem, 100vw"
                      className="object-cover"
                    />
                  </span>
                  <span className="text-sm leading-relaxed text-ivory/75">{item.category.summary}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
            {items.map((item, index) => (
              <Image
                key={item.category.slug}
                src={item.category.image}
                alt=""
                fill
                sizes="40vw"
                className={`object-cover transition-[opacity,transform,clip-path] duration-[1100ms] ease-[var(--ease-out-expo)] ${
                  index === active
                    ? "scale-100 opacity-100 [clip-path:inset(0_0_0_0)]"
                    : "scale-110 opacity-0 [clip-path:inset(0_0_100%_0)]"
                }`}
              />
            ))}
            <div className="scrim-bottom absolute inset-0" />
            <p className="eyebrow absolute top-5 left-5 rounded-full bg-charcoal/70 px-3 py-1.5 text-ivory backdrop-blur">
              {current.category.code} · {current.category.services.length} services
            </p>
          </div>
          <div className="mt-6 min-h-[9.5rem]">
            <p className="max-w-md text-ivory/80">{current.category.summary}</p>
            <p className="eyebrow mt-5 text-ivory-muted">Includes</p>
            <p className="mt-2 text-sm text-ivory/70">
              {current.category.services
                .slice(0, 5)
                .map((service) => service.name)
                .join(" · ")}
              {current.also ? ` · plus ${current.also.title.toLowerCase()}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
