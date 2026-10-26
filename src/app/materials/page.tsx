import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/primitives";
import { MaterialExplorer } from "@/components/materials/MaterialExplorer";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { materials } from "@/data/content";

export const metadata: Metadata = {
  title: "Materials & Finishes — Marble, Granite, Tile, Timber & More",
  description:
    "Explore the materials we work with — marble, granite, ceramic and porcelain tiles, wood, glass, concrete, natural stone, metal, paint finishes and architectural lighting.",
  alternates: { canonical: "/materials" },
};

const principles = [
  {
    title: "Samples before orders",
    body: "Finishes are approved from physical samples under the light of the actual room — not from a screen.",
  },
  {
    title: "Preparation is the finish",
    body: "Flat screeds, true walls and cured substrates decide how stone, tile and paint look for years.",
  },
  {
    title: "Planned set-out",
    body: "Tile and stone layouts are drawn before installation, so cuts land where they are least visible.",
  },
  {
    title: "Protection until handover",
    body: "Completed surfaces are protected while other trades finish, then cleaned and inspected together.",
  },
];

export default function MaterialsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Materials", href: "/materials" }]}
        eyebrow="Materials & finishes"
        title={["Honest Materials,", <em key="e">Precisely Set.</em>]}
        intro={
          <p>
            The materials you choose shape how a building feels, ages and is maintained. Here is how we think about the
            finishes we install most often — and what each one asks of the work beneath it.
          </p>
        }
        image="/images/materials/marble.jpg"
        imageAlt="White marble with dramatic charcoal veining"
      />

      <section aria-label="Material library" className="bg-ivory py-16 md:py-24">
        <div className="container-x">
          <MaterialExplorer materials={materials} />
        </div>
      </section>

      <section aria-labelledby="craft-title" className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-x">
          <SectionLabel tone="light">Craftsmanship</SectionLabel>
          <h2 id="craft-title" className="display-lg mt-8 max-w-3xl">
            Four rules we finish by.
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

      <ClosingCta />
    </>
  );
}
