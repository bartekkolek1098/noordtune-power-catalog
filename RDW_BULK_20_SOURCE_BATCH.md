# NoordTune RDW — second bulk source-backed Stage 1 batch (2026-10-08)

## Release intent and fixed sampling methodology

This is an **explicitly reviewed 20-configuration** second batch. Its 113 historical RDW technical observations were selected long before this implementation as part of the fixed **3,000-observation, 250-group nonrandom historical cohort**. These are observations, **not distinct national licence plates, fleet population statistics or customer guarantees**. The original 3,000-case report and existing numbered direct-source profiles are never edited to fabricate coverage.

Every new tuning reference requires an exact RDW make/trading name, type/body code, original registered power in kW (decimal where RDW actually provides it), displacement, cylinders, first-admission year and a *single* matching petrol/diesel fuel. Source providers' original torque is **not** an RDW field; a source marketing 100/90/115 PS label may differ by one rounded metric PS from registered 74/67/85 kW.

| Independently scoped registered car, fuel and first admission | Registered original | Published original Nm | External standard Stage 1 PS / Nm | Fixed historical observations |
|---|---:|---:|---:|---:|
| Hyundai i20 GB 998cc 3c petrol, 2020 1.0 T-GDI 100 | 73.6 kW → 100 PS | 172 | 140 / 230 | 4 |
| Seat Ibiza KJ 999cc 3c petrol, 2018 1.0 TSI 95 | 70 kW → 95 PS | 160 | 130–135 / 225–240 | 2 |
| Seat Ibiza KJ 999cc 3c petrol, 2019 1.0 TSI 95 | 70 kW → 95 PS | 175 (a tuner says 160) | 130–135 / 225–240 | 3 |
| Seat Ibiza KJ 999cc 3c petrol, 2018–19 1.0 TSI 115 | 85 kW → 116 PS | 200 | 130–135 / 225–240 | 3 |
| Seat Ibiza 6J 999cc 3c petrol, 2015 1.0 TSI 95 | 70 kW → 95 PS | 160 | 130–135 / 225–240 | 3 |
| Nissan Micra K14 999cc 3c petrol, 2019–20 1.0 IG-T 100 | 74 kW → 101 PS | 160 | 115–120 / 200–220 | 12 |
| Renault Clio V RJA 999cc 3c petrol, 2019–20 1.0 TCe 100 | 74 kW → 101 PS | 160 | 115–120 / 200–220 | 16 |
| Renault Clio V RJA 999cc 3c petrol, **2021** TCe 90 pre-facelift | 67 kW → 91 PS | 160 | 110 / 200 | 4 |
| Renault Clio V facelift RJA 999cc 3c petrol, **2024–25** TCe 90 | 67 kW → 91 PS | 160 | 110–120 / 200–220 | 11 |
| Dacia Sandero III DJF 999cc 3c petrol, 2023–24 TCe 90 | 67 kW → 91 PS | 160 | 110–120 / 200–220 | 6 |
| Ford Fiesta VII JA8 998cc 3c petrol, 2015–17 EcoBoost 100 | 74 kW → 101 PS | 170 | 145 / 240–250 | 5 |
| Ford Fiesta VIII JHH 998cc 3c petrol, 2019 EcoBoost 100 | 73.5 kW → 100 PS | 170 | 145 / 240–250 | 4 |
| Opel Corsa F U 1199cc 3c petrol, **2020** 1.2T 100 | 74 kW → 101 PS | 205 | 130–135 / 240 | 3 |
| Citroën C3 III S 1199cc 3c petrol, **2017** 1.2 PureTech 110 | 81 kW → 110 PS | 205 | 145 / 270 | 2 |
| Renault Kangoo II W 1461cc 4c diesel, 2015–19 1.5 dCi 75 | 55 kW → 75 PS | 200 (source variation 180) | 110–115 / 240–260 | 8 |
| Peugeot 5008 II M 1199cc 3c petrol, **2018–19** 1.2 PureTech 130 | 96 kW → 131 PS | 230 | 145–150 / 270–275 | 8 |
| Peugeot 5008 II facelift M 1199cc 3c petrol, **2021** PureTech 130 | 96 kW → 131 PS | 230 | 145–150 / 270–275 | 4 |
| VW Caddy 2KN 1968cc 4c diesel, **2013–14** 2.0 TDI 140 | 103 kW → 140 PS | 320 | 180–185 / 400–410 | 5 |
| VW Golf VI 1K 1390cc 4c petrol, 2009 1.4 TSI 122 | 90 kW → 122 PS | 200 | 145 / 250 | 4 |
| VW Golf VII AU 1197cc 4c petrol, **2014–15** 1.2 TSI 105 | 77 kW → 105 PS | 175 | 130 / 215–220 | 6 |
| **Total / twenty independently scoped applications** | | | | **113** |

