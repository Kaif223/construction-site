import type { Metadata } from "next";
import { ArrowUpRight, Scale } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink, SectionLabel } from "@/components/ui/primitives";
import { planningTopics, regulatoryNotes } from "@/data/planning";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/planning", title: dict.meta.planning.title, description: dict.meta.planning.description });
}

export default async function PlanningPage() {
  const { dict, href, market, l, t, tag } = await getI18n();
  const p = dict.planning;
  const notes = regulatoryNotes[market.id];
  const date = (iso: string) => new Intl.DateTimeFormat(tag, { dateStyle: "long" }).format(new Date(iso));

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.nav.planning, href: "/planning" }]}
        eyebrow={p.eyebrow}
        title={p.title}
        intro={<p>{p.intro}</p>}
        image="/images/brand/planning-desk.jpg"
        imageAlt={p.heroAlt}
      />

      <section aria-labelledby="topics-title" className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <SectionLabel>{p.topicsLabel}</SectionLabel>
          <h2 id="topics-title" className="display-lg mt-8 max-w-3xl">
            {p.topicsTitle}
          </h2>
          <ol className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {planningTopics.map((topic, index) => (
              <li key={topic.id} id={topic.id} className="scroll-mt-28 bg-ivory p-6 md:p-8">
                <span className="eyebrow text-orange-ink">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-xl font-medium">{l(topic.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{l(topic.body)}</p>
                {topic.varies && (
                  <p className="mt-4 flex items-start gap-2 text-xs text-orange-ink">
                    <Scale aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {p.varies}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {notes && (
        <section aria-labelledby="regulatory-title" className="bg-paper py-20 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel>{p.regulatoryLabel}</SectionLabel>
              <h2 id="regulatory-title" className="display-md mt-6">
                {p.regulatoryTitle}
              </h2>
              <p className="eyebrow mt-6 text-ink-muted">
                {notes.reviewStatus === "reviewed"
                  ? t(p.reviewed, { date: date(notes.lastChecked) })
                  : t(p.reviewStatus, { date: date(notes.lastChecked) })}
              </p>
            </div>
            <div className="lg:col-span-7">
              <p className="lede">{l(notes.summary)}</p>
              <ul className="mt-8 space-y-4 border-t border-line pt-6">
                {notes.points.map((point) => (
                  <li key={point.en} className="leading-relaxed text-ink-muted">
                    {l(point)}
                  </li>
                ))}
              </ul>
              <h3 className="eyebrow mt-10 text-ink-muted">{p.sources}</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {notes.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-4 py-4">
                      <span>
                        <span className="block font-medium">{l(source.name)}</span>
                        <span className="mt-1 block text-sm text-ink-muted">{l(source.note)}</span>
                        <span className="ltr-isolate mt-1 block text-xs text-ink-muted">{new URL(source.url).hostname}</span>
                        <span className="sr-only">{dict.common.opensNewTab}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="icon-dir mt-1 h-4 w-4 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
              <p role="note" className="mt-8 border-s-2 border-orange bg-ivory px-5 py-4 text-sm leading-relaxed">
                {p.disclaimer}
              </p>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="planning-cta" className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-x flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 id="planning-cta" className="display-lg">
              {p.ctaTitle}
            </h2>
            <p className="mt-4 text-ivory/75">{p.ctaBody}</p>
          </div>
          <ButtonLink href={href("/quote")}>{dict.common.requestQuote}</ButtonLink>
        </div>
      </section>
    </>
  );
}
