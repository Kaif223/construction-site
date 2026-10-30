import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
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
import { homepageServiceGroups, totalServiceCount } from "@/data/services";
import { testimonials } from "@/data/content";
import { getBenefits, getCategory, getFaqs, getJourney, getMaterials, getProcess, getProjects } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/", title: dict.meta.home.title, description: dict.meta.home.description, absoluteTitle: true });
}

/*
 * Interactive sections are wrapped in <Suspense> so React can hydrate them as
 * separate units, keeping long main-thread tasks short on slower phones.
 */
export default async function HomePage() {
  const { dict, href, language, t, p } = await getI18n();
  const h = dict.home;
  const overview = homepageServiceGroups.map((slug) => getCategory(language, slug)!);

  return (
    <>
      <Hero />

      <section id="journey" aria-labelledby="journey-title" className="grid-paper bg-paper pt-20 text-charcoal md:pt-28">
        <div className="container-x grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel number="01">{h.journey.label}</SectionLabel>
            <SplitHeading id="journey-title" lines={h.journey.lines} emphasis={[1]} className="display-xl mt-8" />
          </div>
          <p className="text-ink-muted md:col-span-4" data-reveal="up">
            {h.journey.copy}
          </p>
        </div>
        <div className="mt-10 md:mt-12">
          <Suspense>
            <ConstructionJourney stages={getJourney(language)} />
          </Suspense>
        </div>
        <div className="container-x pt-20 pb-20 md:pb-28">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <h3 className="display-md md:col-span-6" data-reveal="up">
              {h.journey.drawingTitle[0]} <span className="icon-dir inline-block text-orange-ink">→</span> {h.journey.drawingTitle[1]}
            </h3>
            <p className="text-ink-muted md:col-span-5 md:col-start-8" data-reveal="up">
              {h.journey.drawingCopy}
            </p>
          </div>
          <CompareSlider
            className="mt-10"
            initial={46}
            label={t(dict.compare.label, { before: h.journey.drawing, after: h.journey.built })}
            valueText={t(dict.compare.valueText, { before: h.journey.drawing })}
            before={{ src: "/images/brand/residence-blueprint.jpg", alt: h.journey.drawingAlt, label: h.journey.drawing }}
            after={{ src: "/images/hero/residence-dusk.jpg", alt: h.journey.builtAlt, label: h.journey.built }}
          />
        </div>
      </section>

      <BrandIntro />

      <section aria-labelledby="services-title" className="grain relative isolate bg-charcoal py-20 text-ivory md:py-28">
        <div aria-hidden="true" data-reveal="guides" className="column-guides column-guides-light" />
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel number="03" tone="light">
                {h.services.label}
              </SectionLabel>
              <SplitHeading id="services-title" lines={h.services.lines} emphasis={[1]} className="display-xl mt-8" />
            </div>
            <div className="md:col-span-4" data-reveal="up">
              <p className="text-ivory/75">{t(h.services.copy, { services: p(dict.plurals.service, totalServiceCount) })}</p>
              <TextLink href={href("/services")} className="mt-6 text-ivory">
                {h.services.browse}
              </TextLink>
            </div>
          </div>
          <div className="mt-12 md:mt-16">
            <Suspense>
              <ServicesOverview items={overview} />
            </Suspense>
          </div>
        </div>
      </section>

      <section aria-labelledby="projects-title" className="bg-ivory pt-20 md:pt-28">
        <div className="container-x grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel number="04">{h.projects.label}</SectionLabel>
            <SplitHeading id="projects-title" lines={h.projects.lines} emphasis={[1]} className="display-xl mt-8" />
          </div>
          <div className="md:col-span-4" data-reveal="up">
            <p className="text-ink-muted">{h.projects.copy}</p>
            <TextLink href={href("/projects")} className="mt-6">
              {h.projects.link}
            </TextLink>
          </div>
        </div>
        <div className="mt-12 pb-16 lg:mt-0 lg:pb-0">
          <Suspense>
            <FeaturedProjects projects={getProjects(language).slice(0, 6)} />
          </Suspense>
        </div>
      </section>


      <section aria-labelledby="why-title" className="relative isolate bg-ivory py-20 md:py-28">
        <div aria-hidden="true" data-reveal="guides" className="column-guides" />
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel number="05">{h.why.label}</SectionLabel>
              <SplitHeading id="why-title" lines={h.why.lines} emphasis={[1]} className="display-lg mt-8" />
              <div data-reveal="mask" className="relative mt-12 aspect-[4/5] overflow-hidden bg-ivory-deep">
                <Image
                  src="/images/brand/site-team.jpg"
                  alt={h.why.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <ol className="grid gap-px self-start bg-line sm:grid-cols-2 lg:col-span-7" data-reveal="stagger">
              {getBenefits(language).map((benefit, index) => (
                <li key={benefit.id} className="bg-ivory p-6 md:p-8">
                  <span className="eyebrow text-orange-ink">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-xl font-medium">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{benefit.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="materials-title" className="grain relative bg-graphite py-20 text-ivory md:py-28">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel number="06" tone="light">
                {h.materials.label}
              </SectionLabel>
              <SplitHeading id="materials-title" lines={h.materials.lines} emphasis={[1]} className="display-xl mt-8" />
            </div>
            <div className="md:col-span-4" data-reveal="up">
              <p className="text-ivory/75">{h.materials.copy}</p>
              <TextLink href={href("/materials")} className="mt-6 text-ivory">
                {h.materials.link}
              </TextLink>
            </div>
          </div>
          <div className="mt-14">
            <Suspense>
              <MaterialsShowcase materials={getMaterials(language)} />
            </Suspense>
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel number="07" className="justify-center">
              {h.process.label}
            </SectionLabel>
            <SplitHeading id="process-title" lines={h.process.lines} emphasis={[1]} className="display-lg mt-8" />
          </div>
          <div className="mx-auto mt-12 max-w-5xl md:mt-16">
            <ProcessTimeline steps={getProcess(language)} />
          </div>
          <div className="mt-16 text-center">
            <ButtonLink href={href("/process")} variant="ghost-dark">
              {h.process.link}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="estimate" aria-labelledby="estimate-title" className="grid-paper bg-paper py-20 md:py-28">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel number="08">{h.estimate.label}</SectionLabel>
              <SplitHeading id="estimate-title" lines={h.estimate.lines} emphasis={[1]} className="display-lg mt-8" />
            </div>
            <p className="text-ink-muted md:col-span-4" data-reveal="up">
              {h.estimate.copy}
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

      <section aria-labelledby="faq-title" className="relative isolate bg-ivory py-20 md:py-28">
        <div aria-hidden="true" data-reveal="guides" className="column-guides" />
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel number="10">{h.faq.label}</SectionLabel>
            <SplitHeading id="faq-title" lines={h.faq.lines} emphasis={[1]} className="display-lg mt-8" />
            <TextLink href={href("/faq")} className="mt-8">
              {h.faq.link}
            </TextLink>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={getFaqs(language).slice(0, 6)} />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
