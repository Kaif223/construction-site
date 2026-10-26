# CONSTRUKT — construction & architecture website

A multi-page marketing site for a construction company that covers design, construction, finishing, building services and renovation. It is built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict), Tailwind CSS 4 and GSAP.

> **Demonstration content.** CONSTRUKT is a working brand name. The projects are labelled concept studies, the estimator uses illustrative example rates, and the contact details are placeholders. See [Before launch](#before-launch).

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script              | What it does                                                |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Development server                                          |
| `npm run build`     | Production build (prerenders all 36 pages)                  |
| `npm start`         | Serve the production build                                  |
| `npm run typecheck` | Generate route types, then `tsc --noEmit`                   |
| `npm run lint`      | ESLint (Next core-web-vitals + TypeScript rules)            |
| `npm test`          | Unit tests for the estimator and inquiry validation (`node --test`) |
| `npm run check`     | All of the above, in order                                  |

Copy `.env.example` to `.env.local` to set the public site URL and the inquiry webhook.

## Routes

`/` · `/services` · `/services/[slug]` (9 disciplines) · `/projects` · `/projects/[slug]` (8 concept projects) · `/about` · `/process` · `/materials` · `/estimate` · `/contact` · `/faq` · `/privacy` · `/terms` · custom 404 · `/sitemap.xml` · `/robots.txt` · `POST /api/inquiry`

## Architecture

```
src/
  app/                  Routes (Server Components by default), sitemap, robots, API route
  components/
    layout/             Header + mobile menu, footer, MotionProvider, custom cursor
    home/               Hero, services index, project reel, construction journey, materials strip
    sections/           Reusable page sections (process timeline, FAQ, CTA, testimonials, legal)
    estimate/           Budget estimator UI
    contact/            Project inquiry form
    projects/, services/, materials/, ui/
  config/site.ts        Business details, navigation, inquiry endpoint
  data/                 Services, projects, content (journey, process, materials, FAQ…), estimator rates
  lib/                  estimate.ts (pure calculator), inquiry.ts (shared validation),
                        inquiry-client.ts, gsap.ts (on-demand GSAP + hooks), slugify.ts
  hooks/                SSR-safe browser storage / URL helpers
public/images/          Self-hosted imagery + CREDITS.json
tests/                  node:test unit tests
```

- **Data-driven.** Services, projects, materials, FAQs, process steps and journey stages all render from `src/data`. Add a service or project there and its page, links and sitemap entry follow.
- **Rendering.** Every page is prerendered. The two dynamic routes read `params` inside `<Suspense>`, so with Partial Prefetching their shared shell (and a loading state) is prefetched. Unknown slugs render the custom not-found page with `noindex`. They return status 200, because streaming has already started by then.

### Motion system

- **Scroll entrances.** Markup opts in with `data-reveal="up | fade | lines | mask | stagger | rule"`. `MotionProvider` uses one `IntersectionObserver` to add `.is-revealed`, and CSS transitions in `globals.css` do the animating. Easings are the `--ease-out-expo` / `--ease-arch` tokens.
- **Hero.** The entrance is pure CSS keyframes, so it starts at first paint, before hydration.
- **Scroll-linked effects.** The pinned project reel, the pinned construction journey, parallax and the hero drift use GSAP ScrollTrigger. GSAP is **dynamically imported** through `useScrollMotion` / `loadGsap`, and only on screens of 1024px and up (parallax from 768px) with motion allowed. Each effect lives in a `gsap.context` and is reverted on unmount or route change.
- **Without motion.** Hidden pre-animation states apply only under `html.motion-ready`. An inline script adds that class when JavaScript runs and `prefers-reduced-motion` is not set. Reduced-motion and no-JS visitors get fully visible, static content. Every interactive section also works without scroll animation, as tabs, scroll-snap or buttons.
- **Hidden states start at `opacity: 0.01`, not 0.** Chrome ignores content first painted at opacity 0 when picking the Largest Contentful Paint element.

## Integrations

| Feature | Status | To finish |
| --- | --- | --- |
| Project inquiry | `POST /api/inquiry` validates with the same rules as the form (`lib/inquiry.ts`), rejects bodies over 20 KB and filters a honeypot field. | Set `INQUIRY_WEBHOOK_URL`. Inquiries are forwarded as JSON with an `Idempotency-Key` header. **Until then the form says plainly that nothing was sent** and offers "open in email app" or "copy summary". Consider rate limiting or a bot challenge on the host. |
| Estimate → inquiry handoff | Works client-side via `sessionStorage`. | — |
| Analytics / cookies | None installed. | Update `/privacy` before adding any. |
| Testimonials | `data/content.ts → testimonials` is empty by design. | Add only verified, permitted client feedback. |

## Before launch

1. **Business details.** Fill in `src/config/site.ts`: phone, address, service area, hours, social links. The email is currently `hello@construkt.example`, a reserved domain.
2. **Estimator rates.** `src/data/estimator.ts` holds illustrative example rates, not market prices. Replace them with validated rates for the markets you serve, and set the currency there.
3. **Projects.** Replace the concept projects in `src/data/projects.ts` with real case studies and photography. Change `status` and remove the "Concept project" labelling only when they are genuine.
4. **Imagery.** Photos are stock (Unsplash License, or CC0 via Openverse), self-hosted under `public/images`, and credited on `/terms#imagery` from `public/images/CREDITS.json`. Swap in company photography using the same file paths.
5. **Legal.** `/privacy` and `/terms` are templates that need review by legal counsel.
6. **Credentials and structured data.** Add licences or certifications only once they can be verified. LocalBusiness structured data is intentionally omitted until a real address exists. Breadcrumb and FAQ structured data are included.

## Quality status (measured locally)

Lighthouse 12, against `next start`:

| Page | Perf (mobile) | Perf (desktop) | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| Home | 86–88 | 99 | 97* | 100 | 100 |
| Services | 94 | — | 100 | 100 | 100 |
| Contact | 90 | — | 100 | 100 | 100 |
| Project detail | 85 | — | 97* | 100 | 100 |

\* The remaining accessibility deductions are colour-contrast flags on below-the-fold text that is still in its pre-reveal state (opacity 0.01) when Lighthouse captures the page. Once revealed, the text meets AA contrast. Mobile LCP is about 3–3.5 s under Lighthouse's simulated slow 4G and 4× CPU throttle.

Also verified: no horizontal overflow on 14 routes at 320, 390, 768 and 1024px. No broken internal links or anchors across 28 crawled pages. Content is fully visible with reduced motion and with JavaScript disabled. All form inputs are labelled. The keyboard works for the mobile menu (Escape, focus return, inert background), the gallery dialog, the journey tabs (arrow keys) and the pinned reel (focused cards scroll into view).
