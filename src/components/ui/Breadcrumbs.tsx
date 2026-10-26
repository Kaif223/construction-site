import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getI18n } from "@/i18n/server";

export type Crumb = { label: string; href: string };

/**
 * Visible breadcrumb trail plus matching BreadcrumbList structured data.
 * `href`s are locale-less paths; the locale prefix is added here.
 */
export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { dict, href } = await getI18n();
  const trail = [{ label: dict.common.home, href: "/" }, ...items].map((item) => ({ ...item, href: href(item.href) }));
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
    <nav aria-label={dict.common.breadcrumb}>
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
                  <span aria-hidden="true" className="rtl:-scale-x-100">
                    /
                  </span>
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
