import Link from "next/link";
import type { Testimonial } from "@/data/content";
import { getI18n } from "@/i18n/server";
import { SectionLabel } from "@/components/ui/primitives";

/**
 * Renders verified testimonials when they exist. Until then it shows an
 * honest placeholder rather than invented reviews.
 */
export async function Testimonials({ testimonials, number }: { testimonials: Testimonial[]; number?: string }) {
  const { dict, href } = await getI18n();
  const t = dict.testimonials;
  const [before, after] = t.consult.split("{link}");

  return (
    <section aria-labelledby="voices-title" className="bg-ivory-deep py-24 md:py-32">
      <div className="container-x">
        <SectionLabel number={number}>{t.label}</SectionLabel>
        {testimonials.length > 0 ? (
          <>
            <h2 id="voices-title" className="display-lg mt-8 max-w-3xl">
              {t.headingVerified}
            </h2>
            <ul className="mt-14 grid gap-10 md:grid-cols-3">
              {testimonials.map((item) => (
                <li key={item.name} className="border-t border-line pt-6">
                  <blockquote className="font-display text-2xl leading-snug">“{item.quote}”</blockquote>
                  <p className="mt-6 text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-ink-muted">{item.project}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h2 id="voices-title" className="display-lg max-w-3xl" data-reveal="up">
                {t.heading} <em>{t.headingEm}</em>
              </h2>
            </div>
            <div className="md:col-span-5" data-reveal="up">
              <p className="leading-relaxed text-ink-muted">{t.body}</p>
              <p className="mt-6 text-sm">
                {before}
                <Link href={href("/quote?intent=consultation")} className="link-line font-medium">
                  {t.consultLink}
                </Link>
                {after}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
