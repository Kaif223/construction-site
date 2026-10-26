"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-inverse px-4 text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
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
