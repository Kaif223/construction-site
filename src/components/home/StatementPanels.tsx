import Image from "next/image";
import { getI18n } from "@/i18n/server";
import { maskWords, TextLink } from "@/components/ui/primitives";

const panels = [
  { image: "/images/services/construction.jpg", links: ["services", "about"] },
  { image: "/images/journey/03-structure.jpg", links: ["process", "planning"] },
  { image: "/images/journey/09-handover.jpg", links: ["materials", "projects"] },
] as const;

/**
 * Full-screen statements that stack as the page scrolls: each panel sticks to
 * the top and the next one slides over it. This is ordinary sticky
 * positioning, so scrolling is never taken over and it works the same on
 * touch screens. Words rise in as each statement arrives.
 */
export async function StatementPanels() {
  const { dict, href } = await getI18n();
  const t = dict.home.statements;
  const total = String(panels.length).padStart(2, "0");

  return (
    <section id="statements" aria-labelledby="statements-title" className="relative bg-charcoal text-ivory">
      <h2 id="statements-title" className="sr-only">
        {t.label}
      </h2>
      {panels.map((panel, index) => (
        <div key={panel.image} className="sticky top-0 isolate h-[100svh] min-h-[34rem] overflow-hidden">
          <div data-reveal="zoom" className="absolute inset-0 -z-10">
            <Image src={panel.image} alt={t.items[index].imageAlt} fill sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/85 via-charcoal/55 to-charcoal/10 rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal/70 to-transparent to-50%" />

          <div className="container-x flex h-full flex-col justify-center pt-[var(--header-h)]">
            <p className="eyebrow flex items-center gap-3 text-ivory/70" data-reveal="fade">
              <span className="ltr-isolate text-orange">
                {String(index + 1).padStart(2, "0")} / {total}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-ivory/30" />
              {t.label}
            </p>
            <p className="display-lg mt-6 max-w-[20ch]" data-reveal="lines">
              {maskWords(t.items[index].text).nodes}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3" data-reveal="up">
              {panel.links.map((key) => (
                <TextLink key={key} href={href(`/${key}`)} className="text-ivory">
                  {dict.nav[key]}
                </TextLink>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
