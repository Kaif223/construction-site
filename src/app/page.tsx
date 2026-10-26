import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { BrandIntro } from "@/components/home/BrandIntro";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ConstructionJourney } from "@/components/home/ConstructionJourney";
import { MaterialsShowcase } from "@/components/home/MaterialsShowcase";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqList } from "@/components/sections/FaqList";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Estimator } from "@/components/estimate/Estimator";
import { SectionLabel, SplitHeading, TextLink, ButtonLink } from "@/components/ui/primitives";
import { getServiceCategory, homepageServiceGroups, totalServiceCount } from "@/data/services";
import { projects } from "@/data/projects";
import { benefits, faqs, journeyStages, materials, processSteps, testimonials } from "@/data/content";

export const metadata: Metadata = {
  title: { absolute: "CONSTRUKT — Construction, Architecture & Renovation Under One Roof" },
  description:
    "Residential and commercial construction, architectural design, interior finishing, electrical, plumbing and renovation — coordinated by one team from the first blueprint to the final finish.",
  alternates: { canonical: "/" },
};

/*
 * Interactive sections are wrapped in <Suspense> so React can hydrate them as
 * separate units, keeping long main-thread tasks short on slower phones.
 */
export default function HomePage() {
  const overview = homepageServiceGroups.map((group) => ({
    title: group.title,
    category: getServiceCategory(group.slug)!,
    also: "alsoSlug" in group ? getServiceCategory(group.alsoSlug) : undefined,
  }));

  return (
    <>
      <Hero />
      <BrandIntro />

      {/* Services overview */}
      <section aria-labelledby="services-title" className="grain relative bg-charcoal py-24 text-ivory md:py-36">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel number="02" tone="light">
                What we do
              </SectionLabel>
              <SplitHeading
                id="services-title"
                lines={["One Team.", <em key="e">Every Trade.</em>]}
                className="display-xl mt-8"
              />
            </div>
            <div className="md:col-span-4" data-reveal="up">
              <p className="text-ivory/75">
                {totalServiceCount} services across design, construction, finishing, building systems and
                renovation — organised so you can find exactly what your project needs.
              </p>
              <TextLink href="/services" className="mt-6 text-ivory">
                Browse all services
              </TextLink>
            </div>
          </div>
          <div className="mt-16 md:mt-24">
            <Suspense>
              <ServicesOverview items={overview} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section aria-labelledby="projects-title" className="bg-ivory pt-24 md:pt-36">
        <div className="container-x grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel number="03">Selected work</SectionLabel>
            <SplitHeading
              id="projects-title"
              lines={["Concept Studies", <em key="e">in Craft.</em>]}
              className="display-xl mt-8"
            />
          </div>
          <div className="md:col-span-4" data-reveal="up">
            <p className="text-ink-muted">
              These concept projects show how we approach design, structure and finishing. They are illustrative
              studies — not completed client work.
            </p>
            <TextLink href="/projects" className="mt-6">
              View the portfolio
            </TextLink>
          </div>
        </div>
        <div className="mt-12 pb-16 lg:mt-0 lg:pb-0">
          <Suspense>
            <FeaturedProjects projects={projects.slice(0, 6)} />
          </Suspense>
        </div>
      </section>

      {/* Construction journey */}
      <section aria-labelledby="journey-title" className="bg-charcoal pt-24 text-ivory md:pt-36">
        <div className="container-x grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel number="04" tone="light">
              The construction journey
            </SectionLabel>
            <SplitHeading
              id="journey-title"
              lines={["From Empty Site", <em key="e">to Final Handover.</em>]}
              className="display-xl mt-8"
            />
          </div>
          <p className="text-ivory/75 md:col-span-4" data-reveal="up">
            Nine stages, each inspected before the next begins. Scroll — or choose a stage — to follow how a
            building comes together.
          </p>
        </div>
        <div className="mt-12 lg:mt-0">
          <Suspense>
            <ConstructionJourney stages={journeyStages} />
          </Suspense>
        </div>
        <div className="container-x pt-20 pb-24 md:pb-36">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <h3 className="display-md md:col-span-6" data-reveal="up">
              Drawing <span className="text-orange">→</span> built.
            </h3>
            <p className="text-ivory/75 md:col-span-5 md:col-start-8" data-reveal="up">
              Every project starts as lines on paper. Drag across the image to compare a line study with the finished
              residence — the same view, before and after construction.
            </p>
          </div>
          <CompareSlider
            className="mt-10"
            initial={46}
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

      {/* Why choose us */}
      <section aria-labelledby="why-title" className="bg-ivory py-24 md:py-36">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel number="05">Why CONSTRUKT</SectionLabel>
              <SplitHeading
                id="why-title"
                lines={["Fewer Hand-offs.", <em key="e">Fewer Surprises.</em>]}
                className="display-lg mt-8"
              />
              <div data-reveal="mask" className="relative mt-12 aspect-[4/5] overflow-hidden bg-ivory-deep">
                <Image
                  src="/images/brand/site-team.jpg"
                  alt="Construction workers in hard hats fixing steel reinforcement on a building site"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <ol className="grid gap-px self-start bg-line sm:grid-cols-2 lg:col-span-7" data-reveal="stagger">
              {benefits.map((benefit, index) => (
                <li key={benefit.title} className="bg-ivory p-6 md:p-8">
                  <span className="eyebrow text-orange-ink">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-xl font-medium">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{benefit.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section aria-labelledby="materials-title" className="grain relative bg-graphite py-24 text-ivory md:py-36">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel number="06" tone="light">
                Materials &amp; craftsmanship
              </SectionLabel>
              <SplitHeading
                id="materials-title"
                lines={["Honest Materials,", <em key="e">Precisely Set.</em>]}
                className="display-xl mt-8"
              />
            </div>
            <div className="md:col-span-4" data-reveal="up">
              <p className="text-ivory/75">
                Stone, timber, glass and light — chosen for how they age, and installed with the preparation they
                need.
              </p>
              <TextLink href="/materials" className="mt-6 text-ivory">
                Explore materials
              </TextLink>
            </div>
          </div>
          <div className="mt-14">
            <Suspense>
              <MaterialsShowcase materials={materials} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Process */}
      <section aria-labelledby="process-title" className="bg-ivory py-24 md:py-36">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel number="07" className="justify-center">
              How it works
            </SectionLabel>
            <SplitHeading
              id="process-title"
              lines={["Six Clear Steps", <em key="e">to Your Building.</em>]}
              className="display-lg mt-8"
            />
          </div>
          <div className="mx-auto mt-16 max-w-5xl md:mt-24">
            <ProcessTimeline steps={processSteps} />
          </div>
          <div className="mt-16 text-center">
            <ButtonLink href="/process" variant="ghost-dark">
              See the full process
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Estimator */}
      <section id="estimate" aria-labelledby="estimate-title" className="grid-paper bg-paper py-24 md:py-36">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel number="08">Budget estimator</SectionLabel>
              <SplitHeading
                id="estimate-title"
                lines={["Plan with a", <em key="e">Realistic Range.</em>]}
                className="display-lg mt-8"
              />
            </div>
            <p className="text-ink-muted md:col-span-4" data-reveal="up">
              A preliminary range to start the conversation — calculated from illustrative example rates, not a
              quotation.
            </p>
          </div>
          <div className="mt-14">
            <Suspense>
              <Estimator />
            </Suspense>
          </div>
        </div>
      </section>

      <Testimonials testimonials={testimonials} number="09" />

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-ivory py-24 md:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel number="10">Questions</SectionLabel>
            <SplitHeading id="faq-title" lines={["Good Questions,", <em key="e">Straight Answers.</em>]} className="display-lg mt-8" />
            <TextLink href="/faq" className="mt-8">
              All frequently asked questions
            </TextLink>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={faqs.slice(0, 6)} />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
