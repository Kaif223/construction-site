"use client";

import { useEffect, useRef } from "react";

/**
 * A whole number that counts up from zero when it scrolls into view. The real
 * value is server-rendered and stays in place without JavaScript or with
 * reduced motion. Leading zeros in `value` ("01") are kept while counting.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Update React's own text node rather than replacing it via textContent.
    const text = ref.current?.firstChild;
    const target = Number(value);
    if (!ref.current || !(text instanceof Text) || !Number.isInteger(target) || target < 2) return;
    if (!document.documentElement.classList.contains("motion-ready")) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400 + Math.min(target, 200) * 3;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 4);
          text.nodeValue = String(Math.round(target * eased)).padStart(value.length, "0");
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      // Matches the reveal margin, so counting starts as the row fades in.
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      text.nodeValue = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
