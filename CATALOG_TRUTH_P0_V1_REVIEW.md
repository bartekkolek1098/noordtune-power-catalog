# Catalog truth P0 V1 review

Review date: 2026-10-04. Status: implementation candidate for owner review; no merge or production release is authorized by this report.

## Scope and provenance

Implementation branch: `fix/catalog-truth-p0-v1`, created directly from verified production `origin/main` at `14a6e5c0456cc7eda82602702fcadf38c3fcfb8a`. The initial working tree was clean. No `AGENTS.md` was present in the repository or its ancestors. The eight `docs/audits` files in [research Draft PR #18](https://github.com/bartekkolek1098/noordtune-power-catalog/pull/18), head `cb615e3fa288f276f90d981f248f47e173afb37c`, were read as research. No research commit was merged, cherry-picked or edited.

Only the 12 requested existing public profiles receive technical data changes. The other 12 public profiles are protected by independent baseline JSON hashes in the regression matrix. The 58,586 canonical records, provider datasets, service price schedule and reviewed commercial assignments remain unchanged. No expansion candidates, vehicle families, controller database or SEO routes were added.

Factory documentation establishes a configuration, not the identity of a customer's installed engine or controller. Tool support establishes an application family, not fitted ECU/TCU identity or access. Tuner figures remain conditional reference estimates. Registration year is only a scope guard and never proves engine generation, ECU, gearbox, TCU or unlock method.

## Per-profile decision

Numbers below are hp / Nm. Each row has exactly one primary action. Associated disclosure, quote and controller changes implement that action. All 12 require vehicle confirmation; “high” confidence refers to the correction or decision to withhold, not a guaranteed tuned result.

| Profile | Before | Evidence problem | Primary action | After | Confidence | Remaining vehicle-specific confirmation |
| --- | --- | --- | --- | --- | --- | --- |
| BMW 320d F30/F31 B47 | 2015–2022 F30/F31; stock 190/400; S1 225/470; EDC17/MD1 | Year range crosses G20; compatible tuners do not support retaining 470 Nm as a target | CORRECT | F30/F31 LCI 2015–2019 only; stock 190/400 retained; conditional S1 **220–225/440–460**; EDC17 documented application | High factory boundary; moderate conditional output | Body/generation, B47 application, fitted ECU suffix/access, gearbox/TCU, condition and fuel |
| Golf 7 GTI Performance | 2014–2020; stock 230/350; S1 300/450; Bosch MED17/MG1 | Standard GTI, 230 Performance and later 245 Performance were collapsed; wrong controller family label | CORRECT | Pre-facelift **230/350**, 2013–2017; conditional S1 **300–305/440–460**; Continental Simos 18.x application | High configuration boundary; moderate conditional output | Performance variant, facelift boundary, fuel, hardware, exact Simos and DSG/TCU |
| BMW G20/G21 320i | Stock 184/270; S1 225/320; MG1/MEVD17 family template | European factory stock torque is 300; retrieved tuned reference starts at incompatible 270 stock | CORRECT | Stock **184/300**; tuned outputs withheld; ECU/access unknown pending identification | High stock correction; high withholding decision | Exact European configuration, fitted ECU/access and transmission; compatible tuning reference |
| Golf 7 R | 2017–2018 300/400; S1 365/480; Bosch MED17/MG1 | Pre-facelift 300/380, facelift 310/400 and later GPF 300/400 are different scopes | CORRECT | Existing route narrowed to pre-facelift **300/380**, 2014–2016; conditional S1 **≈350/≈460**; Simos 18.x application | High factory boundary; moderate output, one corroboration index-only | Non-GPF/pre-facelift scope, engine, fuel, fitted Simos and DSG/TCU |
| BMW X3 E83 177 | M47 / EDC16; stock 177/350; S1 214/420 | Exact engine/controller pairing was unsupported for 177 hp | REMOVE_UNSUPPORTED_EXACT_CLAIM | Engine label **2.0d**; ECU unknown; no invented N47 suffix/EDC17; stock retained; conditional S1 **210–215/425–430** | High removal decision; moderate conditional output | Engine code, fitted ECU, manual/automatic transmission, condition |
| Audi A4 B9 TDI 190 | Stock 190/400; S1 230/470; generic DSG | Compatible S1 references are lower; longitudinal transmission must not be treated as transverse DSG | CORRECT | Stock retained; conditional S1 **220–225/450–460**; longitudinal S tronic candidate, fitted type unconfirmed | Moderate output/application; high uncertainty disclosure | Engine/emissions variant, ECU, longitudinal transmission and exact TCU |
| Passat B8 TDI 150 | Stock 150/340; S1 180/400 | Retrieved references start at 320 Nm; exact factory market/engine mapping not established | MAKE_CONDITIONAL | 150 hp retained; **stock torque unknown**, all tuning output withheld | High withholding decision; unresolved stock torque | Factory market scope, engine code, emissions, ECU, gearbox/TCU |
| Focus ST Mk3 petrol | Stock 250/360; S1 285/430 | Early and facelift references differ; fuel/calibration equivalence not established; 285 has no compatible multi-source basis here | WITHHOLD_OUTPUT | Mk3 petrol 250/360 retained; all tuned output withheld; manual transmission subject to confirmation | High withholding decision | Pre/post facelift, petrol identity, fuel, calibration, installed ECU and mechanical condition |
| XC60 I D5 220 | Stock 220/440; S1 255/520 | 220 hp alone does not distinguish 440/420 Nm engines; only one compatible retrieved tuning provider | WITHHOLD_OUTPUT | Existing 220/440 route scoped to **D5244T20 application**; excludes T22 220/420; all tuned output withheld | Moderate indexed factory application; high withholding decision | Fitted engine code, AWD/automatic scope, ECU/TCU and compatible tuning evidence |
| Leon Cupra 5F 300 | Stock 300/400; S1 365/480; Bosch MED17/MG1 | Retrieved tuner starts at 380 Nm; exact factory/market mapping unresolved; Golf R figures cannot be transferred | MAKE_CONDITIONAL | 300 hp retained; **stock torque unknown**, tuning withheld; Simos 18.x application | High withholding decision; moderate controller application | 5F variant, factory torque, emissions/GPF, fuel, ECU and DSG/TCU |
| A45 AMG W176 360 | Stock 360/450; S1 400/520; years 2013–2018 | Later 381/475 and W177 cannot share the same tuned output; compatible 360 references give different S1 torque | MAKE_CONDITIONAL | Existing 360/450 retained with explicit exclusion of 381/475 and W177; conditional S1 **400–410/530–540** | Moderate compatible tuner scope; no new factory claim | Actual 360 variant, fuel, fitted ECU, access and transmission |
| BMW F20/F21 118d | Stock 150/330; generic 2.0d/3.0d engine; S1 180/390; EDC17/MD1 | Factory documents disagree by market (320 vs 330 Nm); no exact NL mapping | MAKE_CONDITIONAL | **2.0 diesel**, 150 hp; stock torque unknown, tuning withheld; EDC17 documented application | High conflict/withholding decision; exact NL stock unresolved | Market/configuration, engine code, ECU/access, gearbox/TCU |

## Exact Stage value changes

`Withheld` means no numeric point or range is serialized for that Stage. It remains selectable and useful: the customer sees confirmation/custom hardware wording and a quote on request. Old figures are not silently restored by provider or canonical fallbacks.

| Profile | S1 before → after | S2 before → after | S3+ before → after |
| --- | --- | --- | --- |
| BMW 320d B47 | 225/470 → **220–225/440–460** | 245/520 → withheld | 280/600 → withheld |
| GTI Performance 230 | 300/450 → **300–305/440–460** | 335/500 → withheld | 430/560 → withheld |
| G20/G21 320i | 225/320 → withheld | 260/370 → withheld | 315/420 → withheld |
| Golf 7 R 300 | 365/480 → **≈350/≈460** | 425/540 → withheld | 510/620 → withheld |
| X3 E83 177 | 214/420 → **210–215/425–430** | 228/455 → withheld | 255/520 → withheld |
| A4 B9 TDI 190 | 230/470 → **220–225/450–460** | 255/530 → withheld | 290/590 → withheld |
| Passat B8 TDI 150 | 180/400 → withheld | 200/450 → withheld | 230/500 → withheld |
| Focus ST Mk3 | 285/430 → withheld | 315/470 → withheld | 380/540 → withheld |
| XC60 D5 | 255/520 → withheld | 275/560 → withheld | 305/620 → withheld |
| Leon Cupra 300 | 365/480 → withheld | 425/540 → withheld | 510/620 → withheld |
| A45 W176 360 | 400/520 → **400–410/530–540** | 430/560 → withheld | 500/640 → withheld |
| F20/F21 118d | 180/390 → withheld | 200/440 → withheld | 230/490 → withheld |

Stage 1 ranges are envelopes of compatible published references, not a promise of every power/torque combination. Golf R's identical published points are explicitly approximate. Original hardware condition, fuel, ECU access and transmission suitability need review. No common RON value, downpipe, catalyst, intercooler or turbo package is invented where retrieved sources do not establish a shared approved scope. Normal/Xtreme/S1+ labels are not relabelled as Stage 2. All 12 Stage 2 and Stage 3+ packages remain custom hardware/calibration and require a vehicle-specific quote; hardware is not included.

## Independent evidence receipts

Sources were independently checked on 2026-10-04 through web retrieval, separately from PR #18. “Page” includes extracted webpage/PDF content, not an authenticated vehicle measurement. “Index” means the search engine's cached extraction; it is not a fresh direct page capture. These limitations reduce precision rather than authorize stronger claims.

### Factory scope

- **BMW 320d:** [BMW Netherlands 2015 3 Series update](https://www.press.bmwgroup.com/netherlands/article/detail/T0216582NL/bmw-presenteert-de-vernieuwde-bmw-3-serie), page: 190 hp/400 Nm and F30/F31 update. [2019 F31 production price list](https://www.press.bmwgroup.com/italy/article/detail/T0281718IT/listino-prezzi-bmw-serie-3-touring-f31-valido-a-partire-dal-21-01-2019-per-la-produzione-dal-01-03-2019?language=it) and [new G21 introduction](https://www.press.bmwgroup.com/netherlands/article/detail/T0297106NL/prijzen-nieuwe-bmw-3-serie-touring?language=nl), index: 2019 handover. 2019 in the combined F30/F31 scope does not assert F30 production throughout that year or identify a car by registration date.
- **GTI:** [Volkswagen GTI engine versions](https://www.volkswagen-newsroom.com/en/engine-versions-golf-7-gti-profile-20034), page: Performance 230/350 in 2013–2017 versus 245/370 in 2017–2019; standard GTI remains a separate scope. Clubsport/TCR/R figures are excluded.
- **G20/G21:** [BMW European 3 Series launch](https://www.press.bmwgroup.com/belux/article/detail/T0285543NL/de-nieuwe-bmw-3-reeks-berline?language=nl), page, and [BMW Netherlands G21 specification](https://www.press.bmwgroup.com/netherlands/article/detail/T0297106NL/prijzen-nieuwe-bmw-3-serie-touring?language=nl), index: 320i 184/300. No tuning target or access method follows from this stock correction.
- **Golf R:** [Volkswagen Golf 7 engine versions](https://www.volkswagen-newsroom.com/de/motorversionen-golf-7-steckbrief-20040), page: R 300/380 in 2014–2016 and 310/400 in 2017–2019. That page does not document the later GPF 300/400 case; that case is expressly excluded rather than given a new public output.
- **X3:** [BMW 2008 model-year X3 technical announcement](https://www.press.bmwgroup.com/global/article/detail/T0011997EN/bmw-x3-best-seller-now-even-more-powerful-and-efficient-bmw-efficientdynamics-in-the-2008-model-year%3A-bmw-x3-2-0d-with-new-four-cylinder-diesel-engine-optional-six-speed-automatic-transmission-fuel-saving-technologies-on-all-variants-of-the-world-s-most-successful-sav-in-the-premium-segment?language=en), page: new four-cylinder 177/350, manual or optional six-speed automatic. It does not support the old exact M47/EDC16 pairing or a replacement suffix/controller assertion.
- **A4:** [Audi 2019 A4 technical dossier](https://www.audi-mediacenter.com/en/the-audi-a4-major-upgrade-for-the-bestseller-11884/download), PDF: the documented 40 TDI configuration is 190/400. This is corroboration for the requested stock scope, not proof that every early B9 or transmission has the same configuration.
- **Focus:** [Ford Europe ST technical PDF](https://media.ford.com/content/dam/fordmedia/Europe/documents/productReleases/Focus%20ST/FocusST-2014_Technical_Specifications_EU.pdf) and [Ford ST launch](https://media.ford.com/content/fordmedia/feu/gb/en/news/2014/10/29/new-ford-focus-st-petrol-and-diesel-range-priced-from-p22-195.html), index: petrol 250/360, six-speed manual. Direct PDF retrieval failed and the launch URL redirected. No newly verified factory fuel specification is asserted.
- **XC60:** [Volvo XC60 2016 engine specifications](https://www.volvocars.com/pl/support/car/xc60/2016/article/c48f21dbf78fa679c0a801e800b1d372/), index: D5244T20 220/440 differs from D5244T22 220/420. An alternative localized page returned only site chrome. The application code is a scope boundary, not installed-engine confirmation.
- **118d:** [BMW global specification PDF](https://www.press.bmwgroup.com/global/article/attachment/T0200199EN/302716), PDF, lists 150/320; [BMW UK 2015 specifications](https://www.press.bmwgroup.com/united-kingdom/article/detail/T0200962EN_GB/the-bmw-1-series-for-2015), page, lists 150/330. Exact Dutch applicability was not resolved, so neither torque is adopted.
- **Passat, Leon, A45:** no exact independently matched Dutch factory variant was established. Existing hp and A45 360/450 scope are retained conditionally; Passat and Leon stock torque are withheld instead of promoted from tuner catalogues.

### Compatible tuning observations used only as conditional Stage 1 references

| Scope | Independently retrieved sources and observations | Decision |
| --- | --- | --- |
| B47 190/400 | [Shiftech](https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2015-f30-f31-f35-lci/diesel/20d-190), page: S1 225/460; [Mosselman](https://www.mosselmanturbo.com/nl/bmw-320d-f30-f31-lci-190hp), page: 220/450; [Unlimited](https://www.unlimitedtuning.nl/chiptuning-bmw-320d-f30-f31-190-pk.html), page: Normal 220/440 | 220–225/440–460; Unlimited Xtreme 230/460 is not another Stage 1 endpoint or Stage 2 package |
| GTI Performance 230/350 | [BR-Performance](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/5106-gti-performance-2-0-tsi/), page: 300/440; [Unlimited](https://www.unlimitedtuning.nl/chiptuning-volkswagen-golf-7-2-0-gti-performance-230-pk.html), page: Normal 305/460 | 300–305/440–460; later GTI and Xtreme 315/480 are excluded |
| Golf R pre-facelift 300/380 | [Shiftech](https://www.shiftech.eu/en/chiptuning/car/volkswagen/golf/2012-vii-mki/petrol/2.0-tsi-300), page: 350/460; [BR-Performance](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/7593-r-2-0-tsi/), index after direct failure: 350/460 | ≈350/≈460; explicit retrieval limitation and vehicle confirmation |
| X3 E83 177/350 | [Shiftech](https://www.shiftech.eu/en/chiptuning/car/bmw/x3/2003-e83/diesel/20d-177), page: 210/430; [Unlimited](https://www.unlimitedtuning.nl/chiptuning-bmw-x3-2-0d-177-pk.html), page: S1 215/425 | 210–215/425–430; S1+ 224/465 not treated as Stage 2 |
| A4 B9 TDI 190/400 | [Shiftech](https://www.shiftech.eu/en/chiptuning/car/audi/a4/2015-b9/diesel/2.0-tdi-cr-eu6-190), page: 220/450; [Unlimited](https://www.unlimitedtuning.nl/chiptuning-audi-a4-b9-2-0-tdi-190-pk.html), page: Normal 225/460 | 220–225/450–460; Xtreme 235/480 excluded |
| A45 W176 360/450 | [Shiftech](https://www.shiftech.eu/fr/reprogrammation-moteur/voiture/mercedes/a/2012-w176/essence/45-amg-2.0t-360), page: 400/540; [Unlimited](https://www.unlimitedtuning.nl/chiptuning-mercedes-benz-w176-a45-amg-360-pk.html), page: Normal 410/530 | 400–410/530–540; Xtreme 420/550 and custom Stage 3 figures are not transferred |

### Rechecked figures deliberately not adopted

- [G20 Shiftech](https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2019-g20-g21/petrol/20i-2.0t-eu6d-184), page: 184/270 → 300/420. Its stock torque is incompatible with the corrected factory 300 Nm scope; 300/420 is not a NoordTune target.
- [Passat Shiftech](https://www.shiftech.eu/en/chiptuning/car/volkswagen/passat/2015-b8/diesel/2.0-tdi-cr-eu6-150), page: 150/320 → 185/420. [Passat Unlimited](https://www.unlimitedtuning.nl/chiptuning-volkswagen-passat-b8-2-0-tdi-150-pk.html), page: 150/320 → Normal 195/430. Neither resolves the exact original 340 Nm public scope, so stock 320 and either tuned figure are not adopted.
- [Focus Shiftech facelift](https://www.shiftech.eu/en/chiptuning/car/ford/focus/2014-mkiii/petrol/2.0-t-ecoboost-st-250), page: 265/440. [BR early Mk3](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1123-focus/1124-mk3-2010-2014/1141-st-2-0t-ecoboost/), index after 403: 270/430. A separately indexed BR facelift page also lists 270/430; that does not establish fuel/calibration/hardware equivalence for every car on the existing broad route. These are not pooled into one universal range.
- [XC60 Unlimited](https://www.unlimitedtuning.nl/chiptuning-volvo-xc60-2015-2-4-d5-220-pk.html), page: Normal 230/480 and Xtreme 240/500. One compatible provider does not establish a multi-source NoordTune target, and Xtreme is not Stage 2.
- [Leon Shiftech](https://www.shiftech.eu/en/chiptuning/car/seat/leon/2017-5f-mk2/petrol/2.0-tsi-300), page: 300/380 → 350/460. [Vagtechniek Cupra](https://www.vagtechniek.nl/chiptuning/seat/leon/5f-facelift/2.0-tsi-cupra-300pk/) exposed the application page but no numeric tuning table in retrieval. Neither resolves the Dutch factory scope; stock 380 and tuned 350/460 are not adopted.
- [118d Shiftech](https://www.shiftech.eu/en/chiptuning/car/bmw/1-serie/2015-f20-lci/diesel/18d-150), page: stock 320 → 190/400; [Mosselman 118d](https://www.mosselmanturbo.com/nl/bmw-118d-f20-f21-lci-150hp), page scope independently retrieved. Factory market conflict remains unresolved; no tuned figure is promoted.
- [Vagtechniek GTI](https://www.vagtechniek.nl/chiptuning/volkswagen/golf/7-/2.0-tsi-gti-performance-230pk/) did not expose a numeric tuning table during independent retrieval. Its PR #18 numeric suggestion is not counted as an independently verified endpoint.
- Published Stage 2/3 values require specific hardware and vehicle evidence beyond a generic list of possible parts. No exact hardware package is approved here, so none of those values is adopted across these 12 profiles.

### ECU / transmission / TCU application receipts

[Autotuner Simos 18.x coverage](https://us.autotuner.com/blogs/news/at-one-coverage-expansion-continental-simos-18-x-for-vag), page, documents VAG Simos 18.1–18.10 applications including Golf GTI/R and Leon/Cupra. The public family is Simos 18.x, with installed type explicitly to be confirmed; no suffix is inferred.

[Autotuner BMW EDC17 coverage](https://www.autotuner.com/blogs/news/bosch-edc17-one), page, documents E/F-series 18d/20d applications and subfamilies C06/C41/C50/C56/CP02/CP09/CP45/CP49. It supports a bounded EDC17 application family for B47/118d, not an installed subfamily or automatic access approval. MD1 is removed from those broad public labels. X3 is not assigned a replacement exact EDC17/N47 pairing. A G20 MG1CS003 tool page returned only site chrome and did not establish the requested exact application; G20 ECU remains unknown.

[Autotuner VAG TCU coverage](https://us.autotuner.com/blogs/news/autotuner-one-now-supports-tcu-flashing-vag-dq-dl-platfo), page, distinguishes transverse DQ200/DQ250/DQ381/DQ500 from longitudinal DL382/DL501 applications and includes the relevant model families. It does not prove the fitted TCU from a model name or year. Audi A4's candidate is labelled longitudinal S tronic; all 12 exact TCU types/variants remain unknown. Manual Focus has no TCU tuning offer. Other gearbox family claims lose any implication of fitted/verified identification.

## Product behavior, pricing and preservation

- **12 reviewed and changed** public profiles; **12 other public profiles unchanged**. Primary actions: CORRECT 5; REMOVE_UNSUPPORTED_EXACT_CLAIM 1; MAKE_CONDITIONAL 4; WITHHOLD_OUTPUT 2; KEEP 0; SPLIT 0. All 12 require vehicle-specific confirmation.
- Six conditional Stage 1 references; six Stage 1 outputs withheld; 12 Stage 2 and 12 Stage 3+ output pairs withheld: **30 Stage output pairs / 60 scalar point values** withheld. Two stock-torque corrections (G20 270→300; Golf R 400→380); three stock torques withheld (Passat 340, Leon 400, 118d 330).
- **Zero price amount/schedule/assignment changes.** Retained Stage 1 software from-prices: B47 €449, GTI €449, Golf R €549, X3 €299, A4 €449, A45 €549. Six other Stage 1 and all 12 Stage 2 quotes become on-request because their technical scope is unresolved. Stage 3 stays customer-facing custom/on-request; its raw historical values now also cannot enter Offers or quotes. Historical internal `price`/`sourcePrice` values are not presented as a resolved commercial quote.
- No €269 fallback. Advanced unlock remains conditional from €700. TCU remains conditional from €249 after installed-transmission confirmation. Options do not turn an on-request Stage into a numeric total; hardware is excluded.
- Shared nullable output fields and ranges reach vehicle pages, three Stage pages, calculator, recommendations, chart, selected DTO, RDW resolution, selectors, Offer markup and decoded WhatsApp draft consistently. Missing stock torque is not zero. Corrected public scope takes precedence over incompatible retained provider output, without changing the underlying datasets.
- NL/EN/PL distinguish application evidence and installed-type confirmation. Profile-specific exclusions appear in the calculator and quote draft. Customer serialization strips internal evidence prose and raw source IDs. Selected profile source links use readable hostnames. No source-voting or audit labels are rendered.
- Homepage summaries linking to corrected profiles use the same current Stage 1 data; the BMW example WhatsApp draft uses its range. Homepage internal links, titles, SEO metadata templates, canonicals, hreflang and sitemap generation logic are unchanged. Broader editorial category banners are not new configuration-specific tuning promises and remain outside this bounded data review.
- **Zero URL changes**: 24 existing profile identities/slugs retained; 72 localized vehicle routes, 216 localized Stage routes and 3 homes. Sitemap **291 before / 291 after**. Canonical database remains 58,586 records / 175,758 Stage records. No mass publication or expansion.
- Boundary verifier: zero full-catalog/provider/truth-layer imports reachable from five client roots (72 reachable modules in this run). The bounded truth layer remains server-only; clients receive only selected compact profiles.
- The audit retains the original production hashes for canonical data, commercial assignments, options, aliases and routes. Only the explicitly authorized public technical projection is pinned to new SHA-256 `a549fa22f49202684defaaef9b932563fcccf4a37e2a97fa6e8595d07d901d35`; original public projection was `cc88ac52bce27c52076c749b4f8631b5c3b3fbe8a5d173db902132a247e69e14`. The unrelated-public-profile hashes remain unchanged.

## Validation

All data fixtures use synthetic identities; no real registration plates or outgoing WhatsApp messages were used.

| Check | Result / scope |
| --- | --- |
| `pnpm catalog:audit` | PASS; 0 critical groups, 18 existing warning groups; protected canonical/commercial/routes hashes pass |
| `pnpm test:tuning` | PASS; all 17 scripts, including 649 P0 assertions covering 12 profiles × 3 Stages × NL/EN/PL, wrong generation/stock power, ECU/TCU uncertainty, quotes, WhatsApp and route preservation; 12 unrelated-profile hashes protected |
| Dataset matrix within tuning suite | PASS; 31,692 assertions / 1,266 synthetic fixtures, failures empty; retained dataset and sourced-pricing regressions pass |
| `pnpm test:seo` | PASS; 291 unique routes, 24 vehicles, localized metadata, honest Offers, 24/24 crawl links |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS after build; an earlier concurrent attempt hit transient missing `.next/types` files while Next regenerated them, then the sequential check passed |
| `pnpm build` | PASS; all 298 framework/static entries generated, including the unchanged 291 public sitemap URLs |
| `node --no-warnings scripts/qa-catalog-truth-p0-browser.cjs` | PASS against `pnpm start --port 3144`: 12 profiles × NL/EN/PL = 36 vehicle pages, 108 direct Stage routes, 216 calculator/recommendation selections; quote, sticky CTA, configuration wording, controller uncertainty, structured Offer and decoded WhatsApp agreement; no console/page errors or 390 px horizontal overflow |
| Browser navigation/layout | PASS: real manual-search → BMW profile links in NL/EN/PL at 320/768/1440 px; Stage 2 on-request output/price; 20 compact homepage links; served sitemap 291. Nine screenshots captured locally, with representative BMW range and withheld-output views visually inspected |

Browser receipt and screenshots are stored locally in `.git/catalog-truth-p0-browser/`; the committed fixture-driven script reproduces the checks. The quick `agent-browser` check also loaded the home page, clicked its BMW link and inspected the interactive calculator with no browser errors. These are genuine local production-build page checks, not authenticated vehicle tests or production-host verification. The automatic PR Preview URL and hosted check state are delivered with the Draft PR, separately from this local validation receipt.

The audit's first final attempt rejected the public hash after the Dutch copy correction and retrieval-method correction. The explicit P0 pin was updated for those reviewed changes; original non-P0 hashes and independent unrelated-profile protection were preserved. An initial browser harness assertion expected Service at the root of JSON-LD; the existing schema nests it under Vehicle/Offer. The harness was corrected to inspect that existing structure, without changing SEO schema.

## Remaining P1 backlog and release boundary

1. Resolve Dutch factory market/engine mapping for Passat, Leon and 118d stock torque, and compatible European G20 tuned evidence. Obtain a second independently compatible XC60 tuning source and confirmed Focus fuel/calibration scope.
2. Confirm fitted engine codes, exact ECU/TCU IDs/software and access method using workshop evidence; tool application lists cannot substitute for identification.
3. Review explicit Stage 2/3 hardware packages before restoring numerical targets or fixed software-package quotes. No owner approval record or hardware configuration is invented here.
4. Existing canonical cross-product identities, broad family estimates, inherited source price records, duplicate/placeholder image coverage and service-option compatibility warnings remain separate P1 work. The audit's 18 warning groups are not promoted to factual approval by a passing schema/test run.
5. Broad homepage editorial categories and the other 12 public profiles need their own bounded future review if requested. No six expansion candidates or further profile corrections are implemented here.

Deliver one new Draft implementation PR to main. PR #18 remains Draft, research-only and unmerged. The implementation must stop for owner review; passing tests or an automatic preview deployment do not authorize a merge or production release.
