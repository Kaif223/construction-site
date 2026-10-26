import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel, SplitHeading } from "@/components/ui/primitives";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ConstructionJourney } from "@/components/home/ConstructionJourney";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { journeyStages, processSteps } from "@/data/content";

export const metadata: Metadata = {
  title: "Our Construction Process",
  description:
    "How a project moves from consultation and site visit to design, quotation, construction, inspection and handover — and the nine construction stages in between.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Process", href: "/process" }]}
        eyebrow="Process"
        title={["A Clear Path", <em key="e">From Idea to Keys.</em>]}
        intro={
          <p>
            Construction is easier when you know what happens next. Our process is designed around written decisions,
            stage inspections and regular updates — so you always know where your project stands.
          </p>
        }
        image="/images/process/crane.jpg"
        imageAlt="Tower cranes above a building under construction"
        meta={[
          { label: "Working stages", value: processSteps.length },
          { label: "Construction stages", value: journeyStages.length },
        ]}
      />

      <section aria-labelledby="steps-title" className="bg-ivory py-20 md:py-32">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel className="justify-center">Working together</SectionLabel>
            <SplitHeading id="steps-title" lines={["Six steps,", <em key="e">in writing.</em>]} className="display-lg mt-8" />
          </div>
          <div className="mx-auto mt-16 max-w-5xl md:mt-24">
            <ProcessTimeline steps={processSteps} detailed />
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-title" className="bg-charcoal pt-20 text-ivory md:pt-32">
        <div className="container-x">
          <SectionLabel tone="light">On site</SectionLabel>
          <SplitHeading
            id="journey-title"
            lines={["Nine stages,", <em key="e">each inspected.</em>]}
            className="display-lg mt-8"
          />
        </div>
        <div className="mt-12 lg:mt-0">
          <ConstructionJourney stages={journeyStages} />
        </div>
        <div className="container-x pt-20 pb-24 md:pb-32">
          <h3 className="display-md" data-reveal="up">
            Drawing <span className="text-orange">→</span> built.
          </h3>
          <CompareSlider
            className="mt-10"
            before={{
              src: "/images/brand/residence-blueprint.jpg",
              alt: "Blueprint-style line drawing of a two-storey residence beneath a large tree",
              label: "Drawing",
            }}
            after={{
              src: "/images/hero/residence-dusk.jpg",
              alt: "The same two-storey residence completed and lit at dusk",
              label: "Built",
            }}
          />
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
