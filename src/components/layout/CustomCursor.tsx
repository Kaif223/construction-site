"use client";

import { useEffect, useRef, useState } from "react";
import { loadGsap } from "@/lib/gsap";

/**
 * A label that follows the pointer over elements marked `data-cursor="…"`.
 * The native cursor is never hidden. Only mounts on fine pointers with motion
 * allowed — touch devices and reduced-motion visitors never see it.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    let xTo: ((value: number) => void) | undefined;
    let yTo: ((value: number) => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    });
    let current = "";

    const onMove = (event: PointerEvent) => {
      xTo?.(event.clientX);
      yTo?.(event.clientY);
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const next = target?.dataset.cursor ?? "";
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const onLeave = () => {
      current = "";
      setLabel("");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelled = true;
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      loadGsap().then(({ gsap }) => gsap.killTweensOf(el));
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90]"
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-orange px-4 py-2.5 font-mono text-[0.68rem] tracking-[0.14em] whitespace-nowrap text-charcoal uppercase transition-[opacity,scale] duration-300 ease-[var(--ease-out-expo)] ${
          label ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        {label || " "}
      </div>
    </div>
  );
}
