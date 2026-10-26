import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/privacy", title: dict.meta.privacy.title, description: dict.meta.privacy.description });
}

export default async function PrivacyPage() {
  const { dict, market, l } = await getI18n();
  const email = market.contact.email ?? "the contact address on this website";

  return (
    <LegalPage
      title={dict.meta.privacy.title}
      href="/privacy"
      intro={dict.meta.privacy.description}
      sections={[
        {
          id: "collect",
          title: "Information we collect",
          body: (
            <>
              <p>When you request a quotation, you may provide:</p>
              <ul>
                <li>Contact details — name, email address and, optionally, a phone number and WhatsApp preference.</li>
                <li>Project details — type, emirate or region, area or community, approximate size, budget range, timing and a description.</li>
                <li>A preliminary estimate summary, if you chose to attach one.</li>
              </ul>
              <p>
                We do not ask for a street address at this stage. Supporting documents you select in the form are checked
                in your browser only; they are <strong>not uploaded or sent</strong> until a secure upload service is
                connected, and this policy will be updated before that happens.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          body: (
            <p>
              Request details are used only to respond to your request and, if you opted in, to send follow-up about your
              project. We do not sell personal information, and form contents are not sent to analytics or advertising
              tools.
            </p>
          ),
        },
        {
          id: "technical",
          title: "Technical data",
          body: (
            <>
              <p>
                To protect the form from abuse, the server briefly processes your IP address to limit repeated
                submissions. It is held in memory for up to ten minutes and is not stored with your request.
              </p>
              <p>
                If you switch language, a functional cookie (<code>construkt-locale</code>) remembers your choice for up
                to a year. The budget estimator stores an attached estimate in your browser&apos;s session storage until
                you close the tab.
              </p>
            </>
          ),
        },
        {
          id: "storage",
          title: "Storage & retention",
          body: (
            <p>
              <strong>To be completed:</strong> where requests are stored (for example, an email inbox or CRM), who can
              access them, how long they are kept and how they are deleted. At present this website does not store
              requests on a server.
            </p>
          ),
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <>
              <p>
                Depending on applicable law, you may have rights to access, correct or delete your information. To make a
                request, contact <a href={`mailto:${email}`}>{email}</a>.
              </p>
              <p>
                <strong>To be completed:</strong>{" "}
                {market.legal.dataProtection
                  ? l(market.legal.dataProtection)
                  : "the data-protection law that applies to the business and the market it serves, reviewed by legal counsel."}
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies & analytics",
          body: (
            <p>
              This website does not currently use analytics or advertising cookies. Fonts are self-hosted. If analytics
              are added later, this section must be updated — and consent obtained where required — before they are
              enabled.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions about this policy: <a href={`mailto:${email}`}>{email}</a>. Business address:{" "}
              {market.contact.address ? l(market.contact.address) : "to be confirmed"}.
            </p>
          ),
        },
      ]}
    />
  );
}
