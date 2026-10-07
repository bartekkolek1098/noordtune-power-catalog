# NoordTune Power Catalog UX V2 — Review

Base branch:
`fix/catalog-safety-brand-stage3-v1`

Safety dependency head:
`17b941b7c9c4df3b7de8da145c90c08010d771ba`

Figma concept:
https://www.figma.com/design/zKB4LRkT6wj6Cp4ZYcUJSy

## Product goal

Make the catalog easier to understand and convert on a phone without weakening
the technical-safety rules introduced by the catalog-safety branch.

This UX pass does not change tuning figures, pricing policy, matching, canonical
data, RDW behavior, privacy rules, routes or sitemap.

## Changes

### Plate-first hero

The homepage now starts with a simpler conversion message:

- identify the vehicle first;
- show source-backed Stage 1 / Stage 2 information;
- avoid generic guess values;
- provide a clear next action.

On mobile the decorative hero image is hidden so the plate lookup stays fast,
clear and visually dominant.

### Manual selection

The large manual selector is no longer competing with the plate lookup in the
hero. The hero contains one explicit manual-selection CTA and the complete
manual selector follows immediately below the hero.

### Trust messaging

The three benefit cards were rewritten around:

- exact vehicle identity first;
- Stage 1 / Stage 2 evidence instead of generic figures;
- a clear price indication or confirmation request.

### Result priority on mobile

The example result now presents the Stage 1 / Stage 2 cards before the secondary
vehicle-detail panel on narrow screens.

## Localization

Conversion copy was updated consistently in NL, EN and PL.

## Validation

PASS:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test:seo`
- `pnpm test:tuning`
- `pnpm build`
- dedicated browser QA at 320 / 390 / 768 / 1440 px for NL / EN / PL

Browser QA verifies:

- plate lookup visible in the first-screen conversion flow;
- manual selector follows the plate-first flow;
- Stage 1 precedes Stage 2 on mobile;
- no Stage 3+ customer copy;
- no horizontal overflow;
- no console/page errors.

The implementation remains stacked on the catalog-safety branch and must not be
merged independently before PR #22.
