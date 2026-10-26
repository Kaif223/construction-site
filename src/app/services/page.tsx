import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/primitives";
import { ServiceFinder, type SearchableService } from "@/components/services/ServiceFinder";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { serviceCategories, totalServiceCount } from "@/data/services";

export const metadata: Metadata = {
  title: "Construction & Renovation Services",
  description:
    "Architectural design, house and commercial construction, interior finishing, marble and tile installation, electrical, plumbing, HVAC, renovation and specialist systems — all coordinated by one team.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const searchable: SearchableService[] = serviceCategories.flatMap((category) =>
    category.services.map((service) => ({
      ...service,
      categorySlug: category.slug,
      categoryTitle: category.title,
      categoryCode: category.code,
    })),
  );

  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }]}
        eyebrow="Services"
        title={["Everything a Building Needs.", <em key="e">One Team.</em>]}
        intro={
          <p>
            From the first site survey to the final coat of paint, our services cover the complete construction and
            home-improvement lifecycle — organised into nine disciplines that work as one.
          </p>
        }
        meta={[
          { label: "Disciplines", value: serviceCategories.length },
          { label: "Individual services", value: totalServiceCount },
          { label: "Projects", value: "Residential & commercial" },
          { label: "Scope", value: "Design, build, finish, maintain" },
        ]}
      />

      <section aria-labelledby="finder-title" className="bg-paper py-16 md:py-24">
        <div className="container-x max-w-5xl">
          <h2 id="finder-title" className="display-md">
            Find a service
          </h2>
          <p className="mt-3 text-ink-muted">Search every service by name, material or problem.</p>
          <div className="mt-8">
            <ServiceFinder services={searchable} />
          </div>
        </div>
      </section>

      <section aria-labelledby="disciplines-title" className="bg-ivory py-20 md:py-32">
        <div className="container-x">
          <SectionLabel>Disciplines A — I</SectionLabel>
          <h2 id="disciplines-title" className="sr-only">
            Service disciplines
          </h2>
          <ol className="mt-12 border-t border-line">
            {serviceCategories.map((category, index) => (
              <li key={category.slug} id={category.slug} className="border-b border-line py-12 md:py-16">
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                  <div className={`lg:col-span-4 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <p className="eyebrow text-orange-ink">
                      {category.code} · {category.number}
                    </p>
                    <h3 className="display-md mt-3">
                      <Link href={`/services/${category.slug}`} className="link-line">
                        {category.title}
                      </Link>
                    </h3>
                    <p className="mt-4 leading-relaxed text-ink-muted">{category.summary}</p>
                    <Link
                      href={`/services/${category.slug}`}
                      className="btn btn-ghost-dark mt-8"
                      aria-label={`Explore ${category.title}`}
                    >
                      Explore discipline <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                  <Link
                    href={`/services/${category.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    data-cursor="Explore"
                    className={`group relative block aspect-[4/3] overflow-hidden bg-ivory-deep lg:col-span-4 ${
                      index % 2 === 1 ? "lg:order-1" : ""
                    }`}
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
                    <p className="eyebrow text-ink-muted">{category.services.length} services</p>
                    <ul className="mt-4 columns-1 gap-6 text-sm sm:columns-2 lg:columns-1 xl:columns-2">
                      {category.services.map((service) => (
                        <li key={service.id} className="break-inside-avoid border-b border-line py-2">
                          <Link href={`/services/${category.slug}#${service.id}`} className="link-line">
                            {service.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
