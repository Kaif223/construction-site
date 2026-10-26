# CONSTRUKT — UAE-first construction website

A bilingual (English / Arabic, RTL) website for a construction and property-services brand, launching in the **United Arab Emirates** and structured to expand to further markets through configuration. Built with Next.js 16 (App Router, Cache Components, Partial Prefetching), React 19, TypeScript (strict), Tailwind CSS 4 and on-demand GSAP.

> **Demonstration content.** CONSTRUKT is a working brand name. Projects are labelled concept studies, estimator rates are illustrative and hidden by default, service availability is "confirmed on request", contact numbers are unset, and the Arabic translation is a draft awaiting professional review. See [Before launch](#before-launch).

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en-ae (or /ar-ae for Arabic browsers)
```

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Develop, build (105 prerendered pages), serve |
| `npm run typecheck` | Route types + `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (`node --test`): estimator, quote validation, contact links, rate limiter, i18n, config and data integrity |
| `npm run check` | All of the above |

Copy `.env.example` to `.env.local` for the site URL and inquiry webhook.

## Routes

Every page exists per locale: `/en-ae/…` and `/ar-ae/…`. Unprefixed URLs (including old links such as `/services`) redirect via `src/proxy.ts`, choosing a saved preference, then `Accept-Language`, then English.

`/` · `/services` · `/services/[slug]` (19 categories, 136 services with anchors) · `/projects` · `/projects/[slug]` · `/process` · `/planning` (UAE planning guide) · `/materials` · `/estimate` · `/quote` (7-step quotation) · `/contact` · `/about` · `/faq` · `/privacy` · `/terms` · localized 404 · `/sitemap.xml` (with hreflang) · `/robots.txt` · `POST /api/inquiry`

## Architecture

```
src/
  config/markets.ts      Market config: currency, units, emirates, contact, availability, tax, budgets, uploads, trust, SEO, legal
  config/site.ts         Brand-wide settings and navigation keys
  i18n/                  Locales, dictionaries (en, ar), server getI18n(), client useI18n(), plural rules
  content/               Localized getters + Arabic overlays + translation status
  data/                  English source content, rate tables (data/rates), planning guide and regulatory notes
  lib/                   estimate.ts, quote.ts (shared validation), contact.ts (WhatsApp/tel/mailto), rate-limit.ts, seo.ts, gsap.ts
  components/            layout, home, quote, estimate, contact, projects, services, sections, ui
  app/[locale]/          All pages (root layout sets lang/dir)
  app/api/inquiry/       Quotation endpoint
  proxy.ts               Locale redirects
docs/international.md    Markets, languages, RTL conventions, translation workflow
docs/customer-portal.md  Future portal integration plan (not implemented)
```

Key behaviours:

- **Configuration, not conditionals.** Country-specific values come from `markets.ts`. UAE is the only enabled market; a disabled `sa` entry shows the shape of the next one. Disabled markets produce no routes, sitemap entries or UI.
- **Honest unknowns.** `null` contact details render as "to be confirmed"; WhatsApp and call buttons appear only when a valid E.164 number is configured; trust sections render only verified claims; emirate coverage and service availability default to "confirmed on request".
- **Estimator.** Rate tables are separate (`data/rates`) with `status`, `reviewedOn`, unit basis, inclusions and tax flag. Example rates are never shown by default — visitors can opt into a stamped preview. Missing rates return "no rates" instead of a number. No VAT is applied. AED is formatted per language; sq ft and m² convert exactly.
- **Quotation workflow.** Seven steps with per-step validation, conditional fields, estimator handoff, prefill from service links, document checks (type/size/count, never uploaded), duplicate-submission guard and a confirmation that only says "received" when the backend confirms delivery.
- **Localization.** `ar` is typed against `en`; tests verify full content coverage and placeholder parity. Arabic uses IBM Plex Sans Arabic / Noto Kufi Arabic, logical CSS, mirrored icons and Arabic plural rules. Arabic pages show a draft-translation notice; legal pages show English with an Arabic notice.

## Integrations

| Capability | Status | To finish |
| --- | --- | --- |
| Quotation delivery | `POST /api/inquiry` validates (shared schema), rate-limits per IP (in-memory), rejects >20 KB bodies, filters a honeypot. Forwards JSON with `Idempotency-Key` to `INQUIRY_WEBHOOK_URL` when set. | Set the webhook (CRM, email service, automation). Add edge/WAF rate limiting and a bot challenge for production; the in-memory limiter is per instance. |
| Document uploads | UI validates files locally and states they are not sent. | Signed-URL upload service with private storage and virus scanning; set `uploads.endpoint`, implement the upload step (see `docs/customer-portal.md`). |
| WhatsApp / phone | Link builders ready and tested. | Set `contact.whatsapp` / `contact.phone` in `markets.ts` (E.164). |
| Lead management, scheduling, CMS, analytics | Not implemented. | Analytics must exclude form contents and update `/privacy` (consent where required). |
| Customer portal | Not implemented by design. | See `docs/customer-portal.md`. |

## Before launch

1. **Business details** in `markets.ts`: email, phone, WhatsApp, address, hours, emirate coverage, service availability (`available` / `partner` / `not-offered`).
2. **Verified credentials** in `trust` (registration, licences, insurance, warranty…), each with `verifiedOn`.
3. **Rates**: replace `data/rates/ae-example.ts` with reviewed rates, set `status: "verified"` and `reviewedOn`; confirm tax treatment (`tax.rate`, `reviewed`) against official guidance.
4. **Regulatory notes** (`data/planning.ts`): have them reviewed; currently `reviewStatus: "unreviewed"`.
5. **Arabic**: professional translation review, then set `translation-status.ts` to `reviewed`.
6. **Legal**: complete and review `/privacy` and `/terms`, including the applicable data-protection law; add Arabic legal translations.
7. **Projects and imagery**: replace concept projects and stock photography (`public/images/CREDITS.json`).

## Verification (local)

Verified locally with the production build: typecheck, lint, 34 unit tests and build pass; all routes return 200 in both locales with real 404s for unknown paths; redirects and language negotiation work; no horizontal overflow on 15 routes × 2 languages × 4 widths (320–1024 px); the quotation flow was exercised end to end in the browser (validation, conditional fields, unit conversion, document checks, demo confirmation); the estimator shows no figures by default and formats AED in Arabic. See the final report for Lighthouse results.
