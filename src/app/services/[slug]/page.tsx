import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel, SplitHeading, ButtonLink } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { RouteFallback } from "@/components/ui/RouteFallback";
import { getServiceCategory, serviceCategories } from "@/data/services";
import { getProject } from "@/data/projects";

export function generateStaticParams() {
  return serviceCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getServiceCategory(slug);
  if (!category) return { title: "Service not found" };
  return {
    title: `${category.title} Services`,
    description: `${category.summary} Including ${category.services
      .slice(0, 4)
      .map((service) => service.name.toLowerCase())
      .join(", ")} and more.`,
    alternates: { canonical: `/services/${category.slug}` },
    openGraph: { images: [{ url: category.image, alt: category.imageAlt }] },
  };
}

export default function ServiceCategoryPage({ params }: PageProps<"/services/[slug]">) {
  // The URL-specific read happens inside Suspense, so the route's shared shell
  // (and a loading state) can be prefetched and shown instantly on navigation.
  return (
    <Suspense fallback={<RouteFallback label="service" />}>
      <ServiceCategoryContent params={params} />
    </Suspense>
  );
}

async function ServiceCategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getServiceCategory(slug);
  if (!category) notFound();

  const related = category.relatedProjects.map(getProject).filter((project) => project !== undefined);
  const index = serviceCategories.findIndex((item) => item.slug === category.slug);
  const next = serviceCategories[(index + 1) % serviceCategories.length];

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Services", href: "/services" },
          { label: category.title, href: `/services/${category.slug}` },
        ]}
        eyebrow={`Discipline ${category.code} · ${category.number}`}
        title={[category.title]}
        intro={<p>{category.summary}</p>}
        image={category.image}
        imageAlt={category.imageAlt}
        meta={[
          { label: "Services", value: category.services.length },
          { label: "Deliverables", value: category.deliverables.length },
        ]}
      />

      <section aria-labelledby="approach-title" className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel>Our approach</SectionLabel>
            <h2 id="approach-title" className="sr-only">
              Our approach
            </h2>
            <p className="mt-8 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.2]" data-reveal="up">
              {category.intro}
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <h3 className="eyebrow text-ink-muted">What you receive</h3>
            <ul className="mt-5 border-t border-line" data-reveal="stagger">
              {category.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-line py-3.5 text-sm">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="list-title" className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SplitHeading id="list-title" lines={[`${category.services.length} services`, <em key="e">in detail.</em>]} className="display-lg" />
            <ButtonLink href="/contact" variant="dark">
              Discuss your project
            </ButtonLink>
          </div>
          <ol className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((service, i) => (
              <li
                key={service.id}
                id={service.id}
                className="scroll-mt-28 bg-paper p-6 transition-colors duration-700 target:bg-orange/15 md:p-8"
              >
                <p className="eyebrow text-orange-ink">
                  {category.code}.{String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg font-medium">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-ivory py-20 md:py-28">
          <div className="container-x">
            <SectionLabel>Related concept projects</SectionLabel>
            <h2 id="related-title" className="display-lg mt-8">
              See it applied.
            </h2>
            <ul className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {related.map((project) => (
                <li key={project.slug}>
                  <ProjectCard project={project} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <nav aria-label="Other disciplines" className="bg-charcoal py-16 text-ivory">
        <div className="container-x">
          <Link href={`/services/${next.slug}`} className="group flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <span>
              <span className="eyebrow text-ivory-muted">Next discipline · {next.code}</span>
              <span className="display-lg mt-3 block">{next.title}</span>
            </span>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-orange text-charcoal transition-transform duration-500 group-hover:translate-x-2">
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </span>
          </Link>
          <ul className="mt-12 flex flex-wrap gap-2 border-t border-line-inverse pt-8">
            {serviceCategories
              .filter((item) => item.slug !== category.slug)
              .map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line-inverse px-4 text-sm text-ivory/80 hover:border-ivory hover:text-ivory"
                  >
                    {item.code} · {item.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </nav>

      <ClosingCta />
    </>
  );
}
