"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { JourneyStage } from "@/data/content";
import { useScrollMotion } from "@/lib/gsap";

/**
 * Nine construction stages presented as an accessible tab set.
 * Large screens with motion allowed: the section pins and scrolling advances
 * the stages. Everywhere else: tap, click or arrow keys switch stages.
 */
export function ConstructionJourney({ stages }: { stages: JourneyStage[] }) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTriggerType | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const total = stages.length;
  const stage = stages[active];

  useScrollMotion(root, ({ ScrollTrigger }) => {
    trigger.current = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: () => `+=${window.innerHeight * total * 0.55}`,
      pin: true,
      onUpdate: (self) => {
        const index = Math.min(total - 1, Math.floor(self.progress * total));
        setActive((current) => (current === index ? current : index));
      },
    });
    return () => {
      trigger.current = null;
    };
  });

  function select(index: number, focus = false) {
    const next = (index + total) % total;
    const st = trigger.current;
    if (st) {
      window.scrollTo({ top: st.start + ((next + 0.5) / total) * (st.end - st.start), behavior: "auto" });
    }
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  }

  function onTabKey(event: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (event.key in keys) {
      event.preventDefault();
      select(index + keys[event.key], true);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select(event.key === "Home" ? 0 : total - 1, true);
    }
  }

  return (
    <div ref={root} className="bg-charcoal text-ivory lg:flex lg:h-[100svh] lg:items-center lg:pt-[var(--header-h)]">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-8 py-6 lg:grid-cols-12 lg:gap-10">
        {/* Stage list */}
        <div className="lg:col-span-3">
          <div
            role="tablist"
            aria-label="Construction stages"
            aria-orientation="vertical"
            className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
          >
            {stages.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.number}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`stage-tab-${index}`}
                  aria-selected={selected}
                  aria-controls="stage-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(index)}
                  onKeyDown={(event) => onTabKey(event, index)}
                  className={`group flex min-h-11 shrink-0 items-center gap-3 rounded-full border px-4 text-left text-sm whitespace-nowrap transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:border-line-inverse lg:px-0 lg:py-3 lg:whitespace-normal ${
                    selected
                      ? "border-orange bg-orange text-charcoal lg:bg-transparent lg:text-ivory"
                      : "border-line-inverse text-ivory/60 hover:text-ivory"
                  }`}
                >
                  <span className={`eyebrow ${selected ? "lg:text-orange" : ""}`}>{item.number}</span>
                  <span>{item.title}</span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto hidden h-px bg-orange transition-all duration-700 ease-[var(--ease-out-expo)] lg:block ${
                      selected ? "w-8" : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Image stack: later stages wipe up over earlier ones */}
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden bg-graphite lg:aspect-auto lg:h-[min(64vh,44rem)]">
            {stages.map((item, index) => (
              <div
                key={item.number}
                className="absolute inset-0 transition-[clip-path] duration-[1100ms] ease-[var(--ease-arch)]"
                style={{
                  zIndex: index,
                  clipPath: index <= active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                }}
                aria-hidden={index !== active}
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={`object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] ${
                    index === active ? "scale-100" : "scale-110"
                  }`}
                />
              </div>
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4 md:p-5">
              <span className="eyebrow rounded-full bg-charcoal/75 px-3 py-1.5 backdrop-blur">
                Stage {stage.number} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
          {/* Progress */}
          <div aria-hidden="true" className="mt-4 h-px bg-line-inverse">
            <div
              className="h-px origin-left bg-orange transition-transform duration-700 ease-[var(--ease-out-expo)]"
              style={{ transform: `scaleX(${(active + 1) / total})` }}
            />
          </div>
        </div>

        {/* Stage detail */}
        <div
          id="stage-panel"
          role="tabpanel"
          aria-labelledby={`stage-tab-${active}`}
          className="flex flex-col lg:col-span-3"
        >
          <p className="font-display text-7xl leading-none text-orange lg:text-8xl" aria-hidden="true">
            {stage.number}
          </p>
          <h3 className="display-md mt-4">{stage.title}</h3>
          <p className="mt-4 leading-relaxed text-ivory/75">{stage.description}</p>
          <p className="eyebrow mt-8 text-ivory-muted">Checked before moving on</p>
          <ul className="mt-3 space-y-2.5 text-sm">
            {stage.checks.map((check) => (
              <li key={check} className="flex items-start gap-3">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                {check}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3 lg:mt-auto lg:pt-8">
            <button
              type="button"
              onClick={() => select(active - 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/30 transition-colors hover:border-ivory"
              aria-label="Previous stage"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => select(active + 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/30 transition-colors hover:border-ivory"
              aria-label="Next stage"
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
