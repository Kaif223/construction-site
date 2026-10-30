import Image from "next/image";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { SplitHeading } from "@/components/ui/primitives";

/**
 * Light editorial header shared by every inner page, set on drafting-paper
 * grid. Every page opens on a light surface, so the transparent navigation
 * has a single, predictable (dark-on-light) state. A page image, when given,
 * sits in its own frame beside the text rather than behind it.
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
    <section className="grid-paper relative isolate overflow-hidden border-b border-line bg-paper text-charcoal">
      <div className="container-x pt-[calc(var(--header-h)+2.5rem)] pb-14 md:pt-[calc(var(--header-h)+4rem)] md:pb-20">
        <Breadcrumbs items={crumbs} />
        <div className={`mt-10 grid gap-10 md:mt-14 ${image ? "lg:grid-cols-12 lg:items-end lg:gap-12" : ""}`}>
          <div className={image ? "lg:col-span-7" : ""}>
            <p className="eyebrow text-orange-ink" data-reveal="fade">
              {eyebrow}
            </p>
            <SplitHeading as="h1" lines={title} emphasis={emphasis} className="display-xl mt-5 max-w-[16ch]" />
            {intro && (
              <div className="lede mt-8 max-w-2xl text-ink-muted" data-reveal="up">
                {intro}
              </div>
            )}
            {children}
          </div>
          {image && (
            <div className="lg:col-span-5">
              <div data-reveal="mask" className="relative aspect-[4/3] overflow-hidden bg-ivory-deep lg:aspect-[5/4]">
                <div data-parallax="0.06" className="absolute inset-x-0 -inset-y-[8%]">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    preload
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {meta && (
          <dl
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 md:grid-cols-4"
            data-reveal="stagger"
          >
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="eyebrow text-ink-muted">{item.label}</dt>
                <dd className="mt-1.5 text-sm">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
