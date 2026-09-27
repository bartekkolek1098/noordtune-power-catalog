# Catalog SEO Polish V1 Review

## Scope and baseline

- Branch: `feature/catalog-seo-polish-v1`
- Released `main` baseline: `34c60d2a88296d33494a12bf746e26e9045afb20`
- Scope: sitemap dates, public business data, localized metadata, crawl links, structured-data consistency and verification only.
- No catalog records, matching rules, output figures, prices, services, vehicle IDs, locale routes, lookup/configurator behavior, deployment settings or production state changed.

## Before and after

| Area | Before | After |
| --- | --- | --- |
| Sitemap dates | Every entry received the request/build time from `new Date()` | `lastmod` is omitted because the catalog has no reliable per-entry content modification date |
| Public location | Unconfirmed `A. Vogelstraat 1, 9406 XD Assen` in the footer and provider JSON-LD | Localized `Assen, Nederland`, `Assen, Netherlands` and `Assen, Holandia`; JSON-LD keeps only `Assen` and country `NL` |
| Title branding | Vehicle and Stage generators included `NoordTune`, then the root template added `NoordTune Power Catalog` again | Page titles are unbranded inputs with one `| NoordTune` suffix; final titles are unique and at most 61 characters |
| Crawl links | Existing popular cards linked 4 of the 24 curated vehicle pages | A visible compact lower-page group links the remaining 20; all 24 vehicle pages are reachable from each localized homepage |

Representative rendered metadata:

- NL home: `Chiptuning catalogus & RDW-check | NoordTune`
- EN vehicle: `BMW 3 Serie 320d tuning & Stage 1 | NoordTune`
- PL custom Stage: `Audi A4 B9 2.0 TDI Stage 3+ chiptuning | NoordTune`
- Custom Stage 3 descriptions use `Maatwerk / hardware-afhankelijk`, `Custom / hardware-dependent` or `Indywidualnie / zależnie od osprzętu`; they do not publish a numeric Stage 3 output.

## Canonical, language and crawl verification

- Local production crawl: 291/291 sitemap URLs returned HTTP 200 with one same-language production canonical.
- Hreflang: 873/873 expected reciprocal links passed, covering NL, EN and PL on every sitemap page.
- No sitemap URL, canonical, hreflang or metadata field contains a preview host or lookup query string. No real registration was supplied; the lookup-privacy regression passed.
- Titles and descriptions are unique across all 97 pages in each locale.
- Each curated vehicle page links all three of its Stage pages, so the homepage-to-vehicle-to-Stage path covers all 72 Stage definitions and all 216 localized Stage pages.

## Structured data

- Home and Stage provider objects share the verified NoordTune name, main-site URL, telephone, email, Assen locality and NL country code.
- Breadcrumb items use real public URLs and end at the page canonical.
- Stage `Offer` JSON-LD continues to use `resolveStageQuote()` and `quoteOfferFields()`, matching the visible VAT-inclusive indication. On-request/custom work has a description only and no fabricated numeric price.
- The provider intentionally omits street, postcode, coordinates, ratings, reviews and price range. Without a confirmed complete postal address, Google LocalBusiness rich-result eligibility is limited; no eligibility claim is made.

## Product-data and route invariants

`pnpm catalog:audit` confirms:

- 24 curated public vehicles
- 58,586 canonical selector/RDW vehicles
- 175,758 canonical Stage definitions
- 216 localized curated Stage pages
- 291 sitemap URLs
- 0 critical issue groups
- 0 client imports of the server catalog

The diff contains no changes under `src/data`, `messages`, or deployment configuration. The audit's 18 existing warning groups remain warnings about estimated/placeholder catalog evidence and legacy canonical data; this task does not promote those facts.

## Validation

- `pnpm catalog:audit` — passed; 0 critical issue groups.
- `pnpm test:seo` — passed; 291 unique routes, localized metadata, honest offers and 24/24 curated vehicle links.
- `pnpm lint` — passed.
- `pnpm typecheck` — passed.
- `pnpm build` — passed; 298 static/generated app pages completed.
- `pnpm qa:seo` — passed; 291-page bounded-concurrency production crawl plus browser checks at 320, 390, 768 and 1440 px.
- `pnpm test:tuning` — passed, including 672 quote-surface assertions, lookup privacy, customer navigation and contact-message consistency.

Browser QA used no real registration. It confirmed the existing plate lookup and manual selector, the lower link group, localized footer, a real vehicle-page click, an inline FAQ action, and one vehicle plus one Stage page per locale.

## Search Console owner checklist

No Search Console account or property was changed. After production release, the owner can:

1. Confirm the `power.noordtune.nl` property and ownership status.
2. Submit `https://power.noordtune.nl/sitemap.xml` and confirm that Google reads 291 URLs without `lastmod` warnings.
3. Inspect `/nl`, `/en` and `/pl`, plus one vehicle and one Stage URL per locale.
4. Confirm the selected canonical and reciprocal language alternates in URL Inspection.
5. Review Page indexing for duplicate, soft-404 and crawled-currently-not-indexed groups.
6. Review Breadcrumb and merchant/service enhancement reports without assuming AutoRepair rich-result eligibility.
7. Request indexing for a small representative set only after this branch reaches production, then monitor coverage and Core Web Vitals.

## Known limitations and follow-up

- The root layout still emits server-side `lang="nl"`; the existing inline script switches it to EN or PL in the browser. A server-correct language refactor needs separate layout work and was intentionally not attempted here.
- Six existing popular-card targets are legacy detail URLs outside the curated 24-vehicle sitemap set. They remain unchanged because this task protects existing product navigation and vehicle URLs.
- A complete public street/postcode is still unconfirmed, so it remains absent from runtime UI and JSON-LD.
- Search Console submission and inspection require the owner's account and remain an owner-run release step.
