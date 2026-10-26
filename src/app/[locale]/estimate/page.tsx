import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/primitives";
import { Estimator } from "@/components/estimate/Estimator";
import { FaqList } from "@/components/sections/FaqList";
import { getRateTable } from "@/data/rates";
import { getFaqs } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/estimate", title: dict.meta.estimate.title, description: dict.meta.estimate.description });
}

export default async function EstimatePage() {
  const { dict, language, market, l, t } = await getI18n();
  const e = dict.estimatePage;
  const table = getRateTable(market.rateTable);

  return (
    <>
      <PageHero crumbs={[{ label: dict.nav.estimate, href: "/estimate" }]} eyebrow={e.eyebrow} title={e.title} intro={<p>{e.intro}</p>} />

      <section aria-label={dict.nav.estimate} className="grid-paper bg-paper py-16 md:py-24">
        <div className="container-x">
          {table?.status !== "verified" && (
            <p role="note" className="mb-12 max-w-3xl border-s-2 border-orange bg-ivory px-5 py-4 text-sm leading-relaxed">
              {t(e.notice, { market: l(market.name) })}
            </p>
          )}
          <Suspense>
            <Estimator />
          </Suspense>
        </div>
      </section>

      <section aria-labelledby="factors-title" className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>{e.factorsLabel}</SectionLabel>
            <h2 id="factors-title" className="display-md mt-6">
              {e.factorsTitle}
            </h2>
          </div>
          <dl className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8">
            {e.factors.map((factor) => (
              <div key={factor.term} className="bg-ivory p-6">
                <dt className="font-medium">{factor.term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{factor.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="container-x mt-20 grid gap-12 lg:grid-cols-12">
          <h2 className="display-md lg:col-span-4">{e.costQuestions}</h2>
          <div className="lg:col-span-8">
            <FaqList faqs={getFaqs(language).filter((faq) => ["costs", "tax", "quotations", "payments"].includes(faq.id))} />
          </div>
        </div>
      </section>
    </>
  );
}
