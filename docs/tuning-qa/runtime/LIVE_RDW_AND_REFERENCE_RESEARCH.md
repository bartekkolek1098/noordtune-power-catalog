# Live RDW identity and Transit Connect reference research

Research date: 15 September 2026. This report separates registry facts, published tuning references, catalog estimates and proposed NoordTune targets. It does not establish installed ECU, transmission, unlock status or measured output.

The later accuracy pass replaced the first implementation's compounded generic point estimates with rounded scenarios. The current generic values and method are recorded in [GENERIC_RANGE_POLICY.md](../GENERIC_RANGE_POLICY.md); source figures and live registry evidence below remain unchanged.

## Live official evidence

The four cases were fetched directly from RDW on 15 September 2026 at approximately 19:10 UTC. [live-rdw-identities.json](./live-rdw-identities.json) retains only the requested technical fields, normalized matcher inputs, selected schema definitions, request URLs and retrieval times. The vehicle and fuel resources are [RDW registered vehicles](https://opendata.rdw.nl/resource/m9d7-ebf2.json) and [RDW registered vehicle fuel](https://opendata.rdw.nl/resource/8ys7-d773.json). No owner, address, keeper or unrelated raw fields were retained.

| Case | Official make / trade name | Fuel / displacement | Registered power / converted metric pk | First admission | Type / variant / execution |
|---|---|---|---|---|---|
| H329XH | LAND ROVER / DEFENDER | Diesel / 1999 cc | 177 kW / 241 pk | 2020-06-12 | LE / HCBBC0 / 50AC010 |
| V380ST | FORD / TRANSIT CONNECT | Diesel / 1499 cc | 73.5 kW / 100 pk | 2018-10-17 | PU2 / Z2GA1BFX / F2BBBSABDADBK |
| V978ZF | FORD / TRANSIT CUSTOM | Diesel / 1995 cc | 77 kW / 105 pk | 2019-04-29 | FCC / YLF61ABX / R5WGASABC00UA |
| KKH27K | BMW / 128TI | Benzine / 1998 cc | 195 kW / 265 pk | 2022-09-14 | F1H / 7L51 / IAW500MG |

All four records report four cylinders. Converted metric pk is rounded from `kW / 0.73549875`; it is not an independent registered measurement. Dates are first admission, not production dates. RDW did not supply stock torque or a tuning estimate in these selected fields.

## Canonical compatibility inspection

The full `vehicleDatabase` contains 58,586 records. This inspection reads existing values; it does not validate the generated source templates as measured results.

| Case | Compatible source path | Material exclusions and limits |
|---|---|---|
| H329XH | Canonical `land-rover-defender-2-0-sd4-2020`: stock 240 pk / 500 Nm; Stage 1 290 / 590; Stage 2 320 / 660; Stage 3+ 365 / 740. | RDW 241 pk is compatible with the 240 pk template within conversion/rounding tolerance. Seven annual copies for 2020–2026 have identical outputs and should collapse. The 2.0 petrol and larger-displacement Defender templates are incompatible. Public SEO publication is irrelevant to availability. |
| V380ST | Conditional reference `ref-ford-transit-connect-15-tdci-100`; independent later-stage estimation where no applicable published stage exists. | No Transit Connect record exists in the canonical database. Generic Transit, Transit Custom and Transit Courier are different families. Never substitute 1.6 or 2.0 litres. Engine generation remains conditional. |
| V978ZF | Reference `ref-ford-transit-custom-20-ecoblue-105`. | The canonical Custom 2.0 EcoBlue template is 170 pk / 420 Nm and fails the registered 105 pk identity. A shared 2.0 EcoBlue label does not make that configuration applicable. 150 pk TDCi and different displacements also fail. |
| KKH27K | Reference `ref-bmw-128ti-f40-265`. | No canonical 128ti record exists. Other BMW 1 Series badges cannot substitute for 128ti. [BMW's specification](https://www.press.bmwgroup.com/united-kingdom/article/detail/T0318330EN_GB/the-new-bmw-128ti) supports a 2.0 petrol turbo category, 265 hp / 400 Nm; it does not establish this vehicle's present ECU access. |

## Transit Connect: what the primary sources support

These are comparable published application references. They are neither independent measurements of V380ST nor interchangeable definitions of Stage 1/2/3.

| Source | Published application | Stock | Published output | Applicability and retrieval |
|---|---|---|---|---|
| [BR-Performance](https://www.br-performance.be/nl-be/chiptuning/1-wagens/23-ford/12693-transit-connect/14273-ii-2013-2018/22985-1-5-tdci/) | Transit Connect II 1.5 TDCi, 2015–2018 | 100 pk / 250 Nm | Stage 1: 125 pk / 330 Nm | Current official-domain search index verified the figures; direct page retrieval failed. This is the existing reference and is not a universal mechanical limit. |
| [Unlimited Tuning](https://www.unlimitedtuning.nl/chiptuning-ford-transit-connect-1-5-tdci-100-pk.html) | Transit Connect 1.5 TDCi 100; broad application labels | 100 pk / 250 Nm | Stage 1: 140 pk / 340 Nm; separately named Stage 1+: 145 pk / 355 Nm | Direct page verified. Supports the higher comparison endpoint. Its general engine/ECU labels do not decode V380ST. Stage 1+ is not silently renamed Stage 2. |
| [Shiftech](https://www.shiftech.eu/en/chiptuning/car/ford/transit-connect/2016/diesel/1.5-tdci-eu5-100) | Transit Connect 2016, 1.5 TDCI **EU5** | 100 hp / 250 Nm | Stage 1: 125 hp / 330 Nm; Stage 2: 135 hp / 350 Nm | Direct page verified. Stage 2 describes installed-part changes. EU5 is the source's label; it differs from Ford's Euro VI introduction specification. V380ST's engine-generation/emissions applicability is unconfirmed. |

A useful Stage 1 comparison is **125–140 pk / 330–340 Nm**, conditional on application. The range spans published endpoints; it is not a statistical confidence interval, a guaranteed achievable range or a NoordTune result. The existing 125/330 scalar remains available. A 135 pk Stage 2 from one tuner cannot follow a 140 pk Stage 1 from another as though both form one increasing package ladder.

The supplemental module [tuning-reference-research.ts](../../../src/data/tuning-reference-research.ts) contains the comparison, source records and a separately guarded Shiftech Stage 2 candidate. It does not alter original catalog or reference scalar outputs. Later stages may use the independently labelled runtime heuristic when no sufficiently compatible source applies.

## Why 2018 and the RDW codes do not settle generation

[Ford's June 2015 release](https://media.ford.com/content/fordmedia/feu/gb/en/news/2015/06/09/ford-delivers-class-leading-fuel-efficiency-and-segment-first-te.html) specifies a new 1.5 TDCi ECOnetic with 100 PS / 250 Nm and Euro Stage VI, introduced that summer. [Ford's July 2018 release](https://media.ford.com/content/fordmedia/feu/de/de/news/2018/07/11/ford-transit-connect-und-ford-transit-courier-mit-neuen-motoren-.html) describes the new 1.5 EcoBlue in 75/100/120 PS versions and Q3 2018 market introduction. Both releases were verified through the current official-domain search index; the Ford media direct URLs now redirect to Ford's current site. These dates establish a transition, not the production identity of a specific van admitted in October 2018.

[RDW identifies type, variant and execution as registration fields](https://www.rdw.nl/paginas/gegevens-op-het-kentekenbewijs). The saved live schema confirms those field names. No authoritative Ford mapping of the exact `PU2 / Z2GA1BFX / F2BBBSABDADBK` combination to an engine generation was found in this research. Third-party vehicle listings and similar variant strings are insufficient evidence. These strings remain available to matching as opaque facts; their letters are not decoded into an engine or gearbox.

The owner explicitly confirmed there is **no engine-generation evidence** and requested that the estimate remain conditional. The remaining check is documentary or physical identification of the engine configuration. No further owner question is needed for this task.

## Proposed NoordTune targets — owner review only

The following proposal is separate from every source figure above and from current commercial price approval. It is not an approved production tune, a feasibility conclusion or a measured result. It requires confirmation of the installed engine, condition, hardware and calibration scope before any final target is set.

| Proposed package | Draft planning target | Basis and remaining decision |
|---|---|---|
| Stage 1 | No preferred NoordTune target selected; display the conditional 125–140 pk / 330–340 Nm source comparison. | Do not automatically select the highest third-party claim. The lower existing point remains a conditional reference; the engine generation is unresolved. |
| Stage 2 | Current generic planning scenario: 125–140 pk, subject to engine/hardware review. An owner-approved target remains unset. | This stock-based scenario supersedes the first implementation's 147 pk point. It does not compound the Stage 1 upper endpoint. Shiftech's 135/350 remains a separate, EU5-labelled source application. |
| Stage 3+ | Current generic planning scenario: 140–155 pk, subject to owner/hardware review. An owner-approved target remains unset. | This stock-based scenario supersedes the first implementation's 159 pk point. No applicable primary Stage 3 reference was established here. Numeric runtime output retains generic provenance. |

No prices, service compatibility, source outputs, public SEO membership or existing route inventory were changed by this research.
