import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { siteConfig } from "@/config/site";
import credits from "../../../public/images/CREDITS.json";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the CONSTRUKT website, its estimator and its content, plus image credits.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      href="/terms"
      intro="The terms that apply when you use this website and its tools."
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
              The budget estimator produces a preliminary range calculated from illustrative example rates. These are
              not verified market prices and are not binding. Any contract price is set only in a written quotation
              following a site visit and an agreed scope.
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
              Questions about these terms: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
