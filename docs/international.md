# Markets, languages and localization

## How it fits together

| Concern | Where | Notes |
| --- | --- | --- |
| Market settings | `src/config/markets.ts` | Currency, units, regions (the seven emirates), contact details, service availability, tax, budget bands, uploads, trust claims, SEO, legal. `null` = not supplied yet; the UI never invents a value. |
| Locales | `src/i18n/locales.ts` | `<language>-<market>`, e.g. `en-ae`, `ar-ae`. Derived from enabled markets only. |
| Routing | `src/app/[locale]/…`, `src/proxy.ts` | `[locale]` is the root layout (sets `lang`/`dir`). The proxy redirects unprefixed URLs using a saved choice (`construkt-locale` cookie), then `Accept-Language`, then `en-ae`. |
| Interface strings | `src/i18n/dictionaries/{en,ar}.ts` | `ar` is typed against `en`, so a missing key fails the build. Placeholders use `{name}`. |
| Content | `src/data/*` (English source) + `src/content/ar/*` | Translations overlay the English data by id; missing fields fall back to English. `tests/data.test.ts` checks every id is covered. |
| Rates | `src/data/rates/*` | Per-market rate tables with `status` (`example`/`verified`) and `reviewedOn`. |
| Regulatory notes | `src/data/planning.ts` → `regulatoryNotes` | Kept apart from marketing copy, with sources, `lastChecked` and `reviewStatus`. |
| Server access | `getI18n()` in `src/i18n/server.ts` | Reads the locale with `next/root-params`; works in any Server Component. |
| Client access | `useI18n()` in `src/i18n/client.tsx` | Only the active language's dictionary is sent to the browser. |

## Adding a market (e.g. Saudi Arabia)

A disabled `sa` entry already exists in `markets.ts` as a template.

1. Fill in the market: contact details, regions and their coverage, enabled service categories and availability, budget bands, tax settings, legal notes.
2. Add a rate table in `src/data/rates/` (or leave `rateTable: null` — the estimator will then only offer a quotation request).
3. Add regulatory notes for the market in `src/data/planning.ts`, citing official sources.
4. Review every page for market-specific copy. Most text is market-neutral, but strings that name the UAE (`meta.*`, planning guide) need market variants before launch — add them to the dictionary and select by `market.id`.
5. Set `enabled: true`. Routes (`/en-sa/…`, `/ar-sa/…`), sitemap entries and hreflang alternates appear automatically.

Do not enable a market whose services, prices, contact details and legal content have not been confirmed.

## Adding a language

1. Add the code to `LanguageCode` in `markets.ts` and to the market's `languages`.
2. Create `src/i18n/dictionaries/<code>.ts` typed as `Dictionary`, and register it in `dictionaries/index.ts`.
3. Add content overlays under `src/content/<code>/` and wire them in `src/content/index.ts`.
4. If it is right-to-left, add it to `rtlLanguages` in `locales.ts`.
5. Add its entry to `src/content/translation-status.ts` as `draft` until reviewed.

## Translation workflow

- English in `src/data` and `dictionaries/en.ts` is the source of truth.
- Arabic was drafted during development and is **not professionally reviewed**. `translation-status.ts` marks it `draft`, which shows a notice on every Arabic page.
- Legal pages are shown in English with an Arabic notice until a legal translation exists.
- Recommended process: export the `ar` files to a translation tool or agency, have a professional translator and a construction-industry reviewer check terminology, re-import, then set the status to `reviewed` with a date.
- Do not machine-translate regulatory or legal content without expert review.

## RTL conventions

- Use logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `border-s`) instead of left/right.
- Directional icons (arrows) get the `icon-dir` class, which mirrors them in RTL.
- Hover nudges use `translate-x-[calc(Xrem*var(--dir))]`; `--dir` is `1` in LTR and `-1` in RTL.
- Latin fragments inside Arabic (codes, emails, phone numbers, prices) use `ltr-isolate`.
- Arabic text never gets letter-spacing or uppercase transforms (see `globals.css`).
- Spatial comparisons (the before/after slider) stay left-to-right on purpose.
