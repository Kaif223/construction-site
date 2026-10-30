"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/client";

/** Pages that are themselves the next step, where the shortcut would only repeat it. */
const HIDDEN_ON = ["/quote", "/contact", "/estimate"];

/**
 * Phones only (the header shows this action from the `sm` breakpoint up).
 * A quotation shortcut pinned to the bottom of the screen once the visitor
 * has scrolled past the first screen, tucked away again over the footer.
 */
export function MobileQuoteBar() {
  const { dict, href } = useI18n();
  const pathname = usePathname();
  const [pastFold, setPastFold] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const hiddenHere = HIDDEN_ON.some((path) => pathname.endsWith(path));

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPastFold(window.scrollY > window.innerHeight * 0.8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footer = document.querySelector("footer[data-site-footer]");
    const observer = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting));
    if (footer) observer.observe(footer);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [pathname]);

  if (hiddenHere) return null;
  const visible = pastFold && !atFooter;

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-500 ease-[var(--ease-out-expo)] sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <Link
        href={href("/quote")}
        className="btn btn-primary w-full shadow-[0_12px_32px_-12px_rgb(23_25_24/0.55)]"
      >
        {dict.common.requestQuote}
        <ArrowUpRight aria-hidden="true" className="icon-dir h-4 w-4" />
      </Link>
    </div>
  );
}
