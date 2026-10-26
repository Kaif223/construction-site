import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { siteConfig } from "@/config/site";
import { serviceCategories } from "@/data/services";

export const metadata: Metadata = {
  title: "Contact & Project Inquiry",
  description:
    "Tell us about your construction, renovation or design project. Request a quotation or schedule a consultation with the CONSTRUKT team.",
  alternates: { canonical: "/contact" },
};

const nextSteps = [
  { title: "We review your inquiry", body: "and may follow up with a few questions." },
  { title: "Consultation", body: "to understand goals, budget and timing." },
  { title: "Site visit", body: "to measure and assess conditions before any quotation." },
];

export default function ContactPage() {
  const { contact } = siteConfig;
  const serviceOptions = serviceCategories.map((category) => ({ id: category.slug, label: category.shortTitle }));

  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact", href: "/contact" }]}
        eyebrow="Start a project"
        title={["Tell Us What", <em key="e">You Want to Build.</em>]}
        intro={
          <p>
            A few details help us understand your project and respond with the right questions. Required fields are
            marked with an asterisk — everything else is optional.
          </p>
        }
      />

      <section aria-label="Project inquiry" className="bg-ivory py-16 md:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="display-md mb-10">Project inquiry</h2>
            <InquiryForm serviceOptions={serviceOptions} contactEmail={contact.email} />
          </div>

          <aside className="space-y-10 lg:col-span-4" aria-label="Contact information">
            <div className="bg-charcoal p-6 text-ivory md:p-8">
              <h2 className="eyebrow text-orange">Direct contact</h2>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-ivory/60" />
                  <a href={`mailto:${contact.email}`} className="link-line">
                    {contact.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-ivory/60" />
                  {contact.phone ?? <span className="text-ivory/70">Phone number to be confirmed</span>}
                </li>
                <li className="flex gap-3">
                  <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-ivory/60" />
                  {contact.address ?? <span className="text-ivory/70">Office address to be confirmed</span>}
                </li>
                <li className="flex gap-3">
                  <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-ivory/60" />
                  <span>
                    {contact.hours.map((row) => (
                      <span key={row.days} className="block">
                        {row.days}: <span className="text-ivory/70">{row.time}</span>
                      </span>
                    ))}
                  </span>
                </li>
              </ul>
              {contact.serviceArea && <p className="mt-6 text-sm text-ivory/70">Service area: {contact.serviceArea}</p>}
            </div>

            <div>
              <h2 className="eyebrow text-ink-muted">What happens next</h2>
              <ol className="mt-5 border-t border-line">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4 border-b border-line py-4 text-sm">
                    <span className="eyebrow pt-0.5 text-orange-ink">0{index + 1}</span>
                    <span>
                      <span className="font-medium">{step.title}</span>{" "}
                      <span className="text-ink-muted">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {!siteConfig.inquiryEndpoint && (
              <p className="border-l-2 border-orange pl-4 text-xs leading-relaxed text-ink-muted">
                Online inquiry delivery is not connected on this website yet. The form validates your details and then
                lets you send them by email or copy them — it will not claim to have sent anything.
              </p>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
