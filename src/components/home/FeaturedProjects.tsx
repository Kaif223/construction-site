"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { useScrollMotion } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";

const shapes = ["aspect-[4/5]", "aspect-[3/2]", "aspect-[1/1]", "aspect-[3/2]", "aspect-[4/5]", "aspect-[5/4]"];

/**
 * Horizontal project reel. With a large screen and motion allowed, vertical
 * scrolling drives the reel while the section is pinned (in the reading
 * direction, so right-to-left in Arabic). Otherwise it is a plain scroll-snap
 * row that works with touch, trackpads and keyboards.
 */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const { dict, href, dir } = useI18n();
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const sign = dir === "rtl" ? 1 : -1;

  useScrollMotion(section, ({ gsap }) => {
    const el = track.current!;
    const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
    section.current!.classList.add("is-pinned");
    const tween = gsap.to(el, {
      x: () => sign * distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section.current,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
    trigger.current = tween.scrollTrigger ?? null;
    return () => {
      section.current?.classList.remove("is-pinned");
      trigger.current = null;
    };
  });

  // Keep keyboard focus visible: scroll the page to where the focused card is on screen.
  function revealFocused(event: React.FocusEvent<HTMLElement>) {
    const st = trigger.current;
    const el = track.current;
    if (!st || !el) return;
    const item = (event.target as HTMLElement).closest("li");
    if (!item) return;
    const distance = el.scrollWidth - el.clientWidth;
    const fromStart = dir === "rtl" ? el.scrollWidth - item.offsetLeft - item.offsetWidth : item.offsetLeft;
    const progress = Math.min(1, Math.max(0, (fromStart - el.clientWidth * 0.15) / distance));
    window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: "auto" });
  }

  return (
    <div
      ref={section}
      className="flex min-h-0 flex-col justify-center overflow-x-clip bg-ivory py-6 lg:h-[100svh] lg:pt-[var(--header-h)]"
    >
      <ul
        ref={track}
        onFocus={revealFocused}
        className="no-scrollbar container-x flex snap-x snap-mandatory scroll-px-[var(--gutter)] items-end gap-5 overflow-x-auto pb-4 md:gap-8 [.is-pinned_&]:snap-none [.is-pinned_&]:overflow-visible"
      >
        {projects.map((project, index) => (
          <li key={project.slug} className="shrink-0 snap-start">
            <Link
              href={href(`/projects/${project.slug}`)}
              data-cursor={dict.cursor.viewProject}
              className="group block w-[78vw] sm:w-[52vw] lg:w-min"
            >
              <div className={`relative overflow-hidden bg-ivory-deep lg:h-[min(56vh,40rem)] ${shapes[index % shapes.length]}`}>
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 80vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
                <span className="eyebrow ltr-isolate absolute start-4 top-4 rounded-full bg-ivory/90 px-3 py-1.5 text-charcoal">
                  {project.number}
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-display text-2xl leading-tight md:text-3xl">{project.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {project.type} · <span className="text-orange-ink">{dict.projects.status[project.status]}</span>
                  </p>
                </div>
                <span className="eyebrow pt-2 text-ink-muted">{dict.projects.categories[project.category]}</span>
              </div>
            </Link>
          </li>
        ))}
        <li className="shrink-0 snap-start">
          <Link
            href={href("/projects")}
            className="group flex aspect-[4/5] w-[60vw] flex-col justify-between bg-charcoal p-8 text-ivory sm:w-[36vw] lg:h-[min(56vh,40rem)] lg:w-[min(44.8vh,32rem)]"
          >
            <span className="eyebrow text-ivory-muted">{dict.home.projects.portfolio}</span>
            <span className="font-display text-4xl leading-none md:text-5xl">
              {dict.home.projects.viewAll[0]}
              <br />
              {dict.home.projects.viewAll[1]}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-orange text-charcoal transition-transform duration-500 group-hover:translate-x-[calc(0.5rem*var(--dir))]">
              <ArrowRight aria-hidden="true" className="icon-dir h-5 w-5" />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
