import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactActions } from "@/components/contact/ContactActions";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/contact", title: dict.meta.contact.title, description: dict.meta.contact.description });
}

export default async function ContactPage() {
  const { dict, href, market, l } = await getI18n();
  const c = dict.contactPage;
  const { contact } = market;

  return (
    <>
      <PageHero crumbs={[{ label: dict.nav.contact, href: "/contact" }]} eyebrow={c.eyebrow} title={c.title} intro={<p>{c.intro}</p>} />

      <section aria-labelledby="channels-title" className="bg-ivory py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {[
              { title: c.quoteTitle, body: c.quoteBody, path: "/quote", dark: true },
              { title: c.consultTitle, body: c.consultBody, path: "/quote?intent=consultation", dark: false },
            ].map((card) => (
              <Link
                key={card.title}
                href={href(card.path)}
                className={`group flex min-h-64 flex-col justify-between p-6 md:p-8 ${card.dark ? "bg-charcoal text-ivory" : "border border-line bg-paper"}`}
              >
                <span>
                  <span className="display-md block">{card.title}</span>
                  <span className={`mt-3 block text-sm leading-relaxed ${card.dark ? "text-ivory/75" : "text-ink-muted"}`}>
                    {card.body}
                  </span>
                </span>
                <span className="mt-8 grid h-12 w-12 place-items-center rounded-full bg-orange text-charcoal transition-transform duration-500 group-hover:translate-x-[calc(0.5rem*var(--dir))]">
                  <ArrowUpRight aria-hidden="true" className="icon-dir h-5 w-5" />
                </span>
              </Link>
            ))}
            <div className="sm:col-span-2">
              <h2 className="eyebrow text-ink-muted">{c.nextTitle}</h2>
              <ol className="mt-5 border-t border-line">
                {c.next.map((step, index) => (
                  <li key={step.title} className="flex gap-4 border-b border-line py-4 text-sm">
                    <span className="eyebrow pt-0.5 text-orange-ink">0{index + 1}</span>
                    <span>
                      <span className="font-medium">{step.title}</span> <span className="text-ink-muted">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:col-span-5" aria-labelledby="channels-title">
            <div className="bg-charcoal p-6 text-ivory md:p-8">
              <h2 id="channels-title" className="eyebrow text-orange">
                {c.channels}
              </h2>
              <div className="mt-6">
                <ContactActions variant="panel" />
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="eyebrow text-ivory-muted">{c.address}</dt>
                  <dd className="mt-1 text-ivory/80">{contact.address ? l(contact.address) : dict.footer.addressTbc}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ivory-muted">{c.hours}</dt>
                  <dd className="mt-1 text-ivory/80">
                    {contact.hours.length > 0
                      ? contact.hours.map((row) => (
                          <span key={row.days.en} className="block">
                            {l(row.days)}: {row.time ? l(row.time) : dict.common.toBeConfirmed}
                          </span>
                        ))
                      : dict.footer.hoursTbc}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
