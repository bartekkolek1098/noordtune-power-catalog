# NoordTune RDW — third source-reviewed bulk engine batch (2026-10-08)

## Customer truth and release purpose

Third bulk batch targets the biggest **NET-new**, previously source-unverified original RDW engine configurations in the frozen **3,000-record technical QA cohort**. Applications are restricted to exact RDW original registered make, trading name, body/type, first-admission YEAR, cc, cylinders, kW (not marketing PS) and a single petrol/diesel fuel. All Stage 1 indications are published by **at least two independent providers** per original engine. They are **neither NoordTune dyno measurements nor a power/torque guarantee**. ECU and gearbox condition/compatibility require a workshop quote. Public Stage 2/3 remain withheld. Do not infer any Netherlands-wide fleet share from this nonrepresentative historical frozen sample.

The new alias-safe matcher recognizes **word-bounded, exact allowlisted RDW names** containing hyphens or multiple words (MX-5, T-Roc, C5 Aircross, Nissan X-Trail) without accepting truncated lookalikes (MX-50, T-Rocket) or any new name lacking an exact RDW trading-name allowlist. This is deliberately a matcher logic change, so **full** QA is required for this batch, not only the expedited 25-journey data-only gate.

## 15 reviewed configurations with frozen observation counts

| Exact vehicle & required RDW body/type | Original kW, cc and year scope | Published **Stage 1** (PS / Nm) | Frozen observations with new exact match |
|---|---|---|---:|
| Mazda MX-5 NC1 1.8 MZR naturally aspirated | 93kW, 1798cc, 2007–2014 | **138–139 / 170–182** | 19 |
| Volkswagen T-Roc I A1 1.5 TSI 150 | 110kW, 1498cc, **2020** | **175 / 300** | 4 |
| Volkswagen T-Roc I R A1 2.0 TSI 300 | 221kW, 1984cc, **2019–2021** | **350–380 / 460–500** | 8 |
| Audi Q3 8U 2.0 TFSI 170 | 125kW, 1984cc, 2012–2015 | **255–260 / 380–400** | 11 |
| Nissan X-Trail III T32 1.6 DIG-T 163 | 120kW, 1618cc, 2017–2019 | **180–205 / 270–320** | 8 |
| BMW 320i G20 G3L B48 petrol | 135kW, 1998cc, **2019–2020** | **220–260 / 370–420** | 8 |
| BMW 320i G20 G3K B48 petrol | 135kW, 1998cc, **2020** | **220–260 / 370–420** | 4 |
| Citroën C5 Aircross I A PureTech 130 | 96kW, 1199cc, 2020–2021 petrol | **145 / 250–275** | 8 |
| Citroën C4 III B PureTech 130 | 96kW, 1199cc, 2020–2022 petrol | **145 / 250–270** | 8 |
| Nissan Juke II F16 DIG-T 117 | 86kW, 999cc, **2020** petrol | **130 / 240** | 4 |
| Nissan Juke II F16 DIG-T 114 | 84kW, 999cc, 2021–2024 petrol | **120–130 / 220** | 6 |
| Nissan Micra K14 IG-T 92 | 68kW, 999cc, 2021–2024 petrol | **110–120 / 184–220** | 8 |
| Audi A1 Sportback facelift 8X 1.0 TFSI 95 | 70kW, 999cc, 2015–2017 petrol | **120–130 / 235–240** | 8 |
| Peugeot Partner III E 1.5 BlueHDi 100 marketed | 75kW, 1499cc, 2022–2024 diesel | **140 / 300–345** | 7 |
| Volkswagen Tiguan I 5N 2.0 TSI 180 | 132kW, 1984cc, 2012–2014 petrol | **235–260 / 400** | 5 |
| **TOTAL** | | | **116** |

The deterministic, aggregate-only `docs/rdw-evidence-funnel.{json,md}` report after the complete 15 manifests: **source-linked indicative Stage1 1,556→1,672 (+116)**, Stage1 numeric withheld **1,439→1,323 (-116)**; 5 other unsourced numeric, Stage3 numeric 0. Those numbers are **only** this fixed deliberately purpose-selected frozen technical cohort. They do not describe national Dutch RDW registrations.

## External Stage 1 provenance and deliberate exclusions

Every original/publisher power and torque claim, source URL and scope is pinned in `src/data/reviewed-rdw-bulk-batch-3.ts`; the build-time `buildReviewedRdwBulkBatch` constructor checks source-stage values against the manually reviewed envelope, >=2 distinct publishers and source original identity where existing archival source IDs are used.

