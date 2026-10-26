import { BadgeCheck } from "lucide-react";
import { hasTrustClaims, type TrustConfig, type VerifiedClaim } from "@/config/markets";
import { getI18n } from "@/i18n/server";
import { SectionLabel } from "@/components/ui/primitives";

/**
 * Verified business credentials and policies from the market config.
 * Renders nothing until at least one claim has been supplied with a
 * verification date — there are no placeholder badges.
 */
export async function TrustSection() {
  const { dict, market, l, t, tag } = await getI18n();
  if (!hasTrustClaims(market.trust)) return null;

  const entries = (Object.keys(market.trust) as (keyof TrustConfig)[]).flatMap((key) => {
    const value = market.trust[key];
    const claims: VerifiedClaim[] = Array.isArray(value) ? value : value ? [value] : [];
    return claims.filter((claim) => claim.verifiedOn).map((claim) => ({ key, claim }));
  });
  const date = (iso: string) => new Intl.DateTimeFormat(tag, { dateStyle: "medium" }).format(new Date(iso));

  return (
    <section aria-labelledby="trust-title" className="bg-paper py-20 md:py-28">
      <div className="container-x">
        <SectionLabel>{dict.trust.label}</SectionLabel>
        <h2 id="trust-title" className="display-md mt-6">
          {dict.trust.title}
        </h2>
        <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(({ key, claim }) => (
            <li key={`${key}-${claim.title.en}`} className="bg-paper p-6">
              <p className="eyebrow text-ink-muted">{dict.trust.kinds[key]}</p>
              <p className="mt-3 flex items-start gap-2 font-medium">
                <BadgeCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {l(claim.title)}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{l(claim.detail)}</p>
              {claim.reference && (
                <p className="mt-3 text-xs text-ink-muted">{t(dict.trust.reference, { reference: claim.reference })}</p>
              )}
              <p className="mt-1 text-xs text-ink-muted">{t(dict.trust.verified, { date: date(claim.verifiedOn) })}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
