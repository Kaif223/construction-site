import Image from "next/image";
import { getI18n } from "@/i18n/server";
import { serviceCategories, totalServiceCount } from "@/data/services";
import { SectionLabel, SplitHeading, TextLink } from "@/components/ui/primitives";

export async function BrandIntro() {
  const { dict, href } = await getI18n();
  const t = dict.home.intro;
  const facts = [
    { value: String(serviceCategories.length).padStart(2, "0"), label: t.facts.disciplines },
    { value: String(totalServiceCount), label: t.facts.services },
    { value: "01", label: t.facts.contact },
  ];

  return (
    <section id="introduction" aria-labelledby="intro-title" className="relative bg-ivory py-24 md:py-36">
      <div className="container-x">
        <SectionLabel number="01">{t.label}</SectionLabel>
        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <SplitHeading id="intro-title" lines={t.lines} emphasis={[1]} className="display-xl lg:col-span-8" />
          <div className="self-end lg:col-span-4 lg:pb-3">
            <p className="lede text-ink-muted" data-reveal="up">
              {t.copy}
            </p>
            <TextLink href={href("/about")} className="mt-8">
              {t.link}
            </TextLink>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-12 md:gap-6">
          <figure className="md:col-span-7">
            <div data-reveal="mask" className="relative aspect-[4/3] overflow-hidden bg-ivory-deep">
              <Image
                src="/images/brand/architect-drawing.jpg"
                alt={t.imageAlt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="eyebrow mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-muted">
              <span>{t.caption[0]}</span>
              <span>{t.caption[1]}</span>
            </figcaption>
          </figure>

          <div className="flex flex-col justify-between gap-12 md:col-span-4 md:col-start-9">
            <p className="text-[1.0625rem] leading-relaxed" data-reveal="up">
              {t.body}
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
