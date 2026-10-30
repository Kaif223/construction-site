"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { JourneyStage } from "@/data/content";
import { useI18n } from "@/i18n/client";
import { BuildDrawing } from "@/components/home/BuildDrawing";

/** Extra scroll, in stages, during which the finished house is held on screen. */
const HOLD = 0.6;
/** Scroll distance given to each stage, in small-viewport heights. */
const STAGE_SCROLL = 30;

/**
 * Nine construction stages, told by a drawing of a house that builds itself.
 *
 * With motion allowed (any screen size): the section is a tall track whose
 * inner frame sticks to the viewport; scrolling through it advances the
 * drawing continuously and selects the matching stage. This is ordinary
 * sticky positioning, so touch scrolling is never taken over. Otherwise the
 * stages are a plain tab set and the drawing shows the selected stage.
 * Either way the tabs work with click, tap and arrow keys.
 */
export function ConstructionJourney({ stages }: { stages: JourneyStage[] }) {
  const { dict, dir } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const drawing = useRef<HTMLDivElement>(null);
  const tabList = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrubbing = useRef(false);
  const [active, setActive] = useState(0);
  const total = stages.length;
  const span = total + HOLD;
  const stage = stages[active];

  // Scroll position → drawing progress (written straight to the DOM each frame) and active stage.
  useEffect(() => {
    const el = track.current;
    const art = drawing.current;
    if (!el || !art) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = el.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / scrollable)) : 1;
      const s = Math.min(total, progress * span);
      art.style.setProperty("--s", s.toFixed(3));
      const index = Math.min(total - 1, Math.floor(s));
      setActive((current) => (current === index ? current : index));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // `motion-ready` is only set when JavaScript runs and reduced motion is not requested.
    scrubbing.current = document.documentElement.classList.contains("motion-ready");
    if (!scrubbing.current) return;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [total, span]);

  // Without scroll-driving, the drawing simply shows the selected stage complete.
  useEffect(() => {
    if (!scrubbing.current) drawing.current?.style.setProperty("--s", String(active + 1));
  }, [active]);

  // Keep the active stage visible in the horizontally scrolling tab row on small screens.
  useEffect(() => {
    const list = tabList.current;
    const tab = tabRefs.current[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    const listBox = list.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    list.scrollBy({ left: tabBox.left + tabBox.width / 2 - (listBox.left + listBox.width / 2), behavior: "smooth" });
  }, [active]);

  function select(index: number, focus = false) {
    const next = (index + total) % total;
    const el = track.current;
    if (scrubbing.current && el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + ((next + 0.85) / span) * scrollable, behavior: "smooth" });
    }
    setActive(next);
    if (focus) tabRefs.current[next]?.focus({ preventScroll: true });
  }

  function onTabKey(event: React.KeyboardEvent, index: number) {
    // Horizontal arrows follow reading direction: in Arabic, Left moves forward.
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const keys: Record<string, number> = { ArrowDown: 1, [forward]: 1, ArrowUp: -1, [backward]: -1 };
    if (event.key in keys) {
      event.preventDefault();
      select(index + keys[event.key], true);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select(event.key === "Home" ? 0 : total - 1, true);
    }
  }

  return (
    <div
      ref={track}
      style={{ "--track-h": `${100 + total * STAGE_SCROLL}svh` } as React.CSSProperties}
      className="relative [.motion-ready_&]:h-[var(--track-h)]"
    >
      <div className="flex flex-col justify-center py-8 [.motion-ready_&]:sticky [.motion-ready_&]:top-0 [.motion-ready_&]:h-[100svh] [.motion-ready_&]:py-0 [.motion-ready_&]:pt-[var(--header-h)]">
        <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* Stage list */}
          <div className="lg:col-span-3">
            <div
              ref={tabList}
              role="tablist"
              aria-label={dict.journey.tablist}
              aria-orientation="vertical"
              className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
            >
              {stages.map((item, index) => {
                const selected = index === active;
                const done = index < active;
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
                    className={`group flex min-h-11 shrink-0 items-center gap-3 rounded-full border px-4 text-start text-sm whitespace-nowrap transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-2.5 lg:whitespace-normal ${
                      selected
                        ? "border-charcoal bg-charcoal text-ivory lg:bg-transparent lg:text-charcoal"
                        : done
                          ? "border-line text-charcoal/80 hover:text-charcoal"
                          : "border-line text-ink-muted hover:text-charcoal"
                    }`}
                  >
                    <span className={`eyebrow ${selected ? "lg:text-orange-ink" : ""}`}>{item.number}</span>
                    <span>{item.title}</span>
                    <span
                      aria-hidden="true"
                      className={`ms-auto hidden h-px bg-orange transition-all duration-700 ease-[var(--ease-out-expo)] lg:block ${
                        selected ? "w-8" : done ? "w-2" : "w-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawing sheet */}
          <div className="lg:col-span-6">
            <div className="relative border border-line bg-paper/80 px-2 pt-3 pb-9 md:px-4 md:pt-4">
              <div ref={drawing} className="build text-charcoal">
                <BuildDrawing className="mx-auto block aspect-[8/5] max-h-[42svh] w-full lg:h-[min(52vh,30rem)] lg:max-h-none lg:w-auto lg:max-w-full" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-line px-3 py-2 md:px-4">
                <span className="eyebrow text-ink-muted">
                  {dict.journey.stage} <span className="ltr-isolate">{stage.number} / {String(total).padStart(2, "0")}</span>
                </span>
                <span aria-hidden="true" className="eyebrow ltr-isolate hidden text-ink-muted sm:inline">
                  DWG A-101
                </span>
              </div>
            </div>
            {/* Progress */}
            <div aria-hidden="true" className="mt-3 h-px bg-line">
              <div
                className="h-px origin-left bg-orange transition-transform duration-700 ease-[var(--ease-out-expo)] rtl:origin-right"
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
            <div key={active} className="stage-swap">
              <div className="flex items-baseline gap-4 lg:block">
                <p className="font-display text-4xl leading-none font-medium text-orange-ink tabular-nums lg:text-6xl" aria-hidden="true">
                  {stage.number}
                </p>
                <h3 className="display-md lg:mt-4">{stage.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base lg:mt-4">{stage.description}</p>
              <p className="eyebrow mt-6 hidden text-ink-muted md:block">{dict.journey.checked}</p>
              <ul className="mt-3 hidden space-y-2 text-sm md:block">
                {stage.checks.map((check) => (
                  <li key={check} className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange-ink" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 hidden gap-3 lg:flex">
              <button
                type="button"
                onClick={() => select(active - 1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/25 transition-colors hover:border-charcoal"
                aria-label={dict.journey.previous}
              >
                <ArrowLeft aria-hidden="true" className="icon-dir h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => select(active + 1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/25 transition-colors hover:border-charcoal"
                aria-label={dict.journey.next}
              >
                <ArrowRight aria-hidden="true" className="icon-dir h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
