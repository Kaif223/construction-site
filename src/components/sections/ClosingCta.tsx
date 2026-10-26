import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitHeading } from "@/components/ui/primitives";

const actions = [
  { label: "Start a project", href: "/contact", note: "Tell us about your plans" },
  { label: "Request a quotation", href: "/contact?intent=quotation", note: "Itemised and transparent" },
  { label: "Schedule a consultation", href: "/contact?intent=consultation", note: "Discuss the brief" },
  { label: "Estimate a budget", href: "/estimate", note: "Preliminary range in minutes" },
];

export function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="grain relative isolate overflow-hidden bg-charcoal text-ivory">
      <div className="absolute inset-0 -z-10">
        <div data-parallax="0.1" className="absolute -inset-y-[12%] inset-x-0">
          <Image
            src="/images/brand/closing-residence.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-charcoal/20" />
      </div>

      <div className="container-x py-28 md:py-40">
        <p className="eyebrow text-orange" data-reveal="fade">
          Let’s begin
        </p>
        <SplitHeading
          id="closing-title"
          lines={["Have a Project in Mind?", "Let’s Build It Right."]}
          className="display-xl mt-6 max-w-[15ch]"
        />
        <ul className="mt-14 grid max-w-5xl border-t border-line-inverse sm:grid-cols-2" data-reveal="stagger">
          {actions.map((action) => (
            <li key={action.href} className="border-b border-line-inverse sm:odd:border-r sm:odd:pr-8 sm:even:pl-8">
              <Link
                href={action.href}
                className="group flex items-center justify-between gap-4 py-6"
              >
                <span>
                  <span className="block text-xl md:text-2xl">{action.label}</span>
                  <span className="mt-1 block text-sm text-ivory/65">{action.note}</span>
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/30 transition-colors duration-500 group-hover:border-orange group-hover:bg-orange group-hover:text-charcoal">
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
