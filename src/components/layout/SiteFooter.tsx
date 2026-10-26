import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerNav, siteConfig } from "@/config/site";
import { serviceCategories } from "@/data/services";
import { Logo } from "@/components/ui/Logo";
import { BackToTop } from "@/components/layout/BackToTop";
import { CopyrightYear } from "@/components/layout/CopyrightYear";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="eyebrow mb-5 text-ivory-muted">{children}</h2>;
}

const linkClass = "link-line text-ivory/85 hover:text-ivory";

export function SiteFooter() {
  const { contact, social } = siteConfig;

  return (
    <footer data-site-footer className="grain relative overflow-hidden bg-charcoal text-ivory">
      <div className="container-x pt-20 pb-10 md:pt-28">
        <div className="grid gap-12 border-b border-line-inverse pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-md text-ivory/75">{siteConfig.description}</p>
            <Link href="/contact" className="btn btn-primary mt-8">
              Start your project <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <FooterHeading>Services</FooterHeading>
              <ul className="space-y-2.5 text-sm">
                {serviceCategories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/services/${category.slug}`} className={linkClass}>
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <FooterHeading>Company</FooterHeading>
              <ul className="space-y-2.5 text-sm">
                {footerNav.company.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <FooterHeading>
                <span className="mt-10 block">Get started</span>
              </FooterHeading>
              <ul className="space-y-2.5 text-sm">
                {footerNav.start.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <FooterHeading>Contact</FooterHeading>
              <address className="space-y-2.5 text-sm not-italic text-ivory/85">
                <p>
                  <a href={`mailto:${contact.email}`} className={linkClass}>
                    {contact.email}
                  </a>
                </p>
                <p>{contact.phone ?? "Phone: to be confirmed"}</p>
                <p>{contact.address ?? "Office address: to be confirmed"}</p>
              </address>
              <FooterHeading>
                <span className="mt-10 block">Hours</span>
              </FooterHeading>
              <dl className="space-y-1.5 text-sm text-ivory/85">
                {contact.hours.map((row) => (
                  <div key={row.days}>
                    <dt className="inline">{row.days}: </dt>
                    <dd className="inline">{row.time}</dd>
                  </div>
                ))}
              </dl>
              <FooterHeading>
                <span className="mt-10 block">Social</span>
              </FooterHeading>
              {social.length > 0 ? (
                <ul className="space-y-2.5 text-sm">
                  {social.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={linkClass} rel="noopener noreferrer" target="_blank">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ivory/60">Social channels launching soon.</p>
              )}
            </div>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none mt-10 select-none font-display text-[clamp(4rem,19vw,19rem)] leading-[0.8] tracking-[-0.03em] text-ivory/[0.07]"
        >
          CONSTRUKT
        </p>

        <div className="mt-8 flex flex-col gap-6 text-xs text-ivory/60 md:flex-row md:items-center md:justify-between">
          <p>
            © <CopyrightYear /> {siteConfig.legalName}. Project imagery is illustrative — see{" "}
            <Link href="/terms#imagery" className="link-line">
              image credits
            </Link>
            .
          </p>
          <ul className="flex flex-wrap items-center gap-6">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-line">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <BackToTop />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
