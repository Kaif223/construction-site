import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/primitives";
import { MaterialExplorer } from "@/components/materials/MaterialExplorer";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getMaterials } from "@/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/materials", title: dict.meta.materials.title, description: dict.meta.materials.description });
}

export default async function MaterialsPage() {
  const { dict, language } = await getI18n();
  const m = dict.materialsPage;

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.nav.materials, href: "/materials" }]}
        eyebrow={m.eyebrow}
        title={m.title}
        intro={<p>{m.intro}</p>}
        image="/images/materials/marble.jpg"
        imageAlt={m.heroAlt}
      />

      <section aria-label={m.stripLabel} className="bg-ivory py-16 md:py-24">
        <div className="container-x">
          <Suspense>
            <MaterialExplorer materials={getMaterials(language)} />
          </Suspense>
        </div>
      </section>

      <section aria-labelledby="craft-title" className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-x">
          <SectionLabel tone="light">{m.craftLabel}</SectionLabel>
          <h2 id="craft-title" className="display-lg mt-8 max-w-3xl">
            {m.craftTitle}
          </h2>
          <ol className="mt-14 grid gap-px bg-line-inverse sm:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
            {m.principles.map((item, index) => (
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
