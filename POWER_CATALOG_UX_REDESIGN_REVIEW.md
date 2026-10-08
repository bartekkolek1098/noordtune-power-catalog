# NoordTune Power Catalog — mobile-first editorial redesign review

Status: **preview-only**, not released to production.
Base production commit: `0c0bfb9b552ae18c06b50163feed525b2ead96d4`.
Separate work branch: `feature/power-catalog-mobile-ux-20261008`.
Immutable rollback anchor: `backup/power-catalog-before-redesign-2026-10-08`.

Editable UI mockups: [NoordTune UX Refresh — Figma](https://www.figma.com/design/obPkGObhGcmNaPqgLxnKr5).

## Goals and visual direction

1. Put the core task **enter a Dutch registration → see factory data → review conditional Stage 1 → ask for advice** above decorations, within an accessible mobile screen. The manual make/model/year/engine search is a clear second path, directly below.
2. Replace loud faux racing graphics, scanlines, carbon backgrounds and glow gradients with graphite, calm typography, restrained brand red, distinct RDW yellow plates and honest technical text.
3. Make one-hand mobile use practical: simplified sticky header, no horizontal navigation ribbon, language selector, accessible mobile menu, 48px or larger touch targets, fixed bottom search/consultation actions and safe-area padding.
4. Keep the existing **verified engine matching, quotations, prices, disclaimers, RDW API, localized content, WhatsApp and vehicle data** unchanged. No anonymous ECU can be guaranteed by RDW, and no new Stage 2 / Stage 3 numbers are invented.
5. Maintain site crawlability: the existing **NL/EN/PL URLs, metadata, canonicals, hreflang, JSON-LD, sitemap and internal vehicle links** are not altered. One real H1 and meaningful section headings remain, and no decorative image is required for the first content interaction.

## Changed surfaces

- `src/app/[locale]/page.tsx`: editorial RDW-first intro, manual discovery, indexed vehicle links and scoped Stage 1 example; all marketing-service panels replaced with catalog-specific content.
- `src/app/globals.css` + `src/app/editorial-v2.css`: preserve the stable base design and isolate iteration-2 photographic styling for a low-risk UI revert, accessible focus states, responsive spacing, touch targets and reduced-motion support.
- `src/components/hero-photo.tsx`: two responsive uses of one accessible, credited, locally optimized photograph — a desktop editorial panel and a compact below-form mobile strip.
- `src/components/catalog-header.tsx` and `language-switcher.tsx`: single clean desktop nav, compact mobile menu, no off-screen menu ribbon.
- `src/components/plate-lookup.tsx` and `manual-selector.tsx`: visual styling and input labeling; data logic and networking unchanged.
- `src/components/mobile-action-bar.tsx` plus vehicle/stage pages: faster conversion action on mobile, without duplicate floating WhatsApp controls.
- `src/components/vehicle-detail.tsx`, shared buttons, colors: visually consistent result cards without changing power, torque or pricing formulas.
- `src/data/homepage.ts`: shorter, genuinely informative NL/EN/PL introductory copy; no SEO metadata rewrites.

## Iteration 2 — premium photography and shorter mobile journey

- **Hero:** a real, subtly desaturated headlight photograph alongside a three-line typographic statement on desktop. On mobile, the registration form stays above the photographic strip, so the image cannot push the primary lookup out of the first viewport.
- **Technical process:** a separately photographed engine inspection reinforces the procedure instead of using generic icons or fictional dynamometer curves. Both photographs are labelled illustrative and never represented as NoordTune customer work.
- **Manual search:** the brand/model/year/engine selectors appear ahead of popular vehicles on mobile unless a quick-search query is active (in that case, search results appear first). The quick-search and RDW lookup each wait for actual React hydration in browser QA.
- **Vehicle pages:** secondary cross-site button is hidden in the mobile hero (still available at desktop and in the content), retaining the primary return link and making output data reachable sooner. Source/ECU warnings remain visible; factory, Stage 1 and gain calculations are unchanged.
- **Media provenance:** photo by [Ryan Collins](https://unsplash.com/photos/close-up-of-a-dark-car-with-headlights-on-C_wWePb8dXo) in `public/brand/editorial/car-headlight-unsplash-ryan-collins.jpg` (142 KB); photo by [Dextar Studio](https://unsplash.com/photos/mechanic-inspecting-a-car-engine-with-hood-open-erWc6mrOq_I) in `public/brand/editorial/engine-inspection-unsplash-dextar-studio.jpg` (181 KB). Both are listed as free to use under the [Unsplash License](https://unsplash.com/license) at time of inclusion, and photographer credits appear directly beside the images. Review trademark/person publicity rights before using the photos outside this contextual design.
- **Figma:** the original 7/10 concepts remain alongside two newer, editable V2 mobile/desktop compositions; the V2 photo layers are real Figma image fills, not screenshots of the finished UI.

## Iteration 3 — corporate header parity, desktop composition and catalog-specific SEO

- **Corporate parity:** compared live `www.noordtune.nl/nl` and its `src/components/header.tsx`, `mobile-menu.tsx`, `language-switcher.tsx` and `src/content/site.ts`. Catalog now uses the same genuine SVG logo (SHA-256 matches), 10 nav destinations and ordering, locale flags NL/EN/PL, approx. 73px mobile / 87px desktop header height, uppercase compact desktop nav, and full-screen mobile menu. The catalog is the active destination; the logo and corporate nav lead to localized `www.noordtune.nl` pages, while locale switching remains in the current catalog path.
- **One hero photo:** desktop is intentionally photo-led, but the mobile-only duplicate is forced off above 1023px. A 36px separation between the desktop photograph and the plate card prevents merged cards. Mobile retains the previously approved photo below the RDW form.
- **Graphite manual selector:** replaced the pale/ivory outer background with a subtle dark neutral block. Form fields and labels still have strong contrast; the page remains accessible and free of horizontal overflow.
- **Purpose-specific home sections:** replaced the cramped BMW 3-column sales calculator and vehicle services price grid with a compact **190pk / 400Nm → Stage 1 220–225pk / 440–460Nm (indicative)** catalog example, readable vehicle cards, a disclosure list for additional curated engines, a five-question RDW/source/ECU FAQ, and a clear hand-off to the main NoordTune site. No general workshop-service descriptions or guaranteed dyno claims on the catalog landing page.
- **SEO:** homepage metadata and content now explicitly describe `power.noordtune.nl` as a standalone **CollectionPage** backed by the main `www.noordtune.nl` provider. The canonical/hreflang remain on the power subdomain; all 219 public URLs and 24 curated vehicle pages remain linked. NL/EN/PL vehicle/stage SEO explanation copy now explicitly covers scope, estimate limitations, Stage 2 hardware checks and the source of the workshop quotation.
- **Quality gate:** the mobile/SEO suite asserts 10-item header parity, flags, full-screen navigation, desktop photo/card gap, no second desktop hero image, original RDW figures, localized source copy, collection schema, all curated profile links, vehicle details and Stage 1 SEO route at 320/390/768/1440px. Rebuild and focused SEO QA required before review.

## Verification and acceptance

- `pnpm typecheck` and `pnpm exec eslint src`: zero errors.
- `pnpm build`: full 226 page Next.js production build.
- `node scripts/qa-ux-mobile-seo.cjs`: NL 320/390/768/1440, EN/PL 390; synthetic RDW lookup in each locale, two vehicle page viewports, no horizontal scrolling or browser runtime errors, mobile menu/locale, one H1, canonical/hreflang/JSON-LD.
- `pnpm test:seo`: existing 219 public routes, multilingual metadata and internal crawl links.
- `pnpm test:tuning`: unchanged tuning resolver, Stage 1 source scopes, pricing, privacy, field units and deterministic 3,000-vehicle frozen RDW verification.
- The **Figma design is an editable prototype of the UI**, not a replacement for running browser/SEO tests. The actual branch and immutable Preview must remain source of truth.

## Release and restore procedure

Before any merge, inspect the **protected Vercel preview for the exact feature-branch commit**, compare 320/390/1440px screenshots, and obtain business/design approval. Preview must be READY. Do not disable Vercel deployment protection for review. The live URL `https://power.noordtune.nl` stays on the previous release until merging is authorized.

The original version has its own immutable Git tag and commit. To inspect it without touching production:

```powershell
git fetch origin --tags
git switch -c review/pre-redesign backup/power-catalog-before-redesign-2026-10-08
```

If a future redesign merge was approved but must be reversed, make a **new revert commit/PR** on the then-current `main` branch, or redeploy the known-good release from the rollback tag. Do not force-push `main`, and do not restore old RDW data changes unrelated to the redesign. Verify the Vercel production alias commit after rollback.

## Excluded from this PR

- New vehicle tuning values, new engine match logic, RDW API/registration persistence changes or pricing rewrites.
- Removing canonical routes, SEO copy-farming, automatic claims about guaranteed Stage 1 outputs, or artificial reviews / dyno results.
- Updating the separate main `noordtune-www` site. This design concerns `power.noordtune.nl` only.
