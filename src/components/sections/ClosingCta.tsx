import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { SplitHeading } from "@/components/ui/primitives";
import { AlignOnScroll } from "@/components/ui/AlignOnScroll";

export async function ClosingCta() {
  const { dict, href } = await getI18n();
  const t = dict.cta;
  const actions = [
    { ...t.actions.start, href: "/contact" },
    { ...t.actions.quote, href: "/quote" },
    { ...t.actions.consult, href: "/quote?intent=consultation" },
    { ...t.actions.estimate, href: "/estimate" },
  ];

  return (
    <section aria-labelledby="closing-title" className="grain relative isolate overflow-hidden bg-charcoal text-ivory">
      <div className="absolute inset-0 -z-10">
        <div data-parallax="0.1" className="absolute inset-x-0 -inset-y-[12%]">
          <Image src="/images/brand/closing-residence.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-charcoal/20 rtl:bg-gradient-to-l" />
      </div>

      <div className="container-x py-24 md:py-32">
        <p className="eyebrow text-orange" data-reveal="fade">
          {t.label}
        </p>
        <AlignOnScroll>
          <SplitHeading id="closing-title" lines={t.lines} emphasis={[1]} className="display-xl mt-6 max-w-[15ch]" />
        </AlignOnScroll>
        <ul className="mt-14 grid max-w-5xl border-t border-line-inverse sm:grid-cols-2" data-reveal="stagger">
          {actions.map((action) => (
            <li
              key={action.label}
              className="border-b border-line-inverse sm:odd:border-e sm:odd:pe-8 sm:even:ps-8"
            >
              <Link href={href(action.href)} className="group flex items-center justify-between gap-4 py-6">
                <span>
                  <span className="block text-lg font-medium md:text-xl">{action.label}</span>
                  <span className="mt-1 block text-sm text-ivory/65">{action.note}</span>
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/30 transition-colors duration-500 group-hover:border-orange group-hover:bg-orange group-hover:text-charcoal">
                  <ArrowUpRight aria-hidden="true" className="icon-dir h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
