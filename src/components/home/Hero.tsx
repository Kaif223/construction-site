"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useScrollMotion } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";

/** Staggers the CSS entrance animations defined in globals.css. */
const order = (i: number) => ({ "--i": i }) as React.CSSProperties;

/**
 * The entrance (window reveal, headline lines, fades, blueprint lines) is pure
 * CSS so it begins at first paint. GSAP is only used on large screens for the
 * scroll-out drift, and is loaded on demand.
 */
export function Hero() {
  const { dict, href } = useI18n();
  const t = dict.hero;
  const root = useRef<HTMLElement>(null);

  useScrollMotion(root, ({ gsap }) => {
    gsap.to("[data-hero-image]", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to("[data-hero-content]", {
      yPercent: -18,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "30% top", end: "bottom top", scrub: true },
    });
  });

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate h-[100svh] min-h-[38rem] overflow-hidden bg-charcoal text-ivory"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div data-hero-image className="absolute inset-0">
          <div data-hero-zoom className="absolute inset-0 scale-[1.06]">
            <Image
            src="/images/hero/residence-dusk.jpg"
            alt={t.imageAlt}
            fill
            preload
            sizes="100vw"
            quality={85}
            className="object-cover object-[62%_center]"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/10 to-transparent rtl:bg-gradient-to-l" />
        <div data-hero-curtain aria-hidden="true" />
      </div>

      {/* Blueprint annotation layer */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5] h-full w-full text-ivory/40"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        {[
          "M40 150 V110 H80",
          "M960 150 V110 H920",
          "M40 850 V890 H80",
          "M960 850 V890 H920",
          "M80 110 H920",
          "M960 150 V850",
        ].map((d, i) => (
          <path
            key={d}
            d={d}
            data-hero="draw"
            style={order(i)}
            pathLength={1}
            strokeDasharray="1"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div
        data-hero-content
        className="container-x relative flex h-full flex-col justify-end pt-[var(--header-h)] pb-10 md:pb-14"
      >
        <div
          data-hero="fade" style={order(0)}
          className="eyebrow absolute end-[var(--gutter)] top-[calc(var(--header-h)+2.75rem)] hidden text-end leading-relaxed text-ivory/70 md:block"
        >
          <p>{t.figure[0]}</p>
          <p>{t.figure[1]}</p>
        </div>

        <p data-hero="fade" style={order(1)} className="eyebrow mb-6 flex items-center gap-3 text-ivory/80">
          <span aria-hidden="true" className="h-px w-8 bg-orange" />
          {t.eyebrow}
        </p>

        <h1 id="hero-title" data-hero="lines" className="display-hero">
          {t.lines.map((line, index) => (
            <span key={line} className="line-mask">
              <span className={index === 1 ? "italic text-ivory/90" : undefined} style={order(index)}>
                {line}
                {index === 0 ? " " : null}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:items-end">
          <p data-hero="fade" style={order(2)} className="lede max-w-md text-ivory/85 md:col-span-5">
            {t.copy}
          </p>
          <div data-hero="fade" style={order(3)} className="flex flex-col gap-3 xs:flex-row md:col-span-7 md:justify-end">
            <Link href={href("/projects")} className="btn btn-primary" data-cursor={dict.cursor.explore}>
              {t.explore} <ArrowRight aria-hidden="true" className="icon-dir h-4 w-4" />
            </Link>
            <Link href={href("/quote")} className="btn btn-ghost-light">
              {t.start}
            </Link>
          </div>
        </div>

        <div
          data-hero="fade" style={order(4)}
          className="eyebrow mt-10 flex items-center justify-between border-t border-line-inverse pt-5 text-ivory/60"
        >
          <a href="#introduction" className="group inline-flex items-center gap-3 text-ivory/80 hover:text-ivory">
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-ivory/20">
              <span className="scroll-cue absolute inset-0 bg-orange" />
            </span>
            {t.scroll}
            <ArrowDown aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
          </a>
          <span className="hidden sm:inline">{t.tagline}</span>
        </div>
      </div>
    </section>
  );
}
