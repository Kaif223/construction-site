"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { loadGsap, scheduleScrollRefresh } from "@/lib/gsap";

declare global {
  interface Window {
    __construktMotion?: boolean;
  }
}

const PARALLAX_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/**
 * Declarative scroll motion for server-rendered markup.
 *
 * Sections stay Server Components and opt in with attributes:
 *   data-reveal="up | fade | lines | mask | stagger | rule"
 *       Entrance played once when the element enters the viewport. The
 *       transitions themselves live in globals.css; this component only adds
 *       `is-revealed`, using a single IntersectionObserver.
 *   data-parallax="0.12"   — image drift while scrolling (fraction of height)
 *   data-scrub="grow-y"    — element scales in step with scroll position
 *       Scroll-linked effects use GSAP ScrollTrigger, loaded on demand for
 *       tablet/desktop only.
 *
 * Content streamed in after navigation is picked up by a MutationObserver.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    window.__construktMotion = true;
    if (!document.documentElement.classList.contains("motion-ready")) return;

    // ── Entrance reveals ────────────────────────────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    function scanReveals() {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-bound])").forEach((el) => {
        el.dataset.revealBound = "";
        const type = el.dataset.reveal;
        if (type === "stagger") {
          Array.from(el.children).forEach((child, index) =>
            (child as HTMLElement).style.setProperty("--i", String(index)),
          );
        } else if (type === "lines") {
          el.querySelectorAll<HTMLElement>(".line-mask > span").forEach((span, index) =>
            span.style.setProperty("--i", String(index)),
          );
        }
        observer.observe(el);
      });
    }

    // ── Scroll-linked effects (tablet and up) ───────────────────────────
    const media = window.matchMedia(PARALLAX_QUERY);
    let revertScroll: (() => void) | undefined;
    let disposed = false;

    async function setupScroll() {
      revertScroll?.();
      revertScroll = undefined;
      const targets = document.querySelectorAll("[data-parallax], [data-scrub]");
      if (!media.matches || targets.length === 0) return;
      const { gsap } = await loadGsap();
      if (disposed) return;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 0.1;
          gsap.fromTo(
            el,
            { yPercent: -amount * 100 },
            {
              yPercent: amount * 100,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
        gsap.utils.toArray<HTMLElement>('[data-scrub="grow-y"]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
            },
          );
        });
      });
      revertScroll = () => ctx.revert();
      scheduleScrollRefresh();
    }

    // ── Watch for streamed or client-rendered content ───────────────────
    let pending = 0;
    const mutations = new MutationObserver((records) => {
      const relevant = records.some((record) =>
        Array.from(record.addedNodes).some(
          (node) =>
            node instanceof Element &&
            (node.matches("[data-reveal], [data-parallax], [data-scrub]") ||
              node.querySelector("[data-reveal], [data-parallax], [data-scrub]")),
        ),
      );
      if (!relevant) return;
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        scanReveals();
        setupScroll();
      });
    });

    scanReveals();
    setupScroll();
    media.addEventListener("change", setupScroll);
    const main = document.getElementById("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(pending);
      observer.disconnect();
      // Anything still waiting to reveal must be re-observed by the next scan.
      document
        .querySelectorAll<HTMLElement>("[data-reveal-bound]:not(.is-revealed)")
        .forEach((el) => delete el.dataset.revealBound);
      mutations.disconnect();
      media.removeEventListener("change", setupScroll);
      revertScroll?.();
    };
  }, [pathname]);

  return null;
}
