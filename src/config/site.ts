/**
 * Central business configuration.
 *
 * Every value marked `null` is intentionally unset: the real business details
 * have not been supplied yet. Components render a neutral "to be confirmed"
 * state instead of inventing an address, phone number or social profile.
 */
export const siteConfig = {
  name: "CONSTRUKT",
  legalName: "CONSTRUKT (working brand name)",
  tagline: "From the First Blueprint to the Final Finish.",
  description:
    "CONSTRUKT brings architecture, engineering, construction, interior finishing and specialist trades together under one roof — for homes, commercial spaces and renovations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://construkt.example",
  locale: "en",
  contact: {
    // example.com is reserved for documentation, so it can never reach a real inbox.
    email: "hello@construkt.example",
    phone: null as string | null,
    address: null as string | null,
    serviceArea: null as string | null,
    hours: [
      { days: "Monday – Friday", time: "To be confirmed" },
      { days: "Saturday", time: "To be confirmed" },
    ],
  },
  social: [] as { label: string; href: string }[],
  /**
   * Where project inquiries are delivered. Leave unset until a real backend,
   * CRM or email service is connected — see README "Integrations".
   */
  inquiryEndpoint: process.env.INQUIRY_WEBHOOK_URL ?? null,
} as const;

export const mainNav = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Process", href: "/process" },
  { label: "Materials", href: "/materials" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  company: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Process", href: "/process" },
    { label: "Materials", href: "/materials" },
    { label: "FAQ", href: "/faq" },
  ],
  start: [
    { label: "Budget estimator", href: "/estimate" },
    { label: "Project inquiry", href: "/contact" },
    { label: "Schedule a consultation", href: "/contact?intent=consultation" },
  ],
  legal: [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of service", href: "/terms" },
  ],
} as const;
