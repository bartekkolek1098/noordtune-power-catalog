/** NoordTune manual source-reviewed NL commercial vans RDW batch 12, 2026-10-09.
 * Exact technical make/model/type/fuel/cc/kW/year cohorts. CNG stays CNG.
 * External published Stage1 indications only: no claimed dyno results or Stage2/3.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const seeds:readonly Seed[] = [
  {
    "id": "rdw-bulk-12-volkswagen-caddy-2kn-20-ecofuel-cng-109-2014",
    "make": "Volkswagen",
    "model": "Caddy",
    "rdwModel": "CADDY",
    "type": "2KN",
    "from": 2014,
    "to": 2014,
    "cc": 1984,
    "cylinders": 4,
    "kw": 80,
    "stockNm": 160,
    "engine": "VW Caddy III 2.0 EcoFuel naturally aspirated CNG 109PS 80kW 1984cc Euro5 Caddy 2KN",
    "fuel": "CNG",
    "power": [
      116,
      125
    ],
    "torque": [
      170,
      182
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "dynocheck",
        "title": "DynoCheck Caddy III 2.0 EcoFuel 80kW CNG",
        "url": "https://www.dynocheck.com/en/catalog/detail/volkswagen-caddy-3-caddy-2-0-ecofuel-80kw",
        "stage1Hp": 116,
        "stage1Nm": 170,
        "scope": "Specific Caddy III 2.0 EcoFuel natural gas, original 80kW/109PS/160Nm to 85kW/116PS/170Nm. Modest naturally aspirated gains, CNG-specific.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "vtune",
        "title": "Vtune Volkswagen Caddy pre-2015 2.0i 8V Eco-Fuel 109",
        "url": "https://vtune.nl/chiptuning-volkswagen/volkswagen-caddy-l-2015/",
        "stage1Hp": 121,
        "stage1Nm": 182,
        "scope": "Caddy <2015 2.0i Eco-Fuel original 109PS/160Nm, remap 121PS/182Nm; not petrol-only 2.0 and not TDI.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "turboperformance",
        "title": "TurboPerformance Caddy III 2K 2.0 EcoFuel 109",
        "url": "https://www.turboperformance.de/chiptuning/transporter/volkswagen-transporter/caddy-iii-2k/2.0-ecofuel-109PS",
        "stage1Hp": 125,
        "stage1Nm": 180,
        "scope": "VW Caddy III 2K EcoFuel gas 109PS/160Nm to 125PS/180Nm Stage1; verify CNG ignition/injection and ECU.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "ONLY RDW VW CADDY type 2KN, single CNG fuel, 1984cc, 80kW, first admission 2014. Natural gas fuel requires special ECU and CNG fueling check; no claim CNG is petrol, LPG, 2.0 SDI or turbo diesel. OEM 2.0 EcoFuel is naturally aspirated, modest tune gains and no guaranteed economy. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-vw-transporter-7j0-t5-20bitdi180-2015",
    "make": "Volkswagen",
    "model": "Transporter",
    "rdwModel": "TRANSPORTER",
    "type": "7J0",
    "from": 2015,
    "to": 2015,
    "cc": 1968,
    "cylinders": 4,
    "kw": 132,
    "stockNm": 400,
    "engine": "Volkswagen Transporter T5.1 facelift 2.0 BiTDI 180PS CFCA 132kW EA189 Bosch EDC17CP20 2015",
    "fuel": "Diesel",
    "power": [
      200,
      215
    ],
    "torque": [
      430,
      460
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "tvs-engineering",
        "title": "TVS Transporter T5 2009–2015 2.0 TDI CR 180 mild Stage1",
        "url": "https://tvsengineering.com/tuning/volkswagen-transporter-multivan-t5-2009-2015-2-0-tdi-cr-180hp-tuning/",
        "stage1Hp": 200,
        "stage1Nm": 430,
        "scope": "Actual T5 CFCA 180PS/400Nm, mild ordinary TVS Stage1 200PS/430Nm; do not confuse their Stage2 235/485.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "br-performance",
        "title": "BR-Performance T5 facelift 2009–2015 2.0 TDI 180",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/3187-transporter-multivan/3191-t5-2009-2015/3194-2-0-tdi/?stage=2142",
        "stage1Hp": 205,
        "stage1Nm": 450,
        "scope": "T5 facelift 180PS/400Nm ordinary Stage1 205PS/450Nm, emissions preserved.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "mapro-tuning",
        "title": "Mapro 2015 Transporter T5.1 2.0 BiTDI 180 dyno",
        "url": "https://www.maprotuning.co.uk/news/mapro-tuning-2015-vw-transporter-2-0bitdi-180bhp-stage-1-remap",
        "stage1Hp": 215,
        "stage1Nm": 460,
        "scope": "Specific 2015 2.0 BiTDI 180/400 to215/460 owner vehicle, not universal dyno guarantee.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "2015 7J0 132kW 1968cc only. Supplier results 200–215PS/430–460Nm, higher Tuning Service 220/485 excluded as higher-risk differing tune. Confirm CFCA, true T5.1 2015 rather than T6, oil consumption/EGR cooler turbo/DPF, and real 6-speed/DQ500 torque limit. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-vw-transporter-7j0-t5-20tdi102-2015",
    "make": "Volkswagen",
    "model": "Transporter",
    "rdwModel": "TRANSPORTER",
    "type": "7J0",
    "from": 2015,
    "to": 2015,
    "cc": 1968,
    "cylinders": 4,
    "kw": 75,
    "stockNm": 250,
    "engine": "VW Transporter T5 facelift 2.0 TDI 102PS 75kW, 1968cc, 2015 year-boundary 5-speed manual variant",
    "fuel": "Diesel",
    "power": [
      138,
      160
    ],
    "torque": [
      340,
      350
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "celtic-tuning",
        "title": "Celtic Transporter T5 2010–15 2.0 TDI 102 Stage1",
        "url": "https://www.celtictuning.co.uk/services/performance-stats/volkswagen/transporter-t5-2003-2015/diesel/2-0-tdi-102-bhp-2010-2015-ECU-remap-chiptuning/stage-1",
        "stage1Hp": 138,
        "stage1Nm": 340,
        "scope": "102 bhp to138 bhp and ~251lb-ft≈340Nm, original184lb-ft≈250Nm; indicative supplier conservative remap.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "avon-tuning",
        "title": "Avon T5 2009–15 2.0 TDI 102 5-speed capped Stage1",
        "url": "https://www.avontuning.co.uk/tuning/volkswagen/transporter-multivan-t5-2009-2015/20-tdi-102hp",
        "stage1Hp": 160,
        "stage1Nm": 350,
        "scope": "Manufacturer explicitly limits 102PS 5-speed Stage1 to160BHP/350Nm; higher advertised 175/400 is NOT selected due gearbox risk.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only 2015 7J0 75kW 1968cc, actual T5 facelift/102PS must be confirmed. Some competing suppliers market 175PS; intentionally excluded because stock 5-speed clutch and flywheel may not safely tolerate the 400Nm. 2015 T6 transition and DSG/manual diagnosis mandatory. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-ford-transit-fed-20ecoblue130-2018-19",
    "make": "Ford",
    "model": "Transit",
    "rdwModel": "TRANSIT",
    "type": "FED",
    "from": 2018,
    "to": 2019,
    "cc": 1995,
    "cylinders": 4,
    "kw": 96,
    "stockNm": 385,
    "engine": "Ford Transit 2.0 EcoBlue 130 marketed, RDW 96kW 1995cc type FED 2018–2019 SID211 candidate",
    "fuel": "Diesel",
    "power": [
      190,
      190
    ],
    "torque": [
      440,
      450
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Ford Transit / Transit Custom 2017–19 2.0 EcoBlue130",
        "url": "https://www.ecu-soft.be/chiptuning/ford/transit-transit-custom/8552/2-0-tdci-ecoblue-130-11045",
        "stage1Hp": 190,
        "stage1Nm": 440,
        "scope": "2017-2019 Transit and Custom 130/385, normal Stage1 190/440; 1995cc RDW vs nominal supplier 1996cc check.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "jpt-performance",
        "title": "JPT Ford Transit 2.0 EcoBlue130 individual reference",
        "url": "https://jpt-performance.nl/chiptuning-ford-transit-2-0-tdci-ecoblue-130pk/",
        "stage1Hp": 190,
        "stage1Nm": 450,
        "scope": "Specifically Transit not Custom, EcoBlue 130/385 Stage1 190/450, engine YMF6 possible, year depends on installed ECU.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Exact TRANSIT FED original96kW 1995cc, admission 2018–2019. Supplier nominal displacement 1996cc vs RDW 1995cc one cc, match source is conditional on real YMF6 and ECU SID211/other. No application to Custom FCC, FCD different registered original kW, or 2024 1996cc. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-ford-transit-fcd-20ecoblue130-2019",
    "make": "Ford",
    "model": "Transit",
    "rdwModel": "TRANSIT",
    "type": "FCD",
    "from": 2019,
    "to": 2019,
    "cc": 1995,
    "cylinders": 4,
    "kw": 95.6,
    "stockNm": 385,
    "engine": "Ford Transit EcoBlue 130 2019 FCD 1995cc RDW95.6kW marketed130PS",
    "fuel": "Diesel",
    "power": [
      190,
      190
    ],
    "torque": [
      440,
      450
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Transit/Custom 2017-19 EcoBlue 130",
        "url": "https://www.ecu-soft.be/chiptuning/ford/transit-transit-custom/8552/2-0-tdci-ecoblue-130-11045",
        "stage1Hp": 190,
        "stage1Nm": 440,
        "scope": "2017–2019 Euro6 generation 130PS/385Nm to190/440.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "jpt-performance",
        "title": "JPT Ford Transit 2.0 EcoBlue 130",
        "url": "https://jpt-performance.nl/chiptuning-ford-transit-2-0-tdci-ecoblue-130pk/",
        "stage1Hp": 190,
        "stage1Nm": 450,
        "scope": "Transit EcoBlue 130/385 to190/450 with real ECU and engine-code verification.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only 2019 TRANSIT FCD registered95.6kW 1995cc; 96kW cohorts and 2024 95.7kW/1996cc must not inherit this exact RDW application. Verify 2019 SID ECU and original torque. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-ford-transit-fcd-20ecoblue170-2016",
    "make": "Ford",
    "model": "Transit",
    "rdwModel": "TRANSIT",
    "type": "FCD",
    "from": 2016,
    "to": 2016,
    "cc": 1995,
    "cylinders": 4,
    "kw": 125,
    "stockNm": 405,
    "engine": "Ford Transit 2016 2.0 EcoBlue 170PS 125kW RDW1995cc FCD (2016 production transition)",
    "fuel": "Diesel",
    "power": [
      190,
      200
    ],
    "torque": [
      440,
      450
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "powermod-performance",
        "title": "Powermod Ford Transit 2016–2018 EcoBlue170",
        "url": "https://powermod.de/konfigurator/Ford/Transit/2016-2018/2.0-EcoBlue/16201",
        "stage1Hp": 200,
        "stage1Nm": 450,
        "scope": "Explicit 2016–2018 Transit 2.0 EcoBlue 170PS/405Nm → normal Stage1 200/450Nm.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "cf-tuning",
        "title": "CF Tuning Ford Transit 2.0 EcoBlue170 125kW",
        "url": "https://cf-tuning.nl/en/chiptuning-files/ford/ford-transit/2-0-tdci-ecoblue-170hp",
        "stage1Hp": 190,
        "stage1Nm": 440,
        "scope": "Exact 125kW/170PS/405Nm Transit 2.0 EcoBlue Stage1 190/440; year not disclosed, apply only after first provider's 2016–2018 generation check.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "First admitted 2016 125kW 1995cc Transit FCD, not older 2.2TDCi 2016 or later Custom. 2016 transition means VIN, engine YNFS/YLF6, ECU, Euro phase, load and gearbox need workshop confirmation. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-renault-kangoo-w-15dci90-2015",
    "make": "Renault",
    "model": "Kangoo",
    "rdwModel": "KANGOO",
    "type": "W",
    "from": 2015,
    "to": 2015,
    "cc": 1461,
    "cylinders": 4,
    "kw": 66,
    "stockNm": 220,
    "engine": "Renault Kangoo II 1.5 dCi 90 K9K 1461cc RDW66kW 2015 Euro5/6 conditional",
    "fuel": "Diesel",
    "power": [
      110,
      111
    ],
    "torque": [
      256,
      260
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "gsg-performance",
        "title": "GSG Kangoo 2013–2020 1.5 dCi90",
        "url": "https://gsgperformance.com/car-detail/renault/kangoo/2013-2020/1-5-dci-90hp",
        "stage1Hp": 110,
        "stage1Nm": 260,
        "scope": "2013–2020 Kangoo 1.5dCi 90PS/220Nm Stage1 110PS/260Nm.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "khptools",
        "title": "KHP Kangoo/Express Van 2014–2021 1.5 dCi 90",
        "url": "https://www.khptools.com/reprogramacion/turismos-furgonetas/renault/kangoo-express-van-van/2014-2021/15-dci/90/9377/stage-1",
        "stage1Hp": 111,
        "stage1Nm": 256,
        "scope": "2014-2021 90PS/220Nm stage1 111PS/256Nm, supplier indication, actual Euro ECU phase unknown.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "RDW KANGOO W 66kW1461cc single Diesel 2015 only; verify K9K generation, ECU Delphi DCM vs Bosch, DPF and clutch. Other 55kW/81kW Kangoo not included. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-renault-kangoo-w-15dci90-2019",
    "make": "Renault",
    "model": "Kangoo",
    "rdwModel": "KANGOO",
    "type": "W",
    "from": 2019,
    "to": 2019,
    "cc": 1461,
    "cylinders": 4,
    "kw": 66,
    "stockNm": 220,
    "engine": "Renault Kangoo II 1.5 dCi 90 K9K 1461cc RDW66kW first registered2019 later emissions ECU phase",
    "fuel": "Diesel",
    "power": [
      110,
      111
    ],
    "torque": [
      256,
      260
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "gsg-performance",
        "title": "GSG Kangoo 2013–2020 1.5 dCi90",
        "url": "https://gsgperformance.com/car-detail/renault/kangoo/2013-2020/1-5-dci-90hp",
        "stage1Hp": 110,
        "stage1Nm": 260,
        "scope": "2013–2020 1.5dCi90 K9K 90PS/220Nm to110/260.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "khptools",
        "title": "KHP Kangoo/Express Van 2014–2021 1.5dCi90",
        "url": "https://www.khptools.com/reprogramacion/turismos-furgonetas/renault/kangoo-express-van-van/2014-2021/15-dci/90/9377/stage-1",
        "stage1Hp": 111,
        "stage1Nm": 256,
        "scope": "2014-2021 Kangoo 1.5dCi90 90/220 to111/256.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "2019 Kangoo type W 66kW 1461cc may have Euro6/R9M software change; never transfer 2015 file blindly. Validate actual K9K, ECU, gearbox, DPF SCR if fitted. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-peugeot-partner-7-16hdi75-2015",
    "make": "Peugeot",
    "model": "Partner",
    "rdwModel": "PARTNER",
    "type": "7",
    "from": 2015,
    "to": 2015,
    "cc": 1560,
    "cylinders": 4,
    "kw": 55,
    "stockNm": 150,
    "engine": "Peugeot Partner II pre-2015 1.6 HDi 75 55kW DV6 non-BlueHDi candidate RDW type7 1560cc",
    "fuel": "Diesel",
    "power": [
      115,
      115
    ],
    "torque": [
      260,
      260
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance Peugeot Partner pre-2015 1.6 HDi75",
        "url": "https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/43-peugeot/2334-partner/2335-2015/2337-1-6-hdi/",
        "stage1Hp": 115,
        "stage1Nm": 260,
        "scope": "Partner until2015 1.6 HDi 75PS/150Nm normal Stage1 115PS/260Nm (not 2015+ BlueHDi 75).",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Peugeot Partner pre-2015 1.6 HDi75",
        "url": "https://www.ecu-soft.be/chiptuning/peugeot/partner/2335/1-6-hdi-75-2945",
        "stage1Hp": 115,
        "stage1Nm": 260,
        "scope": "Older Partner -2015 1.6HDi 75/150 Stage1 115/260, original torque differs from CSC 185Nm, must verify.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "First admission2015 55kW 1560cc RDW PARTNER type7 could be pre-2015 HDi or new June2015 BlueHDi75 (original 230Nm): cannot verify from RDW alone; source specifically pre-2015 must pass VIN/engine and ECU before Stage1 recommendation. No transfer from BlueHDi 75 120/280. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-mercedes-sprinter-906bb35-21-313cdi129-2013",
    "make": "Mercedes-Benz",
    "model": "Sprinter",
    "rdwModel": "SPRINTER",
    "type": "906BB35",
    "from": 2013,
    "to": 2013,
    "cc": 2143,
    "cylinders": 4,
    "kw": 95,
    "stockNm": 305,
    "engine": "Mercedes Sprinter W906 313 CDI 2.1 OM651 95kW 129PS 2143cc 2013 Euro5",
    "fuel": "Diesel",
    "power": [
      154,
      161
    ],
    "torque": [
      355,
      384
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "sls-tuning",
        "title": "SLS W906 213/313/513 CDI 129 95kW Stage1",
        "url": "https://www.slstuning.de/chiptuning/mercedes-benz/sprinter-w-906/1905-213-313-513/stage-1/",
        "stage1Hp": 154,
        "stage1Nm": 355,
        "scope": "Sprinter W906 129PS/95kW 305Nm to 154PS/355Nm normal Stage1, specific 95kW.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "ecutechnik",
        "title": "ECU Technik W906 Sprinter 313 2.1 CDI129",
        "url": "https://www.ecutechnik.pl/en/katalog-mocy/mercedes/sprinter-906-kombi-mittel-3-5t-313-cdi-2-1-129-km",
        "stage1Hp": 161,
        "stage1Nm": 384,
        "scope": "Mercedes Sprinter 906 313 CDI 2.1 129PS/95kW/305Nm to161PS/384Nm, body version may affect software, verify.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "RDW SPRINTER 906BB35 2143cc 95kW year2013 exact. Verify actual OM651 Delphi CRD2/CRD3, Euro5, 5-speed/7G gearbox and DPF. No W907 or higher engine application. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-mercedes-sprinter-906ka35-21-316cdi163-2010",
    "make": "Mercedes-Benz",
    "model": "Sprinter",
    "rdwModel": "SPRINTER",
    "type": "906 KA 35",
    "from": 2010,
    "to": 2010,
    "cc": 2143,
    "cylinders": 4,
    "kw": 120,
    "stockNm": 360,
    "engine": "Mercedes Sprinter W906 316 CDI OM651 2.1 163PS 120kW first admitted2010",
    "fuel": "Diesel",
    "power": [
      187,
      200
    ],
    "torque": [
      425,
      480
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "startuning",
        "title": "Startuning Sprinter W906 216/316 CDI163 OM651",
        "url": "https://startuning.de/konfigurator/mercedes-benz/sprinter/w906-2006-2018/216-316-cdi-163ps-163-ps",
        "stage1Hp": 200,
        "stage1Nm": 480,
        "scope": "Sprinter W906 2006–2018 OM651 163PS/360Nm Stage1 200PS/480Nm, high supplier claim, NOT safe loaded Sprinter torque limit.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "ecutechnik",
        "title": "ECU Technik Sprinter 906 316 CDI 2.1 163",
        "url": "https://www.ecutechnik.pl/en/katalog-mocy/mercedes/sprinter-906-kombi-kurz-3-5t-316-cdi-2-1-163-km",
        "stage1Hp": 187,
        "stage1Nm": 425,
        "scope": "W906 2.1 316CDI 163PS/120kW/360Nm to187/425, different coachwork; use only generation-scoped source indication.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only registered first admission2010 Mercedes SPRINTER type906 KA 35 2143cc 120kW. 2010 early OM651 vs OM646 transition check actual ECU (Delphi), transmission, 3.5tonne load. 480Nm is high external supplier claim, not approved gearbox capacity. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  },
  {
    "id": "rdw-bulk-12-renault-trafic-l-20bluedci150-2023-24",
    "make": "Renault",
    "model": "Trafic",
    "rdwModel": "TRAFIC",
    "type": "L",
    "from": 2023,
    "to": 2024,
    "cc": 1997,
    "cylinders": 4,
    "kw": 110,
    "stockNm": 350,
    "engine": "Renault Trafic III facelift 2.0 Blue dCi150 RDW110kW/1997cc first admitted2023-24",
    "fuel": "Diesel",
    "power": [
      200,
      200
    ],
    "torque": [
      420,
      420
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "procartuning",
        "title": "ProCarTuning Renault Trafic 2022+ 2.0 dCi 150",
        "url": "https://procartuning.nl/renault-trafic-2022-2-0-dci-150pk.html",
        "stage1Hp": 200,
        "stage1Nm": 420,
        "scope": "Exact Renault Trafic 2022→ 2.0dCi150PS/350Nm 1997cc normal Stage1 200/420.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "powerconcept",
        "title": "Powerconcept Renault Trafic 2022+ 2.0 dCi150",
        "url": "https://www.powerconcept.be/reprogrammation/renault/trafic/2022-g/20-dci-150hp",
        "stage1Hp": 200,
        "stage1Nm": 420,
        "scope": "2022+ Trafic 2.0 dCi150PS/350Nm 1997cc normal Stage1 200PS/420Nm, actual tune checked on dyno.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Exact TRAFIC RDW typeL diesel 1997cc 110kW 2023–24. Renault official site independently confirms stock 150PS/350Nm and 1997cc/110kW, both manual and EAG9. ECU, Euro6d-Full phase, AdBlue/SCR, towing capacity and 9-speed automatic torque must be confirmed; no Opel/Nissan copy. These are competing third-party ordinary Stage 1 published estimates, not NoordTune measurements, guarantees, or safe torque limits. Vehicle-specific engine code, ECU/firmware, original registered kW, RDW body/type, year, fuel, gearbox/clutch, load and emissions variant require workshop diagnosis. DPF/EGR/SCR/AdBlue (when fitted) must remain legal and functional; no Stage2/3 numeric indications or cross-brand file transfers."
  }
];
export const reviewedRdwBulkBatch12=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch12Count=reviewedRdwBulkBatch12.length;
