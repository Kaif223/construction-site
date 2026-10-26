import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/primitives";
import { Estimator } from "@/components/estimate/Estimator";
import { FaqList } from "@/components/sections/FaqList";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: "Construction Budget Estimator",
  description:
    "Get a preliminary construction or renovation budget range by project type, area, floors, finishing level and optional services. Example rates — not a quotation.",
  alternates: { canonical: "/estimate" },
};

const factors = [
  ["Location", "Labour rates, material availability and access vary widely between markets."],
  ["Site conditions", "Soil, slope, groundwater and existing structures can change foundations and programme."],
  ["Design", "Spans, cantilevers, glazing and complexity affect structure and finishing time."],
  ["Materials", "The same floor area can cost very differently in porcelain or book-matched marble."],
  ["Labour & timing", "Market demand and programme length affect labour costs and availability."],
  ["Scope", "Inclusions and exclusions — from landscaping to furniture — move the final figure."],
];

export default function EstimatePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Estimate", href: "/estimate" }]}
        eyebrow="Budget estimator"
        title={["Plan with a", <em key="e">Realistic Range.</em>]}
        intro={
          <p>
            Answer a few questions to see a preliminary budget range. It is a starting point for planning — your
            detailed quotation follows a site visit and an agreed scope of work.
          </p>
        }
      />

      <section aria-label="Estimator" className="grid-paper bg-paper py-16 md:py-24">
        <div className="container-x">
          <div role="note" className="mb-12 max-w-3xl border-l-2 border-orange bg-ivory px-5 py-4 text-sm leading-relaxed">
            <strong className="font-medium">Preliminary estimate only.</strong> Figures are calculated from illustrative
            example rates, not verified current market prices, and are not an offer or quotation. Actual costs depend on
            location, materials, site conditions, design, labour and final scope.
          </div>
          <Estimator />
        </div>
      </section>

      <section aria-labelledby="factors-title" className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>Behind the numbers</SectionLabel>
            <h2 id="factors-title" className="display-md mt-6">
              What moves the final cost
            </h2>
          </div>
          <dl className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8">
            {factors.map(([term, detail]) => (
              <div key={term} className="bg-ivory p-6">
                <dt className="font-medium">{term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="container-x mt-20 grid gap-12 lg:grid-cols-12">
          <h2 className="display-md lg:col-span-4">Cost questions</h2>
          <div className="lg:col-span-8">
            <FaqList faqs={faqs.filter((faq) => ["Costs", "Quotations", "Payments"].includes(faq.topic))} />
          </div>
        </div>
      </section>
    </>
  );
}
