import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { AvailabilityStatus } from "@/config/markets";

type HeadingTag = "h1" | "h2" | "h3";

/**
 * Wraps each word of `text` in a `.word-mask` so it can rise into view.
 * Words are numbered from `start` through `--i`, written into the markup so
 * the server and client render identical HTML. Non-string content is
 * treated as a single word.
 */
export function maskWords(text: React.ReactNode, start = 0) {
  const words = typeof text === "string" ? text.split(" ").filter(Boolean) : [text];
  const nodes = words.map((word, index) => (
    <Fragment key={index}>
      <span className="word-mask">
        <span style={{ "--i": start + index } as React.CSSProperties}>{word}</span>
      </span>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));
  return { nodes, count: words.length };
}

/**
 * Headline in authored lines whose words rise into view one after another.
 * Lines are authored (not measured) so wrapping stays natural and the text
 * remains a single readable heading for assistive technology.
 * `emphasis` marks which line indexes are set in a quieter tone.
 */
export function SplitHeading({
  as: Tag = "h2",
  lines,
  emphasis = [],
  className = "",
  id,
}: {
  as?: HeadingTag;
  lines: React.ReactNode[];
  emphasis?: number[];
  className?: string;
  id?: string;
}) {
  const masked = lines.reduce<{ nodes: React.ReactNode[]; count: number }[]>(
    (done, line) => [...done, maskWords(line, done.reduce((sum, item) => sum + item.count, 0))],
    [],
  );

  return (
    <Tag id={id} className={className} data-reveal="lines">
      {masked.map(({ nodes }, index) => (
        <span key={index} className="block">
          {emphasis.includes(index) ? <em>{nodes}</em> : nodes}
          {index < lines.length - 1 ? " " : null}
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
      <Icon aria-hidden="true" className="icon-dir h-4 w-4" />
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
        className="icon-dir h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-[calc(0.25rem*var(--dir))]"
      />
    </Link>
  );
}

/** Small badge used wherever demonstration content appears. */
export function ConceptBadge({
  label,
  tone = "dark",
  className = "",
}: {
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const styles = tone === "dark" ? "border-charcoal/25 text-charcoal/75" : "border-ivory/35 text-ivory/85";
  return (
    <span className={`eyebrow inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${styles} ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-orange" />
      {label}
    </span>
  );
}

const availabilityStyles: Record<AvailabilityStatus, string> = {
  available: "border-success/40 text-success",
  partner: "border-mineral/50 text-mineral",
  "not-offered": "border-charcoal/25 text-ink-muted line-through decoration-1",
  unconfirmed: "border-charcoal/20 text-ink-muted",
};

/** Market availability of a service. Uses a text label, never colour alone. */
export function AvailabilityBadge({
  status,
  label,
  description,
  className = "",
}: {
  status: AvailabilityStatus;
  label: string;
  description?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${availabilityStyles[status]} ${className}`}
      title={description}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
