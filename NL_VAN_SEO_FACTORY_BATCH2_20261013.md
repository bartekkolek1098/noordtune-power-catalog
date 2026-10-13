# NoordTune SEO Factory NL — verified commercial van photography batch #2
**Evidence review:** 2026-10-13. **Baseline production:** `9b19305` (PR #64). **Branch:** `feature/nl-seo-factory-vans-photos-20261013`.

## Goal
Make the existing, individually source-reviewed 100 Dutch van engine pages more useful, visually credible and browsable, rather than creating mass duplicate SEO URLs or copying tuning outputs between engine families.

## Output and generation scoping
- **27 manually reviewed Wikimedia Commons model-generation photographs**, from 27 distinct exact Commons file pages with creator, licence and origin recorded in `src/data/nl-van-generation-photos.json`. All are CC BY / CC BY-SA permitting commercial reuse with visible per-photo attribution and licence link. `docs/NL_VAN_IMAGE_LICENCES_20261013.md` gives the detailed audit trail.
- **85 / 100** existing indexed NL van engine pages can safely use these generation photos. Each has a responsive image, appropriate photographer/licence credit, a clear label that it is a **model illustration — not a NoordTune customer car**, selected admission years / factory kW / engine cc from existing reviewed RDW applications, and a direct link to the matching van model page.
- **15 / 100** pages intentionally remain photo-free: older Fiat Ducato pre-facelift 2013–15, Renault Master 2019+ facelift, Fiat Doblò, Opel Vivaro B, Opel Movano B/C. The online candidates were insufficiently representative or shown as a different market brand/body to claim that generation; **NO false replacement photograph** will be inserted.
- Generation-specific links: VW Transporter T5, T6 and T6.1 are independent; Mercedes Sprinter W906 vs W907 separated; Peugeot Partner II vs III; Citroën Berlingo II vs III; Opel Vivaro C independent from Vivaro B. Differences in engine software and gearbox remain critical for customer quotes.
- New generation photo appears only on Dutch NL van engine pages. NL OpenGraph metadata uses the applicable locally stored licensed photo. All images are rendered with Next.js Image at supported quality=78 and responsive sizes.
- Fixed a previously identified copy issue: Caddy 2.0 EcoFuel single-fuel CNG now correctly displays **Aardgas (CNG)**, not `Benzine` in its engine details. This does not change registration matching or any Stage 1 numerical outcomes.

## Authenticity and legal requirements
Photographs illustrate the appropriate **body model generation**, not proof of a given photographed engine code, ECU, factory kW, or a previous NoordTune service. Captions disclose that equipment/facelift may differ. Images are imported only by explicitly reviewed filenames, never automatically taken from internet search results. Missing photography does not hide the Stage 1 page or cause the renderer to use a photograph of an unrelated model. Source, author, licence and locally stored image SHA256 are independently checked.

## Release guardrails
- No extra SEO pages created: **sitemap remains 375**; no unreviewed RDW records indexed, no city doorway pages, no duplicated generated texts.
- 100 van engine articles, 25 NL van model hubs, 129 exact linked RDW applications, existing broader catalogue results and quote form remain unchanged.
- `pnpm test:seo` includes `scripts/test-nl-van-generation-photos.ts` to verify 100/85/15 matching, 27 photograph hashes, correct model generation, no cross-generation erroneous fallback and CNG copy.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, optimized-browser `pnpm qa:seo:nl-van-photos` on 320/390/1440 px; existing `pnpm qa:seo:nl-vans` and `pnpm qa:seo:nl-vehicles` must still PASS.
- Merge only when exact commit's Vercel Preview READY and GitHub green; production READY and public URL/image/CNG/sitemap smoke before claiming release.
- Rollback tag must point to prior production `9b19305`, push before deployment.

## Follow-on work
Add only visually checked CC-licensed photos for the 15 missing routes, especially the Fiat Doblò 263, Opel Vivaro B and Movano B/C, and correct Renault Master facelift. Continue independently authored Dutch articles for new source-verified engine cohorts, with Search Console query/indexing metrics guiding priority and actual quote submissions distinguishing marketing from mere website clicks.
