# NoordTune Power Catalog UX V2 — Review

Base production main after Taxonomy V2:
`e62a2f0eaf43c248b481798e4ad91347a70bf831`

Branch:
`feature/catalog-ux-v2-mobile`

Figma concept:
https://www.figma.com/design/zKB4LRkT6wj6Cp4ZYcUJSy

## Product goal

Make the Power Catalog fast to understand and convert on a phone while keeping
NoordTune.nl visibly primary and preserving every catalog-safety boundary.

This UX pass does not generate tuning figures, widen Stage eligibility, change
pricing policy, expose the 58,586-row server catalog, add SEO pages or alter RDW
privacy behavior.

## Current UX

### Plate-first homepage

The homepage starts with vehicle identification rather than technical detail.

- compact mobile header linked back to NoordTune.nl;
- concise Stage 1 / Stage 2 positioning without generic guess values;
- RDW plate input is the dominant first action;
- on 320–390 px viewports the plate field begins before 460 px;
- manual selection follows as the fallback path;
- the three supporting trust cards are deferred on phone widths;
- sticky mobile actions keep plate lookup and WhatsApp available.

### Real selector taxonomy

The branch includes the merged Taxonomy V2 production layer.

- 4,592 real discovery configurations;
- generated model × trim cross-products are suppressed where taxonomy covers;
- taxonomy-only vehicles remain on-request;
- no new SEO pages are created;
- Stage 3 remains absent from the customer catalog.

### Vehicle detail hierarchy

Vehicle pages prioritize the decision path before secondary technical detail.

- compact mobile hero;
- Stage 1 before Stage 2;
- Stage 2 remains honest about on-request scope where evidence is insufficient;
- ECU-family detail is not placed in the mobile conversion hero;
- the secondary NoordTune.nl/chiptuning CTA is hidden from the mobile hero;
- sticky quote / WhatsApp actions remain available;
- range-based Stage 1 output is presented as separate stock / Stage / gain values;
- derived gain ranges no longer collapse to an empty dash;
- the comparison chart labels power and torque explicitly and uses separate Y axes.

## Localization

Conversion hierarchy and copy are implemented in NL, EN and PL.

## Validation

PASS on the integrated branch:

- `pnpm test:tuning`
- `pnpm test:seo`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- local production browser QA at 320 / 390 / 768 / 1440 for NL / EN / PL
- BMW 320d mobile vehicle-detail QA

Browser QA verifies:

- NoordTune.nl remains the primary company-site destination;
- plate lookup stays inside the mobile first-screen threshold;
- manual selector follows the plate-first flow;
- Stage 1 precedes Stage 2;
- no Stage 3+ customer copy;
- no horizontal overflow;
- no console/page errors;
- mobile sticky conversion controls remain usable.

## Release gate

Draft until the latest pushed head has a successful Vercel Preview and that exact
Preview tree passes fresh browser QA. Do not merge from local-only QA.
