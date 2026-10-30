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

/** React marks every DOM node it has hydrated or rendered with a `__reactFiber$…` key. */
function isHydrated(el: Element) {
  return Object.keys(el).some((key) => key.startsWith("__reactFiber$"));
}

/**
 * Resolves once the document has loaded and the main thread is idle — by
 * then streamed Suspense boundaries have hydrated. Decorative scroll effects
 * wait for this; entrance reveals do not.
 */
function pageSettled() {
  return new Promise<void>((resolve) => {
    const idle = () =>
      "requestIdleCallback" in window ? requestIdleCallback(() => resolve(), { timeout: 1500 }) : setTimeout(resolve, 200);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

/**
 * Declarative scroll motion for server-rendered markup.
 *
 * Sections stay Server Components and opt in with attributes:
 *   data-reveal="up | fade | lines | mask | stagger | rule | guides"
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
    // Adding the class to a node React has not hydrated yet (a streamed
    // Suspense boundary on first load) would be a hydration mismatch, so wait
    // until React has claimed the node; give up waiting after ~2 seconds.
    const frames = new Set<number>();
    function reveal(el: Element, attempt = 0) {
      if (attempt < 120 && !isHydrated(el)) {
        const frame = requestAnimationFrame(() => {
          frames.delete(frame);
          reveal(el, attempt + 1);
        });
        frames.add(frame);
        return;
      }
      el.classList.add("is-revealed");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          reveal(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    // Bound elements are tracked here rather than marked in the DOM: this runs
    // while later Suspense boundaries may still be hydrating, and any attribute
    // written before React reaches them would be a hydration mismatch. Stagger
    // order comes from CSS (:nth-child) and word order from the markup.
    const bound = new WeakSet<Element>();
    function scanReveals() {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)").forEach((el) => {
        if (bound.has(el)) return;
        bound.add(el);
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
      // GSAP writes inline styles, so wait until React has hydrated the page.
      const [{ gsap }] = await Promise.all([loadGsap(), pageSettled()]);
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
      frames.forEach((frame) => cancelAnimationFrame(frame));
      observer.disconnect();
      mutations.disconnect();
      media.removeEventListener("change", setupScroll);
      revertScroll?.();
    };
  }, [pathname]);

  return null;
}
