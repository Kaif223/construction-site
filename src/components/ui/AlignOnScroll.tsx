"use client";

import { useRef } from "react";
import { useScrollMotion } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";

/**
 * The lines of a SplitHeading inside start staggered sideways and slide into
 * alignment as the block scrolls towards the middle of the screen, in step
 * with the scroll position. Large screens with motion allowed only; elsewhere
 * the heading simply sits aligned.
 */
export function AlignOnScroll({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { dir } = useI18n();
  const sign = dir === "rtl" ? -1 : 1;

  useScrollMotion(root, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>("[data-reveal='lines'] > .block").forEach((line, index) => {
      const side = index % 2 === 0 ? 1 : -1;
      gsap.fromTo(
        line,
        { xPercent: sign * side * (16 + index * 10) },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "center 55%", scrub: 0.9 },
        },
      );
    });
  });

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
