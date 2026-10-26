import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/primitives";
import { FaqList } from "@/components/sections/FaqList";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about construction costs, timelines, materials, drawings, renovation, plumbing and electrical work, quotations, payments, site visits, supervision and warranties.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: "FAQ", href: "/faq" }]}
        eyebrow="Frequently asked questions"
        title={["Good Questions,", <em key="e">Straight Answers.</em>]}
        intro={<p>The things people most often ask before starting a construction or renovation project.</p>}
      />
      <section aria-label="Questions and answers" className="bg-ivory py-16 md:py-24">
        <div className="container-x max-w-5xl">
          <FaqList faqs={faqs} withTopics />
          <div className="mt-16 flex flex-col items-start gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
            <p className="display-md">Still have a question?</p>
            <ButtonLink href="/contact" variant="dark">
              Ask us directly
            </ButtonLink>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
