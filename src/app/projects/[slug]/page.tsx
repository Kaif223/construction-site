import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ConceptBadge, SectionLabel } from "@/components/ui/primitives";
import { Gallery } from "@/components/projects/Gallery";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { RouteFallback } from "@/components/ui/RouteFallback";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} — ${project.type} (Concept)`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { images: [{ url: project.cover.src, alt: project.cover.alt }] },
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  // The URL-specific read happens inside Suspense, so the route's shared shell
  // (and a loading state) can be prefetched and shown instantly on navigation.
  return (
    <Suspense fallback={<RouteFallback label="project" />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { previous, next } = getAdjacentProjects(project.slug);

  return (
    <>
      <section aria-labelledby="project-title" className="grain relative isolate overflow-hidden bg-charcoal text-ivory">
        <div className="absolute inset-0 -z-10">
          <div data-parallax="0.08" className="absolute -inset-y-[10%] inset-x-0">
            <Image src={project.cover.src} alt={project.cover.alt} fill preload sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/50" />
        </div>
        <div className="container-x flex min-h-[88svh] flex-col justify-between pt-[calc(var(--header-h)+3.5rem)] pb-12 md:pt-[calc(var(--header-h)+5rem)]">
          <Breadcrumbs
            items={[
              { label: "Projects", href: "/projects" },
              { label: project.name, href: `/projects/${project.slug}` },
            ]}
          />
          <div>
            <div className="flex flex-wrap items-center gap-4" data-reveal="fade">
              <span className="eyebrow text-orange">{project.number}</span>
              <ConceptBadge tone="light" />
            </div>
            <h1 id="project-title" className="display-xl mt-6 max-w-[14ch]" data-reveal="lines">
              <span className="line-mask">
                <span>{project.name}</span>
              </span>
            </h1>
            <p className="lede mt-6 max-w-2xl text-ivory/80" data-reveal="up">
              {project.summary}
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Project overview" className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 self-start border-t border-line pt-6 lg:col-span-4" data-reveal="stagger">
            {[
              ["Category", project.category],
              ["Type", project.type],
              ["Location", project.location ?? "Not specified (concept)"],
              ["Status", project.status],
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
                className={index === 0 ? "font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.22]" : "lede text-ink-muted"}
                data-reveal="up"
              >
                {paragraph}
              </p>
            ))}
            <p className="border-l-2 border-orange pl-4 text-sm text-ink-muted">
              This is a concept project created to illustrate our approach. Images are representative photography and
              specifications are design-brief figures, not measurements of a completed building.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="gallery-title" className="bg-ivory pb-20 md:pb-28">
        <div className="container-x">
          <SectionLabel>Gallery</SectionLabel>
          <h2 id="gallery-title" className="sr-only">
            Gallery
          </h2>
          <div className="mt-8">
            <Gallery images={[project.cover, ...project.gallery]} title={project.name} />
          </div>
        </div>
      </section>

      <section aria-labelledby="spec-title" className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>Specification</SectionLabel>
            <h2 id="spec-title" className="display-md mt-6">
              Design brief
            </h2>
            <table className="mt-8 w-full text-left text-sm">
              <caption className="sr-only">Design-brief specifications for {project.name}</caption>
              <tbody>
                {project.specs.map((spec) => (
                  <tr key={spec.label} className="border-t border-line">
                    <th scope="row" className="py-3.5 pr-6 font-mono text-[0.72rem] font-normal tracking-[0.1em] text-ink-muted uppercase">
                      {spec.label}
                    </th>
                    <td className="py-3.5 text-right">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="eyebrow text-ink-muted">Relevant services</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={`/services/${service.categorySlug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-charcoal/20 px-4 text-sm hover:border-charcoal"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="eyebrow mt-10 text-ink-muted">Material palette</h3>
            <ul className="mt-4 grid grid-cols-2 gap-px border border-line bg-line text-sm">
              {project.materials.map((material) => (
                <li key={material} className="bg-paper px-4 py-3">
                  {material}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <nav aria-label="More projects" className="bg-charcoal text-ivory">
        <div className="container-x grid md:grid-cols-2">
          {[
            { project: previous, label: "Previous", Icon: ArrowLeft },
            { project: next, label: "Next", Icon: ArrowRight },
          ].map(({ project: item, label, Icon }) => (
            <Link
              key={label}
              href={`/projects/${item.slug}`}
              data-cursor="View Project"
              className={`group flex items-center gap-6 border-line-inverse py-10 md:py-14 ${
                label === "Next" ? "md:justify-end md:border-l md:pl-10 md:text-right" : "border-b md:border-b-0 md:pr-10"
              }`}
            >
              {label === "Previous" && (
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
              )}
              <span>
                <span className="eyebrow block text-ivory-muted">{label} project</span>
                <span className="mt-2 block font-display text-3xl md:text-4xl">{item.name}</span>
              </span>
              {label === "Next" && (
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      <ClosingCta />
    </>
  );
}
