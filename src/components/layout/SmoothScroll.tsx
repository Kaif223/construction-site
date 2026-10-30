"use client";

import { useEffect } from "react";
import { loadGsap } from "@/lib/gsap";

const SMOOTH_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** True while something modal (the mobile menu or a dialog) has locked page scroll. */
function scrollLocked() {
  return document.body.style.overflow === "hidden" || document.querySelector("dialog[open]") !== null;
}

/**
 * Eases mouse-wheel and trackpad scrolling with Lenis on devices with a fine
 * pointer. The page still scrolls natively — Lenis only animates
 * window.scrollTo — so keyboard, touch, find-in-page and anchors are
 * untouched. Lenis is driven from GSAP's ticker so ScrollTrigger pins and
 * scrubs stay in step with it. Touch screens and reduced-motion visitors
 * never load it.
 */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia(SMOOTH_QUERY);
    let teardown: (() => void) | undefined;
    let disposed = false;

    async function apply() {
      teardown?.();
      teardown = undefined;
      if (!media.matches) return;
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import("lenis"), loadGsap()]);
      if (disposed || !media.matches) return;

      const lenis = new Lenis({
        lerp: 0.11,
        allowNestedScroll: true,
        virtualScroll: () => !scrollLocked(),
      });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      teardown = () => {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    }

    apply();
    media.addEventListener("change", apply);
    return () => {
      disposed = true;
      media.removeEventListener("change", apply);
      teardown?.();
    };
  }, []);

  return null;
}
