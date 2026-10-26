import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/primitives";
import { FaqList } from "@/components/sections/FaqList";
import { getFaqs } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/faq", title: dict.meta.faq.title, description: dict.meta.faq.description });
}

export default async function FaqPage() {
  const { dict, href, language, tag } = await getI18n();
  const f = dict.faqPage;
  const faqs = getFaqs(language);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: tag,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <PageHero crumbs={[{ label: dict.nav.faq, href: "/faq" }]} eyebrow={f.eyebrow} title={f.title} intro={<p>{f.intro}</p>} />
      <section aria-label={f.eyebrow} className="bg-ivory py-16 md:py-24">
        <div className="container-x max-w-5xl">
          <FaqList faqs={faqs} topicLabels={f.topics} />
          <div className="mt-16 flex flex-col items-start gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
            <p className="display-md">{f.still}</p>
            <ButtonLink href={href("/quote")} variant="dark">
              {f.ask}
            </ButtonLink>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
