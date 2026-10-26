import Link from "next/link";
import { siteConfig } from "@/config/site";

export type Crumb = { label: string; href: string };

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, siteConfig.url).toString(),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-ivory/70">
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-3">
              {last ? (
                <span aria-current="page" className="text-ivory">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="link-line hover:text-ivory">
                    {item.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
