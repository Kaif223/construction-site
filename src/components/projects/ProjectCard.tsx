import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  href,
  statusLabel,
  categoryLabel,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 45vw, 100vw",
  headingLevel: Heading = "h3",
}: {
  project: Project;
  href: string;
  statusLabel: string;
  categoryLabel: string;
  aspect?: string;
  sizes?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Link href={href} className="group block">
      <div className={`relative overflow-hidden bg-ivory-deep ${aspect}`}>
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <span className="eyebrow ltr-isolate absolute start-4 top-4 rounded-full bg-ivory/90 px-3 py-1.5 text-charcoal">
          {project.number}
        </span>
        <span className="eyebrow absolute end-4 top-4 rounded-full bg-charcoal/75 px-3 py-1.5 text-ivory backdrop-blur">
          {statusLabel}
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6 border-t border-line pt-4">
        <div>
          <Heading className="font-display text-2xl leading-tight md:text-[2rem]">{project.name}</Heading>
          <p className="mt-1.5 text-sm text-ink-muted">{project.type}</p>
        </div>
        <span className="eyebrow shrink-0 pt-2 text-ink-muted">{categoryLabel}</span>
      </div>
    </Link>
  );
}