Key independent sources (standard Stage1, without ethanol/Stage2/DSG+ packages):
- **Mazda**: [BR-Performance NC 125/167→138/182](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/36-mazda/6639-mx5/6640-nc-2006-2015/6641-1-8-mzr/) and [Shiftech NC 126/155→139/170](https://www.shiftech.eu/en/chiptuning/car/mazda/mx5/2005/petrol/1.8i-mzr-126). Different source original torque **167 vs155Nm**. Year **2005 excluded** because BR's NC range starts 2006; no modified hardware testimonial gain is a plain Stage1.
- **T-Roc I 1.5TSI**: [BR 175/300](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/9674-t-roc/9675-2018-2025/9630-1-5-tsi/) and [Shiftech 175/300](https://www.shiftech.eu/de/chiptuning/auto/volkswagen/t-roc/2017/benzin/1.5-tsi-150). **2022/2024 facelift 1.5 eTSI excluded**, even when badge and kW match.
- **T-Roc R**: [BR ordinary Stage1 380/500](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/9674-t-roc/9675-2017-2025/13731-r-2-0-tsi-2022/), [Shiftech 350/460](https://www.shiftech.eu/en/chiptuning/car/volkswagen/t-roc/2017/petrol/2.0-tsi-r-300). **BR's separate combination with DSG calibration 400/520, Stage2 and facelift 2024 all EXCLUDED**. RDW 221kW rounds 300 metric PS; DSG DQ381/ECU control-unit limits unknown.
- **Audi Q3**: [VAGtechniek 8U170 Stage1 255/380](https://www.vagtechniek.nl/chiptuning/audi/q3/8u/2.0-tfsi-170pk/) and [Shiftech Q3 8U170 260/400](https://www.shiftech.eu/en/chiptuning/car/audi/q3/2011-8u/petrol/2.0-tfsi-170). Large claimed factory de-rating gain: never inferred hardware parity or installation suitability from 125kW alone. VAG Stage1+ and factory update excluded.
- **X-Trail**: [Shiftech facelift 2017 1.6DIG-T 180/270](https://www.shiftech.eu/en/chiptuning/car/nissan/x-trail/2017-iii-ii/petrol/1.6-dig-t-163), [ECU-Soft T32 205/320](https://www.ecu-soft.be/chiptuning/nissan/x-trail/6578/1-6-dig-t-163-9863). ECU-Soft page uses a 2014–2017 scope, so **2019 requires separate installed ECU revision confirmation** before any mapping. Stage2 189/284 excluded. 2015 first admissions outside this new sample scope.
- **BMW 320i G20**: [BR GPF ordinary 220/370](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/5-bmw/525-serie-3/10456-g2x-03-2019-06-2024/12115-320i-gpf/), [Mosselman B48 RON98 260/420](https://www.mosselmanturbo.com/en/bmw-320i-g20-184hp); marketed 184PS/290Nm, RDW original135kW. No Shiftech high 300PS or 2024 LCI claim. Specific Bosch ECU unlock/gearbox access MUST be established.
- **C5 Aircross**: [BR 145/250](https://www.br-performance.lu/en-lu/chiptuning/1-cars/17-citroen/820-c5-c5-aircross/10403-2018/10406-1-2-puretech-gpf/), [Shiftech 145/275](https://www.shiftech.eu/en/chiptuning/car/citroen/c5-aircross/2018/petrol/1.2-thp-puretech-gpf-130). Hybrid/E85 excluded, wet-belt/GPF/EAT torque limitations apply.
- **C4 III**: [BR from Dec2020 145/250](https://www.br-performance.fr/brp-bayonne-es/chiptuning/1-vehiculos/17-citroen/808-c4/11287-12-2020/11099-1-2-puretech-gpf/), [ATM C4 III 2020-on 145/270](https://www.atm-chiptuning.com/chiptuning/citroen-c4-12-puretech-130pk-11400/), and [ECU-Soft C4 III 2020–2023 145/250](https://www.ecu-soft.be/chiptuning/citroen/c4/11287/1-2-puretech-gpf-130-14303). Four fixed RDW cases first admitted **Nov 2020** predate BR's Dec title, but are covered by ATM and ECU-Soft **2020+ independent pages**, with installed ECU still a workshop condition. Avoid older C4 2015 and different ECU generations.
- **Juke II**: for 86kW/117 [BR 130/240](https://www.br-performance.be/en-be/chiptuning/1-cars/41-nissan/2033-juke/10911-2020/12391-1-0-dig-t/) and [GSG 130/240](https://gsgperformance.com/car-detail/nissan/juke/2020/1-0-dig-t-117hp). For 84kW/114 [Shiftech 120/220](https://www.shiftech.eu/en/chiptuning/car/nissan/juke/2020/petrol/1.0-dig-t-114) and [Unlimited 130/220](https://www.unlimitedtuning.nl/chiptuning-nissan-juke-1-0-dig-t-114-pk.html). Provider stock torque **180 vs200Nm** in the 114PS version, owner CVT/manual unresolved; do not borrow F15 1.2 DIG-T figures.
- **Micra K14 IG-T92**: [BR 110/184](https://www.br-performance.be/en-be/chiptuning/1-cars/41-nissan/2040-micra/11419-2021/14221-1-0-ig-t/), [Shiftech 120/220](https://www.shiftech.eu/en/chiptuning/car/nissan/micra/2020/petrol/1.0-ig-t-92). Original stock torque source contradiction **144 vs160Nm**; not the earlier K14 100PS original74kW.
- **A1 Sportback 8X 1.0TFSI95**: [BR 130/240](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/11-audi/202-a1/6567-8x-2015-2018/6568-1-0-tfsi/), [Shiftech 120/235](https://www.shiftech.eu/en/chiptuning/car/audi/a1/2015-8x/petrol/1.0-tsi-tfsi-95). Tuners label A1 8X, not separate exact Sportback trading name: match requires Sportback RDW 8X plus ECU verification; original stock torque 160 vs175Nm differs by source.
- **Partner diesel**: [ATM BlueHDi100 140/300](https://www.atm-chiptuning.com/chiptuning/peugeot-partner-15-bluehdi-100pk/), [Unlimited 140/345](https://www.unlimitedtuning.nl/chiptuning-peugeot-partner-1-5-bluehdi-100-pk.html). Source marketing 100PS ≠ registered **75kW→102 metric PS**; exact DV5 ECU, clutch, DPF and AdBlue compliance required.
- **Tiguan I 2.0TSI180**: [Unlimited 235/400](https://www.unlimitedtuning.nl/chiptuning-volkswagen-tiguan-2-0-tsi-180-pk.html), [ATM 260/400](https://www.atm-chiptuning.com/chiptuning/volkswagen-tiguan-20-tsi-180pk/). Provider original torque 320 vs280Nm: distinct EA888 engine/ECU variant suspected, withhold guarantee; type5N first admissions 2017 not included.

**Unresolved high-volume cases stay withheld:** Nissan Qashqai J11 1.2 DIG-T85kW (**manual/CVT torque limitations**), Ford Transit Connect 1.5 TDCi vs EcoBlue hardware, BMW F30 N20/B48 320i engine boundaries, 2024 T-Roc facelift/eTSI/R revisions, pure hybrid/mild-hybrid cars, older atmospheric engines lacking actual safe tuning evidence. “Recognized in RDW” is not equal to confirmed Stage1 suitability.

## QA and release requirements

- `scripts/test-rdw-bulk-reviewed-3.ts` tests **15/15 exact source-reviewed original configurations**, all **116/116** frozen purpose-selected matches, **240+** wrong model/year/cc/kW/type/cylinder/fuel tests, plus explicit **whole-word allowlisted name anti-false-positive** regressions.
- Update the executable `scripts/test-rdw-qa-risk-plan.cjs` and `scripts/qa-rdw-browser-gate.cjs`; current third manifest is 15 engines, older 20/15 remain regression fixtures. `scripts/qa-rdw-bulk-3-browser.cjs`: 75 real multilingual viewport journeys **in full mode**, one-per-engine fast mode for later source-only batches, no real customer plate/VIN.
- **Matcher change ⇒ high-risk release under `RDW_RISK_BASED_QA_POLICY.md`: mandatory full browser QA for new and affected old batches**, not 25 only; protected exact-HEAD Vercel Preview READY and browser QA + direct API HTTP 200/405/400, then squash-merge exact SHA, production alias SHA verification and full release QA. Keep UX PR #24 and research PR #31 unrelated drafts.
- Full `pnpm test:tuning` includes all three source-reviewed bulk batches, all existing regression tests, and **reproducible frozen 3,000-row aggregate report check**. Lint, typecheck, SEO, data audit and Next.js build mandatory. No customer data or browser registration appears in version control.
