import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import credits from "../../../../public/images/CREDITS.json";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return pageMetadata({ path: "/terms", title: dict.meta.terms.title, description: dict.meta.terms.description });
}

export default async function TermsPage() {
  const { dict, market } = await getI18n();
  const email = market.contact.email ?? "the contact address on this website";
  return (
    <LegalPage
      title={dict.meta.terms.title}
      href="/terms"
      intro={dict.meta.terms.description}
      sections={[
        {
          id: "use",
          title: "Use of this website",
          body: (
            <p>
              This website provides general information about construction, design and renovation services. Nothing on
              it is an offer, a quotation or professional advice for a specific project.
            </p>
          ),
        },
        {
          id: "estimates",
          title: "Estimates",
          body: (
            <p>
              The budget estimator shows figures only from rate tables marked as reviewed. Illustrative example figures
              can be previewed and are labelled as such; they are not market prices and are not binding. Estimates
              exclude taxes unless stated. Any contract price is set only in a written quotation following a site visit
              and an agreed scope.
            </p>
          ),
        },
        {
          id: "projects",
          title: "Projects & content",
          body: (
            <p>
              Projects on this website are concept studies used to illustrate an approach. They are not represented as
              completed client work, and their specifications are design-brief figures.
            </p>
          ),
        },
        {
          id: "services",
          title: "Services & availability",
          body: (
            <p>
              The service directory describes the kinds of work we coordinate. It is not a statement that every service
              is available in every location: availability, the use of specialist partners and coverage for your emirate
              are confirmed in writing for each project. Regulated work is carried out only by appropriately licensed and
              authorized professionals, and no approval from any authority is guaranteed.
            </p>
          ),
        },
        {
          id: "liability",
          title: "Liability",
          body: (
            <p>
              <strong>To be completed by legal counsel:</strong> limitations of liability, governing law and
              jurisdiction appropriate to the business’s location.
            </p>
          ),
        },
        {
          id: "imagery",
          title: "Image credits",
          body: (
            <>
              <p>
                Photography is representative stock imagery used under the Unsplash License or released under CC0
                (public domain) via Openverse. It does not depict CONSTRUKT projects. The “drawing” comparison image is a
                line study generated from the hero photograph.
              </p>
              <ul className="text-sm">
                {credits.map((credit) => (
                  <li key={credit.file}>
                    <span className="font-mono text-xs">{credit.file}</span> —{" "}
                    <a href={credit.url} rel="noopener noreferrer" target="_blank">
                      {credit.source}
                    </a>
                    {"creator" in credit && credit.creator ? `, ${credit.creator}` : ""} ({credit.license})
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions about these terms: <a href={`mailto:${email}`}>{email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
