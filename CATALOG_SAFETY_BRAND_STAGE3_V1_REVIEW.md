# Catalog Safety, Branding & Stage 3 Removal V1

Baseline: `22425f174abba0dc84206370fcb311a7e650716e`

## Scope

This branch intentionally makes three customer-facing changes without modifying the canonical 58,586-record dataset:

1. Blocks generated/canonical-estimated numeric Stage 1/2 values from reaching customer DTOs unless the Stage is backed by retained reference or sourced evidence.
2. Removes Stage 3+ from the public customer catalog and SEO publication set while preserving internal historical data for audit/research.
3. Replaces legacy catalog branding assets with the approved NoordTune logo/favicon package used by the main NoordTune site.

## Customer safety

- Public/customer Stage list is now Stage 1 + Stage 2 only.
- Generic/canonical-estimated numeric outputs are stripped at the customer serialization boundary.
- Such configurations remain identifiable/selectable but return confirmation/on-request behavior instead of an invented numeric quote.
- Reviewed/source-backed Stage 1/2 values remain intact.
- Regression explicitly covers the generated Volkswagen 204 hp BiTDI cross-product that internally carried Stage 2 275 hp.
- Internal source/canonical data is not deleted or rewritten.

## Stage 3 removal

- Stage 3+ is no longer rendered in customer vehicle/RDW/reference flows.
- Stage 3+ pages are removed from static generation and sitemap.
- Existing Stage 3+ URLs permanently redirect to the corresponding Stage 2 page.
- Public sitemap changes from 291 to 219 URLs:
  - 3 locale home pages
  - 72 localized vehicle pages
  - 144 localized Stage 1/2 pages
- Internal Stage 3 source/history remains available to audits and future research.

## Branding

Approved logo-pack assets copied from `NoordTune_Logo_Pack/07_WWW` and the main-site SVG branding:

- NoordTune dark header/footer logo
- SVG/ICO/16/32/48 favicons
- Apple touch icon
- Android 192/512 icons
- web manifest

The catalog logo component now uses the same approved SVG family as `noordtune-www`.

## Figma UX V2

A separate editable Figma concept was created for the upcoming UX redesign:

https://www.figma.com/design/zKB4LRkT6wj6Cp4ZYcUJSy

It includes desktop and mobile concepts focused on:
- plate lookup above the fold
- Stage 1 / Stage 2 only
- conservative, evidence-backed output presentation
- clear "on request" states
- stronger mobile conversion path
- simplified trust messaging and CTA hierarchy

The Figma redesign is intentionally not implemented in this branch so the safety/branding changes can be independently reviewed.

## Validation

PASS:
- `pnpm test:tuning`
- `pnpm test:seo`
- `pnpm catalog:audit` — 0 critical groups
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

Build generates 226 static pages and the public sitemap contract is 219 URLs.

No production deployment or merge is performed by this branch.
