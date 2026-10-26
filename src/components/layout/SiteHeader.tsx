"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/Logo";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const lastY = useRef(0);

  // Solid background once the page scrolls; hide while scrolling down.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setSolid(y > 24);
        setHidden(y > 480 && y > lastY.current + 4);
        if (y < lastY.current - 4 || y < 480) setHidden(false);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the menu after navigating. Adjusting state during render (rather
  // than in an effect) avoids a flash of the open menu on the new page.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  // While the menu is open: lock scroll, make the page inert, handle Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const main = document.getElementById("main");
    const footer = document.querySelector<HTMLElement>("footer[data-site-footer]");
    document.body.style.overflow = "hidden";
    if (main) main.inert = true;
    if (footer) footer.inert = true;
    firstLinkRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const onLight = solid && !menuOpen;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 animate-[header-enter_0.9s_var(--ease-out-expo)_0.35s_both] transition-[transform,background-color,color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
        hidden && !menuOpen ? "-translate-y-full" : ""
      } ${
        onLight
          ? "bg-ivory/90 text-charcoal shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
          : "bg-transparent text-ivory"
      }`}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 rounded-sm" aria-label={`${siteConfig.name} — home`}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.9rem]">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-line"
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/contact"
            className={`btn hidden min-h-11 px-5 text-sm sm:inline-flex ${onLight ? "btn-dark" : "btn-primary"}`}
          >
            Start a project
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 items-center gap-3 rounded-full px-3 text-sm lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="eyebrow">{menuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                  menuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                  menuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Sibling of <header>, not a child: the header's transform and backdrop
          filter would otherwise trap this fixed overlay inside its own box. */}
      <div
        id="mobile-menu"
        aria-label="Main menu"
        role="dialog"
        aria-modal="true"
        hidden={!menuOpen}
        className="grid-paper-dark fixed inset-0 z-40 h-[100dvh] overflow-y-auto bg-charcoal pt-[var(--header-h)] text-ivory lg:hidden"
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col justify-between gap-10 pt-8 pb-10">
          <ul className="space-y-1">
            {mainNav.map((item, index) => (
              <li
                key={item.href}
                className="menu-item-enter border-b border-line-inverse"
                style={{ animationDelay: `${80 + index * 50}ms` }}
              >
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  className="flex items-baseline justify-between py-4 font-display text-[2.6rem] leading-none sm:text-6xl"
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                  <span className="eyebrow text-ivory-muted">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-6">
            <Link href="/contact" className="btn btn-primary w-full">
              Start a project <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <div className="flex flex-wrap justify-between gap-4 text-sm text-ivory-muted">
              <Link href="/estimate" className="link-line">
                Budget estimator
              </Link>
              <Link href="/faq" className="link-line">
                FAQ
              </Link>
              <a href={`mailto:${siteConfig.contact.email}`} className="link-line">
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
