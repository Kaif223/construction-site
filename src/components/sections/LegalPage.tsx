import { getI18n } from "@/i18n/server";
import { PageHero } from "@/components/ui/PageHero";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/**
 * Shared layout for policy pages. Legal text is only published in languages
 * that have had a professional legal translation; until then other languages
 * show a notice and the English text (marked as English for assistive tech).
 */
export async function LegalPage({
  title,
  href,
  intro,
  sections,
}: {
  title: string;
  href: string;
  intro: string;
  sections: LegalSection[];
}) {
  const { dict, language } = await getI18n();
  const translated = language === "en";

  return (
    <>
      <PageHero crumbs={[{ label: title, href }]} eyebrow={dict.legal.label} title={[title]} emphasis={[]} intro={<p>{intro}</p>} />
      <section className="bg-ivory py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <nav aria-label={dict.legal.onThisPage} className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="eyebrow text-ink-muted">{dict.legal.onThisPage}</p>
              <ol className="mt-4 space-y-2 text-sm" lang="en" dir="ltr">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="link-line">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="max-w-3xl lg:col-span-8 lg:col-start-5">
            {!translated && dict.translation.legalNotice && (
              <p role="note" className="mb-6 border-s-2 border-orange bg-paper px-5 py-4 text-sm leading-relaxed">
                {dict.translation.legalNotice}
              </p>
            )}
            <div role="note" className="border-s-2 border-orange bg-paper px-5 py-4 text-sm leading-relaxed">
              {dict.legal.placeholder}
            </div>
            <div lang="en" dir="ltr">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-line py-10">
                  <h2 className="display-md">{section.title}</h2>
                  <div className="mt-5 space-y-4 leading-relaxed text-ink-muted [&_a]:underline [&_li]:ms-5 [&_li]:list-disc [&_strong]:text-charcoal">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
