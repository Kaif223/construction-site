# Future customer portal — integration plan

The public website deliberately has **no** login, dashboard or customer records. This document records where a portal would connect once its backend, authentication, data model and authorization rules are defined. Nothing here is implemented.

## Capabilities in scope later

Customer accounts · project status and milestones · progress photographs · document access · quotation history · invoices · appointment scheduling · project messages · approval workflows.

## Prerequisites (must exist first)

1. **Identity** — an authentication provider with MFA, password reset and account recovery. Customers, staff and partners as separate roles.
2. **Data model** — Customer, Project (linked to market and region), Quotation (versioned, with scope, exclusions, payment terms, tax treatment), Milestone, Document, Invoice, Appointment, Message, Approval.
3. **Authorization** — every record scoped to a project; customers see only their projects; partners only their assigned packages; all checks enforced server-side.
4. **Document storage** — private object storage with short-lived signed URLs, virus scanning, size and type validation, no public buckets.
5. **Audit and retention** — access logs, retention periods and deletion procedures agreed with legal counsel for each market.

## Where it plugs into this codebase

| Website piece | Today | Portal-era change |
| --- | --- | --- |
| `POST /api/inquiry` | Validates, rate-limits, optionally forwards to `INQUIRY_WEBHOOK_URL`. | Create a Lead/Quotation record in the backend instead; return its real reference. |
| Quote wizard documents step | Validates files locally; never uploads. | Request a signed upload URL per file from the backend, upload directly to private storage, attach document ids to the request. Set `uploads.endpoint` in the market config. |
| `src/lib/quote.ts` | Shared validation schema. | Reuse server-side in the backend so both enforce identical rules. |
| Header | No account link. | Add "Sign in" only when the portal is live. |
| Routing | `src/app/[locale]/…` static pages. | Portal under `src/app/[locale]/(portal)/account/…`, rendered dynamically behind authentication, excluded from the sitemap and `noindex`. |

## Explicitly out of scope until then

No simulated dashboards, placeholder login screens or fake project timelines — they would suggest customer records exist when they do not.
