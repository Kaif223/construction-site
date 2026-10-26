import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel, SplitHeading } from "@/components/ui/primitives";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { serviceCategories } from "@/data/services";

export const metadata: Metadata = {
  title: "About — Our Approach to Building",
  description:
    "CONSTRUKT brings architecture, engineering, construction, finishing and specialist trades together, so every decision is made with the whole building in view.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Understand before building",
    body: "We survey, ask and draw before we price. Most construction problems are cheaper to solve on paper.",
  },
  {
    title: "Decisions in writing",
    body: "Scope, changes and approvals are recorded, so everyone works from the same information.",
  },
  {
    title: "Inspect before covering",
    body: "Foundations, reinforcement, pipework and wiring are checked and photographed before they disappear.",
  },
  {
    title: "Say what we don’t know",
    body: "Estimates are labelled as estimates. Risks and assumptions are stated, not buried.",
  },
];

const commitments = [
  "We do not publish invented reviews, ratings or awards.",
  "We label concept work as concept work.",
  "We do not present example rates as market prices.",
  "We only promise what is written into your contract.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", href: "/about" }]}
        eyebrow="About CONSTRUKT"
        title={["From the First Blueprint", <em key="e">to the Final Finish.</em>]}
        intro={
          <p>
            CONSTRUKT is built on a simple idea: buildings turn out better when the people who design them, build them
            and finish them work as one team, from the very first conversation.
          </p>
        }
        image="/images/brand/site-team.jpg"
        imageAlt="Construction workers in hard hats fixing steel reinforcement"
      />

      <section aria-labelledby="story-title" className="bg-ivory py-20 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel>Our approach</SectionLabel>
            <SplitHeading
              id="story-title"
              lines={["Coordination", <em key="e">is the craft.</em>]}
              className="display-lg mt-8"
            />
            <div className="mt-10 space-y-5 text-[1.0625rem] leading-relaxed text-ink-muted" data-reveal="up">
              <p>
                Many construction projects are delivered by a chain of separate consultants and contractors, each
                optimising for their own part. The gaps between them are where delays, rework and budget surprises tend
                to appear.
              </p>
              <p>
                We bring architecture, engineering, construction, interior finishing and building services into one
                coordinated process. The same team that draws the plan understands how it will be built, priced and
                maintained — and stays accountable through to handover.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div data-reveal="mask" className="relative aspect-[3/4] overflow-hidden bg-ivory-deep">
              <Image
                src="/images/process/consultation.jpg"
                alt="Hands reviewing architectural drawings with a scale ruler"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-x">
          <SectionLabel tone="light">How we work</SectionLabel>
          <h2 id="principles-title" className="display-lg mt-8 max-w-3xl">
            Four working principles.
          </h2>
          <ol className="mt-14 grid gap-px bg-line-inverse sm:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
            {principles.map((item, index) => (
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
            <SectionLabel>Under one roof</SectionLabel>
            <h2 id="disciplines-title" className="display-md mt-6">
              Nine disciplines, one point of contact.
            </h2>
          </div>
          <ul className="grid gap-px self-start bg-line sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <li key={category.slug} className="bg-ivory">
                <Link href={`/services/${category.slug}`} className="block p-6 hover:bg-paper">
                  <span className="eyebrow text-orange-ink">{category.code}</span>
                  <span className="mt-3 block font-medium">{category.title}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{category.services.length} services</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="honesty-title" className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>Our commitments</SectionLabel>
            <h2 id="honesty-title" className="display-md mt-6">
              Trust is built the same way as everything else — carefully.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-line">
              {commitments.map((item) => (
                <li key={item} className="border-b border-line py-4 text-lg">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-ink-muted">
              Company history, team profiles, licences and professional credentials will be published here once they
              have been confirmed and can be verified.
            </p>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
