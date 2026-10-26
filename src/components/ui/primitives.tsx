import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type HeadingTag = "h1" | "h2" | "h3";

/**
 * Headline split into authored lines, each clipped so it can slide up into
 * view. Lines are authored (not measured) so wrapping stays natural and the
 * text remains a single readable heading for assistive technology.
 */
export function SplitHeading({
  as: Tag = "h2",
  lines,
  className = "",
  id,
}: {
  as?: HeadingTag;
  lines: React.ReactNode[];
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={className} data-reveal="lines">
      {lines.map((line, index) => (
        <span key={index} className="line-mask">
          <span>
            {line}
            {index < lines.length - 1 ? " " : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function SectionLabel({
  number,
  children,
  tone = "dark",
  className = "",
}: {
  number?: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const muted = tone === "dark" ? "text-ink-muted" : "text-ivory-muted";
  // Brand orange is too light for small text on ivory; use the darker ink there.
  const accent = tone === "dark" ? "text-orange-ink" : "text-orange";
  const rule = tone === "dark" ? "bg-charcoal/25" : "bg-ivory/25";
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {number && <span className={`eyebrow ${accent}`}>{number}</span>}
      <span aria-hidden="true" data-reveal="rule" className={`h-px w-10 ${rule}`} />
      <p className={`eyebrow ${muted}`}>{children}</p>
    </div>
  );
}

type ButtonVariant = "primary" | "dark" | "ghost-light" | "ghost-dark";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
}) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Link href={href} className={`btn btn-${variant} ${className}`}>
      {children}
      <Icon aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 font-medium ${className}`}>
      <span className="link-line">{children}</span>
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
      />
    </Link>
  );
}

/** Small badge used wherever demonstration content appears. */
export function ConceptBadge({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const styles =
    tone === "dark"
      ? "border-charcoal/25 text-charcoal/75"
      : "border-ivory/35 text-ivory/85";
  return (
    <span className={`eyebrow inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${styles} ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-orange" />
      Concept project
    </span>
  );
}
