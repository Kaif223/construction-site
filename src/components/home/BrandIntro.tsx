import Image from "next/image";
import { serviceCategories, totalServiceCount } from "@/data/services";
import { SectionLabel, SplitHeading, TextLink } from "@/components/ui/primitives";

const facts = [
  { value: String(serviceCategories.length).padStart(2, "0"), label: "Service disciplines" },
  { value: String(totalServiceCount), label: "Individual services" },
  { value: "01", label: "Point of contact" },
];

export function BrandIntro() {
  return (
    <section id="introduction" aria-labelledby="intro-title" className="relative bg-ivory py-24 md:py-36">
      <div className="container-x">
        <SectionLabel number="01">Our philosophy</SectionLabel>
        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <SplitHeading
            id="intro-title"
            lines={["Every Detail Matters.", <em key="e">Every Structure</em>, "Tells a Story."]}
            className="display-xl lg:col-span-8"
          />
          <div className="self-end lg:col-span-4 lg:pb-3">
            <p className="lede text-ink-muted" data-reveal="up">
              We believe a building should be understood before it is built. That is why architecture,
              engineering, construction and finishing sit in one team at CONSTRUKT — so every decision is made
              with the whole building in view.
            </p>
            <TextLink href="/about" className="mt-8">
              Our approach
            </TextLink>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-12 md:gap-6">
          <figure className="md:col-span-7">
            <div data-reveal="mask" className="relative aspect-[4/3] overflow-hidden bg-ivory-deep">
              <Image
                src="/images/brand/architect-drawing.jpg"
                alt="An architect drawing on a printed plan with a scale ruler and rolled drawings"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="eyebrow mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-muted">
              <span>Fig. 02 — Drawing review</span>
              <span>Planning &amp; design</span>
            </figcaption>
          </figure>

          <div className="flex flex-col justify-between gap-12 md:col-span-4 md:col-start-9">
            <p className="text-[1.0625rem] leading-relaxed" data-reveal="up">
              Whether you are building a family home, transforming a kitchen or delivering a commercial building,
              you work with one coordinated team — from the first site survey to the final coat of paint.
            </p>
            <dl className="divide-y divide-line border-y border-line" data-reveal="stagger">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between py-5">
                  <dt className="eyebrow text-ink-muted">{fact.label}</dt>
                  <dd className="font-display text-5xl leading-none">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
