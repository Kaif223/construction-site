import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { footerNav, siteConfig } from "@/config/site";
import { getI18n } from "@/i18n/server";
import { getCategories } from "@/content";
import { translationStatus } from "@/content/translation-status";
import { Logo } from "@/components/ui/Logo";
import { BackToTop } from "@/components/layout/BackToTop";
import { CopyrightYear } from "@/components/layout/CopyrightYear";

function FooterHeading({ children, spaced = false }: { children: React.ReactNode; spaced?: boolean }) {
  return <h2 className={`eyebrow mb-5 text-ivory-muted ${spaced ? "mt-10" : ""}`}>{children}</h2>;
}

const linkClass = "link-line text-ivory/85 hover:text-ivory";

export async function SiteFooter() {
  const { dict, href, language, market, l } = await getI18n();
  const { contact } = market;
  const categories = getCategories(language);
  const draft = translationStatus[language].status === "draft";

  return (
    <footer data-site-footer className="grain relative overflow-hidden bg-charcoal text-ivory">
      {draft && dict.translation.draftNotice && (
        <div role="note" className="border-b border-line-inverse bg-graphite">
          <p className="container-x flex items-start gap-3 py-4 text-sm text-ivory/80">
            <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
            {dict.translation.draftNotice}
          </p>
        </div>
      )}
      <div className="container-x pt-20 pb-10 md:pt-28">
        <div className="grid gap-12 border-b border-line-inverse pb-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-md text-ivory/75">{dict.footer.description}</p>
            <p className="eyebrow mt-6 text-ivory-muted">{dict.footer.market.replace("{market}", l(market.name))}</p>
            <Link href={href("/quote")} className="btn btn-primary mt-8">
              {dict.common.requestQuote} <ArrowUpRight aria-hidden="true" className="icon-dir h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <FooterHeading>{dict.footer.services}</FooterHeading>
              <ul className="columns-2 gap-6 space-y-2.5 text-sm sm:columns-1">
                {categories.map((category) => (
                  <li key={category.slug} className="break-inside-avoid">
                    <Link href={href(`/services/${category.slug}`)} className={linkClass}>
                      {category.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <FooterHeading>{dict.footer.company}</FooterHeading>
              <ul className="space-y-2.5 text-sm">
                {footerNav.company.map((item) => (
                  <li key={item.href}>
                    <Link href={href(item.href)} className={linkClass}>
                      {dict.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
              <FooterHeading spaced>{dict.footer.getStarted}</FooterHeading>
              <ul className="space-y-2.5 text-sm">
                {footerNav.start.map((item) => (
                  <li key={item.href}>
                    <Link href={href(item.href)} className={linkClass}>
                      {dict.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <FooterHeading>{dict.footer.contact}</FooterHeading>
              <address className="space-y-2.5 text-sm not-italic text-ivory/85">
                {contact.email && (
                  <p>
                    <a href={`mailto:${contact.email}`} className={`${linkClass} ltr-isolate`}>
                      {contact.email}
                    </a>
                  </p>
                )}
                <p>{contact.phone ? <span className="ltr-isolate">{contact.phone}</span> : dict.footer.phoneTbc}</p>
                <p>{contact.address ? l(contact.address) : dict.footer.addressTbc}</p>
              </address>
              <FooterHeading spaced>{dict.footer.hours}</FooterHeading>
              {contact.hours.length > 0 ? (
                <dl className="space-y-1.5 text-sm text-ivory/85">
                  {contact.hours.map((row) => (
                    <div key={row.days.en}>
                      <dt className="inline">{l(row.days)}: </dt>
                      <dd className="inline">{row.time ? l(row.time) : dict.common.toBeConfirmed}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-ivory/70">{dict.footer.hoursTbc}</p>
              )}
              <FooterHeading spaced>{dict.footer.social}</FooterHeading>
              {siteConfig.social.length > 0 ? (
                <ul className="space-y-2.5 text-sm">
                  {siteConfig.social.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={linkClass} rel="noopener noreferrer" target="_blank">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ivory/60">{dict.footer.socialSoon}</p>
              )}
            </div>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none mt-10 select-none font-display text-[clamp(4rem,19vw,19rem)] leading-[0.8] tracking-[-0.03em] text-ivory/[0.07] [direction:ltr]"
        >
          CONSTRUKT
        </p>

        <div className="mt-8 flex flex-col gap-6 text-xs text-ivory/60 md:flex-row md:items-center md:justify-between">
          <p>
            © <CopyrightYear /> {siteConfig.name} {dict.common.workingBrand}. {dict.footer.imagery}{" "}
            <Link href={href("/terms#imagery")} className="link-line">
              {dict.footer.credits}
            </Link>
            .
          </p>
          <ul className="flex flex-wrap items-center gap-6">
            <li>
              <Link href={href("/privacy")} className="link-line">
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={href("/terms")} className="link-line">
                {dict.footer.terms}
              </Link>
            </li>
            <li>
              <BackToTop label={dict.common.backToTop} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
