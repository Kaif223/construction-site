import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/primitives";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.notFound.title, robots: { index: false } };
}

export default async function NotFound() {
  const { dict, href } = await getI18n();
  const n = dict.notFound;
  const links = [
    { label: dict.nav.services, href: "/services" },
    { label: dict.nav.projects, href: "/projects" },
    { label: dict.nav.estimate, href: "/estimate" },
    { label: dict.nav.quote, href: "/quote" },
  ];

  return (
    <section className="grid-paper-dark grain relative flex min-h-[100svh] items-center bg-charcoal text-ivory">
      <div className="container-x pt-[var(--header-h)]">
        <p className="eyebrow text-orange">{n.eyebrow}</p>
        <h1 className="display-hero mt-6">
          {n.lines[0]}
          <br />
          <em>{n.lines[1]}</em>
        </h1>
        <p className="lede mt-8 max-w-xl text-ivory/75">{n.body}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={href("/")}>{n.back}</ButtonLink>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-line-inverse pt-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={href(link.href)} className="link-line text-ivory/80 hover:text-ivory">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
