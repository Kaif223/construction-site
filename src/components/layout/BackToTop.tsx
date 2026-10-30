"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-charcoal/20 px-4 text-charcoal/80 transition-colors hover:border-charcoal hover:text-charcoal"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
    >
      {label} <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
    </button>
  );
}
