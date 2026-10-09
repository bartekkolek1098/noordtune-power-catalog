# NL model-family hub SEO — NoordTune Power Catalog

**Branch:** `feature/nl-model-family-hubs-20261009` on top of production `209bbdef8f4cd65427190bd0e747b9526f12bf4d`. Preview-only until QA and review.

## Why these pages

Google Search Console has begun surfacing engine-specific search queries, but individual Stage 1 engine pages need meaningful internal navigation and a readable way for Dutch customers to choose the correct generation. The main `noordtune.nl` site continues to own local service/appointment queries. The `power.noordtune.nl` subdomain remains strictly a vehicle technical catalog.

We created **seven additional NL URLs** (one category directory plus six real multi-engine model overviews), bringing the sitemap from **241 to 248**. Do not generate a page for every model string or RDW type.

## Carefully reviewed model families

| Model hub | Distinct source-backed engine profiles | Comparison |
|---|---:|---|
| BMW 320i F30/F31 | 2 | N20 vs B48, 1997 vs 1998 cc and 2015 overlap |
| Nissan Qashqai J11 | 2 | 1.2 vs 1.3 DIG-T, different ECU/GPF/CVT context |
| Ford Transit Connect EcoBlue | 2 | 100 vs 120 pk, PU2 original kW and transmission torque |
| Volkswagen Golf VII | 2 | EA211 1.0 TSI vs EA888 GTI 245, engine and DSG hardware |
| Volkswagen Caddy 2.0 TDI | 5 | Older 2KN vs newer SKN, 102/110/122/140 pk variants |
| Renault Master III 2.3 dCi | 2 | 2017 dCi vs 2022 Blue dCi, ECU/aftertreatment divergence |

These six hubs link **15 of the existing 21 fully sourced engine topics**. The six other engine topics remain discoverable directly at `/nl/motoren`. Hubs are not dynamically produced from RDW lookups or customer plates; they use a fixed editorial manifest containing unique model differences and at least two original Dutch Q&As per model.

## Technical publication constraints

- Only `/nl/modellen` and `/nl/modellen/[slug]` are canonical and submitted to sitemap. English and Polish paths are not generated; no multilingual thin duplicates.
- Every page compares published original RDW horsepower and independent Stage 1 HP/Nm as indicative ranges; actual ECU, generation, transmission and vehicle condition must be verified.
- There are no invented results, dyno figures, testimonials, Stage 2/3 numeric gains, or `Offer`/price schema.
- Index pages link all hubs, model pages link specific individual engine profiles, and source pages backlink to their model hubs, creating an actual hierarchical internal link structure. NL home and motor index also link the category.
- Existing 219 curated URLs + 22 source-backed motor URLs stay unchanged. Canonical titles rely on the site-wide title template so `NoordTune` appears **once**, not twice.
- This is intentionally **not** a new dataset / RDW coverage expansion; all 25 batch-4 records, their source URLs and factory powers remain exactly as reviewed.

## Validation gates

- `pnpm test:seo`: **248 unique routes**, 6 distinct hubs, 15 source-backed motor topics, 12 NL FAQs, existing coverage intact and no duplicate meta titles.
- `pnpm typecheck` and `pnpm lint`: pass.
- `pnpm build`: Next production SSG including the seven new NL pages and legacy paths.
- `pnpm qa:seo:nl-models`: 6/6 model detail pages, category index, correct NL canonical, all 15 linked motor pages, 4 unsupported EN/PL paths returning 404, 320/390px and 1440px no horizontal overflow, SSR home / engine index link checks and sitemap routes.
- `pnpm qa:seo:nl-engines`: source-engine page regressions after the shared metadata title fix.

## Next steps (after rollout)

Submit/verify new NL sitemap in Search Console if needed; monitor Google impressions, indexed URL status and clicks for each model family in the next 3–6 weeks. Count qualified referral clicks into `www.noordtune.nl/nl/chiptuning` and WhatsApp to separate ranking from leads.

Do not expand to 1000 pages unless stronger data, independently useful generation-specific copy, exact engine matching and crawl/indexing evidence justify it. The RDW lookup can continue to cover the full database without publishing thin SEO URLs.
