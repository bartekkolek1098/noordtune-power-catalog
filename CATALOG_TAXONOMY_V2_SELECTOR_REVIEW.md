# Catalog Taxonomy V2 Selector Review

Baseline production main:
`61daa56da6582eac5b8feb9a5fef50810162e2ce`

Branch:
`feature/catalog-taxonomy-v2-selector`

## Purpose

Replace customer-facing manual/search discovery based on generated model × trim
Cartesian products with an evidence-preserving vehicle taxonomy.

This is the first implementation step toward a broad competitor-level catalog.
It does **not** claim that every discovered vehicle already has an approved
NoordTune Stage 1 / Stage 2 target.

## Discovery source

V-Tech public configurator taxonomy was used only to discover vehicle
make/model/generation/year/engine configurations.

Snapshot imported:

- 4,592 normalized unique configurations
- 55 normalized brands
- 438 make/model families

The tracked taxonomy retains the public source URL for every row.

Important boundary:

- V-Tech PowerChip gains are not imported as NoordTune remap values.
- taxonomy discovery does not identify an installed ECU or TCU.
- taxonomy discovery does not create an SEO page.
- taxonomy discovery does not create an automatic numeric quote.

## Selector behavior

Where the real taxonomy covers a make/model/year:

- brand → model → year → engine selection uses taxonomy configurations;
- old generated canonical cross-products are suppressed from that customer selector;
- quick search uses public reviewed pages, retained references and taxonomy rows;
- taxonomy-only rows return `on-request`;
- selecting a taxonomy-only row directs the customer to confirm the vehicle with
  the RDW plate flow instead of presenting generated tuning numbers.

Legacy generated rows remain internal for compatibility/audit while the full
database rebuild is in progress.

## Reproduced customer-risk case

The old canonical generator contains:

`Volkswagen Golf 2.0 BiTDI 204 hp / 450 Nm`

with internally generated values:

- Stage 1: 245 hp
- Stage 2: 275 hp

Taxonomy V2 does not present that cross-product as a 2019 Golf configuration.

Regression result:

- Volkswagen → Golf → 2019: no 2.0 BiTDI 204 row
- quick search `Volkswagen Golf 2.0 BiTDI 2019`: no generated BiTDI result
- Volkswagen → Transporter → 2019: genuine 204 KM taxonomy configurations remain discoverable
- quick search `Volkswagen Transporter 204`: genuine taxonomy result remains discoverable

This fixes the discovery path that could lead a customer toward an incompatible
generated family while preserving legitimate 204 hp Volkswagen applications.

## Product boundaries

Unchanged:

- canonical server-side records: 58,586
- canonical Stage definitions: 175,758
- public SEO vehicles: 24
- public Stage SEO pages: 144
- sitemap URLs: 219
- Pricing V2 schedules
- Stage 1 / Stage 2 evidence policy
- RDW lookup privacy
- public route structure
- NoordTune domain/deployment settings
- client imports of server catalog: 0

The taxonomy JSON is a compact selector discovery layer. It is not the canonical
tuning-output dataset.

## Validation

PASS:

- `pnpm test:tuning`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm catalog:audit` — 0 critical groups
- `pnpm test:seo`
- `pnpm build`
- `node scripts/qa-selector-taxonomy-v2-browser.cjs`

Browser/API QA confirms:

- manual selector is taxonomy-backed;
- generated Golf BiTDI 204 is absent;
- legitimate Transporter 204 remains selectable;
- taxonomy-only items are on-request;
- customer must confirm via RDW before a tuning result;
- no SEO/sitemap expansion occurred.

## Next database step

The next layer should join these real taxonomy identities to the existing 1,269
source-backed tuning profiles and raw provider observations.

Promotion policy remains:

1. exact compatible configuration first;
2. multiple independent sources for automatic Stage 1 public ranges;
3. single-source evidence remains conditional;
4. Stage 2 numeric output requires exact compatible Stage 2 evidence and
   defined hardware/fuel/transmission scope;
5. generic ratios never create customer-facing Stage 2 values.

No production merge is performed by this branch.
