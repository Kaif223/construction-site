import Link from "next/link";
import type { Testimonial } from "@/data/content";
import { SectionLabel } from "@/components/ui/primitives";

/**
 * Renders verified testimonials when they exist. Until then it shows an
 * honest placeholder rather than invented reviews.
 */
export function Testimonials({ testimonials, number }: { testimonials: Testimonial[]; number?: string }) {
  return (
    <section aria-labelledby="voices-title" className="bg-ivory-deep py-24 md:py-32">
      <div className="container-x">
        <SectionLabel number={number}>Client voices</SectionLabel>
        {testimonials.length > 0 ? (
          <>
            <h2 id="voices-title" className="display-lg mt-8 max-w-3xl">
              In our clients’ words.
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
                Reviews you can trust — <em>when they’re real.</em>
              </h2>
            </div>
            <div className="md:col-span-5" data-reveal="up">
              <p className="leading-relaxed text-ink-muted">
                We only publish feedback from verified clients, with their permission. Client testimonials will appear
                here as projects are completed and reviewed — we will never show invented quotes or ratings.
              </p>
              <p className="mt-6 text-sm">
                Have questions about how we work? Bring them to a{" "}
                <Link href="/contact?intent=consultation" className="link-line font-medium">
                  consultation
                </Link>{" "}
                — we are happy to walk through our process in detail.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
