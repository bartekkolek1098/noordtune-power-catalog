/** NoordTune reviewed NL commercial RDW batch 13, 2026-10-09.
 * External publisher ordinary Stage1 indications, no cross-engine transfer.
 * No Stage2/3 values, road vehicle emissions remain operational.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const seeds:readonly Seed[] = [
  {
    "id": "rdw-bulk-13-renault-kangoo-w-15dci110-2015",
    "make": "Renault",
    "model": "Kangoo",
    "rdwModel": "KANGOO",
    "type": "W",
    "from": 2015,
    "to": 2015,
    "cc": 1461,
    "kw": 81,
    "cylinders": 4,
    "stockNm": 260,
    "engine": "Renault Kangoo II 1.5 dCi 110 K9K 1461cc 81kW Euro5/6 candidate",
    "fuel": "Diesel",
    "power": [
      130,
      130
    ],
    "torque": [
      300,
      300
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "revtuning",
        "title": "Revtuning Kangoo 2013–2020 1.5 dCi110",
        "url": "https://revtuning.eu/product/chiptuning-renault-kangoo-1-5-dci-110hp-2013-2020",
        "stage1Hp": 130,
        "stage1Nm": 300,
        "scope": "Renault Kangoo 2013–20, 1.5dCi 110PS/260Nm to ordinary Stage1 130/300.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "powerconcept",
        "title": "Powerconcept Kangoo 2013–2020 1.5 dCi110",
        "url": "https://www.powerconcept.be/reprogrammation/renault/kangoo/2013-2020/15-dci-110hp",
        "stage1Hp": 130,
        "stage1Nm": 300,
        "scope": "Renault Kangoo 2013–2020, diesel 1461cc 110/260→130/300.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "bpt-portal",
        "title": "BPT Kangoo 2013–2020 1.5dCi110",
        "url": "https://bpt-portal.com/nl/tuning/cars/renault/kangoo/2013-2020/1-5-dci-110hp/",
        "stage1Hp": 130,
        "stage1Nm": 300,
        "scope": "Same 110/260→130/300 source published as ordinary Stage1.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only RDW KANGOO W first admitted2015 1461cc 81kW diesel, not 66kW 90PS or 55kW 75PS. Verify K9K, ECU Bosch/Continental and emissions hardware. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-renault-master-ma-23dci110-euro6-2017",
    "make": "Renault",
    "model": "Master",
    "rdwModel": "MASTER",
    "type": "MA",
    "from": 2017,
    "to": 2017,
    "cc": 2299,
    "kw": 81,
    "cylinders": 4,
    "stockNm": 285,
    "engine": "Renault Master III Mk4 2.3 dCi Euro6 110 2299cc 81kW",
    "fuel": "Diesel",
    "power": [
      160,
      180
    ],
    "torque": [
      390,
      420
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Master 2.3 dCi Euro6 110 2016–19",
        "url": "https://www.atm-chiptuning.com/chiptuning/renault-master-23-dci-euro-6-110pk/",
        "stage1Hp": 160,
        "stage1Nm": 390,
        "scope": "Mk4 2016–19 Master 110PS/285Nm to160PS/390Nm, source quotes 2298cc nominal.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "ecu-soft",
        "title": "ECU Soft Master 2016–19 2.3 dCi Euro6 110",
        "url": "https://www.ecu-soft.be/chiptuning/renault/master/8964/2-3-dci-euro-6-110-11623",
        "stage1Hp": 180,
        "stage1Nm": 420,
        "scope": "Explicit 2016–19 110/285 to180/420; separate ECU/calibration check.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "br-performance",
        "title": "BR Master Mk4 2016–19 2.3 dCi110 Euro6",
        "url": "https://www.br-performance.be/en-be/chiptuning/1-cars/45-renault/2536-master/8964-mk4-03-2016-2019/8965-2-3-dci-euro-6/",
        "stage1Hp": 180,
        "stage1Nm": 420,
        "scope": "2016–19 110PS 285Nm ordinary Stage1 180PS/420Nm; advertisement not approval.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only 2017 RDW MASTER type MA, 2299cc 81kW, marketing110PS. Suppliers disagree strongly: 160–180/390–420 is NOT a safe loaded van gearbox ceiling. No borrowing later Master135/145 ECU. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-renault-master-ma-23bluedci135-2019",
    "make": "Renault",
    "model": "Master",
    "rdwModel": "MASTER",
    "type": "MA",
    "from": 2019,
    "to": 2019,
    "cc": 2299,
    "kw": 100,
    "cylinders": 4,
    "stockNm": 360,
    "engine": "Renault Master III facelift 2.3 Blue dCi 135 Mk5 2019 RDW 100kW 2299cc",
    "fuel": "Diesel",
    "power": [
      175,
      180
    ],
    "torque": [
      420,
      430
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "shiftech",
        "title": "Shiftech Renault Master 2019+ 2.3 Blue dCi EU6 135",
        "url": "https://www.shiftech.eu/en/chiptuning/car/renault/master/2019-iii-iii/diesel/2.3-bluedci-eu6-135",
        "stage1Hp": 180,
        "stage1Nm": 430,
        "scope": "2019 III Blue dCi135 original135/360 to180/430 normal Stage1.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "motortech",
        "title": "Motortech Master 2019 III Blue dCi EU6 135",
        "url": "https://motortech.fr/reprogrammation/voiture/renault/master/2019-iii-iii/2.3-bluedci-eu6-135",
        "stage1Hp": 175,
        "stage1Nm": 420,
        "scope": "Specific 2019 III 2.3 Blue dCi EU6 135/360 to175/420.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "rstronic",
        "title": "RS-Tronic Master 2019 III Blue dCi EU6 135",
        "url": "https://rstronic.com/en/chiptuning/renault/master/2019-iii-iii/2.3-bluedci-eu6-135",
        "stage1Hp": 180,
        "stage1Nm": 430,
        "scope": "2019 135/360 to180/430 ordinary remap; higher external210/480 intentionally excluded.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "RDW MA type 2019 100kW rounds136PS while market calls135. 2019 transitional Mk4/Mk5 and Euro6/ECU phase must be confirmed by VIN, no automatic 210PS high-output promotion. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-vw-crafter-syn1e-20tdi102-euro6-2018",
    "make": "Volkswagen",
    "model": "Crafter",
    "rdwModel": "CRAFTER",
    "type": "SYN1E",
    "from": 2018,
    "to": 2018,
    "cc": 1968,
    "kw": 75,
    "cylinders": 4,
    "stockNm": 250,
    "engine": "VW Crafter 2017–2020 2.0 TDI 102 Euro6 RDW 1968cc75kW SYN1E",
    "fuel": "Diesel",
    "power": [
      160,
      175
    ],
    "torque": [
      350,
      400
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR Crafter 2017–2020 2.0 TDI102",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2950-crafter/9434-2017-2020/9435-2-0-tdi/",
        "stage1Hp": 175,
        "stage1Nm": 400,
        "scope": "2017–20 Crafter 102PS/250Nm ordinary Stage1 175PS/400Nm.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM VW Crafter 2.0 TDI CR Euro6 102",
        "url": "https://www.atm-chiptuning.com/chiptuning/volkswagen-crafter-20-tdi-cr-eur-6-102pk-10872/",
        "stage1Hp": 160,
        "stage1Nm": 350,
        "scope": "Crafter 2.0 TDI Euro6 102PS/300Nm to160/350; original source torque 300 differs from BR250.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "feno",
        "title": "Feno VW Crafter MAN TGE 102 2018+",
        "url": "https://www.chiptuning-feno.nl/product/crafter-tge-102pk-tdi/",
        "stage1Hp": 170,
        "stage1Nm": 400,
        "scope": "2018+ Crafter 102PS/300Nm to170/400; source advert also MAN TGE but exact RDW is VW Crafter.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only CRAFTER SYN1E 1968cc original75kW, admission2018. Original torque supplier disagreement 250 vs300Nm, RDW has NO Nm; 400Nm is not approved for heavy load. DCM6.2V/EDC17C64 ECU to be scanned; no use of 2023 Euro6D software. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-vw-transporter-7j0-t6-20tdi102-2020",
    "make": "Volkswagen",
    "model": "Transporter",
    "rdwModel": "TRANSPORTER",
    "type": "7J0",
    "from": 2020,
    "to": 2020,
    "cc": 1968,
    "kw": 75,
    "cylinders": 4,
    "stockNm": 250,
    "engine": "VW Transporter T6/T6.1 2.0 TDI 102 75kW 1968cc 2020 year/ECU boundary",
    "fuel": "Diesel",
    "power": [
      150,
      164
    ],
    "torque": [
      330,
      345
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "vagtechniek",
        "title": "VAGtechniek VW Transporter T6 2.0 TDI102",
        "url": "https://www.vagtechniek.nl/chiptuning/volkswagen/transporter-multivan/t6/2.0-tdi-102pk/",
        "stage1Hp": 150,
        "stage1Nm": 330,
        "scope": "T6 102PS/250Nm ordinary Stage1 150PS/330Nm, NOT Stage1+160/350.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "racingline",
        "title": "RacingLine VW Transporter T6 2015–2020 Delphi ECU TDI102",
        "url": "https://www.racinglinetuning.com/transporter-t6tdi-software",
        "stage1Hp": 164,
        "stage1Nm": 345,
        "scope": "2015–2020 T6 Delphi ECU only, 102/250→164/345; March2020+ Bosch ECU requires different process.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only 2020 RDW TRANSPORTER type7J0 1968cc75kW Diesel, no assumption whether older T6 or new T6.1. RacingLine works on Delphi ONLY; Bosch after March2020 must not use that file. 5-speed clutch/gearbox torque limits and year verified in shop. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-fiat-doblo-263-16multijet100-2015",
    "make": "Fiat",
    "model": "Doblo",
    "rdwModel": "FIAT DOBLO'",
    "type": "263",
    "from": 2015,
    "to": 2015,
    "cc": 1598,
    "kw": 74,
    "cylinders": 4,
    "stockNm": 320,
    "engine": "Fiat Doblò II 1.6 MultiJet 100 74kW1598cc 2015 Euro6 candidate",
    "fuel": "Diesel",
    "power": [
      140,
      140
    ],
    "torque": [
      360,
      360
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "gsg-performance",
        "title": "GSG Doblò 2015–21 1.6 MultiJet100",
        "url": "https://gsgperformance.com/car-detail/fiat/doblo/2015-2021/1-6-multijet-100hp",
        "stage1Hp": 140,
        "stage1Nm": 360,
        "scope": "Fiat Doblò 2015–21 diesel 100/320 to140/360 Stage1.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "powerconcept",
        "title": "Powerconcept Fiat Doblò 2015–2021 MultiJet100",
        "url": "https://www.powerconcept.be/reprogrammation/fiat/doblo/2015-2021/16-multijet-100hp",
        "stage1Hp": 140,
        "stage1Nm": 360,
        "scope": "1598cc 100/320→140/360 original scope 2015–21.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "db-ecu-service",
        "title": "DB ECU Fiat Doblò 1.6 MultiJet100 2015–21",
        "url": "https://www.dbecuservice.it/chiptuning/fiat-doblo-1-6-multijet-100cv",
        "stage1Hp": 140,
        "stage1Nm": 360,
        "scope": "Italian Doblò 2015–21 100PS/320Nm to140/360, manufacturer claim vendor only.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only FIAT DOBLO' 263 RDW original74kW/1598cc 2015. Separate from MultiJet105/77kW and MultiJet120/88kW. Need verify 2015 Euro phase and Bosch EDC17 ECU. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-fiat-doblo-263-16multijet120-2021",
    "make": "Fiat",
    "model": "Doblo",
    "rdwModel": "FIAT DOBLO'",
    "type": "263",
    "from": 2021,
    "to": 2021,
    "cc": 1598,
    "kw": 88,
    "cylinders": 4,
    "stockNm": 320,
    "engine": "Fiat Doblò II type263 1.6 MultiJet120 88kW1598cc first admitted2021",
    "fuel": "Diesel",
    "power": [
      140,
      140
    ],
    "torque": [
      360,
      360
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "bpt-portal",
        "title": "BPT Fiat Doblò 2015–2021 1.6 MultiJet120",
        "url": "https://bpt-portal.com/tuning/cars/fiat/doblo/2015-2021/1-6-multijet-120hp/",
        "stage1Hp": 140,
        "stage1Nm": 360,
        "scope": "2015–2021 120PS/320Nm to140/360, Bosch EDC17C69 198A3.000 candidate.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "revtuning",
        "title": "Revtuning Fiat Doblò 2015–2021 1.6 MultiJet120",
        "url": "https://revtuning.eu/nl/product/chiptuning-fiat-doblo-1-6-multijet-120hp-2015-2021",
        "stage1Hp": 140,
        "stage1Nm": 360,
        "scope": "2015–2021 120/320 to140/360 ordinary Stage1. Fuel diesel.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only Fiat-era FIAT DOBLO' type263 2021 1598cc 88kW diesel, NOT Peugeot/Stellantis rebadged Doblò 2022+, verify EDC17C69 and emissions. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-fiat-ducato-250-23multijet130-euro6-2020",
    "make": "Fiat",
    "model": "Ducato",
    "rdwModel": "FIAT DUCATO",
    "type": "250",
    "from": 2020,
    "to": 2020,
    "cc": 2287,
    "kw": 96,
    "cylinders": 4,
    "stockNm": 320,
    "engine": "Fiat Ducato 2020 2.3 MultiJet130 Euro6 2287cc 96kW type250",
    "fuel": "Diesel",
    "power": [
      150,
      160
    ],
    "torque": [
      360,
      400
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "squadra-tuning",
        "title": "Squadra Ducato 2.3 MultiJet Euro6 130 conservative camper Stage1",
        "url": "https://squadra-tuning.nl/chiptuning/campertuning/ducato/2-3-multijet-16v-130-pk-euro-6/",
        "stage1Hp": 150,
        "stage1Nm": 360,
        "scope": "2020 update: medio Stage1 150/360 for long-term campers and massimo160/390, high load requires individual torque setting.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Ducato 2.3 130 Euro6",
        "url": "https://www.atm-chiptuning.com/chiptuning/fiat-ducato-23-130-multijet-eur6-130pk/",
        "stage1Hp": 160,
        "stage1Nm": 400,
        "scope": "Euro6 Ducato 130PS/320Nm Stage1 160PS/400Nm, Bosch EDC17C69 vs MarelliMJD9DF verify.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only FIAT DUCATO 250 RDW registered96kW 2287cc 2020; emissions software transitions 2020 Euro6B/Euro6D and F1AGL411D ECU require scan. High advertising 182/426 excluded. Heavy camper load conservative tune. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-citroen-berlingo-7-16hdi75-2015",
    "make": "Citroen",
    "model": "Berlingo",
    "rdwModel": "BERLINGO",
    "type": "7",
    "from": 2015,
    "to": 2015,
    "cc": 1560,
    "kw": 55,
    "cylinders": 4,
    "stockNm": 185,
    "engine": "Citroën Berlingo II older 1.6 HDi 75 1560cc 55kW 2015 transitional model-year",
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
        "provider": "csc-motors",
        "title": "CSC Berlingo II 2012–15 1.6 HDi 75",
        "url": "https://www.cscmotors.com/remapping-stats/Citroen/berlingo/2012-2015/berlingo-1-6-hdi-16v-75hp-2135",
        "stage1Hp": 115,
        "stage1Nm": 260,
        "scope": "Specific older Berlingo 2012–2015 1.6HDi 75PS/185Nm to115/260; DV6BTED4 ECU.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "hirsch-racing",
        "title": "Hirsch Racing Berlingo II 2008–2018 HDi 75",
        "url": "https://www.hirsch-racing.de/chiptuning/citroen/berlingo/mk2-2008-2018/16-hdi-16v-75hp/",
        "stage1Hp": 115,
        "stage1Nm": 260,
        "scope": "Berlingo II old 1.6 HDi75PS/185Nm Stage1 115/260, not BlueHDi.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "powerconcept",
        "title": "Powerconcept Berlingo 2012–15 1.6 HDi75",
        "url": "https://www.powerconcept.ma/reprogrammation/citroen/berlingo/2012-2015/16-hdi-16v-75hp-5777",
        "stage1Hp": 115,
        "stage1Nm": 260,
        "scope": "2012–2015 Berlingo 1.6HDi 75PS/185Nm to115/260.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "RDW BERLINGO type7 first admitted2015 55kW 1560cc could be older HDi or mid2015 1.6 BlueHDi75. RDW alone cannot resolve; only source older HDi until actual DV6 engine and ECU proof. Never copy BlueHDi75 values. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-mercedes-sprinter-906ba35-21-314cdi143-2018",
    "make": "Mercedes-Benz",
    "model": "Sprinter",
    "rdwModel": "SPRINTER",
    "type": "906BA35",
    "from": 2018,
    "to": 2018,
    "cc": 2143,
    "kw": 105,
    "cylinders": 4,
    "stockNm": 330,
    "engine": "Mercedes Sprinter W906 314 CDI 2.1 OM651 143PS 105kW 2018 type906BA35",
    "fuel": "Diesel",
    "power": [
      200,
      210
    ],
    "torque": [
      460,
      480
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR Mercedes Sprinter W906 2016–18 314 CDI143",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/8732-w906-2016-2018/8734-214-314-cdi/",
        "stage1Hp": 200,
        "stage1Nm": 480,
        "scope": "W906 2016–18 314CDI original143/330 normal Stage1 200PS/480Nm, high vendor claim.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "tuningservice",
        "title": "Tuning Service Sprinter W906 2016–18 314CDI143",
        "url": "https://tuningservice.nl/chiptuning/mercedes-benz/sprinter/2016-2018/214314414514-cdi-143pk/",
        "stage1Hp": 210,
        "stage1Nm": 460,
        "scope": "Specifically W906 2016–18 143PS/330Nm Stage1 210PS/460Nm Delphi CRD3P.D1.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only RDW SPRINTER type906BA35 2018 2143cc registered105kW. 2018 W906 vs W907 crossover must be confirmed by chassis/VIN ECU; high suppliers 460–480Nm not gearbox safe limit, especially heavily loaded vans. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-mercedes-sprinter-906bb50-21-316cdi163-2018",
    "make": "Mercedes-Benz",
    "model": "Sprinter",
    "rdwModel": "SPRINTER",
    "type": "906BB50",
    "from": 2018,
    "to": 2018,
    "cc": 2143,
    "kw": 120,
    "cylinders": 4,
    "stockNm": 360,
    "engine": "Mercedes Sprinter W906 316 CDI 2.1 OM651 163PS 120kW 2018 type906BB50",
    "fuel": "Diesel",
    "power": [
      200,
      200
    ],
    "torque": [
      480,
      480
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR Sprinter W906 2016–18 316 CDI163",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/8732-w906-2016-2018/8735-216-316-cdi/",
        "stage1Hp": 200,
        "stage1Nm": 480,
        "scope": "Specific 2016–2018 W906 316CDI 163/360 to200/480 ordinary Stage1.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "full-reprog",
        "title": "Full Reprog Sprinter W906 2016–18 316 CDI163",
        "url": "https://full-reprog.com/en/stage1/mercedes/sprinter/216-316-cdi-163ch-163",
        "stage1Hp": 200,
        "stage1Nm": 480,
        "scope": "W906 216/316 CDI 2.1 163/360 to200/480 published Stage1; 480Nm not a safe mechanical limit.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only W906-type SPRINTER 906BB50 2018 2143cc 120kW 163PS, not W907/2018 W910 similar engine. Suppliers 480Nm high, require gearbox torque ceiling scan and conservatism. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  },
  {
    "id": "rdw-bulk-13-opel-vivaro-v-20d177-2024",
    "make": "Opel",
    "model": "Vivaro",
    "rdwModel": "VIVARO",
    "type": "V",
    "from": 2024,
    "to": 2024,
    "cc": 1997,
    "kw": 130,
    "cylinders": 4,
    "stockNm": 400,
    "engine": "Opel Vivaro C facelift 2024 2.0 D 177PS 130kW 1997cc PSA Euro6d",
    "fuel": "Diesel",
    "power": [
      205,
      207
    ],
    "torque": [
      460,
      465
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU Soft Opel Vivaro 2019–2026 2.0 D177",
        "url": "https://www.ecu-soft.be/chiptuning/opel/vivaro/11211/2-0d-177-15039",
        "stage1Hp": 205,
        "stage1Nm": 460,
        "scope": "2019–2026 Opel Vivaro 2.0D 177PS/400Nm to205/460 ordinary Stage1; exact 2024 ECU differs.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "kuzka-performance",
        "title": "Kuzka Opel Vivaro C 2019+ 2.0 D177",
        "url": "https://www.kuzka-performance.de/chiptuning/opel/vivaro/2019-/20d-177ps",
        "stage1Hp": 205,
        "stage1Nm": 460,
        "scope": "Vivaro 2019+ 2.0D 177PS/400Nm to205/460.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "powermod",
        "title": "Powermod Vivaro C 2.0 BlueHDi EU6d 177",
        "url": "https://powermod.de/konfigurator/Opel/Vivaro/2019/2.0-BlueHDI-EU6d/15723",
        "stage1Hp": 207,
        "stage1Nm": 465,
        "scope": "2019+ Vivaro EU6d 177/400 stage207/465, separate 2024 calibration needs ECU scan.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Exact OPEL VIVARO type V 2024 130kW 1997cc Diesel PSA/Stellantis platform, entirely different from older OPEL VIVARO-B type F7 1598cc. Euro6d and 2024 EAT8/Delphi DCM exact flash eligibility not RDW known. Independent third-party supplier Stage 1 indications, not NoordTune dyno measurements, guaranteed gains or approved torque limits. VIN/motorcode/installed ECU and Euro emissions phase/gearbox/clutch/load must be verified before any tuning quote. DPF, EGR, SCR and AdBlue must remain road legal and functional. No Stage 2/3 numerical outputs, no cross-platform software transfer."
  }
];
export const reviewedRdwBulkBatch13=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch13Count=reviewedRdwBulkBatch13.length;
