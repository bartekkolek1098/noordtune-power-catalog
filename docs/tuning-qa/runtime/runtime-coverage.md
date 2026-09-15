# Runtime RDW estimate coverage

Normal ICE fixtures with a sourced peak or a finite ordered Stage 1/2/3 power range: **64/64 (100%)**. Generic bounds use 5 pk steps and are not measured or vehicle-specific tuning targets.

All three Stages also have sourced torque or an explicitly estimated range for **39/64 (60.94%)**. The remaining generic profiles explicitly explain why torque is unspecified; no precise stock torque is fabricated.

Non-public canonical technical fixtures: **56 across 14 brands**. Source-derived synthetic identities test runtime behavior; the four live owner cases are reported separately. This is not a real-world fleet coverage percentage.

Resolution levels (all normal ICE): {"1":3,"2":4,"3":32,"4":25}. Non-public fixtures: {"1":0,"2":0,"3":31,"4":25}. Level 4 explicitly means generic indication, not an identified canonical tune.

## Per-Stage evidence coverage

The denominator is the same 64 normal-ICE fixtures for every Stage. Public and non-public canonical estimates are separated by each Stage's actual source profile ID; profile-level resolution cannot conceal generic later Stages. Publication is not independent technical verification.

| Stage | Specific reference | Public source | Non-public canonical | Generic range | Unavailable |
| --- | ---: | ---: | ---: | ---: | ---: |
| Stage 1 | 3 (4.69%) | 4 (6.25%) | 32 (50%) | 25 (39.06%) | 0 (0%) |
| Stage 2 | 0 (0%) | 4 (6.25%) | 32 (50%) | 28 (43.75%) | 0 (0%) |
| Stage 3+ | 0 (0%) | 4 (6.25%) | 32 (50%) | 28 (43.75%) | 0 (0%) |

## Runtime commercial coverage

All prices below are local draft starting budgets requiring owner/workshop confirmation. Software scope, selected options and any advanced unlock remain separate from output provenance and physical ECU evidence. Later Stages may retain an on-request commercial scope while keeping their output range available.

| Stage | Numeric draft budget | On request | Numeric category counts (classic / contemporary / complexity / advanced) |
| --- | ---: | ---: | --- |
| Stage 1 | 64/64 (100%) | 0 | 0 / 45 / 17 / 2 |
| Stage 2 | 62/64 (96.88%) | 2 | 0 / 45 / 17 / 0 |
| Stage 3+ | 62/64 (96.88%) | 2 | 0 / 45 / 17 / 0 |

## Individual fixtures

