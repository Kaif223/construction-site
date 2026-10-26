/**
 * Brand-wide settings that do not vary by market. Anything country-specific
 * (contact details, currency, regions, tax, services) lives in markets.ts.
 */
export const siteConfig = {
  name: "CONSTRUKT",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://construkt.example",
  /** Verified social profiles only. Hidden while empty. */
  social: [] as { label: string; href: string }[],
  /**
   * Where quotation requests are delivered (CRM, email service, automation
   * webhook…). Server-only. Leave unset until a real integration exists —
   * see README "Integrations".
   */
  inquiryEndpoint: process.env.INQUIRY_WEBHOOK_URL ?? null,
} as const;

/** Navigation entries; labels come from the `nav` dictionary section. */
export const mainNav = [
  { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "process", href: "/process" },
  { key: "planning", href: "/planning" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export const footerNav = {
  company: [
    { key: "about", href: "/about" },
    { key: "projects", href: "/projects" },
    { key: "process", href: "/process" },
    { key: "planning", href: "/planning" },
    { key: "materials", href: "/materials" },
    { key: "faq", href: "/faq" },
  ],
  start: [
    { key: "quote", href: "/quote" },
    { key: "consultation", href: "/quote?intent=consultation" },
    { key: "estimate", href: "/estimate" },
    { key: "contact", href: "/contact" },
  ],
} as const;
