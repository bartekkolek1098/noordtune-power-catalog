# NoordTune SEO Factory NL — model comparison expansion, 2026-10-14

Baseline production main: 0b00c514 (PR #66).

## Publication scope
- 13 independently written model comparison pages under /nl/modellen, raising reviewed model hubs from 6 to 19.
- 48 existing reviewed engine profiles are now linked through a canonical model comparison hub (15 before).
- New model topics: Audi A1 8X, VW Polo 6R/AW, VW T-Roc A1, VW Tiguan 5N/II, SEAT Ibiza 6J/KJ, Ford Fiesta JA8/JHH, Peugeot 2008 I/II, Peugeot 3008 II, Peugeot 308 II/III, Renault Clio V, Renault Mégane III/IV, Nissan Micra K14 and Nissan Juke F16.
- Two distinct technical FAQs per new hub (26 new answers); source data and ranges are inherited from reviewed engine profiles. No invented Stage 1 figures, cross-make interpolation, fake measurements or duplicate translated pages.
- Model hubs compare factory kW, motor variants, emissions and gearbox checks. Directly connect hubs and engine detail pages via crawlable links, correct canonicals and RDW/WhatsApp enquiry.
- Sitemap grows from 422 to 435 verified unique paths. Original tuning, catalogue lookup, van pages and pricing are unchanged.

## Release checks
pnpm typecheck; pnpm test:seo; pnpm lint; pnpm build; production-build Playwright model QA. Confirm exact commit SHA at Vercel Preview and Production before reporting deployment.
