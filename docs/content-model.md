# Content Model Placeholder

The current implementation stores catalog data in `src/data/catalog.ts`. This is intentionally shaped like CMS content so it can move into PayloadCMS or Sanity without changing the frontend much.

## Vehicle / Engine Variant

Fields:

- `brand`
- `model`
- `engine`
- `fuel`
- `yearRange`
- `stockPowerHp`
- `stockTorqueNm`
- `ecuType`
- `gearbox`
- `stages`
- `options`
- `image`

## Stage

Fields:

- `name`
- `powerHp`
- `torqueNm`
- `price`
- `requirements`

## Service Option

Fields:

- `id`
- `name`
- `price`
- `fuels`
- `requiresGearbox`

## CMS Recommendation

PayloadCMS is a strong fit for this project because it can share TypeScript types with the Next.js codebase and run with Postgres. Sanity is also a good fit if the team prefers a fully managed studio.

Recommended collections:

- `vehicles`
- `engineVariants`
- `stages`
- `serviceOptions`
- `testimonials`
- `dynoVideos`
- `blogPosts`
- `lookupLogs`
- `quoteRequests`

`lookupLogs` should store the normalized plate, public RDW result snapshot, cache status, timestamp, and quote conversion status. Avoid storing unnecessary raw RDW rows.
