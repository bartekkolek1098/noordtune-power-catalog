# V3.2 — targeted missing-configuration recovery

Baseline: `14ca5b91044fb29f2747c2079df5aca9781fba9f`. Existing branch `feature/nl-fleet-coverage-v3`, Draft PR #16; base remains `feature/nl-fleet-coverage-v2`.

## Result and method

Research used the unchanged `v3-1-next20.json` order, prioritizing ranks 2, 3, 5, 6, 11, 12, 13 and 20. The batch retains 46 tuning-provider observations and two official BMW factory-identity observations. It accepts 31 provider observations into 23 new profiles (eight reviewed cross-provider links). All 1,246 previous profiles and all 3,329 previous source observations are hash-identical, including every prior Stage 2/3 result. No runtime matcher, identity normalizer, pricing, service text or public catalog changes.

The production resolver replays the frozen 400 registrations, original 222 subset, frozen 3,000 rows / 1,862 observed scenarios and original Top-50 scenario membership. Cohort hashes are pinned in `v3-2-baseline.json`; no ranking or sample was regenerated. **These purposive samples do not estimate Dutch fleet prevalence.**

| Measure | V3.1 | V3.2 |
|---|---:|---:|
| Accepted profiles | 1246 | 1269 |
| Multi-provider profiles | 179 | 187 |
| Frozen 400 sourced | 168/400 | 184/400 |
| Fixed ordinary ICE subset | 168/344 | 184/344 |
| A / B / C / D / E | 35 / 133 / 15 / 161 / 56 | 38 / 146 / 15 / 145 / 56 |
| Original 222 sourced | 89/222 | 95/222 |
| Observed scenarios sourced | 737/1862 | 863/1862 |
| Strict Top-50 whole groups | 7/50 | 7/50 |
| 400 cohort: sourced Stage 1 power + torque | 168 | 184 |
| 400 cohort: sourced Stage 2 power + torque | 23 | 23 |
| 400 cohort: numeric sourced Stage 3 | 0 | 0 |
| Dataset numeric Stage 1 / 2 / 3 | 1246 / 269 / 4 | 1269 / 271 / 4 |

Quote changes: **0**. Normalized identity changes: **0**. Sourced demotions in frozen 400: **0**. Newly ambiguous cases in frozen 400: **0**. Every before/after quote is retained in the baseline/results rows; transitions are explicit.

Across all 3,000 observed rows: 0 sourced demotions. Across the 1,862 fixed scenarios: 0 sourced demotions.

## Stage, scope and commercial rules

Only explicit ECU Stage 2 tables enter Stage 2 consensus (Audi A4 and Golf V). Stage 1+, E85 packages, external modules and marketing packages do not become Stage 2. No new numeric Stage 3. Single-source Stage 1 retains generic/conditional later-stage UX. Selected figures use the existing conservative consensus and rounding; raw provider values remain in the ledger. Manufacturer releases only corroborate factory facts and do not vote on tuned output or prove factory de-rating.

Provider application years remain raw in observations. Reviewed scopes are narrower review limits, not invented production dates. Distinct 5008 applications retain their inclusive 2020 overlap; Fiat 500 TwinAir applications retain their inclusive 2015 overlap. The existing resolver keeps these overlaps conditional. The existing Golf generation boundary further limits the new Golf V profile to 2005–2007; neither 2008 nor 2009 is silently promoted.

BMW 520i uses the official 184 PS / 290 Nm identity and the matching ATM application. The Shiftech 300 Nm stock/EU6d application is unresolved and has no tuning vote. BMW 318i pre-LCI 2020–2021 and LCI 2022–2023 remain separate; the 2024 application is not promoted. The LCI single-source large-gain review flag remains. Provider ECU lists are possible application hardware, never a confirmed vehicle ECU or an age-based unlock finding. C5 Aircross data is ordinary petrol only; hybrid fuel guards remain. OWNER-B stays conditional between TDCi/EcoBlue.

## All 20 decisions

Every source ID below is retained in `source-pages.json` and the V3.2 batch. The machine ledger includes hashes, timestamps, raw identities/stages, bounded scopes, selected profiles and the exact sampled registrations still unresolved. Values below are selected customer figures, not unrounded provider maxima.

