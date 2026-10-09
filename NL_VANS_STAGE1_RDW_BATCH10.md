# NoordTune NL vans Stage 1 — audited RDW batch #10

**Review date:** 2026-10-09. **Baseline production:** `4413a5c` (approved RDW batch #9). **Feature branch:** `feature/nl-vans-reviewed-rdw-batch10-20261009`.

## Scope and original RDW identity

Every below technical observation is restricted by RDW make **and exact handelsbenaming**, technical **type**, first-registration year, original registered **kW**, displacement in cc, cylinder count, and single diesel fuel. Output figures are *externally published ordinary Stage 1 indications*, **not NoordTune measurements, safe mechanical limits or promises**. In particular, original torque comes from providers, **not RDW**.

| RDW exact model/type | Admission years | cc / original kW | External Stage 1 indications (pk / Nm) | Sources |
| --- | --- | --- | --- | --- |
| OPEL VIVARO-B, F7 — 1.6 CDTI Euro6 95 | 2017–19 | 1598 / 70 | 145 / **350–370** | ECU-Soft; Vtune; ATM |
| OPEL VIVARO-B, F7 — 1.6 CDTI Euro6 120 | 2017–19 | 1598 / 89 | 145 / **350–370** | BR-Performance; ECU-Soft; ATM |
| OPEL VIVARO-B, F7 — 1.6 BiTurbo Euro6 125 | 2017–19 | 1598 / 92 | **165–175** / **370–390** | BR-Performance; ECU-Soft; ATM |
| OPEL VIVARO-B, F7 — 1.6 BiTurbo Euro6 145 | 2019 | 1598 / 107 | 175 / 390 | ECU-Soft; Vtune |
| FORD TRANSIT CONNECT, PU2 — 1.5 TDCi 120 | 2015 | 1499 / 88 | **140–145** / **320–330** | ATM; ECU-Soft |
| PEUGEOT EXPERT, V — 2.0 BlueHDi 177 | 2024 | 1997 / 130 | 205 / **440–460** | BR-Performance; DTX |

**Disagreements and vehicle-specific safety.** Vivaro 120 source-original torque is 300/320 Nm depending on publisher; its RDW kW converts to ~121 metric PS rather than the marketed 120. Vivaro BiTurbo 125 providers disagree on both Stage 1 power and torque. Peugeot's original 130 kW converts to ~177 metric PS and is sometimes marketed as 180: do not transfer an older Expert 180 ECU calibration into a 2024 car. Transit Connect 2015 88 kW 1.5 TDCi is **not** newer 1.5 EcoBlue 100/120, or the new 2.0 Connect. Vivaro B F7 2017–19 is **not** newer Vivaro V 2019+ on PSA platform, nor automatically Renault Trafic despite shared engine ancestry.

Workshop verification must establish exact engine generation and code, ECU/firmware, emissions Euro phase, real gearbox/clutch capacity, maintenance history and load profile. **DPF, EGR, SCR and AdBlue must remain functional and road-legal**. No numeric Stage 2 or Stage 3 outputs. Commercial van torque ranges are supplier marketing output, **not a recommendation to run these outputs on heavily loaded vans**.

## Direct external source pages

- **Vivaro 95:** [ECU-Soft Euro 6 95](https://www.ecu-soft.be/chiptuning/opel/vivaro/9276/1-6-dci-euro-6-95-12079), [Vtune Vivaro 2016–19](https://vtune.nl/chip-tuning-opel/opel-vivaro-2016-2019/), [ATM Euro 6 95](https://www.atm-chiptuning.com/chiptuning/opel-vivaro-16-dci-euro-6-95pk/)
- **Vivaro 120:** [BR-Performance Euro 6](https://www.br-performance.be/en-be/chiptuning/1-cars/42-opel/2205-vivaro/9276-2016-2019/9278-1-6-dci-euro-6/), [ECU-Soft Euro 6](https://www.ecu-soft.be/chiptuning/opel/vivaro/9276/1-6-dci-euro-6-120-12081), [ATM Euro 6](https://www.atm-chiptuning.com/chiptuning/opel-vivaro-16-dci-euro-6-120pk/)
- **Vivaro BiTurbo 125:** [BR-Performance](https://www.br-performance.lu/en-lu/chiptuning/1-cars/42-opel/2205-vivaro/9276-2016-2019/9279-1-6-dci-bi-turbo-euro-6/), [ECU-Soft](https://www.ecu-soft.be/chiptuning/opel/vivaro/9276/1-6-dci-bi-turbo-euro-6-125-12083), [ATM](https://www.atm-chiptuning.com/chiptuning/opel-vivaro-16-dci-bi-turbo-euro-6-125pk/)
- **Vivaro BiTurbo 145:** [ECU-Soft](https://www.ecu-soft.be/chiptuning/opel/vivaro/9276/1-6-dci-bi-turbo-euro-6-145-12085), [Vtune Vivaro 2016–19](https://vtune.nl/chip-tuning-opel/opel-vivaro-2016-2019/)
- **Transit Connect 120:** [ATM 1.5 TDCi 120](https://www.atm-chiptuning.com/chiptuning/ford-transit-connect-15-tdci-120pk-10728/), [ECU-Soft Tourneo/Connect 120](https://www.ecu-soft.be/chiptuning/ford/tourneo-custom-connect-courier/6782/1-5-tdci-120-11835)
- **Expert BlueHDi 177 facelift:** [BR-Performance 2024](https://www.br-performance.be/nl-be/chiptuning/1-wagens/43-peugeot/2328-expert-traveller/13067-2024/18305-2-0-bluehdi/), [DTX 2019–2024](https://dtxchiptuning.com/peugeot/expert-traveller/2019-2024/peugeot-expert-traveller-2019-2024-20-bluehdi-177hp/)

## Measurable impact and release controls

- **6** independently sourced new exact RDW applications, **14** frozen-sample exact positive matches, **90** negative identity checks (wrong make, model, type, fuel, year, power, displacement, cylinders etc.).
- Previous `1,795/3,000` source-linked Stage 1 → **`1,809/3,000` (60.30%)**. **Net +14** verified source-linked indications; generic/generated not counted. **This is a deliberately selected historical 3,000-row sample, NOT a national fleet coverage statistic.**
- 17 → **18** NL indexed van models (Opel Vivaro B added), 6 → **5** browse-only van models; 30 → **36** source-reviewed NL engine pages; 46 → **52** specific model-linked RDW source applications; sitemap **296 → 303** unique URLs, van URLs **48 → 55**.
- `pnpm test:seo`, `pnpm lint`, `pnpm typecheck` PASS. Build, browser QA, Vercel Preview and production smoke must also pass **before** claiming this batch live.
- Previous live production baseline `4413a5c` must be retained as the rollback target and tagged in Git after merge.

Source selection supports real customer enquiries, not mass duplication of near-identical pages. Dutch SEO indexing and lead conversion must be measured independently in Search Console and on production.
