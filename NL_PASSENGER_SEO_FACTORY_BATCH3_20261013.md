# NL SEO Factory – Passenger engines batch 3 (2026-10-13)

Baseline main: b2070eed (#65).

Added 47 distinct Dutch engine guides sourced from existing independently reviewed RDW/tuner evidence. Existing 21 Dutch engine pages and 100 van engine pages are retained. Each guide has a model-generation description, motor/ECU/transmission checks, factory kW and source-specific Stage 1 estimates, two individual FAQs and a quotation CTA. There are 51 reviewed RDW application references, 117 source-link instances and 94 FAQs. BMW G20 and VW Golf 7 use pre-existing correctly licensed Wikimedia photos; all other new pages omit uncertain images.

The Dutch engine index now lists 68 engines and the sitemap contains 422 unique URLs (375 previously). No automatic RDW fleet indexing; no changes to pricing or tuning parameters. Emissions-system compliance remains required.

Validation: pnpm typecheck, pnpm lint, pnpm test:seo and pnpm build passed. Local production Playwright QA on port 3107 tested index, 68 generated engine URLs, sitemap, 10 mobile/desktop journeys including new guides, non-NL URLs, canonicals, source links, technical FAQs and image credits.
