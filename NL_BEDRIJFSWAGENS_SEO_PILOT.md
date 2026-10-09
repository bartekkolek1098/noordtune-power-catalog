# NoordTune NL Bedrijfswagens & Busjes — source-reviewed SEO pilot

**Version:** 2026-10-09, production baseline `0cefd90859e8a8d9a920317225e43d57fe8990a1`. Work on feature branch `feature/nl-bedrijfswagens-coverage-20261009`; initial release only after Preview QA.

## Intent

Dutch-language business-vehicle catalog for actual customers working in **bouw, installatie, service, distributie en transport**. The user starts with a brand/model or RDW registration and is directed to the **official www.noordtune.nl** website for diagnostic and Stage 1/ECU quotation. This is a technical catalog, not a duplicate corporate services page.

### Source and demand baseline

- 3,000-case *purposely selected technical RDW test sample* contains **504 van/bus observations in 20 trade-name groups**, not a representative Dutch fleet share. The largest groups are VW Caddy (60), Mercedes Sprinter (48), VW Transporter (48), Peugeot Partner (36), Ford Transit (36), Fiat Ducato (36). These are **sample counts**, not registered-vehicle market share.
- Existing source research contains **373 van-related records across 27 source model families**, but only around **43 records show values from at least two independent retrieved source providers**. Do not convert the other 330 research records automatically into numeric claims or customer promises.
- Specifically whitelisted `verifiedRdwApplications`: **18** numeric, fully scoped and approved original van applications (exact RDW kW, cc, type, fuel, first-admission year and multiple retrieved provider URLs), with **32 distinct external supplier URLs** across listed records.
- Existing separate Stage 1 motor profiles remain the source of truth for VW Caddy, Crafter, Transporter T6, Ford Transit Connect and Renault Master.

## Pages / sitemap

- **1** category `/nl/bedrijfswagens`, displaying 22 models across **10 brands**, with accessible live search and size filters.
- **15** new substantive manually written NL model pages for Ford Transit/Custom/Connect; VW Transporter/Crafter/Caddy; Mercedes Sprinter/Vito; Toyota Proace/Proace City; Peugeot Partner/Expert/Boxer; Renault Master/Kangoo.
- Other **7** van models (Renault Trafic, Opel Vivaro/Movano, Citroën Jumpy/Berlingo, Fiat Ducato, Iveco Daily) appear in the directory, but link to manual/RDW search only. They have NO separate indexed thin landing pages until tech evidence is approved.
- **5** independent source-backed new Stage 1 pages: Ford Transit 2.0 EcoBlue130, VW Transporter T5 2.0 TDI140, VW Transporter T6 2.0 TDI204, Peugeot Partner 1.5 BlueHDi100, Renault Kangoo II 1.5dCi75. First Transit group displays two original RDW homologation cohorts separately.
- **21 additional indexed NL URLs**, taking total unique sitemap entries from 248 to **269**. No English/Polish clones are published yet.
- No multi-page mass SEO creation from query strings, license plates or VINs. `dynamicParams=false` prevents accidental auto-generated pages.

## Trust, accuracy, emissions

- Only verified Stage 1 numeric sources, never a made-up percent-based gain or an unrelated platform counterpart; variant label and year remain exact, no Stage 2/3 numeric figures or guaranteed gearbox calibration.
- External original torque is distinguished from RDW power: **RDW supplies original kW, not universal factory Nm**. Multi-provider discrepancy is explained.
- **Mercedes-Benz Sprinter/Vito, Toyota Proace/Proace City, Ford Transit Custom, Peugeot Expert/Boxer** have distinct manufacturer-background information but **no invented Stage 1 numbers** until an exact reviewed application is available.
- Independent first-party manufacturer references for Ford, Volkswagen, Mercedes-Benz, Toyota and Peugeot are explicitly linked in the model pages as additional context. Manufacturer model lists do not prove the installed ECU.
- For Dutch public-road vehicles, SCR and AdBlue must work and not be disabled. The official Rijksoverheid notice ([control of exhaust system and AdBlue](https://www.rijksoverheid.nl/themas/verkeer-en-vervoer/goederenvervoer/goederenvervoer-over-de-weg/controle-op-uitlaatsysteem-en-adblue-van-voertuigen-op-diesel-gas-en-waterstof)) states police checks started **1 July 2026** and include vans and buses. Catalog provides diagnostics/repair route rather than advertising road-vehicle emission deactivation.
- The actual customer vehicle is assessed individually for maintenance, DPF/SCR, fault history, ECU, temperature and clutch/DSG/automatic transmission limits before tuning.

## QA and measured outcomes

- `pnpm test:seo` verifies legacy 248 NL/EN/PL pages plus 21 indexed vans; all 269 unique; manually approved van whitelist.
- `pnpm typecheck` and `pnpm lint` must pass.
- `pnpm build` generates all SSG pages in production mode.
- `pnpm qa:seo:nl-vans` tests 22 model cards, Dutch live filtering, 15 indexed model HTTP 200, seven browse-only slug HTTP 404, five verified engine HTTP 200, four EN/PL URL HTTP 404, full sitemap, representative Stage 1 and no-claim model variants, AdBlue government link, 320/390/1440px layout.
- There are **no RDW Stage 1 application rule changes**, no modification to model matching or pricing, no private license plates collected in SEO routes.

## Next genuinely data-driven work

Prioritize exact RDW-review packets for missing popular vans: Mercedes Sprinter 114/143 hp CDI; VW Transporter 84/102/114/150 TDI and new T7; Ford Transit Custom 2.0 EcoBlue; Peugeot Expert 1.5/2.0 BlueHDi; Toyota Proace/Proace City; Fiat Ducato 2.2; Iveco Daily 2.3/3.0. Source research alone is insufficient — each original version must be matched to independent retrieved publications, RDW exact kW/cc/type/fuel/year and workshop torque/ECU constraints before any numeric output is shown.

Compare **actual Google indexing, search impressions and qualified leads** through Search Console over several weeks before publishing hundreds more pages. Do not mistake HTML/sitemap publication for guaranteed Google ranking.
