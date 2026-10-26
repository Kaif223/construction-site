import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel, SplitHeading } from "@/components/ui/primitives";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { TrustSection } from "@/components/sections/TrustSection";
import { hasTrustClaims } from "@/config/markets";
import { getCategories } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/about", title: dict.meta.about.title, description: dict.meta.about.description });
}

export default async function AboutPage() {
  const { dict, href, language, market, t, p } = await getI18n();
  const a = dict.about;

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.nav.about, href: "/about" }]}
        eyebrow={a.eyebrow}
        title={a.title}
        intro={<p>{a.intro}</p>}
        image="/images/brand/site-team.jpg"
        imageAlt={a.heroAlt}
      />

      <section aria-labelledby="story-title" className="bg-ivory py-20 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel>{a.storyLabel}</SectionLabel>
            <SplitHeading id="story-title" lines={a.storyLines} emphasis={[1]} className="display-lg mt-8" />
            <div className="mt-10 space-y-5 text-[1.0625rem] leading-relaxed text-ink-muted" data-reveal="up">
              {a.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div data-reveal="mask" className="relative aspect-[3/4] overflow-hidden bg-ivory-deep">
              <Image src="/images/process/consultation.jpg" alt={a.storyAlt} fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-x">
          <SectionLabel tone="light">{a.principlesLabel}</SectionLabel>
          <h2 id="principles-title" className="display-lg mt-8 max-w-3xl">
            {a.principlesTitle}
          </h2>
          <ol className="mt-14 grid gap-px bg-line-inverse sm:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
            {a.principles.map((item, index) => (
              <li key={item.title} className="bg-charcoal p-6 md:p-8">
                <span className="eyebrow text-orange">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="disciplines-title" className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>{a.disciplinesLabel}</SectionLabel>
            <h2 id="disciplines-title" className="display-md mt-6">
              {a.disciplinesTitle}
            </h2>
          </div>
          <ul className="grid gap-px self-start bg-line sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {getCategories(language).map((category) => (
              <li key={category.slug} className="bg-ivory">
                <Link href={href(`/services/${category.slug}`)} className="block p-6 hover:bg-paper">
                  <span className="eyebrow ltr-isolate text-orange-ink">{category.code}</span>
                  <span className="mt-3 block font-medium">{category.title}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{t(dict.services.count, { services: p(dict.plurals.service, category.services.length) })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TrustSection />

      <section aria-labelledby="honesty-title" className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>{a.commitmentsLabel}</SectionLabel>
            <h2 id="honesty-title" className="display-md mt-6">
              {a.commitmentsTitle}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-line">
              {a.commitments.map((item) => (
                <li key={item} className="border-b border-line py-4 text-lg">
                  {item}
                </li>
              ))}
            </ul>
            {!hasTrustClaims(market.trust) && <p className="mt-8 text-sm leading-relaxed text-ink-muted">{a.credentialsPending}</p>}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
