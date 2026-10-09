# NoordTune Power Catalog — NL van Stage 1 RDW batch #12

**Evidence checked:** 2026-10-09. **Pre-release production baseline:** `22b097e` (PR #55). **Feature branch:** `feature/nl-vans-reviewed-rdw-batch12-20261009`.

## Twelve strict RDW applications: no copied vehicle-generation tune

All new matched applications require exact **RDW make + handelsbenaming + type, original registered kW, displacement, cylinder count, first-admission year, and fuel**. A VIN, engine code, ECU, firmware, exact emissions phase, fitted gearbox and condition are **not** independently decoded from RDW. Stage 1 values below are *supplier-published indications* and never guaranteed NoordTune measurements or approved mechanical torque ratings. Manufacturer-original torque comes from external suppliers, **not RDW**.

| RDW identity (all 4 cylinders) | First admission | Original registered | External ordinary Stage 1 ranges (PS / Nm) |
|---|---|---|---|
| Volkswagen CADDY, type **2KN**, 2.0 EcoFuel **CNG** | 2014 | 1984 cc / 80 kW, CNG ONLY | **116–125 / 170–182** |
| Volkswagen TRANSPORTER, **7J0**, T5 2.0 BiTDI 180 candidate | 2015 | 1968 cc / 132 kW, diesel | **200–215 / 430–460** |
| Volkswagen TRANSPORTER, **7J0**, T5 2.0 TDI 102 candidate | 2015 | 1968 cc / 75 kW, diesel | **138–160 / 340–350** |
| Ford TRANSIT, **FED**, 2.0 EcoBlue 130 candidate | 2018–19 | 1995 cc / 96 kW, diesel | **190 / 440–450** |
| Ford TRANSIT, **FCD**, 2.0 EcoBlue 130 candidate | 2019 | 1995 cc / 95.6 kW, diesel | **190 / 440–450** |
| Ford TRANSIT, **FCD**, 2.0 EcoBlue 170 candidate | 2016 | 1995 cc / 125 kW, diesel | **190–200 / 440–450** |
| Renault KANGOO, **W**, 1.5 dCi 90 candidate | 2015 | 1461 cc / 66 kW, diesel | **110–111 / 256–260** |
| Renault KANGOO, **W**, 1.5 dCi 90 candidate | 2019 | 1461 cc / 66 kW, diesel | **110–111 / 256–260** |
| Peugeot PARTNER, **7**, older 1.6 HDi 75 candidate | 2015 | 1560 cc / 55 kW, diesel | **115 / 260** |
| Mercedes-Benz SPRINTER, **906BB35**, W906 313 CDI 129 candidate | 2013 | 2143 cc / 95 kW, diesel | **154–161 / 355–384** |
| Mercedes-Benz SPRINTER, **906 KA 35**, W906 316 CDI 163 candidate | 2010 | 2143 cc / 120 kW, diesel | **187–200 / 425–480** |
| Renault TRAFIC, **L**, 2.0 Blue dCi 150 candidate | 2023–24 | 1997 cc / 110 kW, diesel | **200 / 420** |

### Explicit source links and differences

- **Caddy 2014 CNG:** [DynoCheck 116/170](https://www.dynocheck.com/en/catalog/detail/volkswagen-caddy-3-caddy-2-0-ecofuel-80kw), [Vtune 121/182](https://vtune.nl/chiptuning-volkswagen/volkswagen-caddy-l-2015/), [TurboPerformance 125/180](https://www.turboperformance.de/chiptuning/transporter/volkswagen-transporter/caddy-iii-2k/2.0-ecofuel-109PS). Independently marketed CNG-specific, modest naturally aspirated gains; **CNG is NOT petrol/LPG/diesel**, and the gas injection and ECU require workshop checks.
- **Transporter T5 180 2015:** [TVS mild ordinary Stage1 200/430](https://tvsengineering.com/tuning/volkswagen-transporter-multivan-t5-2009-2015-2-0-tdi-cr-180hp-tuning/), [BR-Performance 205/450](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/3187-transporter-multivan/3191-t5-2009-2015/3194-2-0-tdi/?stage=2142), [Mapro's 2015 T5.1 215/460](https://www.maprotuning.co.uk/news/mapro-tuning-2015-vw-transporter-2-0bitdi-180bhp-stage-1-remap). Higher standalone 220/485 output excluded due conflicts and long-term loaded use.
- **Transporter T5 102 2015:** [Celtic T5 2010–15 about 138/340](https://www.celtictuning.co.uk/services/performance-stats/volkswagen/transporter-t5-2003-2015/diesel/2-0-tdi-102-bhp-2010-2015-ECU-remap-chiptuning/stage-1) and [Avon T5 2009–15 deliberately capped 160/350](https://www.avontuning.co.uk/tuning/volkswagen/transporter-multivan-t5-2009-2015/20-tdi-102hp). The **factory five-speed flywheel/clutch** is often the real constraint; some vendors advertise 175PS and 400Nm, **deliberately omitted**. 2015 T5/T6 identity still needs a physical check.
- **Ford Transit FED/FCD EcoBlue 130:** [ECU-Soft 2017–19 190/440](https://www.ecu-soft.be/chiptuning/ford/transit-transit-custom/8552/2-0-tdci-ecoblue-130-11045) and [JPT Transit-specific 190/450](https://jpt-performance.nl/chiptuning-ford-transit-2-0-tdci-ecoblue-130pk/). Nominal manufacturer 1996cc versus RDW 1995cc requires verifying actual engine code. The exact 96kW FED, 95.6kW FCD, 2024 95.7kW/1996cc and Transit Custom FCC may not share ECU/software.
- **Ford Transit FCD 170 2016:** [Powermod 2016–18 200/450](https://powermod.de/konfigurator/Ford/Transit/2016-2018/2.0-EcoBlue/16201) and [CF Tuning exact 125kW motor 190/440](https://cf-tuning.nl/en/chiptuning-files/ford/ford-transit/2-0-tdci-ecoblue-170hp). Production-year transition older Puma 2.2 versus EcoBlue 2.0 confirmed only by actual hardware/ECU, not first admission alone.
- **Renault Kangoo 90 2015/2019:** [GSG 2013–20 110/260](https://gsgperformance.com/car-detail/renault/kangoo/2013-2020/1-5-dci-90hp) and [KHP 2014–21 111/256](https://www.khptools.com/reprogramacion/turismos-furgonetas/renault/kangoo-express-van-van/2014-2021/15-dci/90/9377/stage-1). Two distinct admission years are separately RDW-approved; ECU and emission phase may differ.
- **Peugeot Partner 75 2015:** [BR pre-2015 HDi 115/260](https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/43-peugeot/2334-partner/2335-2015/2337-1-6-hdi/), [ECU-Soft pre-2015 HDi 115/260](https://www.ecu-soft.be/chiptuning/peugeot/partner/2335/1-6-hdi-75-2945). 2015 is a **transition year to different BlueHDi 75**, so VIN + ECU/motorcode scan mandatory; brand-new BlueHDi 75 is *not* guaranteed to be this older 150Nm original supplier setup.
- **Sprinter W906 313 CDI 2013:** [SLS 154/355](https://www.slstuning.de/chiptuning/mercedes-benz/sprinter-w-906/1905-213-313-513/stage-1/), [ECU Technik 161/384](https://www.ecutechnik.pl/en/katalog-mocy/mercedes/sprinter-906-kombi-mittel-3-5t-313-cdi-2-1-129-km). Original 95kW W906 OM651 generation and Delphi controller require diagnostics.
- **Sprinter W906 316 CDI 2010:** [Startuning 200/480](https://startuning.de/konfigurator/mercedes-benz/sprinter/w906-2006-2018/216-316-cdi-163ps-163-ps), [ECU Technik 187/425](https://www.ecutechnik.pl/en/katalog-mocy/mercedes/sprinter-906-kombi-kurz-3-5t-316-cdi-2-1-163-km). High supplier spread, especially **480Nm** is *not* an approved torque ceiling or recommendation for heavy loads.
- **Renault Trafic Blue dCi150 2023–24:** [ProCarTuning 2022+ 200/420](https://procartuning.nl/renault-trafic-2022-2-0-dci-150pk.html), [Powerconcept 2022+ 200/420](https://www.powerconcept.be/reprogrammation/renault/trafic/2022-g/20-dci-150hp). [Renault official original 1997cc, 110kW and 350Nm](https://bedrijfswagens.renault.nl/modellen/trafic/dieselmotor.html). A real EAG9 automatic vs manual and ECU Euro6d-Full phase must be established before a quote.

## Legal and commercial safeguards

The business-van catalog only uses **ordinary Stage 1**, with exhaust aftertreatment **SCR/AdBlue, DPF and EGR functional and road-legal**. Vendor pages sometimes advertise removal/deletion, but those products are **not offered or inferred** for public-road vehicles by NoordTune. The customer must not be promised individual power/torque or fuel saving until inspection, original ECU read and workshop assessment. Engine-code, tuning accessibility and gearbox torque safety are not supplied directly by RDW. No numerical Stage 2/3 claims. No user license plates, VINs or raw RDW observations are included in published SEO pages.

## Test plan / impact (frozen sample, NOT Netherlands fleet)

- **12** new approved RDW technical cohorts matched **21** preselected frozen positive observations, with **180** adversarial negative checks rejecting wrong model/type/year/cc/kW/cylinders/fuel.
- New exact reviewed CNG group **separately** tests correct single-CNG fuel and wrong petrol/LPG/diesel inputs.
- NL site: **18→19 indexed van models** by adding Renault Trafic; browse-only 5→4. **40→51** reviewed NL engine pages; verified model-linked applications **56→68**; sitemap **307→319**, of which NL van routes **59→71**. No unsupported EN/PL generated thin pages.
- Historical sample denominator is the unchanged **3,000 nonrandom purpose-selected RDW observations**, not a national prevalence survey. The regenerated aggregate report confirms **1,821 → 1,842 / 3,000 (61.40%, NET +21 new source-linked Stage 1 indications)**. Each of 21 exact frozen positive observations was previously uncovered. This is NOT a Netherlands-wide vehicle coverage percentage.
- Release gates: `pnpm test:seo`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, optimized `pnpm qa:seo:nl-vans` with 320/390/1440px, exact SHA Vercel Preview READY, PR checks, production deployment READY and live sitemap/URL checks. Git baseline **22b097e** is rollback.
