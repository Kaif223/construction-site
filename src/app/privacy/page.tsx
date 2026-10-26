import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CONSTRUKT handles information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      href="/privacy"
      intro="How information shared through this website is collected, used and protected."
      sections={[
        {
          id: "collect",
          title: "Information we collect",
          body: (
            <>
              <p>When you submit a project inquiry, you may provide:</p>
              <ul>
                <li>Contact details — name, email address and, optionally, phone number.</li>
                <li>Project details — type, location, approximate area, budget range, timing and description.</li>
                <li>A preliminary estimate summary, if you chose to attach one.</li>
              </ul>
              <p>
                The budget estimator runs entirely in your browser. Its inputs are not sent anywhere unless you choose to
                attach the summary to an inquiry; it is held temporarily in your browser’s session storage for that
                purpose.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          body: (
            <p>
              Inquiry details are used only to respond to your inquiry and, if you opted in, to send follow-up about your
              project. We do not sell personal information.
            </p>
          ),
        },
        {
          id: "storage",
          title: "Storage & retention",
          body: (
            <p>
              <strong>To be completed:</strong> where inquiries are stored (for example, an email inbox or CRM), who
              can access them, and how long they are retained. At present this website does not store inquiries on a
              server.
            </p>
          ),
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <p>
              Depending on where you live, you may have rights to access, correct or delete your information. To make a
              request, contact <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
            </p>
          ),
        },
        {
          id: "cookies",
          title: "Cookies & analytics",
          body: (
            <p>
              This website does not currently use analytics or advertising cookies. Fonts are self-hosted. If analytics
              are added later, this section must be updated before they are enabled.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions about this policy: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              . Business address: {siteConfig.contact.address ?? "to be confirmed"}.
            </p>
          ),
        },
      ]}
    />
  );
}