| Fixture | Level | Profile | Stage 1 pk / Nm | Stage 2 pk / Nm | Stage 3 pk / Nm | Evidence S1 / S2 / S3 | Draft budgets S1 / S2 / S3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H329XH | 3 | land-rover-defender-2-0-sd4-2020 | 290 / 590 | 320 / 660 | 365 / 740 | canonical / canonical / canonical | €549 / €699 / €999 |
| V380ST | 1 | ref-ford-transit-connect-15-tdci-100 | 125–140 / 330–340 | 125–140 / 330–340 | 140–155 / 330–350 | reference / generic / generic | €449 / €549 / €849 |
| V978ZF | 1 | ref-ford-transit-custom-20-ecoblue-105 | 190 / 440 | 190–215 / 440–470 | 190–235 / 440–505 | reference / generic / generic | €549 / €699 / €999 |
| KKH27K | 1 | ref-bmw-128ti-f40-265 | 310 / 480 | 330–375 / 480–540 | 370–425 / 480–580 | reference / generic / generic | €700 / request (advanced-unlock-higher-stage-scope-unassigned) / request (advanced-unlock-higher-stage-scope-unassigned) |
| curated:bmw-320d-b47 | 2 | bmw-320d-b47 | 225 / 470 | 245 / 520 | 280 / 600 | public / public / public | €700 / request (advanced-unlock-higher-stage-scope-unassigned) / request (advanced-unlock-higher-stage-scope-unassigned) |
| curated:vw-golf-20-tsi-ea888 | 2 | vw-golf-20-tsi-ea888 | 300 / 450 | 335 / 500 | 430 / 560 | public / public / public | €449 / €549 / €849 |
| curated:volkswagen-golf-7-r-20-tsi | 2 | volkswagen-golf-7-r-20-tsi | 365 / 480 | 425 / 540 | 510 / 620 | public / public / public | €549 / €699 / €999 |
| curated:ford-focus-st-20-ecoboost | 2 | ford-focus-st-20-ecoboost | 285 / 430 | 315 / 470 | 380 / 540 | public / public / public | €449 / €549 / €849 |
| canonical:bmw-3-serie-340i-2018 | 4 | rdw-generic-e727be280992 | 325–340 / — | 330–350 / — | 335–360 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:bmw-1-serie-m140i-2018 | 4 | rdw-generic-c3787170a904 | 340–355 / — | 345–365 / — | 350–375 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:bmw-5-serie-530d-2018 | 4 | rdw-generic-d0f2b6a5a3df | 265–280 / — | 270–285 / — | 275–295 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:bmw-3-serie-330i-2018 | 4 | rdw-generic-4d3d7d61f706 | 250–265 / — | 255–270 / — | 260–280 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:volkswagen-polo-1-4-tsi-2018 | 3 | volkswagen-polo-1-4-tsi-2000 | 185 / 300 | 215 / 340 | 255 / 390 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:volkswagen-touran-1-6-tdi-2018 | 3 | volkswagen-touran-1-6-tdi-2003 | 125 / 300 | 140 / 330 | 160 / 370 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:volkswagen-tiguan-2-0-tdi-2018 | 4 | rdw-generic-632623a723bd | 170–190 / — | 185–210 / — | 210–235 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:volkswagen-touran-1-4-tsi-2018 | 3 | volkswagen-touran-1-4-tsi-2003 | 185 / 300 | 215 / 340 | 255 / 390 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:audi-a5-2-0-tfsi-2018 | 3 | audi-a5-2-0-tfsi-2007 | 305 / 440 | 360 / 500 | 430 / 570 | canonical / canonical / canonical | €549 / €699 / €999 |
| canonical:audi-q3-2-0-tdi-2018 | 4 | rdw-generic-a9062a1e8bdb | 170–190 / — | 185–210 / — | 210–235 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:audi-q5-2-0-tdi-2018 | 4 | rdw-generic-5ff71d000cbc | 170–190 / — | 185–210 / — | 210–235 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:audi-tt-2-0-tfsi-2018 | 3 | audi-tt-2-0-tfsi-2000 | 305 / 440 | 360 / 500 | 430 / 570 | canonical / canonical / canonical | €549 / €699 / €999 |
| canonical:ford-fiesta-1-0-ecoboost-2018 | 4 | rdw-generic-7cafc6940823 | 135–150 / — | 155–175 / — | 175–200 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:ford-focus-1-5-ecoboost-2018 | 4 | rdw-generic-c8b6cf6d669e | 200–220 / — | 225–255 / — | 250–295 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:ford-mondeo-2-0-tdci-2018 | 3 | ford-mondeo-2-0-tdci-2000 | 180 / 440 | 200 / 490 | 230 / 550 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:ford-kuga-2-0-tdci-2018 | 3 | ford-kuga-2-0-tdci-2008 | 180 / 440 | 200 / 490 | 230 / 550 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:mercedes-benz-a-klasse-180d-2018 | 4 | rdw-generic-2195ef502008 | 115–125 / — | 115–125 / — | 120–130 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:mercedes-benz-c-klasse-200-2018 | 4 | rdw-generic-f4a189802468 | 180–195 / — | 185–200 / — | 190–205 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:mercedes-benz-e-klasse-220d-2018 | 4 | rdw-generic-b1a443204152 | 190–205 / — | 195–210 / — | 200–215 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:mercedes-benz-glc-250d-2018 | 4 | rdw-generic-425c1932d8e3 | 200–215 / — | 205–220 / — | 210–225 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:volvo-v40-d3-2018 | 4 | rdw-generic-e3170df8f284 | 150–160 / — | 150–165 / — | 155–165 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:volvo-v60-d4-2018 | 4 | rdw-generic-ba9b5c241257 | 190–200 / — | 190–205 / — | 195–210 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:volvo-v90-t4-2018 | 4 | rdw-generic-6daaf601a3e0 | 190–200 / — | 190–205 / — | 195–210 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:volvo-xc90-t5-2018 | 4 | rdw-generic-15f78d38a8f3 | 250–260 / — | 255–270 / — | 260–275 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:renault-clio-0-9-tce-2018 | 4 | rdw-generic-4df4cdfd7fde | 95–110 / — | 110–130 / — | 125–145 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:renault-megane-1-5-dci-2018 | 4 | rdw-generic-8b973b27caf7 | 125–140 / — | 135–155 / — | 150–175 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:renault-kadjar-1-5-dci-2018 | 3 | renault-kadjar-1-5-dci-2012 | 130 / 310 | 145 / 340 | 165 / 380 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:renault-scenic-1-5-dci-2018 | 3 | renault-scenic-1-5-dci-2000 | 130 / 310 | 145 / 340 | 165 / 380 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:peugeot-208-1-2-puretech-2018 | 4 | rdw-generic-f99087f5e5fb | 130–140 / — | 130–140 / — | 135–145 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:peugeot-308-1-5-bluehdi-2018 | 3 | peugeot-308-1-5-bluehdi-2007 | 155 / 350 | 175 / 400 | 200 / 440 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:peugeot-3008-2-0-bluehdi-2018 | 3 | peugeot-3008-2-0-bluehdi-2009 | 215 / 470 | 240 / 530 | 275 / 590 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:peugeot-508-2-0-bluehdi-2018 | 3 | peugeot-508-2-0-bluehdi-2011 | 215 / 470 | 240 / 530 | 275 / 590 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:citroen-c3-1-2-puretech-2018 | 3 | citroen-c3-1-2-puretech-2002 | 135 / 250 | 155 / 280 | 185 / 320 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:citroen-c4-1-6-hdi-2018 | 4 | rdw-generic-6ebeaa5f28f9 | 130–145 / — | 140–165 / — | 160–180 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:citroen-c5-2-0-bluehdi-2017 | 4 | rdw-generic-1ec795314977 | 205–225 / — | 225–255 / — | 250–280 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:citroen-berlingo-1-6-hdi-2018 | 3 | citroen-berlingo-1-6-hdi-2000 | 140 / 320 | 155 / 360 | 175 / 400 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:opel-corsa-1-4-turbo-2018 | 3 | opel-corsa-1-4-turbo-2000 | 185 / 290 | 215 / 330 | 255 / 380 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:opel-astra-1-6-cdti-2018 | 3 | opel-astra-1-6-cdti-2000 | 165 / 380 | 180 / 420 | 205 / 470 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:opel-insignia-2-0-cdti-2018 | 3 | opel-insignia-2-0-cdti-2008 | 205 / 470 | 230 / 530 | 260 / 590 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:opel-mokka-1-4-turbo-2018 | 3 | opel-mokka-1-4-turbo-2012 | 185 / 290 | 215 / 330 | 255 / 380 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:land-rover-freelander-2-2-td4-2014 | 3 | land-rover-freelander-2-2-td4-2000 | 180 / 500 | 200 / 550 | 230 / 620 | canonical / canonical / canonical | €549 / €699 / €999 |
| canonical:land-rover-range-rover-sport-3-0-sdv6-2018 | 3 | land-rover-range-rover-sport-3-0-sdv6-2005 | 365 / 830 | 410 / 920 | 465 / 1040 | canonical / canonical / canonical | €549 / €699 / €999 |
| canonical:land-rover-discovery-3-0-tdv6-2018 | 4 | rdw-generic-1dc7ca48433f | 255–270 / — | 260–280 / — | 265–285 / — | generic / generic / generic | €549 / €699 / €999 |
| canonical:land-rover-defender-2-0-sd4-2020 | 3 | land-rover-defender-2-0-sd4-2020 | 290 / 590 | 320 / 660 | 365 / 740 | canonical / canonical / canonical | €549 / €699 / €999 |
| canonical:fiat-500-0-9-twinair-2018 | 3 | fiat-500-0-9-twinair-2007 | 130 / 170 | 150 / 200 | 180 / 220 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:fiat-punto-1-3-multijet-2018 | 3 | fiat-punto-1-3-multijet-2000 | 115 / 240 | 125 / 260 | 145 / 300 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:fiat-bravo-1-4-t-jet-2014 | 3 | fiat-bravo-1-4-t-jet-2007 | 145 / 260 | 170 / 290 | 205 / 330 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:fiat-tipo-1-6-multijet-2018 | 3 | fiat-tipo-1-6-multijet-2015 | 145 / 380 | 160 / 420 | 180 / 470 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:hyundai-i20-1-0-t-gdi-2018 | 3 | hyundai-i20-1-0-t-gdi-2008 | 145 / 210 | 170 / 230 | 205 / 270 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:hyundai-i30-1-6-crdi-2018 | 4 | rdw-generic-7a1cbdc12355 | 155–170 / — | 170–195 / — | 190–215 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:hyundai-tucson-2-0-crdi-2018 | 3 | hyundai-tucson-2-0-crdi-2004 | 220 / 470 | 250 / 530 | 280 / 590 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:hyundai-i30-1-6-t-gdi-2018 | 4 | rdw-generic-31ca2c9ee552 | 190–215 / — | 220–250 / — | 245–285 / — | generic / generic / generic | €449 / €549 / €849 |
| canonical:kia-ceed-1-0-t-gdi-2018 | 3 | kia-ceed-1-0-t-gdi-2007 | 145 / 210 | 170 / 230 | 205 / 270 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:kia-sportage-1-6-t-gdi-2018 | 3 | kia-sportage-1-6-t-gdi-2012 | 215 / 320 | 250 / 360 | 300 / 410 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:kia-sorento-2-2-crdi-2018 | 3 | kia-sorento-2-2-crdi-2002 | 240 / 520 | 270 / 580 | 305 / 650 | canonical / canonical / canonical | €449 / €549 / €849 |
| canonical:kia-ceed-1-6-crdi-2018 | 3 | kia-ceed-1-6-crdi-2007 | 165 / 380 | 180 / 420 | 205 / 470 | canonical / canonical / canonical | €449 / €549 / €849 |
| implausible-source:Golf GTI 3.0 TDI | 4 | rdw-generic-95d916a320c3 | 230–240 / — | 230–250 / — | 235–255 / — | generic / generic / generic | €549 / €699 / €999 |
| implausible-source:5 Serie 330d | 4 | rdw-generic-88f30ee6da42 | 255–270 / — | 260–280 / — | 265–285 / — | generic / generic / generic | €549 / €699 / €999 |
| wrong-displacement | 4 | rdw-generic-a5e3cf8a908e | 135–150 / — | 150–170 / — | 165–190 / — | generic / generic / generic | €549 / €699 / €999 |
| wrong-Ford-family:Transit Custom | 4 | rdw-generic-b5df8ae4967c | 120–125 / — | 120–130 / — | 120–135 / — | generic / generic / generic | €549 / €699 / €999 |
| wrong-Ford-family:Transit Connect | 4 | rdw-generic-16db88ded8de | 120–125 / — | 120–130 / — | 120–135 / — | generic / generic / generic | €449 / €549 / €849 |
| wrong-Ford-family:Transit Courier | 4 | rdw-generic-f39a507924f3 | 120–125 / — | 120–130 / — | 120–135 / — | generic / generic / generic | €449 / €549 / €849 |
| wrong-fuel | 4 | rdw-generic-3f30a116b4f1 | 120–125 / — | 120–130 / — | 120–135 / — | generic / generic / generic | €549 / €699 / €999 |
| known-generation-conflict | 4 | rdw-generic-d91cac854a26 | 135–150 / — | 150–170 / — | 165–190 / — | generic / generic / generic | €549 / €699 / €999 |
| hybrid | unavailable | UNSUPPORTED_POWERTRAIN_ESTIMATE | — / — | — / — | — / — | unavailable / unavailable / unavailable | request (stage-scope-unavailable) / request (stage-scope-unavailable) / request (stage-scope-unavailable) |
| electric | unavailable | UNSUPPORTED_POWERTRAIN_ESTIMATE | — / — | — / — | — / — | unavailable / unavailable / unavailable | request (stage-scope-unavailable) / request (stage-scope-unavailable) / request (stage-scope-unavailable) |
| missing-power | unavailable | MISSING_OR_INVALID_REGISTERED_POWER | — / — | — / — | — / — | unavailable / unavailable / unavailable | request (stage-scope-unavailable) / request (stage-scope-unavailable) / request (stage-scope-unavailable) |
| equivalent-year-copy | 3 | runtime-synthetic-equivalent-year-copy | 185 / 300 | 215 / 340 | 255 / 390 | canonical / canonical / canonical | €449 / €549 / €849 |
| multiple-technical-profiles | 4 | rdw-generic-1acf2e21f81c | 165–180 / — | 185–210 / — | 210–240 / — | generic / generic / generic | €449 / €549 / €849 |
| generic-unknown-aspiration | 4 | rdw-generic-b2caf054fc53 | 100–105 / — | 100–110 / — | 100–110 / — | generic / generic / generic | €449 / €549 / €849 |

Complete input identities, source IDs/comparisons, rejection reasons, quote objects, DTO sizes and single-process resolution timing are in the adjacent JSON report. The resolver timing excludes initial module/catalog loading and the RDW network request.
