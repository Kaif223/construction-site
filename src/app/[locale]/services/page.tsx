import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { AvailabilityBadge, SectionLabel } from "@/components/ui/primitives";
import { ServiceFinder, type SearchableService } from "@/components/services/ServiceFinder";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { totalServiceCount } from "@/data/services";
import { categoryEnabled, serviceAvailability } from "@/config/markets";
import { getCategories } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/services", title: dict.meta.services.title, description: dict.meta.services.description });
}

export default async function ServicesPage() {
  const { dict, href, language, market, l, t, p } = await getI18n();
  const s = dict.services;
  const categories = getCategories(language).filter((category) => categoryEnabled(market, category.slug));
  const searchable: SearchableService[] = categories.flatMap((category) =>
    category.services.map((service) => ({
      ...service,
      categorySlug: category.slug,
      categoryTitle: category.title,
      categoryCode: category.code,
    })),
  );
  const statuses = ["available", "partner", "not-offered", "unconfirmed"] as const;
  const inUse = new Set(categories.map((category) => serviceAvailability(market, category.slug)));

  return (
    <>
      <PageHero
        crumbs={[{ label: s.eyebrow, href: "/services" }]}
        eyebrow={s.eyebrow}
        title={s.title}
        intro={<p>{s.intro}</p>}
        meta={[
          { label: s.meta.disciplines, value: categories.length },
          { label: s.meta.services, value: totalServiceCount },
          { label: s.meta.coverage, value: s.meta.coverageValue },
          { label: t(dict.availability.title, { market: l(market.name) }), value: dict.availability[market.services.defaultAvailability] },
        ]}
      />

      <section aria-labelledby="finder-title" className="bg-paper py-16 md:py-24">
        <div className="container-x max-w-5xl">
          <h2 id="finder-title" className="display-md">
            {s.finderTitle}
          </h2>
          <p className="mt-3 text-ink-muted">{s.finderCopy}</p>
          <div className="mt-8">
            <ServiceFinder services={searchable} />
          </div>
        </div>
      </section>

      <section aria-labelledby="disciplines-title" className="bg-ivory py-20 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionLabel>{s.disciplinesLabel}</SectionLabel>
            <ul className="flex flex-wrap gap-2" aria-label={t(dict.availability.title, { market: l(market.name) })}>
              {statuses
                .filter((status) => inUse.has(status))
                .map((status) => (
                  <li key={status}>
                    <AvailabilityBadge status={status} label={dict.availability[status]} description={dict.availability.descriptions[status]} />
                    <span className="ms-2 text-xs text-ink-muted">{dict.availability.descriptions[status]}</span>
                  </li>
                ))}
            </ul>
          </div>
          <h2 id="disciplines-title" className="sr-only">
            {s.disciplinesHeading}
          </h2>
          <ol className="mt-12 border-t border-line">
            {categories.map((category, index) => {
              const status = serviceAvailability(market, category.slug);
              return (
                <li key={category.slug} id={category.slug} className="border-b border-line py-12 md:py-16">
                  <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className={`lg:col-span-4 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <p className="eyebrow text-orange-ink">
                        <span className="ltr-isolate">{category.code}</span> · {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="display-md mt-3">
                        <Link href={href(`/services/${category.slug}`)} className="link-line">
                          {category.title}
                        </Link>
                      </h3>
                      <div className="mt-4">
                        <AvailabilityBadge status={status} label={dict.availability[status]} />
                      </div>
                      <p className="mt-4 leading-relaxed text-ink-muted">{category.summary}</p>
                      <Link href={href(`/services/${category.slug}`)} className="btn btn-ghost-dark mt-8">
                        {s.explore}
                        <span className="sr-only"> — {category.title}</span>
                        <ArrowUpRight aria-hidden="true" className="icon-dir h-4 w-4" />
                      </Link>
                    </div>
                    <Link
                      href={href(`/services/${category.slug}`)}
                      tabIndex={-1}
                      aria-hidden="true"
                      data-cursor={dict.cursor.explore}
                      className={`group relative block aspect-[4/3] overflow-hidden bg-ivory-deep lg:col-span-4 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                    >
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105"
                      />
                    </Link>
                    <div className={`lg:col-span-4 ${index % 2 === 1 ? "lg:order-3" : ""}`}>
                      <p className="eyebrow text-ink-muted">{t(s.count, { services: p(dict.plurals.service, category.services.length) })}</p>
                      <ul className="mt-4 columns-1 gap-6 text-sm sm:columns-2 lg:columns-1 xl:columns-2">
                        {category.services.map((service) => (
                          <li key={service.id} className="break-inside-avoid border-b border-line py-2">
                            <Link href={href(`/services/${category.slug}#${service.id}`)} className="link-line">
                              {service.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