All Stage 1 figures are **published reference indications for potentially different calibration levels**, not a measured NoordTune result, an achievable guarantee or permission to tune an uninspected drivetrain. Customer Stage 2 and Stage 3 remain without numbers and pricing remains on-request. A first-admission year is not proof of physical production year or installed ECU.

## Auditable source provenance (direct publisher URLs and original scopes)

The checked, immutable-seed manifest `src/data/reviewed-rdw-bulk-batch-2.ts` includes **actual published source URLs and the source's exact standard Stage 1 PS/Nm per author**, not copied supplier site templates. It reuses the strict source-record/provenance compiler from the previous 15-engine release. For archived publisher profiles the loader checks the retrieved actual-page record, original power/fuel/model/year and selected source Stage 1, and requires two independent publishers. Manually researched extra pages also require an independently named author, URL and exact pinned values. Unavailable sources, differing factory identity, incompatible engine size, electrification and any out-of-range published value cause an error. These are not dynamically generated percentages or full 1,269-profile catalogue promotions.

Illustrative independently verified and generation-specific sources:

- [BR-Performance Seat Ibiza KJ 2019–2021 95 PS, Stage 1 130/240](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/48-seat/2700-ibiza/9248-v-kj-06-2017-2021/22305-1-0-tsi/) contrasted with [VAGtechniek Ibiza KJ 95 PS Stage1 135/225](https://www.vagtechniek.nl/chiptuning/seat/ibiza/kj/1.0-tsi-95pk/), not VAG's Stage1+ 140/240. Different providers' **160 vs 175 Nm original** values are explicitly flagged for owner check.
- [BR-Performance Ibiza KJ 115 Stage1 130/240](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/48-seat/2700-ibiza/9248-a0-06-2017-2024/9250-1-0-tsi/) vs [VAGtechniek KJ 115 Stage1 135/225](https://www.vagtechniek.nl/chiptuning/seat/ibiza/kj/1.0-tsi-115pk/). 2015 Ibiza 6J is a **different** earlier facelift with independent sources.
- [Shiftech Nissan Micra K14 IG-T 100 Stage1 120/220](https://www.shiftech.eu/en/chiptuning/car/nissan/micra/2020/petrol/1.0-ig-t-100) vs [Hirsch Racing K14 IG-T100 Stage1 115/200](https://www.hirsch-racing.de/en/chiptuning/nissan/micra/k14-2017/10-ig-t-100hp/). Do **not** borrow 117PS DIG-T or K14 92PS/68kW sources (144 versus 160Nm factory controversy).
- [BR-Performance Renault Clio V 100 Stage1 115/200](https://www.br-performance.be/en-be/chiptuning/1-cars/45-renault/2453-clio/9874-clio-5-03-2019/9875-1-0-tce/) vs [Shiftech Clio V TCe100 120/220](https://www.shiftech.eu/en/chiptuning/car/renault/clio/2019-v/petrol/1.0-tce-100). Facelift TCe90 has separately published [BR 110/200](https://www.br-performance.be/en-be/chiptuning/1-cars/45-renault/2453-clio/14353-v-facelift-2023-2025/23257-1-0-tce/) and [Shiftech 120/220](https://www.shiftech.eu/en/chiptuning/car/renault/clio/2023-v-ii/petrol/1.0-tce-90); 2026 registrations are withheld pending newer-generation review.
- [Shiftech Sandero III 1.0 TCe90 120/220](https://www.shiftech.eu/en/chiptuning/car/dacia/sandero/2020-iii/petrol/1.0-tce-90) vs separately retrieved Unlimited tuning 110/200 (archived source ID in manifest); no LPG ECO-G.
- [BR Fiesta MkVII 100 Stage1 145/240](https://www.br-performance.fr/brp-toulouse/reprogrammation/1-voitures/23-ford/1117-fiesta/5382-vii-facelift-2012-2017/5483-1-0t-ecoboost/?stage=4271) vs [Shiftech MkVII 145/250](https://www.shiftech.eu/en/chiptuning/car/ford/fiesta/2013-mkvii/petrol/1.0-t-ecoboost-100), and independently [BR Fiesta MkVIII 145/240](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1117-fiesta/9067-mk8-active-2017/9068-1-0t-ecoboost/) — never mix JA8 and JHH engines. **Wet-belt condition is mandatory.**
- [BR Opel Corsa F Turbo100 135/240](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/42-opel/2130-corsa/10981-f-2019/11415-1-2-turbo-gpf/) vs [Shiftech 130/240](https://www.shiftech.eu/en/chiptuning/car/opel/corsa/2019-f/petrol/1.2-turbo-100); later 2024 chain or hybrid variants not preapproved.
- [BR Citroën C3 III pre-GPF PureTech110 145/270](https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/17-citroen/802-c3-c3-picasso/7817-11-2016-2020/7820-1-2t-puretech/) vs [Shiftech 145/270](https://www.shiftech.eu/en/chiptuning/car/citroen/c3/2017/petrol/1.2-thp-puretech-110), **EAT transmission maximum varies**, GPF 2019 source 145/250 excluded.
- [Shiftech Kangoo II 1.5dCi75 110/240](https://www.shiftech.eu/en/chiptuning/car/renault/kangoo/2013-ii-ii/diesel/1.5-dci-eu6-75) vs independent Unlimited 115/260 (pinned in archived source dataset); owner torque code needed due 180/200Nm published stock disagreement.
- [BR Golf VI 1.4TSI122 145/250](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/2969-vi-2008-2012/2974-1-4-tsi/) vs [VAGtechniek Golf6 145/250](https://www.vagtechniek.nl/chiptuning/volkswagen/golf/6/1.4-tsi-122pk/), not 140/160PS twincharger. Golf VII 1.2 TSI105 separately [Shiftech 130/220](https://www.shiftech.eu/en/chiptuning/car/volkswagen/golf/2012-vii-mki/petrol/1.2-tsi-ss-105) and [VAGtechniek 130/220](https://www.vagtechniek.nl/chiptuning/volkswagen/golf/7/1.2-tsi-105pk/).

All remaining archived provider URLs (Hyundai i20, Peugeot 5008 and VW Caddy) are embedded into the source references sent to the customer and the documented manifest. No Stage2, GPF/DPF deletion, E85, ECU impersonation or unsupported “DSG safe 275Nm” assumptions.

## Repeatable privacy-safe QA / release

The second-batch test `scripts/test-rdw-bulk-reviewed-2.ts` asserts the **20** independent applications, their original factory kW→PS and exact model/type/year/cc/cylinders/fuel; full frozen technical cohort positives (**113**), **320** adversarial negatives, no numeric Stage2/3, no VIN or plate logs. The browser acceptance script `scripts/qa-rdw-bulk-2-browser.cjs` runs **100 multilingual customer journeys**: each of 20 applications × NL/EN/PL at 390px + NL 320/1180px, with injection of synthetic technical RDW fixtures, checking exact registered facts, Stage1 envelope, quote/chart visibility, browser errors, overflow and privacy.

The frozen population is unchanged and nationally **nonrepresentative**. The fixed audit now confirms source-linked indicative numeric Stage1 **1,527 → 1,556 (+29 new source-linked outcomes)**, numerical Stage1 withheld **1,468 → 1,439 (-29)**, five other unsourced numerical outcomes and zero public Stage3. **113/113** exact registrations match the newly reviewed manifests, but **84 already had independently source-linked results in the pre-existing catalogue**; do not double count these as newly recovered. No generic generated gain percentages were added. Regenerate `docs/rdw-evidence-funnel.json` and `.md` with `pnpm report:rdw-funnel`, gate in `pnpm test:tuning`, then require SEO/audit/typecheck/lint/build, exact SHA READY protected Vercel Preview Chromium **100/100**, API **200/405/400**, and same tests on the production alias + old verified Audi/Mégane/Octavia regressions. PR #24 and #31 remain draft; do not merge.
