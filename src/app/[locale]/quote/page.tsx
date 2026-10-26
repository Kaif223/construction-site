import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { ContactActions } from "@/components/contact/ContactActions";
import { siteConfig } from "@/config/site";
import { categoryEnabled } from "@/config/markets";
import { getCategories, getMaterials } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/quote", title: dict.meta.quote.title, description: dict.meta.quote.description });
}

export default async function QuotePage() {
  const { dict, language, market } = await getI18n();
  const q = dict.quote;
  const serviceOptions = getCategories(language)
    .filter((category) => categoryEnabled(market, category.slug))
    .map((category) => ({ id: category.slug, label: category.shortTitle }));
  const materialOptions = getMaterials(language).map((material) => ({ id: material.slug, label: material.name }));

  return (
    <>
      <PageHero crumbs={[{ label: q.eyebrow, href: "/quote" }]} eyebrow={q.eyebrow} title={q.title} intro={<p>{q.intro}</p>} />
      <section aria-label={q.eyebrow} className="bg-ivory py-16 md:py-24">
        <div className="container-x">
          {!siteConfig.inquiryEndpoint && (
            <p role="note" className="mb-10 max-w-3xl border-s-2 border-orange bg-paper px-5 py-4 text-sm leading-relaxed">
              {q.result.demoBody}
            </p>
          )}
          <Suspense>
            <QuoteWizard serviceOptions={serviceOptions} materialOptions={materialOptions} />
          </Suspense>
          <div className="mt-16 border-t border-line pt-8">
            <ContactActions variant="compact" />
          </div>
        </div>
      </section>
    </>
  );
}
