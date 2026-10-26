import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { AvailabilityBadge, ButtonLink, SectionLabel, SplitHeading } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ContactActions } from "@/components/contact/ContactActions";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { RouteFallback } from "@/components/ui/RouteFallback";
import { categoryEnabled, serviceAvailability } from "@/config/markets";
import { serviceCategories } from "@/data/services";
import { getCategories, getCategory, getProject } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return serviceCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { dict, language, t } = await getI18n();
  const category = getCategory(language, slug);
  if (!category) return { title: dict.meta.notFound.title };
  return pageMetadata({
    path: `/services/${slug}`,
    title: t(dict.meta.category.title, { title: category.title }),
    description: t(dict.meta.category.description, {
      summary: category.summary,
      examples: category.services
        .slice(0, 3)
        .map((service) => service.name)
        .join(language === "ar" ? "، " : ", "),
    }),
    image: category.image,
    imageAlt: category.imageAlt,
  });
}

export default function ServiceCategoryPage({ params }: PageProps<"/[locale]/services/[slug]">) {
  // The URL-specific read happens inside Suspense, so the route's shared shell
  // (and a loading state) can be prefetched and shown instantly on navigation.
  return (
    <Suspense fallback={<RouteFallback label="…" />}>
      <ServiceCategoryContent params={params} />
    </Suspense>
  );
}

async function ServiceCategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { dict, href, language, market, l, t, p } = await getI18n();
  const c = dict.category;
  const category = getCategory(language, slug);
  if (!category || !categoryEnabled(market, slug)) notFound();

  const categories = getCategories(language);
  const related = category.relatedProjects.map((projectSlug) => getProject(language, projectSlug)).filter((project) => project !== undefined);
  const relatedCategories = category.relatedCategories
    .map((relatedSlug) => categories.find((item) => item.slug === relatedSlug))
    .filter((item) => item !== undefined);
  const index = categories.findIndex((item) => item.slug === category.slug);
  const next = categories[(index + 1) % categories.length];
  const status = serviceAvailability(market, category.slug);
  const quoteHref = href(`/quote?service=${category.slug}`);

  return (
    <>
      <PageHero
        crumbs={[
          { label: dict.services.eyebrow, href: "/services" },
          { label: category.title, href: `/services/${category.slug}` },
        ]}
        eyebrow={t(c.eyebrow, { code: category.code })}
        title={[category.title]}
        emphasis={[]}
        intro={<p>{category.summary}</p>}
        image={category.image}
        imageAlt={category.imageAlt}
        meta={[
          { label: t(dict.availability.title, { market: l(market.name) }), value: dict.availability[status] },
          { label: dict.services.meta.services, value: category.services.length },
        ]}
      >
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href={quoteHref}>{c.discuss}</ButtonLink>
        </div>
      </PageHero>

      <section aria-labelledby="approach-title" className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel>{c.approach}</SectionLabel>
            <h2 id="approach-title" className="sr-only">
              {c.approach}
            </h2>
            <p className="mt-8 font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.3]" data-reveal="up">
              {category.intro}
            </p>
            <p className="mt-8 text-sm text-ink-muted">{dict.availability.descriptions[status]}</p>
            {category.regulated && (
              <p role="note" className="mt-4 flex gap-3 border-s-2 border-orange bg-paper px-4 py-3 text-sm">
                <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange-ink" />
                {dict.availability.regulated}
              </p>
            )}
          </div>
          <div className="space-y-10 lg:col-span-4 lg:col-start-9">
            {[
              { title: c.scope, items: category.scope },
              { title: c.requirements, items: category.requirements },
              { title: c.deliverables, items: category.deliverables },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="eyebrow text-ink-muted">{group.title}</h3>
                <ul className="mt-4 border-t border-line" data-reveal="stagger">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 border-b border-line py-3 text-sm">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="list-title" className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SplitHeading
              id="list-title"
              lines={[t(c.inDetail[0], { services: p(dict.plurals.service, category.services.length) }), c.inDetail[1]]}
              emphasis={[1]}
              className="display-lg"
            />
            <ContactActions variant="compact" whatsappMessage={t(c.whatsappMessage, { service: category.title })} />
          </div>
          <ol className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((service, i) => {
              const serviceStatus = serviceAvailability(market, category.slug, service.id);
              return (
                <li
                  key={service.id}
                  id={service.id}
                  className="flex scroll-mt-28 flex-col bg-paper p-6 transition-colors duration-700 target:bg-orange/15 md:p-8"
                >
                  <p className="eyebrow ltr-isolate text-orange-ink">
                    {category.code}.{String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-lg font-medium">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.summary}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <AvailabilityBadge status={serviceStatus} label={dict.availability[serviceStatus]} />
                    <Link href={quoteHref} className="link-line text-sm font-medium">
                      {c.quoteService}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {(related.length > 0 || relatedCategories.length > 0) && (
        <section aria-labelledby="related-title" className="bg-ivory py-20 md:py-28">
          <div className="container-x">
            {related.length > 0 && (
              <>
                <SectionLabel>{c.relatedProjects}</SectionLabel>
                <h2 id="related-title" className="display-lg mt-8">
                  {c.seeIt}
                </h2>
                <ul className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                  {related.map((project) => (
                    <li key={project.slug}>
                      <ProjectCard
                        project={project}
                        href={href(`/projects/${project.slug}`)}
                        statusLabel={dict.projects.status[project.status]}
                        categoryLabel={dict.projects.categories[project.category]}
                        cursorLabel={dict.cursor.viewProject}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
            {relatedCategories.length > 0 && (
              <div className={related.length > 0 ? "mt-20" : ""}>
                <h2 className="eyebrow text-ink-muted" id={related.length > 0 ? undefined : "related-title"}>
                  {c.relatedServices}
                </h2>
                <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-3">
                  {relatedCategories.map((item) => (
                    <li key={item.slug} className="bg-ivory">
                      <Link href={href(`/services/${item.slug}`)} className="group flex h-full items-start justify-between gap-4 p-6 hover:bg-paper">
                        <span>
                          <span className="eyebrow ltr-isolate text-orange-ink">{item.code}</span>
                          <span className="mt-2 block font-medium">{item.title}</span>
                          <span className="mt-1 block text-sm text-ink-muted">{item.summary}</span>
                        </span>
                        <ArrowRight aria-hidden="true" className="icon-dir mt-1 h-4 w-4 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <nav aria-label={c.other} className="bg-charcoal py-16 text-ivory">
        <div className="container-x">
          <Link href={href(`/services/${next.slug}`)} className="group flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <span>
              <span className="eyebrow text-ivory-muted">{t(c.next, { code: next.code })}</span>
              <span className="display-lg mt-3 block">{next.title}</span>
            </span>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-orange text-charcoal transition-transform duration-500 group-hover:translate-x-[calc(0.5rem*var(--dir))]">
              <ArrowRight aria-hidden="true" className="icon-dir h-5 w-5" />
            </span>
          </Link>
          <ul className="mt-12 flex flex-wrap gap-2 border-t border-line-inverse pt-8">
            {categories
              .filter((item) => item.slug !== category.slug)
              .map((item) => (
                <li key={item.slug}>
                  <Link
                    href={href(`/services/${item.slug}`)}
                    className="inline-flex min-h-11 items-center rounded-full border border-line-inverse px-4 text-sm text-ivory/80 hover:border-ivory hover:text-ivory"
                  >
                    <span className="ltr-isolate">{item.code}</span>&nbsp;· {item.shortTitle}
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
