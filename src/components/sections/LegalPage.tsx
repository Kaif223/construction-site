import { PageHero } from "@/components/ui/PageHero";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Shared layout for policy pages: notice banner, contents list and sections. */
export function LegalPage({
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
  return (
    <>
      <PageHero crumbs={[{ label: title, href }]} eyebrow="Legal" title={[title]} intro={<p>{intro}</p>} />
      <section className="bg-ivory py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="eyebrow text-ink-muted">On this page</p>
              <ol className="mt-4 space-y-2 text-sm">
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
            <div role="note" className="border-l-2 border-orange bg-paper px-5 py-4 text-sm leading-relaxed">
              <strong className="font-medium">Placeholder document.</strong> This text is a starting template, not
              legal advice. It must be completed with the business’s real details and reviewed by qualified legal
              counsel for the relevant jurisdiction before launch.
            </div>
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-line py-10">
                <h2 className="display-md">{section.title}</h2>
                <div className="mt-5 space-y-4 leading-relaxed text-ink-muted [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-charcoal">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
