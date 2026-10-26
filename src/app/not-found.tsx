import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const links = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Budget estimator", href: "/estimate" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="grid-paper-dark grain relative flex min-h-[100svh] items-center bg-charcoal text-ivory">
      <div className="container-x pt-[var(--header-h)]">
        <p className="eyebrow text-orange">Error 404 · Off the drawings</p>
        <h1 className="display-hero mt-6">
          This page
          <br />
          <em>wasn’t built.</em>
        </h1>
        <p className="lede mt-8 max-w-xl text-ivory/75">
          The address may have changed, or the page never existed. Let’s get you back on site.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-line-inverse pt-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="link-line text-ivory/80 hover:text-ivory">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
