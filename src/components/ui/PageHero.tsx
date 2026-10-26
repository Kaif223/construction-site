import Image from "next/image";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { SplitHeading } from "@/components/ui/primitives";

/**
 * Dark editorial header shared by every inner page. Starting each page dark
 * keeps the transparent navigation legible in a single, predictable state.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  emphasis = [1],
  intro,
  image,
  imageAlt = "",
  meta,
  children,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: React.ReactNode[];
  emphasis?: number[];
  intro?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  meta?: { label: string; value: React.ReactNode }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative isolate overflow-hidden bg-charcoal text-ivory">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <div data-parallax="0.08" className="absolute inset-x-0 -inset-y-[10%]">
            <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="object-cover opacity-45" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
        </div>
      ) : (
        <div aria-hidden="true" className="grid-paper-dark absolute inset-0 -z-10 opacity-70" />
      )}

      <div className="container-x pt-[calc(var(--header-h)+3.5rem)] pb-16 md:pt-[calc(var(--header-h)+6rem)] md:pb-24">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow mt-12 text-orange md:mt-20" data-reveal="fade">
          {eyebrow}
        </p>
        <SplitHeading as="h1" lines={title} emphasis={emphasis} className="display-xl mt-5 max-w-[16ch]" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          {intro && (
            <div className="lede max-w-2xl text-ivory/80 lg:col-span-7" data-reveal="up">
              {intro}
            </div>
          )}
          {meta && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line-inverse pt-6 lg:col-span-5" data-reveal="stagger">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="eyebrow text-ivory-muted">{item.label}</dt>
                  <dd className="mt-1.5 text-sm">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
