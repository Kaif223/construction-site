"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useScrollMotion } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";
import { maskWords } from "@/components/ui/primitives";

/** Staggers the CSS entrance animations defined in globals.css. */
const order = (i: number) => ({ "--i": i }) as React.CSSProperties;

/**
 * Light hero: the headline sits on ivory and the photograph is framed below
 * it, inset to the page margins. The entrance (window opening, words rising,
 * fades, blueprint marks) is pure CSS so it begins at first paint. On large
 * screens GSAP — loaded on demand — widens the frame to full bleed and lets
 * the photograph drift as the page scrolls.
 */
export function Hero() {
  const { dict, href } = useI18n();
  const t = dict.hero;
  const root = useRef<HTMLElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const first = maskWords(t.lines[0]);

  useScrollMotion(root, ({ gsap }) => {
    const gutter = parseFloat(getComputedStyle(container.current!).paddingInlineStart) || 0;
    const scroll = { trigger: root.current, start: "top top", end: () => `+=${window.innerHeight * 0.7}`, scrub: true };
    gsap.fromTo(
      "[data-hero-frame]",
      { clipPath: `inset(0px ${gutter}px 0px ${gutter}px)` },
      { clipPath: "inset(0px 0px 0px 0px)", ease: "none", scrollTrigger: scroll },
    );
    gsap.to("[data-hero-image]", {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: "[data-hero-frame]", start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative bg-ivory text-charcoal">
      <div ref={container} className="container-x pt-[calc(var(--header-h)+2rem)] md:pt-[calc(var(--header-h)+3rem)]">
        <div className="flex items-start justify-between gap-6">
          <p data-hero="fade" style={order(0)} className="eyebrow flex items-center gap-3 text-ink-muted">
            <span aria-hidden="true" className="h-px w-8 bg-orange" />
            {t.eyebrow}
          </p>
          <div data-hero="fade" style={order(1)} className="eyebrow hidden text-end leading-relaxed text-ink-muted md:block">
            <p>{t.figure[0]}</p>
            <p>{t.figure[1]}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 id="hero-title" data-hero="words" className="display-hero lg:col-span-8">
            <span className="block">{first.nodes} </span>
            <em className="block">{maskWords(t.lines[1], first.count).nodes}</em>
          </h1>
          <div className="lg:col-span-4 lg:pb-2">
            <p data-hero="fade" style={order(2)} className="lede max-w-md text-ink-muted">
              {t.copy}
            </p>
            <div data-hero="fade" style={order(3)} className="mt-7 flex flex-col gap-3 xs:flex-row">
              <Link href={href("/projects")} className="btn btn-primary">
                {t.explore} <ArrowRight aria-hidden="true" className="icon-dir h-4 w-4" />
              </Link>
              <Link href={href("/quote")} className="btn btn-ghost-dark">
                {t.start}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div data-hero-frame className="hero-frame relative mt-10 h-[clamp(20rem,64svh,48rem)] overflow-hidden bg-ivory-deep md:mt-14">
        <div data-hero-image className="absolute inset-x-0 -inset-y-[8%]">
          <div data-hero-zoom className="absolute inset-0">
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
        <div data-hero-curtain aria-hidden="true" />

        {/* Blueprint annotation marks drawn over the photograph */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full text-ivory/60"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
          fill="none"
        >
          {["M40 140 V80 H100", "M960 140 V80 H900", "M40 860 V920 H100", "M960 860 V920 H900"].map((d, i) => (
            <path
              key={d}
              d={d}
              data-hero="draw"
              style={order(i)}
              pathLength={1}
              strokeDasharray="1"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      <div className="container-x">
        <div
          data-hero="fade"
          style={order(4)}
          className="eyebrow flex items-center justify-between border-b border-line py-5 text-ink-muted"
        >
          <a href="#journey" className="group inline-flex items-center gap-3 text-charcoal/80 hover:text-charcoal">
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-charcoal/15">
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
