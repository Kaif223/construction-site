import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel, SplitHeading, TextLink } from "@/components/ui/primitives";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ConstructionJourney } from "@/components/home/ConstructionJourney";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getJourney, getProcess } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/process", title: dict.meta.process.title, description: dict.meta.process.description });
}

export default async function ProcessPage() {
  const { dict, href, language, t } = await getI18n();
  const p = dict.processPage;
  const j = dict.home.journey;
  const steps = getProcess(language);
  const stages = getJourney(language);

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.nav.process, href: "/process" }]}
        eyebrow={p.eyebrow}
        title={p.title}
        intro={<p>{p.intro}</p>}
        image="/images/process/crane.jpg"
        imageAlt={p.heroAlt}
        meta={[
          { label: p.meta.working, value: steps.length },
          { label: p.meta.construction, value: stages.length },
        ]}
      />

      <section aria-labelledby="steps-title" className="bg-ivory py-20 md:py-32">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel className="justify-center">{p.stepsLabel}</SectionLabel>
            <SplitHeading id="steps-title" lines={p.stepsLines} emphasis={[1]} className="display-lg mt-8" />
          </div>
          <div className="mx-auto mt-16 max-w-5xl md:mt-24">
            <ProcessTimeline steps={steps} detailed />
          </div>
          <div className="mt-16 text-center">
            <TextLink href={href("/planning")}>{p.planningLink}</TextLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-title" className="bg-charcoal pt-20 text-ivory md:pt-32">
        <div className="container-x">
          <SectionLabel tone="light">{p.siteLabel}</SectionLabel>
          <SplitHeading id="journey-title" lines={p.siteLines} emphasis={[1]} className="display-lg mt-8" />
        </div>
        <div className="mt-12 lg:mt-0">
          <Suspense>
            <ConstructionJourney stages={stages} />
          </Suspense>
        </div>
        <div className="container-x pt-20 pb-24 md:pb-32">
          <h3 className="display-md" data-reveal="up">
            {j.drawingTitle[0]} <span className="icon-dir inline-block text-orange">→</span> {j.drawingTitle[1]}
          </h3>
          <CompareSlider
            className="mt-10"
            label={t(dict.compare.label, { before: j.drawing, after: j.built })}
            valueText={t(dict.compare.valueText, { before: j.drawing })}
            cursorLabel={dict.cursor.drag}
            before={{ src: "/images/brand/residence-blueprint.jpg", alt: j.drawingAlt, label: j.drawing }}
            after={{ src: "/images/hero/residence-dusk.jpg", alt: j.builtAlt, label: j.built }}
          />
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
