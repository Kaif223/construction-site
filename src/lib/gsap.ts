"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let modules: Promise<GsapModules> | null = null;

/**
 * GSAP is loaded on demand, only where scroll-linked motion is actually used
 * (large screens, motion allowed). Phones and reduced-motion visitors never
 * download it.
 */
export function loadGsap() {
  modules ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([core, plugin]) => {
    core.gsap.registerPlugin(plugin.ScrollTrigger);
    return { gsap: core.gsap, ScrollTrigger: plugin.ScrollTrigger };
  });
  return modules;
}

let refreshTimer: number | undefined;

/** Triggers are created asynchronously by several components; re-measure once they settle. */
export function scheduleScrollRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(async () => {
    const { ScrollTrigger } = await loadGsap();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 120);
}

export const LARGE_MOTION_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Runs `setup` inside a gsap.context scoped to `scope` while `query` matches,
 * and reverts every tween and ScrollTrigger it created when the query stops
 * matching or the component unmounts.
 */
export function useScrollMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (modules: GsapModules) => void | (() => void),
  query: string = LARGE_MOTION_QUERY,
) {
  const runSetup = useEffectEvent(setup);

  useEffect(() => {
    const media = window.matchMedia(query);
    let revert: (() => void) | undefined;
    let disposed = false;

    async function apply() {
      revert?.();
      revert = undefined;
      if (!media.matches || !scope.current) return;
      const loaded = await loadGsap();
      if (disposed || !media.matches || !scope.current) return;
      let extra: void | (() => void);
      const ctx = loaded.gsap.context(() => {
        extra = runSetup(loaded);
      }, scope.current);
      revert = () => {
        if (typeof extra === "function") extra();
        ctx.revert();
      };
      scheduleScrollRefresh();
    }

    apply();
    media.addEventListener("change", apply);
    return () => {
      disposed = true;
      media.removeEventListener("change", apply);
      revert?.();
    };
  }, [query, scope]);
}
