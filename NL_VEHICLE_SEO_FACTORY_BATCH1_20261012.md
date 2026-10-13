# NoordTune NL SEO Factory — first vehicle editorial release (2026-10-12)

## Purpose and scope
Improve Dutch customer search landing pages with concrete, useful motor-generation information and correctly licensed internet photography **without mass-producing speculative RDW tuning claims**.

### Delivered
- **24** already indexed legacy `/nl/vehicles/{engine-id}` pages gain manually authored Dutch information about engine-generation differences, ECU, gearbox, expected use and maintenance scope. Each profile contains **4 distinct editorial paragraphs and 2 original FAQ items** (48 FAQs).
- **15** externally sourced **Wikimedia Commons CC BY / CC BY-SA** vehicle-generation photographs are used across those existing pages, with the creator, Commons file page, and licence visibly linked next to the image. The same photograph can legitimately illustrate different motor trims in the **same car generation**; the caption states it is *not a NoordTune workshop vehicle*. Photos are local 1200-pixel Commons derivatives, not hotlinked, not AI-generated and not taken from competitors without permission.
- Existing inaccurate generic Unsplash hero backgrounds on these **NL** routes are replaced with the matching documented Commons generation image. Other languages retain existing assets, while the Dutch editorial is not robotically translated.
- New Dutch crawler-visible index: **`/nl/voertuigen`**, internal links to all 24 reviewed legacy car pages; linked from the sitewide NL footer and related engine pages.
- A new unique NL meta description and Commons OpenGraph image are associated with each curated page. Canonicals, existing Stage 1 references, vehicle data, prices, direct WhatsApp and the catalog-to-main-site quote transfer remain unchanged.
- Existing 100 NL van engine pages, 21 hand-reviewed `/nl/motoren/` topics, 25 van model hubs, manual selector and RDW path are unaffected. Sitemap **374→375** solely from one new index page; we have **not** indexed all 58,586 generated vehicleDatabase variants.

### Image provenance / commercial licensing
See `src/data/nl-vehicle-photo-library.json` and `docs/NL_VEHICLE_IMAGE_LICENCES_20261012.md`. Every photo records Wikimedia description URL, author/artist, CC licence and link, local path, dimensions and SHA256; `scripts/import-reviewed-commons-photos.cjs` rejects unsupported licence classes and unsafe URLs. `scripts/research-commons-engine-photos.cjs` only finds **candidate media for human review**; never choose a random photo automatically. Gallery images and the metadata are illustration-only, not claims about customer work or a particular installed engine.

### SEO quality and safeguards
- No automatic mass-generation from unaudited vehicles, no city-doorway pages, no unverifiable ECU or dyno promises.
- FAQ text and editorial must be individually written against known engine/generation differences. Related vehicles are manually curated, not selected by marketing names alone.
- Every article makes it clear that published Stage 1 ranges depend on actual motor/ECU/transmission verification; legal DPF, EGR and SCR/AdBlue operation remains required.
- Historical RDW coverage samples are unchanged, so there is no invented rise in source-linked Stage 1 coverage.
- Public image licensing must remain visible even when photo is used as an OpenGraph or hero background. CC BY-SA requires source, attribution, licence and information on display adaptations.

### Release gates
1. `pnpm test:seo` includes `test-nl-vehicle-editorial.ts` and asserts 24 individual pages, 48 FAQs, 15 licensed Commons files by SHA256, no duplicate photos outside the reviewed groups.
2. `pnpm lint`, `pnpm typecheck`, `pnpm build`.
3. `pnpm qa:seo:nl-vehicles` on the optimized build checks 24 public NL article routes, 15 images, directory, attribution, sitemap375, NL canonical, 320/390/1440px and unsupported EN/PL directory404.
4. GitHub exact feature SHA Vercel Preview READY and GitHub Vercel success before merge.
5. Tagged previous main as rollback. Public production deployment READY, smoke HTTP200, gallery and sitemap verified before claiming release.

### Next evidence-based growth
Start with GSC indexing and query/click audit of these 24 pages (GSC connection may need reauthorization). Rank demand and verified coverage by brand/model/motor and publish the next individually reviewed cohorts in manageable batches. The goal is **helpful NL search pages that produce genuine enquiries**, not an artificial number of indexed URLs or unverified all-fleet performance claims.