| Rank / configuration | Exact sources checked | Generation / engine and decision | Selected Stage 1 | Explicit Stage 2 | Remaining limitation / customer effect | Quote changed |
|---|---|---|---|---|---|---|
| 1. MAZDA MAZDA MX-5 · Petrol, 1798 cc, 93 kW | [atm-v3-a98ab0ab8f180bb9](https://www.atm-chiptuning.com/chiptuning/mazda-mx-5-18i-16v-126pk/) (unresolved/rejected)<br>[shiftech-v2-ec1a3e45a04c329d](https://www.shiftech.eu/en/chiptuning/car/mazda/mx5/2005/petrol/1.8i-mzr-126) (unresolved/rejected) | unresolved; No defensible application mapping | — | — | Unresolved observed years: 2005, 2007, 2009, 2010, 2011, 2014. Engine-code and factory-torque conflict: BP-ZE/167 Nm versus MZR/155 Nm. No promotion to a customer sourced estimate; conditional result retained. | No |
| 2. FIAT FIAT DOBLO' · Diesel, 1598 cc, 77 kW | [atm-v3-8e4e6f6e3887ae8c](https://www.atm-chiptuning.com/chiptuning/fiat-doblo-16-m-jtd-105pk/) (unresolved/rejected)<br>[atm-v3-8994a87d9608c67c](https://www.atm-chiptuning.com/chiptuning/fiat-doblo-16-multijet-105pk/) (accepted) | accepted-with-bounded-scope; 2015 - 2021: 2016–2021; 198A3000 | 2016–2021: 140 PS / 360 Nm | — | Unresolved observed years: 2023. 2022–2023 lies beyond the exact 2015–2021 provider application. 18/22 sampled registrations newly receive sourced Stage 1; 4 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 3. PEUGEOT 5008 · Petrol, 1199 cc, 96 kW | [atm-v3-d389de9e8edec0cd](https://www.atm-chiptuning.com/chiptuning/peugeot-5008-12t-puretech-130pk/) (accepted)<br>[atm-v3-ab5320260e7d91ff](https://www.atm-chiptuning.com/chiptuning/peugeot-5008-12t-puretech-130pk-7854/) (accepted)<br>[atm-v3-689b5845933d6ae0](https://www.atm-chiptuning.com/chiptuning/peugeot-5008-12t-puretech-130pk-12383/) (accepted)<br>[shiftech-v2-9fa3af9ee7124d92](https://www.shiftech.eu/en/chiptuning/car/peugeot/5008/2017/petrol/1.2-thp-puretech-130) (accepted)<br>[shiftech-v2-701c99bcc4788a4f](https://www.shiftech.eu/en/chiptuning/car/peugeot/5008/2020/petrol/1.2-thp-puretech-gpf-130) (accepted) | accepted-with-bounded-scope; 2020 -> ...: 2020–2021; HNY<br>2013 - 2016: 2015–2016; EB2<br>2017 - 2020: 2017–2020; HNY | 2020–2021: 145 PS / 270 Nm<br>2015–2016: 150 PS / 270 Nm<br>2017–2020: 145 PS / 270 Nm | — | Unresolved observed years: 2020. The inclusive 2020 pre/post-facelift overlap needs configuration evidence. 16/20 sampled registrations newly receive sourced Stage 1; 4 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 4. NISSAN NISSAN MICRA · Petrol, 1240 cc, 59 kW | [shiftech-v2-a4e3f908713afb79](https://www.shiftech.eu/en/chiptuning/car/nissan/micra/2003/petrol/1.2i-80) (accepted) | accepted-with-bounded-scope; 2003: 2003–2009; engine code unpublished | 2003–2009: 85 PS / 120 Nm | — | All observed years in the exact tuple are recovered within the reviewed scope. 17/17 sampled registrations newly receive sourced Stage 1; 0 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 5. CITROEN C5 AIRCROSS · Petrol, 1598 cc, 133 kW | [atm-v3-d65b8200a0c31a06](https://www.atm-chiptuning.com/chiptuning/citroen-c5-aircross-16-puretech-180pk/) (accepted)<br>[shiftech-v2-c05a1d77cebc45bb](https://www.shiftech.eu/en/chiptuning/car/citroen/c5-aircross/2018/petrol/1.6-thp-puretech-gpf-180) (accepted) | accepted-with-bounded-scope; 2018 - 2021: 2018–2020; 5GF EP6FADTXD | 2018–2020: 215 PS / 300 Nm | — | Unresolved observed years: 2022, 2024. Electrified controls sharing the petrol tuple remain outside ordinary-ICE matching. 16/22 sampled registrations newly receive sourced Stage 1; 6 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 6. SKODA OCTAVIA · Petrol, 1395 cc, 103 kW | [atm-v3-31f8310a5319405e](https://www.atm-chiptuning.com/chiptuning/skoda-octavia-14-tsi-140pk-chpa/) (accepted)<br>[atm-v3-7f6e72f7dee79607](https://www.atm-chiptuning.com/chiptuning/skoda-octavia-14-tsi-140pk-chpa-7004/) (unresolved/rejected)<br>[shiftech-v2-774a6496a70132e4](https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2013/petrol/1.4-tsi-tfsi-ss-140) (accepted) | accepted-with-bounded-scope; 2013 - 2016: 2013–2015; CHPA | 2013–2015: 170 PS / 300 Nm | — | All observed years in the exact tuple are recovered within the reviewed scope. 16/16 sampled registrations newly receive sourced Stage 1; 0 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 7. AUDI AUDI A4 · Petrol, 1798 cc, 88 kW | [atm-v3-2f5194f080d1abcf](https://www.atm-chiptuning.com/chiptuning/audi-a4-18-tfsi-120pk/) (accepted)<br>[atm-v3-a2ec754f803fda02](https://www.atm-chiptuning.com/chiptuning/audi-a4-18-tfsi-120pk-3729/) (unresolved/rejected)<br>[shiftech-v2-947e3c87f6ed3203](https://www.shiftech.eu/en/chiptuning/car/audi/a4/2008-b8/petrol/1.8-tsi-tfsi-120) (accepted) | accepted-with-bounded-scope; B8 - 2008 - 2011: 2008–2011; CDHA | 2008–2011: 210 PS / 310 Nm | 2008–2011: 220 PS / 340 Nm | Unresolved observed years: 2012. The 2012 facelift source engine-code mapping is unresolved. 11/13 sampled registrations newly receive sourced Stage 1; 2 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 8. RENAULT CLIO · Petrol, 1598 cc, 79 kW | [atm-v3-5e56cb83ee43dfe8](https://www.atm-chiptuning.com/chiptuning/renault-clio-16i-16v-110pk-4825/) (unresolved/rejected)<br>[shiftech-v2-62c1e042f01c33e0](https://www.shiftech.eu/en/chiptuning/car/renault/clio/2001-ii/petrol/1.6i-16v-107) (accepted) | accepted-with-bounded-scope; 2001 - II: 2001–2004; engine code unpublished | 2001–2004: 110 PS / 150 Nm | — | Unresolved observed years: 2000, 2005. 2000 predates the source; 2005 overlaps the separate Clio III application. 8/13 sampled registrations newly receive sourced Stage 1; 5 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 9. FIAT FIAT 500 · Petrol, 875 cc, 63 kW | [atm-v3-54bcd07cac65c8ee](https://www.atm-chiptuning.com/chiptuning/fiat-500-595-695-09-twinair-85pk/) (accepted)<br>[shiftech-v2-52d39d2ea645d63c](https://www.shiftech.eu/en/chiptuning/car/fiat/500/2015/petrol/0.9-twin-air-85) (accepted) | accepted-with-bounded-scope; 500 - 2007 - 2015: 2010–2015; 312A2000<br>2015: 2015–2017; engine code unpublished | 2010–2015: 100 PS / 180 Nm<br>2015–2017: 95 PS / 190 Nm | — | Unresolved observed years: 2015. The 2015 pre/post-facelift overlap remains conditional. 10/13 sampled registrations newly receive sourced Stage 1; 3 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 10. NISSAN NISSAN MICRA · Petrol, 1198 cc, 59 kW | [shiftech-v2-00de5725a83ff1ad](https://www.shiftech.eu/en/chiptuning/car/nissan/micra/2010/petrol/1.2-12v-80) (accepted) | accepted-with-bounded-scope; 2010: 2010–2017; engine code unpublished | 2010–2017: 95 PS / 130 Nm | — | All observed years in the exact tuple are recovered within the reviewed scope. 13/13 sampled registrations newly receive sourced Stage 1; 0 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 11. VOLKSWAGEN T-ROC · Petrol, 1984 cc, 140 kW | [atm-v3-eeb249c42eb58d78](https://www.atm-chiptuning.com/chiptuning/volkswagen-t-roc-20-tsi-190pk/) (accepted)<br>[atm-v3-338dffcf6cbd6e92](https://www.atm-chiptuning.com/chiptuning/volkswagen-t-roc-20-tsi-190pk-12304/) (accepted)<br>[shiftech-v2-8e539131491d0e96](https://www.shiftech.eu/en/chiptuning/car/volkswagen/t-roc/2017/petrol/2.0-tsi-opf-190) (unresolved/rejected) | accepted-with-bounded-scope; 2017 - 2021: 2017–2021; CZPB<br>2022 -> ...: 2022–2024; CZPB | 2017–2021: 245 PS / 430 Nm<br>2022–2024: 245 PS / 430 Nm | — | All observed years in the exact tuple are recovered within the reviewed scope. 13/13 sampled registrations newly receive sourced Stage 1; 0 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 12. VOLKSWAGEN GOLF · Diesel, 1896 cc, 77 kW | [atm-v3-3e247e3e7e5306b2](https://www.atm-chiptuning.com/chiptuning/volkswagen-golf-19-tdi-105pk/) (accepted)<br>[shiftech-v2-a4a6a952ec30fe15](https://www.shiftech.eu/en/chiptuning/car/volkswagen/golf/2003-v/diesel/1.9-tdi-ip-105) (accepted) | accepted-with-bounded-scope; Golf 5 - 2003 - 2008: 2005–2007; BKC | 2005–2007: 140 PS / 320 Nm | 2005–2007: 150 PS / 340 Nm | Unresolved observed years: 2009. The existing Golf generation guard ends the effective scope in 2007; 2008/2009 is not recovered. 8/12 sampled registrations newly receive sourced Stage 1; 4 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 13. BMW 520I · Petrol, 1998 cc, 135 kW | [atm-v3-6793e72537eed755](https://www.atm-chiptuning.com/chiptuning/bmw-5-serie-520i-184pk/) (unresolved/rejected)<br>[atm-v3-b92f3d7d57449e16](https://www.atm-chiptuning.com/chiptuning/bmw-5-serie-520i-184pk-8569/) (accepted)<br>[atm-v3-2727507f7535c236](https://www.atm-chiptuning.com/chiptuning/bmw-5-serie-520i-184pk-11298/) (unresolved/rejected)<br>[shiftech-v2-5cc3dfcd393df5e1](https://www.shiftech.eu/en/chiptuning/car/bmw/5-serie/2016-g30-g31/petrol/20i-2.0t-eu6d-184) (unresolved/rejected) | accepted-with-bounded-scope; G30/31 - 2016 - 2019: 2017–2019; B48B20B | 2017–2019: 250 PS / 440 Nm | — | All observed years in the exact tuple are recovered within the reviewed scope. 12/12 sampled registrations newly receive sourced Stage 1; 0 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 14. SKODA OCTAVIA · Petrol, 1595 cc, 75 kW | [shiftech-v2-65fa7d80495bb895](https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2005/petrol/1.6i-8v-102) (accepted) | accepted-with-bounded-scope; 2005: 2005–2009; engine code unpublished | 2005–2009: 110 PS / 160 Nm | — | All observed years in the exact tuple are recovered within the reviewed scope. 12/12 sampled registrations newly receive sourced Stage 1; 0 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 15. MAZDA MAZDA 6 · Petrol, 1798 cc, 88 kW | [atm-v3-48d2bc1d8f40e7e8](https://www.atm-chiptuning.com/chiptuning/mazda-6-18i-16v-120pk/) (accepted)<br>[shiftech-v2-db1e809928c83527](https://www.shiftech.eu/en/chiptuning/car/mazda/mazda-6/2003/petrol/1.8i-mzr-122) (unresolved/rejected) | accepted-with-bounded-scope; 2003 - 2008: 2005–2008; L8-DE | 2005–2008: 130 PS / 180 Nm | — | Unresolved observed years: 2009. 2009 lies beyond the exact 2003–2008 application. 8/12 sampled registrations newly receive sourced Stage 1; 4 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 16. MERCEDES-BENZ B 180 · Petrol, 1595 cc, 90 kW | [atm-v3-ccdbe137e9c76ada](https://www.atm-chiptuning.com/chiptuning/mercedes-benz-b-180-cgi-122pk/) (accepted)<br>[atm-v3-d02765dbe10162db](https://www.atm-chiptuning.com/chiptuning/mercedes-benz-b-180-cgi-122pk-6559/) (unresolved/rejected)<br>[shiftech-v2-b1a950cea4f6e6f9](https://www.shiftech.eu/en/chiptuning/car/mercedes/b/2013-w246/petrol/180-eu6-1.6t-122) (unresolved/rejected) | accepted-with-bounded-scope; W246 - 2012 - 2014: 2012–2013; M270.910 | 2012–2013: 175 PS / 300 Nm | — | Unresolved observed years: 2011, 2014. 2011 predates the source; 2014 has unresolved overlapping engine labels/applications. 4/12 sampled registrations newly receive sourced Stage 1; 8 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 17. MITSUBISHI MITSUBISHI COLT · Petrol, 1499 cc, 80 kW | [unlimited-v2-159b2c7256791ef9](https://www.unlimitedtuning.nl/chiptuning-mitsubishi-colt-1-5i-109-pk.html) (unresolved/rejected) | unresolved; No defensible application mapping | — | — | Unresolved observed years: 2005, 2007, 2009. The exact tuning table lacks a defensible generation/year scope. No promotion to a customer sourced estimate; conditional result retained. | No |
| 18. FIAT FIAT 500 · Petrol, 1242 cc, 51 kW | [atm-v3-d40c7cbf5f166a1e](https://www.atm-chiptuning.com/chiptuning/fiat-500-595-695-12i-8v-69pk/) (accepted) | accepted-with-bounded-scope; 500 - 2007 - 2015: 2010–2014; 169A4000 | 2010–2014: 75 PS / 110 Nm | — | All observed years in the exact tuple are recovered within the reviewed scope. 12/12 sampled registrations newly receive sourced Stage 1; 0 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 19. SKODA OCTAVIA · Petrol, 1390 cc, 90 kW | [atm-v3-eeb2a2f96c297e9f](https://www.atm-chiptuning.com/chiptuning/skoda-octavia-14-tsi-122pk/) (accepted)<br>[shiftech-v2-efc584da161ee503](https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2005/petrol/1.4-tsi-tfsi-122) (accepted) | accepted-with-bounded-scope; 2004 - 2012: 2010–2012; CAXA | 2010–2012: 140 PS / 240 Nm | — | Unresolved observed years: 2013. 2013 lies beyond the reviewed source overlap ending 2012. 8/12 sampled registrations newly receive sourced Stage 1; 4 remain conditional/unresolved. Later stages retain their independent provenance. | No |
| 20. BMW 318I · Petrol, 1998 cc, 115 kW | [atm-v3-46df01faaa17f8c4](https://www.atm-chiptuning.com/chiptuning/bmw-3-serie-318i-156pk/) (accepted)<br>[atm-v3-bf23d490c8d1b889](https://www.atm-chiptuning.com/chiptuning/bmw-3-serie-318i-156pk-13115/) (unresolved/rejected)<br>[shiftech-v2-d6fc4520e5152921](https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2022-g20-g21-lci/petrol/18i-2.0t-eu6d-156) (accepted)<br>[shiftech-v2-139ccbe44e452003](https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2019-g20-g21/petrol/18i-2.0t-eu6d-156) (accepted) | accepted-with-bounded-scope; 2022 - G20 G21 LCI: 2022–2023; engine code unpublished<br>G2x - 2019 ->: 2020–2021; B48B20 | 2022–2023: 260 PS / 420 Nm<br>2020–2021: 260 PS / 420 Nm | — | Unresolved observed years: 2024. The separately labelled 2024 engine/LCI application is not promoted. 8/12 sampled registrations newly receive sourced Stage 1; 4 remain conditional/unresolved. Later stages retain their independent provenance. | No |

## Source decisions and rejection reasons

### 1. MAZDA MAZDA MX-5 — 1798 cc / 93 kW

- **unresolved-or-rejected** [atm-v3-a98ab0ab8f180bb9](https://www.atm-chiptuning.com/chiptuning/mazda-mx-5-18i-16v-126pk/): MX-5 2005–2015 page labels engine BP-ZE and stock torque 167 Nm, conflicting with the checked MZR source at 155 Nm. Engine/factory torque applicability not resolved.
- **unresolved-or-rejected** [shiftech-v2-ec1a3e45a04c329d](https://www.shiftech.eu/en/chiptuning/car/mazda/mx5/2005/petrol/1.8i-mzr-126): MZR 126 PS/155 Nm versus ATM 126 PS/167 Nm and BP-ZE label remains unresolved. Published Stage 2 146 PS/179 Nm retained as research evidence, not assigned to an unconfirmed configuration.

### 2. FIAT FIAT DOBLO' — 1598 cc / 77 kW

- **unresolved-or-rejected** [atm-v3-8e4e6f6e3887ae8c](https://www.atm-chiptuning.com/chiptuning/fiat-doblo-16-m-jtd-105pk/): Retrieved application does not cover the requested observed period/engine; retained as rejected comparison evidence.
- **accepted** [atm-v3-8994a87d9608c67c](https://www.atm-chiptuning.com/chiptuning/fiat-doblo-16-multijet-105pk/): Doblò 2015–2021 1.6 Multijet 105 PS/290 Nm exact 1598 cc. No extension to 2022–2023 or the older 2010–2015 application. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 3. PEUGEOT 5008 — 1199 cc / 96 kW

- **accepted** [atm-v3-d389de9e8edec0cd](https://www.atm-chiptuning.com/chiptuning/peugeot-5008-12t-puretech-130pk/): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [atm-v3-ab5320260e7d91ff](https://www.atm-chiptuning.com/chiptuning/peugeot-5008-12t-puretech-130pk-7854/): Retain the inclusive published 2020 overlap with the successor; admission year alone does not resolve it. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [atm-v3-689b5845933d6ae0](https://www.atm-chiptuning.com/chiptuning/peugeot-5008-12t-puretech-130pk-12383/): Keep the 2020 PureTech successor separate with its published VD56.1 scope. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [shiftech-v2-9fa3af9ee7124d92](https://www.shiftech.eu/en/chiptuning/car/peugeot/5008/2017/petrol/1.2-thp-puretech-130): Same 2017 5008 1.2 PureTech 130 PS/230 Nm application as ATM. Retain the 2020 overlap. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [shiftech-v2-701c99bcc4788a4f](https://www.shiftech.eu/en/chiptuning/car/peugeot/5008/2020/petrol/1.2-thp-puretech-gpf-130): Separate 2020 GPF application, same 130 PS/230 Nm successor as ATM. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 4. NISSAN NISSAN MICRA — 1240 cc / 59 kW

- **accepted** [shiftech-v2-a4e3f908713afb79](https://www.shiftech.eu/en/chiptuning/car/nissan/micra/2003/petrol/1.2i-80): 2003 Micra 1.2i 80 PS/120 Nm application, nominal 1200 cc within the existing tolerance for 1240 cc. Separate from 2010 Micra 1.2 80 PS/110 Nm. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 5. CITROEN C5 AIRCROSS — 1598 cc / 133 kW

- **accepted** [atm-v3-d65b8200a0c31a06](https://www.atm-chiptuning.com/chiptuning/citroen-c5-aircross-16-puretech-180pk/): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [shiftech-v2-c05a1d77cebc45bb](https://www.shiftech.eu/en/chiptuning/car/citroen/c5-aircross/2018/petrol/1.6-thp-puretech-gpf-180): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 6. SKODA OCTAVIA — 1395 cc / 103 kW

- **accepted** [atm-v3-31f8310a5319405e](https://www.atm-chiptuning.com/chiptuning/skoda-octavia-14-tsi-140pk-chpa/): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **unresolved-or-rejected** [atm-v3-7f6e72f7dee79607](https://www.atm-chiptuning.com/chiptuning/skoda-octavia-14-tsi-140pk-chpa-7004/): Retrieved application does not cover the requested observed period/engine; retained as rejected comparison evidence.
- **accepted** [shiftech-v2-774a6496a70132e4](https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2013/petrol/1.4-tsi-tfsi-ss-140): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 7. AUDI AUDI A4 — 1798 cc / 88 kW

- **accepted** [atm-v3-2f5194f080d1abcf](https://www.atm-chiptuning.com/chiptuning/audi-a4-18-tfsi-120pk/): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **unresolved-or-rejected** [atm-v3-a2ec754f803fda02](https://www.atm-chiptuning.com/chiptuning/audi-a4-18-tfsi-120pk-3729/): 2012 facelift page labels CABB, distinct from the pre-facelift CDHA application, without enough corroboration to assign the observed 2012 car. No extension of the 2008 profile.
- **accepted** [shiftech-v2-947e3c87f6ed3203](https://www.shiftech.eu/en/chiptuning/car/audi/a4/2008-b8/petrol/1.8-tsi-tfsi-120): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 8. RENAULT CLIO — 1598 cc / 79 kW

- **unresolved-or-rejected** [atm-v3-5e56cb83ee43dfe8](https://www.atm-chiptuning.com/chiptuning/renault-clio-16i-16v-110pk-4825/): Retrieved application does not cover the requested observed period/engine; retained as rejected comparison evidence.
- **accepted** [shiftech-v2-62c1e042f01c33e0](https://www.shiftech.eu/en/chiptuning/car/renault/clio/2001-ii/petrol/1.6i-16v-107): Clio II 2001 1.6 107 PS/148 Nm. Stop before separately published Clio III 2005 110 PS; 2000 predates source and 2005 transition remains unresolved.

### 9. FIAT FIAT 500 — 875 cc / 63 kW

- **accepted** [atm-v3-54bcd07cac65c8ee](https://www.atm-chiptuning.com/chiptuning/fiat-500-595-695-09-twinair-85pk/): Retain published inclusive 2015 overlap with the separately retrieved facelift application. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [shiftech-v2-52d39d2ea645d63c](https://www.shiftech.eu/en/chiptuning/car/fiat/500/2015/petrol/0.9-twin-air-85): Separate 2015 Fiat 500 Twin-Air 85 PS/145 Nm facelift application. Inclusive 2015 overlap remains ambiguous; no forced output selection. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 10. NISSAN NISSAN MICRA — 1198 cc / 59 kW

- **accepted** [shiftech-v2-00de5725a83ff1ad](https://www.shiftech.eu/en/chiptuning/car/nissan/micra/2010/petrol/1.2-12v-80): 2010 Micra 1.2 12v 80 PS/110 Nm, nominal 1200 cc consistent with 1198 cc. Separate from the 2003 1240 cc/120 Nm generation. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 11. VOLKSWAGEN T-ROC — 1984 cc / 140 kW

- **accepted** [atm-v3-eeb249c42eb58d78](https://www.atm-chiptuning.com/chiptuning/volkswagen-t-roc-20-tsi-190pk/): Provider separates 2017–2021 from 2022 successor and publishes possible MG1CS001/MG1CS111 plus DQ381 hardware. Exact installed ECU/gearbox remains a workshop check. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [atm-v3-338dffcf6cbd6e92](https://www.atm-chiptuning.com/chiptuning/volkswagen-t-roc-20-tsi-190pk-12304/): Separate provider 2022 application. No ECU family is published for this page; do not inherit the pre-facelift ECU list or infer access/unlock from year. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **unresolved-or-rejected** [shiftech-v2-8e539131491d0e96](https://www.shiftech.eu/en/chiptuning/car/volkswagen/t-roc/2017/petrol/2.0-tsi-opf-190): OPF-specific engine label; the checked page does not resolve applicability to every 2017–2021 non-OPF/OPF configuration. No cross-provider merge.

### 12. VOLKSWAGEN GOLF — 1896 cc / 77 kW

- **accepted** [atm-v3-3e247e3e7e5306b2](https://www.atm-chiptuning.com/chiptuning/volkswagen-golf-19-tdi-105pk/): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [shiftech-v2-a4a6a952ec30fe15](https://www.shiftech.eu/en/chiptuning/car/volkswagen/golf/2003-v/diesel/1.9-tdi-ip-105): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 13. BMW 520I — 1998 cc / 135 kW

- **unresolved-or-rejected** [atm-v3-6793e72537eed755](https://www.atm-chiptuning.com/chiptuning/bmw-5-serie-520i-184pk/): Retrieved application does not cover the requested observed period/engine; retained as rejected comparison evidence.
- **accepted** [atm-v3-b92f3d7d57449e16](https://www.atm-chiptuning.com/chiptuning/bmw-5-serie-520i-184pk-8569/): BMW official 2017 release confirms the new 520i 2.0 petrol 135 kW/184 PS, 290 Nm and 8-speed transmission from July 2017. ATM exact 1998 cc G30/31 application ends 2019. Shiftech 300 Nm stock variant not merged.
- **unresolved-or-rejected** [atm-v3-2727507f7535c236](https://www.atm-chiptuning.com/chiptuning/bmw-5-serie-520i-184pk-11298/): Retrieved application does not cover the requested observed period/engine; retained as rejected comparison evidence.
- **unresolved-or-rejected** [shiftech-v2-5cc3dfcd393df5e1](https://www.shiftech.eu/en/chiptuning/car/bmw/5-serie/2016-g30-g31/petrol/20i-2.0t-eu6d-184): Published stock 300 Nm conflicts with the official 2017 520i 290 Nm and ATM 290 Nm application. The EU6d label is not sufficient to map a separate variant to these RDW rows. No tuned-output vote.
- Factory-only corroboration: [manufacturer-v3-2-bmw-520i-2017](https://www.press.bmwgroup.com/belux/article/attachment/T0270802FR/385610).

### 14. SKODA OCTAVIA — 1595 cc / 75 kW

- **accepted** [shiftech-v2-65fa7d80495bb895](https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2005/petrol/1.6i-8v-102): Published Octavia 2005 1.6i 8v 102 PS/148 Nm, nominal 1600 cc consistent with 1595 cc. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 15. MAZDA MAZDA 6 — 1798 cc / 88 kW

- **accepted** [atm-v3-48d2bc1d8f40e7e8](https://www.atm-chiptuning.com/chiptuning/mazda-6-18i-16v-120pk/): Exact Mazda 6 1798 cc/120 PS/165 Nm L8-DE application, provider period 2003–2008. No extension to observed 2009. Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **unresolved-or-rejected** [shiftech-v2-db1e809928c83527](https://www.shiftech.eu/en/chiptuning/car/mazda/mazda-6/2003/petrol/1.8i-mzr-122): Factory label 122 PS differs from exact 120 PS ATM application. Do not merge by the permissive power tolerance alone or inherit its Stage 2 without factory-variant confirmation.

### 16. MERCEDES-BENZ B 180 — 1595 cc / 90 kW

- **accepted** [atm-v3-ccdbe137e9c76ada](https://www.atm-chiptuning.com/chiptuning/mercedes-benz-b-180-cgi-122pk/): W246 M270.910 1595 cc/122 PS/200 Nm. Review stops before the unresolved overlapping 2014 application; 2011 is before the provider period.
- **unresolved-or-rejected** [atm-v3-d02765dbe10162db](https://www.atm-chiptuning.com/chiptuning/mercedes-benz-b-180-cgi-122pk-6559/): Overlapping 2014 W246 page has OM270 engine-code label for petrol and a different tuning torque. Needs engine/generation mapping before promotion.
- **unresolved-or-rejected** [shiftech-v2-b1a950cea4f6e6f9](https://www.shiftech.eu/en/chiptuning/car/mercedes/b/2013-w246/petrol/180-eu6-1.6t-122): EU6-specific 2013 application and 175 PS/260 Nm do not establish applicability for every 2011–2014 row; transition/engine scope not independently resolved.

### 17. MITSUBISHI MITSUBISHI COLT — 1499 cc / 80 kW

- **unresolved-or-rejected** [unlimited-v2-159b2c7256791ef9](https://www.unlimitedtuning.nl/chiptuning-mitsubishi-colt-1-5i-109-pk.html): Exact 109 PS/145 Nm → 121 PS/163 Nm Normal table retrieved, but no defensible generation/year scope. No promotion from an undated application.

### 18. FIAT FIAT 500 — 1242 cc / 51 kW

- **accepted** [atm-v3-d40c7cbf5f166a1e](https://www.atm-chiptuning.com/chiptuning/fiat-500-595-695-12i-8v-69pk/): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 19. SKODA OCTAVIA — 1390 cc / 90 kW

- **accepted** [atm-v3-eeb2a2f96c297e9f](https://www.atm-chiptuning.com/chiptuning/skoda-octavia-14-tsi-122pk/): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.
- **accepted** [shiftech-v2-efc584da161ee503](https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2005/petrol/1.4-tsi-tfsi-122): Reviewed only for the requested observed years within the published application period; this review limit is not a claimed production end. Workshop must verify actual engine, ECU and hardware.

### 20. BMW 318I — 1998 cc / 115 kW

- **accepted** [atm-v3-46df01faaa17f8c4](https://www.atm-chiptuning.com/chiptuning/bmw-3-serie-318i-156pk/): Official 318i launch confirms 156 PS/250 Nm in 2020; Shiftech separates G20/G21 and 2022 LCI. Narrow the ATM open G2x application to reviewed pre-LCI years 2020–2021. ECU options are not a vehicle-specific access finding.
- **unresolved-or-rejected** [atm-v3-bf23d490c8d1b889](https://www.atm-chiptuning.com/chiptuning/bmw-3-serie-318i-156pk-13115/): 2024 G2x LCI/B48B20A application requires confirmation against the separately dated 2022 G20/G21 LCI application; no generic 2020–2024 ECU/access claim.
- **accepted** [shiftech-v2-d6fc4520e5152921](https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2022-g20-g21-lci/petrol/18i-2.0t-eu6d-156): Separate G20/G21 LCI application. Limit review to 2022–2023 because ATM lists a further 2024 LCI application with a different engine-code label. Do not assume identical ECU access or merge 2024 on nominal power alone. Large-gain single-source review flag retained.
- **accepted** [shiftech-v2-139ccbe44e452003](https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2019-g20-g21/petrol/18i-2.0t-eu6d-156): Official 2020 launch and distinct Shiftech 2022 LCI page bound this reviewed pre-LCI application to 2020–2021. Two providers independently publish 260 PS/420 Nm; no inferred factory de-rating or unlock.
- Factory-only corroboration: [manufacturer-v3-2-bmw-318i-2020](https://www.press.bmwgroup.com/portugal/article/detail/T0304601PT/bmw-model-upgrade-measures-taking-effect-in-the-spring-of-2020).

## Validation

Validation commands, browser evidence and client-boundary measurements are recorded in `v3-2-verification.json` after the production build. `pnpm test:nl-fleet-v3-2` verifies unchanged prior profiles/sources, all 20 decisions, 18 positive frozen configurations, 90 negative identity guards, explicit Stage 2 retention, overlap ambiguity and BMW scope/torque conflicts. `node --no-warnings scripts/qa-v3-2-cohorts.cjs` checks indexed/exhaustive agreement for all 400 registrations.

Local production browser QA separates genuine HTTP owner lookups from deterministic intercepted DTOs for newly recovered configurations. Browser fixture plates are synthetic, and their interception is never described as live RDW evidence. Preview deployment status is recorded separately; an SSO-protected preview is not claimed as hosted browser QA.

### Completed checks

| Command | Result |
|---|---|
| `pnpm catalog:audit` | PASS |
| `pnpm test:tuning` | PASS |
| `pnpm test:nl-fleet-v2` | PASS |
| `pnpm test:nl-fleet-v3` | PASS |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm build` | PASS |
| `pnpm test:nl-fleet-v3-2` | PASS |
| `node --no-warnings scripts/qa-v3-2-cohorts.cjs` | PASS |
| `node --no-warnings scripts/qa-v3-2-browser.cjs` | PASS |

Browser: **118** main cases, including **18 genuine HTTP owner cases** and **100 intercepted DTO cases**, at 320/390/768/1440 px plus EN/PL compact layouts. 3 supplementary localized-date/viewport cases. Runtime errors: **0**. Browser results and screenshots: [browser-v3-2](./browser-v3-2/).

Client: **25 JS files / 1,422,757 bytes**, delta **0 bytes**; source-profile ID leaks **0**; client imports of server catalog **0**, sourced dataset **0**. Public vehicles **24**, sitemap URLs **291**.

Main, production and PRs #12–15 match the recorded protected baseline. No action was performed in noordtune-www. The normal branch push and exact-head Preview status are recorded in Draft PR #16; no production deployment or merge is part of this pass.

### Exact changed-file manifest

- `data/research/batches/v3-2-targeted.json`
- `data/research/profile-consensus.json`
- `data/research/source-pages.json`
- `data/research/unresolved-conflicts.json`
- `data/research/v3-2-acceptance.json`
- `data/research/v3-2-baseline.json`
- `data/research/v3-2-counterpart-links.json`
- `data/research/v3-2-coverage-report.json`
- `data/research/v3-2-kia-hyundai-acceptance.json`
- `data/research/v3-2-next20-decisions.json`
- `data/research/v3-2-preservation-checkpoint.json`
- `data/research/v3-2-results.json`
- `data/research/v3-2-verification.json`
- `docs/tuning-data/V3_2_TARGETED_RECOVERY.md`
- `docs/tuning-data/browser-v3-2/browser-acceptance.json`
- `docs/tuning-data/browser-v3-2/doblo-en-320-viewport.png`
- `docs/tuning-data/browser-v3-2/doblo-nl-1440-viewport.png`
- `docs/tuning-data/browser-v3-2/doblo-pl-320-viewport.png`
Owner-specific screenshots were removed during release privacy cleanup; the release report retains anonymous review evidence.
- `docs/tuning-data/browser-v3-2/rank-2-2016-320.png`
- `docs/tuning-data/browser-v3-2/rank-20-2020-320.png`
- `docs/tuning-data/browser-v3-2/rank-20-2022-320.png`
- `docs/tuning-data/browser-v3-2/rank-7-2008-320.png`
Owner-specific screenshots were removed during release privacy cleanup; the release report retains anonymous review evidence.
- `docs/tuning-data/browser-v3-2/visual-acceptance.json`
- `package.json`
- `scripts/build-tuning-profiles.ts`
- `scripts/build-v3-2-review.cjs`
- `scripts/qa-v3-2-browser.cjs`
- `scripts/qa-v3-2-cohorts.cjs`
- `scripts/test-nl-fleet-v2.ts`
- `scripts/test-nl-fleet-v3.ts`
- `scripts/test-tuning-profile-dataset.ts`
- `scripts/test-v3-2-targeted-recovery.cjs`
- `src/data/tuning-profiles/profiles.json`
- `src/data/tuning-profiles/source-index.json`
