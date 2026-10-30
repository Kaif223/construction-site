import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink, ConceptBadge, SectionLabel, SplitHeading } from "@/components/ui/primitives";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { Gallery } from "@/components/projects/Gallery";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { RouteFallback } from "@/components/ui/RouteFallback";
import { projects } from "@/data/projects";
import { getAdjacentProjects, getProject, getServiceIndex } from "@/content";
import { fromSquareMetres, formatNumber, toSquareMetres } from "@/lib/estimate";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { dict, language, t } = await getI18n();
  const project = getProject(language, slug);
  if (!project) return { title: dict.meta.notFound.title };
  return pageMetadata({
    path: `/projects/${slug}`,
    title: t(dict.meta.project.title, { name: project.name, type: project.type }),
    description: project.summary,
    image: project.cover.src,
    imageAlt: project.cover.alt,
  });
}

export default function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  // The URL-specific read happens inside Suspense, so the route's shared shell
  // (and a loading state) can be prefetched and shown instantly on navigation.
  return (
    <Suspense fallback={<RouteFallback label="…" />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { dict, href, language, tag, t } = await getI18n();
  const p = dict.project;
  const project = getProject(language, slug);
  if (!project) notFound();
  const { previous, next } = getAdjacentProjects(language, project.slug);
  const services = getServiceIndex(language);

  const area = project.area
    ? (() => {
        const sqm = toSquareMetres(project.area.value, project.area.unit);
        return `${formatNumber(sqm, tag)} ${dict.units.sqm} · ${formatNumber(fromSquareMetres(sqm, "sqft"), tag)} ${dict.units.sqft}`;
      })()
    : dict.common.notSpecified;
  const location = project.country
    ? [project.city, new Intl.DisplayNames([tag], { type: "region" }).of(project.country)].filter(Boolean).join(", ")
    : p.locationConcept;
  const timeline = project.timeline ? [project.timeline.start, project.timeline.end ?? "…"].join(" – ") : p.timelineConcept;

  return (
    <>
      <section aria-labelledby="project-title" className="grain relative isolate overflow-hidden bg-charcoal text-ivory">
        <div className="absolute inset-0 -z-10">
          <div data-parallax="0.08" className="absolute inset-x-0 -inset-y-[10%]">
            <Image src={project.cover.src} alt={project.cover.alt} fill preload sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/50" />
        </div>
        <div className="container-x flex min-h-[88svh] flex-col justify-between pt-[calc(var(--header-h)+3.5rem)] pb-12 md:pt-[calc(var(--header-h)+5rem)]">
          <Breadcrumbs
            items={[
              { label: dict.nav.projects, href: "/projects" },
              { label: project.name, href: `/projects/${project.slug}` },
            ]}
          />
          <div>
            <div className="flex flex-wrap items-center gap-4" data-reveal="fade">
              <span className="eyebrow ltr-isolate text-orange">{project.number}</span>
              {project.status === "concept" && <ConceptBadge tone="light" label={dict.common.conceptProject} />}
            </div>
            <SplitHeading as="h1" id="project-title" lines={[project.name]} className="display-xl mt-6 max-w-[14ch]" />
            <p className="lede mt-6 max-w-2xl text-ivory/80" data-reveal="up">
              {project.summary}
            </p>
          </div>
        </div>
      </section>

      <section aria-label={p.labels.type} className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 self-start border-t border-line pt-6 lg:col-span-4" data-reveal="stagger">
            {[
              [p.labels.category, dict.projects.categories[project.category]],
              [p.labels.type, project.type],
              [p.labels.location, location],
              [p.labels.status, dict.projects.status[project.status]],
              [project.area ? p.areaKinds[project.area.kind] : p.labels.area, area],
              [p.labels.timeline, timeline],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="eyebrow text-ink-muted">{term}</dt>
                <dd className="mt-1.5 text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-6 lg:col-span-7 lg:col-start-6">
            {project.description.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 ? "font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.3]" : "lede text-ink-muted"}
                data-reveal="up"
              >
                {paragraph}
              </p>
            ))}
            {project.status === "concept" && (
              <p className="border-s-2 border-orange ps-4 text-sm text-ink-muted">{p.conceptNote}</p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="gallery-title" className="bg-ivory pb-20 md:pb-28">
        <div className="container-x">
          <SectionLabel>{p.gallery}</SectionLabel>
          <h2 id="gallery-title" className="sr-only">
            {p.gallery}
          </h2>
          <div className="mt-8">
            <Gallery images={[project.cover, ...project.gallery]} title={project.name} />
          </div>
          {project.beforeAfter && (
            <div className="mt-16">
              <h3 className="display-md">{p.beforeAfter}</h3>
              <CompareSlider
                className="mt-8"
                label={t(dict.compare.label, { before: p.before, after: p.after })}
                valueText={t(dict.compare.valueText, { before: p.before })}
                before={{ ...project.beforeAfter.before, label: p.before }}
                after={{ ...project.beforeAfter.after, label: p.after }}
              />
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="spec-title" className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>{p.specification}</SectionLabel>
            <h2 id="spec-title" className="display-md mt-6">
              {p.designBrief}
            </h2>
            <table className="mt-8 w-full text-start text-sm">
              <caption className="sr-only">{t(p.specCaption, { name: project.name })}</caption>
              <tbody>
                {project.specs.map((spec) => (
                  <tr key={spec.label} className="border-t border-line">
                    <th scope="row" className="eyebrow py-3.5 pe-6 text-start font-normal text-ink-muted">
                      {spec.label}
                    </th>
                    <td className="py-3.5 text-end">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="eyebrow text-ink-muted">{p.services}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.services.map((serviceId) => {
                const service = services.get(serviceId);
                if (!service) return null;
                return (
                  <li key={serviceId}>
                    <Link
                      href={href(`/services/${service.category.slug}#${serviceId}`)}
                      className="inline-flex min-h-11 items-center rounded-full border border-charcoal/20 px-4 text-sm hover:border-charcoal"
                    >
                      {service.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <h3 className="eyebrow mt-10 text-ink-muted">{p.materials}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-px border border-line bg-line text-sm">
              {project.materials.map((material) => (
                <li key={material} className="bg-paper px-4 py-3">
                  {material}
                </li>
              ))}
            </ul>
            <ButtonLink
              href={href(`/quote?service=${services.get(project.services[0])?.category.slug ?? ""}`)}
              variant="dark"
              className="mt-10"
            >
              {p.enquire}
            </ButtonLink>
          </div>
        </div>
      </section>

      <nav aria-label={dict.nav.projects} className="bg-charcoal text-ivory">
        <div className="container-x grid md:grid-cols-2">
          {[
            { item: previous, label: p.previous, Icon: ArrowLeft, start: true },
            { item: next, label: p.next, Icon: ArrowRight, start: false },
          ].map(({ item, label, Icon, start }) => (
            <Link
              key={label}
              href={href(`/projects/${item.slug}`)}
              className={`group flex items-center gap-6 border-line-inverse py-10 md:py-14 ${
                start ? "border-b md:border-b-0 md:pe-10" : "md:justify-end md:border-s md:ps-10 md:text-end"
              }`}
            >
              {start && <Icon aria-hidden="true" className="icon-dir h-5 w-5 shrink-0" />}
              <span>
                <span className="eyebrow block text-ivory-muted">{label}</span>
                <span className="mt-2 block font-display text-3xl md:text-4xl">{item.name}</span>
              </span>
              {!start && <Icon aria-hidden="true" className="icon-dir h-5 w-5 shrink-0" />}
            </Link>
          ))}
        </div>
      </nav>

      <ClosingCta />
    </>
  );
}
