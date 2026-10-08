// Fourth reviewed high-NET RDW Stage 1 source batch — exact original kW/year/cc/type/fuel only.
// Publisher numbers are indicative, NOT measured NoordTune results or ECU approvals.
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const seeds:readonly Seed[]=[
  {
    "id": "rdw-bulk-four-nissan-qashqai-j11-12-digt115",
    "make": "Nissan",
    "model": "Qashqai",
    "rdwModel": "NISSAN QASHQAI",
    "type": "J11",
    "from": 2014,
    "to": 2019,
    "cc": 1197,
    "cylinders": 4,
    "kw": 85,
    "stockNm": 190,
    "engine": "Qashqai II J11 1.2 DIG-T 115 marketing/85kW (116 PS RDW), 1197cc HRA2DDT/H5Ft petrol",
    "power": [
      130,
      135
    ],
    "torque": [
      230,
      240
    ],
    "profileIds": [
      "sourced-nissan-qashqai-7dfe97c57d2c",
      "sourced-nissan-qashqai-cd1829d6eefc",
      "sourced-nissan-qashqai-338cf195625c",
      "sourced-nissan-qashqai-f5500f5e8f5a"
    ],
    "scope": "Both pre-facelift and 2017 J11 facelift tuner sources, never new J12 or 1.3 DIG-T. 2014-2019 only. Verify HRA2DDT/H5Ft engine and actual ECU, correct fuel, chain/oil service and J11 manual versus X-Tronic/CVT torque capacity; do not apply a manual-only map to a CVT. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-bmw-320i-f30-3l-n20-2015",
    "make": "BMW",
    "model": "320I",
    "rdwModel": "320I",
    "type": "3L",
    "from": 2015,
    "to": 2015,
    "cc": 1997,
    "cylinders": 4,
    "kw": 135,
    "stockNm": 270,
    "engine": "BMW F30/F31 320i N20 2.0 turbo 1997cc 135kW/184 PS petrol pre-B48",
    "power": [
      260,
      265
    ],
    "torque": [
      400,
      420
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR BMW F3x 2011-2015 320i N20 standard Stage1",
        "url": "https://www.br-performance.be/nl-be/chiptuning/1-wagens/5-bmw/525-3-serie/3859-f3x-10-2011/4150-320i/",
        "stage1Hp": 260,
        "stage1Nm": 420,
        "scope": "Pre-LCI 2011–2015 N20 184PS/270Nm Stage1 260PS/420Nm, excludes gearbox tune and owner dyno testimonial."
      },
      {
        "provider": "mosselman",
        "title": "Mosselman 320i F30/F31 N20 Stage1",
        "url": "https://www.mosselmanturbo.com/en/bmw-320i-f30-f31-184hp",
        "stage1Hp": 265,
        "stage1Nm": 400,
        "scope": "N20 184PS/270Nm RON98, ordinary Stage1 265PS/400Nm; Stage1+ and Stage2 NOT included."
      }
    ],
    "scope": "Pre-LCI 1997cc N20 only, no 1998cc LCI B48. 2015 model transition requires engine-code confirmation. Confirm N20/B48 engine code by vehicle scan and actual ECU, gasoline RON98, timing/thermal health, transmission and ECU access; cc determines only a reviewed original engine candidate, not an ECU approval. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-bmw-320i-f30-3k-n20-2015",
    "make": "BMW",
    "model": "320I",
    "rdwModel": "320I",
    "type": "3K",
    "from": 2015,
    "to": 2015,
    "cc": 1997,
    "cylinders": 4,
    "kw": 135,
    "stockNm": 270,
    "engine": "BMW F30 320i N20 1997cc 135kW/184 PS petrol type 3K",
    "power": [
      260,
      265
    ],
    "torque": [
      400,
      420
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR BMW F3x N20 320i standard Stage1",
        "url": "https://www.br-performance.be/nl-be/chiptuning/1-wagens/5-bmw/525-3-serie/3859-f3x-10-2011/4150-320i/",
        "stage1Hp": 260,
        "stage1Nm": 420,
        "scope": "2011–2015 non-LCI N20 184/270 → 260/420, 3K original technical identity conditional."
      },
      {
        "provider": "mosselman",
        "title": "Mosselman BMW 320i F30/F31 N20",
        "url": "https://www.mosselmanturbo.com/en/bmw-320i-f30-f31-184hp",
        "stage1Hp": 265,
        "stage1Nm": 400,
        "scope": "N20 184PS/270Nm Stage1 265PS/400Nm on RON98, not B48."
      }
    ],
    "scope": "2015 3K 1997cc N20 candidate only; RDW type does not itself decode engine or turbo. Confirm N20/B48 engine code by vehicle scan and actual ECU, gasoline RON98, timing/thermal health, transmission and ECU access; cc determines only a reviewed original engine candidate, not an ECU approval. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-bmw-320i-f30-3k-b48-2015-18",
    "make": "BMW",
    "model": "320I",
    "rdwModel": "320I",
    "type": "3K",
    "from": 2015,
    "to": 2018,
    "cc": 1998,
    "cylinders": 4,
    "kw": 135,
    "stockNm": 290,
    "engine": "BMW 320i F30/F31 LCI B48 1998cc 135kW/184 PS petrol type3K",
    "power": [
      260,
      260
    ],
    "torque": [
      400,
      410
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "mosselman",
        "title": "Mosselman BMW 320i F30/F31 LCI B48 Stage1 RON98",
        "url": "https://www.mosselmanturbo.com/en/bmw-320i-f30-f31-lci-184hp",
        "stage1Hp": 260,
        "stage1Nm": 410,
        "scope": "B48 LCI 184PS/290Nm RON98 Stage1 260PS/410Nm, no Stage2/Stage1+."
      },
      {
        "provider": "br-performance",
        "title": "BR BMW 320i F3x LCI 06/2015-2019 standard Stage1",
        "url": "https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/5-bmw/525-serie-3/7522-f3x-lci-06-2015-2019/7525-320i/",
        "stage1Hp": 260,
        "stage1Nm": 400,
        "scope": "F3x LCI 184PS/270Nm stock variant, 260PS/400Nm Stage1, installed B48 must be verified."
      }
    ],
    "scope": "1998cc only, not 1997cc N20. BR and Mosselman source-original torque 270 vs290Nm, cannot determine actual stock torque from RDW. Confirm N20/B48 engine code by vehicle scan and actual ECU, gasoline RON98, timing/thermal health, transmission and ECU access; cc determines only a reviewed original engine candidate, not an ECU approval. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-bmw-320i-f30-3l-b48-2015",
    "make": "BMW",
    "model": "320I",
    "rdwModel": "320I",
    "type": "3L",
    "from": 2015,
    "to": 2015,
    "cc": 1998,
    "cylinders": 4,
    "kw": 135,
    "stockNm": 290,
    "engine": "BMW 320i F30/F31 LCI B48 1998cc 135kW/184 PS petrol type3L",
    "power": [
      260,
      260
    ],
    "torque": [
      400,
      410
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "mosselman",
        "title": "Mosselman 320i F30/F31 LCI 184 B48",
        "url": "https://www.mosselmanturbo.com/en/bmw-320i-f30-f31-lci-184hp",
        "stage1Hp": 260,
        "stage1Nm": 410,
        "scope": "2015+ LCI B48 184/290 to Stage1 260/410 RON98."
      },
      {
        "provider": "br-performance",
        "title": "BR-Performance BMW F3x LCI 320i",
        "url": "https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/5-bmw/525-serie-3/7522-f3x-lci-06-2015-2019/7525-320i/",
        "stage1Hp": 260,
        "stage1Nm": 400,
        "scope": "2015+ F3x LCI Stage1 260/400, source original270Nm differs from Mosselman290Nm."
      }
    ],
    "scope": "2015 3L/1998cc B48 candidate only; factory engine not determined by RDW model string. Confirm N20/B48 engine code by vehicle scan and actual ECU, gasoline RON98, timing/thermal health, transmission and ECU access; cc determines only a reviewed original engine candidate, not an ECU approval. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-ford-connect-pu2-15-ecoblue100-2019-20",
    "make": "Ford",
    "model": "Transit Connect",
    "rdwModel": "TRANSIT CONNECT",
    "type": "PU2",
    "from": 2019,
    "to": 2020,
    "cc": 1499,
    "cylinders": 4,
    "kw": 73.5,
    "stockNm": 250,
    "fuel": "Diesel",
    "engine": "Transit Connect II PU2 1.5 EcoBlue 100 PS/73.5kW 1499cc diesel",
    "power": [
      120,
      145
    ],
    "torque": [
      275,
      340
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Transit Connect 2018-on EcoBlue 100 Stage1",
        "url": "https://www.atm-chiptuning.com/chiptuning/ford-transit-connect-15-ecoblue-100pk/",
        "stage1Hp": 145,
        "stage1Nm": 340,
        "scope": "EcoBlue 1499cc/100PS/250Nm, standard Stage1 145/340."
      },
      {
        "provider": "shiftech",
        "title": "Shiftech Transit Connect 1.5 EcoBlue 100 Stage1",
        "url": "https://www.shiftech.eu/en/chiptuning/car/ford/transit-connect/2016/diesel/1.5-ecoblue-100",
        "stage1Hp": 120,
        "stage1Nm": 275,
        "scope": "1.5 EcoBlue 100PS/215Nm →120/275; differs from ATM stock250Nm. Do not apply TDCi EU5 125/330."
      }
    ],
    "scope": "2019-20 73.5kW only, distinct earlier 1.5 TDCi EU5 vs EcoBlue must be established by ECU. Factory torque claimed 215/250Nm by providers. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-ford-connect-pu2-15-ecoblue100-2022",
    "make": "Ford",
    "model": "Transit Connect",
    "rdwModel": "TRANSIT CONNECT",
    "type": "PU2",
    "from": 2022,
    "to": 2022,
    "cc": 1499,
    "cylinders": 4,
    "kw": 73.3,
    "stockNm": 250,
    "fuel": "Diesel",
    "engine": "Ford Transit Connect PU2 1.5 EcoBlue 100 PS/73.3kW 1499cc 2022",
    "power": [
      120,
      145
    ],
    "torque": [
      275,
      340
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Transit Connect EcoBlue 100 1499cc",
        "url": "https://www.atm-chiptuning.com/chiptuning/ford-transit-connect-15-ecoblue-100pk/",
        "stage1Hp": 145,
        "stage1Nm": 340,
        "scope": "1.5 EcoBlue 100/250→145/340, 2018+ catalogue."
      },
      {
        "provider": "shiftech",
        "title": "Shiftech Connect 1.5 EcoBlue100",
        "url": "https://www.shiftech.eu/en/chiptuning/car/ford/transit-connect/2016/diesel/1.5-ecoblue-100",
        "stage1Hp": 120,
        "stage1Nm": 275,
        "scope": "1.5 EcoBlue 100/215→120/275, first-admission 2022 ECU/gearbox not established by RDW."
      }
    ],
    "scope": "2022 only, NOT 2024 emissions/software revision, not 73.5kW or old EU5 TDCi. Factory torque disagreement 215 versus 250Nm; workshop map suitability mandatory. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-ford-connect-pu2-15-ecoblue120-2019-20",
    "make": "Ford",
    "model": "Transit Connect",
    "rdwModel": "TRANSIT CONNECT",
    "type": "PU2",
    "from": 2019,
    "to": 2020,
    "cc": 1499,
    "cylinders": 4,
    "kw": 88.3,
    "stockNm": 270,
    "fuel": "Diesel",
    "engine": "Ford Transit Connect PU2 1.5 EcoBlue 120 PS/88.3kW 1499cc",
    "power": [
      145,
      155
    ],
    "torque": [
      340,
      360
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Transit Connect 1.5 EcoBlue120 1499cc",
        "url": "https://www.atm-chiptuning.com/chiptuning/ford-transit-connect-15-ecoblue-120pk/",
        "stage1Hp": 145,
        "stage1Nm": 340,
        "scope": "2018+ EcoBlue 120PS/270Nm standard Stage1 145/340."
      },
      {
        "provider": "shiftech",
        "title": "Shiftech Transit Connect 1.5 EcoBlue120",
        "url": "https://www.shiftech.eu/en/chiptuning/car/ford/transit-connect/2016/diesel/1.5-ecoblue-120",
        "stage1Hp": 155,
        "stage1Nm": 360,
        "scope": "1.5 EcoBlue 120/300 Stage1 155/360; original source torque 300 versus ATM270Nm."
      }
    ],
    "scope": "Exact 88.3kW EcoBlue 120 only; source original torque discrepancy 270 vs300Nm. Not 88kW earlier TDCi, no 2015 variant. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-crafter-syn1e-20tdi177-2018-20",
    "make": "Volkswagen",
    "model": "Crafter",
    "rdwModel": "CRAFTER",
    "type": "SYN1E",
    "from": 2018,
    "to": 2020,
    "cc": 1968,
    "cylinders": 4,
    "kw": 130,
    "stockNm": 380,
    "fuel": "Diesel",
    "engine": "Crafter II SYN1E 2.0 TDI EU6 177 PS /130kW 1968cc",
    "power": [
      210,
      220
    ],
    "torque": [
      430,
      480
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "unlimited-tuning",
        "title": "Unlimited Tuning Crafter 2.0 TDI EU6 177",
        "url": "https://www.unlimitedtuning.nl/chiptuning-volkswagen-crafter-2-0-tdi-eu6-177-pk.html",
        "stage1Hp": 210,
        "stage1Nm": 430,
        "scope": "2017+ 177PS/380Nm standard normal Stage1 210/430."
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Crafter 2.0 TDI CR EU6 177",
        "url": "https://www.atm-chiptuning.com/chiptuning/volkswagen-crafter-20-tdi-cr-eur-6-177pk-10874/",
        "stage1Hp": 220,
        "stage1Nm": 480,
        "scope": "2017+ 177PS/410Nm standard Stage1 220/480; stock 380 versus410Nm unresolved."
      }
    ],
    "scope": "SYN1E 2018-20 130kW only, 2024 withheld. Wide external torque 430–480 and original 380 vs410 due ECU and gearbox, no promise. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-golf-au-10tsi110-2017",
    "make": "Volkswagen",
    "model": "Golf",
    "rdwModel": "GOLF",
    "type": "AU",
    "from": 2017,
    "to": 2017,
    "cc": 999,
    "cylinders": 3,
    "kw": 81,
    "stockNm": 200,
    "engine": "Golf VII/VII.5 AU 1.0 TSI 110 marketing/81kW petrol 999cc",
    "power": [
      135,
      140
    ],
    "torque": [
      240,
      240
    ],
    "profileIds": [
      "sourced-volkswagen-golf-9b1b3ca1a7f6",
      "sourced-volkswagen-golf-be86b8cb9110"
    ],
    "scope": "Only original Golf AU 81kW 2017, facelift boundary check specific turbo/ECU and DSG DQ200. Identify ECU software, EA211/EA888/EA189/EA288 engine code, DSG/TCU versus manual clutch capacity and fuel octane before calibration. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-caddy-2kn-20tdi140-2015",
    "make": "Volkswagen",
    "model": "Caddy",
    "rdwModel": "CADDY",
    "type": "2KN",
    "from": 2015,
    "to": 2015,
    "cc": 1968,
    "cylinders": 4,
    "kw": 103,
    "stockNm": 320,
    "fuel": "Diesel",
    "engine": "VW Caddy III/IV type2KN 2.0 TDI CR 140PS/103kW",
    "power": [
      180,
      185
    ],
    "torque": [
      400,
      410
    ],
    "profileIds": [
      "sourced-volkswagen-caddy-ce00f32a90bd"
    ],
    "scope": "2013–15 2KN /103kW, old EU5/EU6 and DSG limits require inspection; never assign 2.0TDI102 gains. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-caddy-2kn-20tdi110-2014",
    "make": "Volkswagen",
    "model": "Caddy",
    "rdwModel": "CADDY",
    "type": "2KN",
    "from": 2014,
    "to": 2014,
    "cc": 1968,
    "cylinders": 4,
    "kw": 81,
    "stockNm": 280,
    "fuel": "Diesel",
    "engine": "Caddy 2KN 2.0 TDI CR 110PS/81kW/1968cc 2014",
    "power": [
      180,
      185
    ],
    "torque": [
      400,
      400
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "unlimited-tuning",
        "title": "Unlimited Tuning Caddy 2.0 TDI110 2010–15",
        "url": "https://www.unlimitedtuning.nl/chiptuning-volkswagen-caddy-mk4-mk5-2-0-tdi-110-pk.html",
        "stage1Hp": 185,
        "stage1Nm": 400,
        "scope": "2010–15 2.0 TDI 110/250→185/400, may be factory de-rated; verify ECU."
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Caddy 2.0 TDI CR 110",
        "url": "https://www.atm-chiptuning.com/chiptuning/volkswagen-caddy-20-tdi-cr-110pk/",
        "stage1Hp": 180,
        "stage1Nm": 400,
        "scope": "2.0 TDI 110/280→180/400 standard Stage1; original publisher torque different."
      }
    ],
    "scope": "2014 only type 2KN; source factory torque 250 vs280. High de-rating needs exact turbo/ECU and clutch scrutiny. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-caddy-2kn-20tdi102-2017-20",
    "make": "Volkswagen",
    "model": "Caddy",
    "rdwModel": "CADDY",
    "type": "2KN",
    "from": 2017,
    "to": 2020,
    "cc": 1968,
    "cylinders": 4,
    "kw": 75,
    "stockNm": 250,
    "fuel": "Diesel",
    "engine": "Caddy IV 2KN 2.0 TDI CR 102 marketing/75kW diesel",
    "power": [
      175,
      185
    ],
    "torque": [
      370,
      400
    ],
    "profileIds": [
      "sourced-volkswagen-caddy-2302519726a8"
    ],
    "extras": [
      {
        "provider": "shiftech",
        "title": "Shiftech Volkswagen Caddy IV 2015 2.0 TDI102",
        "url": "https://www.shiftech.eu/en/chiptuning/car/volkswagen/caddy/2015-4/diesel/2.0-tdi-cr-eu6-102",
        "stage1Hp": 175,
        "stage1Nm": 370,
        "scope": "Caddy IV 2015-2020 stock102/250 Stage1 175/370 standard software, Stage2 and gearbox tune excluded."
      }
    ],
    "scope": "Old Caddy IV 2KN 2017–20; does not apply to new SKN; hardware sharing across 102PS versions not assumed. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-caddy-skn-20tdi102-2024",
    "make": "Volkswagen",
    "model": "Caddy",
    "rdwModel": "CADDY",
    "type": "SKN",
    "from": 2024,
    "to": 2024,
    "cc": 1968,
    "cylinders": 4,
    "kw": 75,
    "stockNm": 250,
    "fuel": "Diesel",
    "engine": "Caddy V SKN 2.0 TDI CR EU6 102PS/75kW diesel 2024",
    "power": [
      175,
      180
    ],
    "torque": [
      350,
      370
    ],
    "profileIds": [
      "sourced-volkswagen-caddy-330cd3046442"
    ],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Caddy 2020+ 2.0 TDI CR 102",
        "url": "https://www.atm-chiptuning.com/chiptuning/volkswagen-caddy-20-tdi-cr-102pk-11158/",
        "stage1Hp": 180,
        "stage1Nm": 350,
        "scope": "New Caddy 2020+ marketing102PS, source original280Nm and standard Stage1 180/350, verify installed ECU. Not old 2KN."
      }
    ],
    "scope": "Only SKN 2024; first-admission date not ECU release/locked status, Shiftech original 250Nm vs ATM280Nm. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-caddy-skn-20tdi122-2022-24",
    "make": "Volkswagen",
    "model": "Caddy",
    "rdwModel": "CADDY",
    "type": "SKN",
    "from": 2022,
    "to": 2024,
    "cc": 1968,
    "cylinders": 4,
    "kw": 90,
    "stockNm": 320,
    "fuel": "Diesel",
    "engine": "VW Caddy V SKN 2.0 TDI 122 marketing/90kW diesel",
    "power": [
      195,
      200
    ],
    "torque": [
      410,
      430
    ],
    "profileIds": [
      "sourced-volkswagen-caddy-247ddb1cd8a7"
    ],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance Caddy V 12/2020 2.0 TDI 122",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2937-caddy/11241-v-12-2020/21819-2-0-tdi/",
        "stage1Hp": 195,
        "stage1Nm": 410,
        "scope": "2020+ Caddy V 122PS/320Nm normal ECU Stage1 195PS/410Nm; requires inspection of SCR/gearbox before tuning."
      }
    ],
    "scope": "SKN 90kW 2022–24 only, not 75kW 102PS. Strong factory de-rating result needs specific installed ECU / DSG verification. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-golf-au-gti245-2017-19",
    "make": "Volkswagen",
    "model": "Golf",
    "rdwModel": "GOLF",
    "type": "AU",
    "from": 2017,
    "to": 2019,
    "cc": 1984,
    "cylinders": 4,
    "kw": 180,
    "stockNm": 350,
    "engine": "Golf VII facelift AU GTI Performance 2.0 TSI 245 PS /180kW",
    "power": [
      310,
      315
    ],
    "torque": [
      440,
      440
    ],
    "profileIds": [
      "sourced-volkswagen-golf-6cff268ab9f5",
      "sourced-volkswagen-golf-9ba924a5d9d0"
    ],
    "scope": "Only AU 180kW 2017–19 GTI Performance, not GTI 169kW nor R300. Publisher original torque 350 vs370Nm; individual DSG/manual torque and GPF review. Identify ECU software, EA211/EA888/EA189/EA288 engine code, DSG/TCU versus manual clutch capacity and fuel octane before calibration. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-tiguan-5n-20tsi180-2017",
    "make": "Volkswagen",
    "model": "Tiguan",
    "rdwModel": "TIGUAN",
    "type": "5N",
    "from": 2017,
    "to": 2017,
    "cc": 1984,
    "cylinders": 4,
    "kw": 132,
    "stockNm": 320,
    "engine": "VW Tiguan II 5N 2.0 TSI 180PS/132kW 2017 petrol",
    "power": [
      235,
      245
    ],
    "torque": [
      400,
      400
    ],
    "profileIds": [
      "sourced-volkswagen-tiguan-857717264ea3"
    ],
    "scope": "2017 second-gen Tiguan only; 2012-14 first-gen same RDW type code deliberately handled by separate reviewed record. Engine/EA888 and DSG generation must match source. Identify ECU software, EA211/EA888/EA189/EA288 engine code, DSG/TCU versus manual clutch capacity and fuel octane before calibration. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-polo-6r-12tsi90-2012-14",
    "make": "Volkswagen",
    "model": "Polo",
    "rdwModel": "POLO",
    "type": "6R",
    "from": 2012,
    "to": 2014,
    "cc": 1197,
    "cylinders": 4,
    "kw": 66,
    "stockNm": 160,
    "engine": "VW Polo V 6R 1.2 TSI 90PS /66kW 1197cc turbo petrol",
    "power": [
      130,
      130
    ],
    "torque": [
      215,
      215
    ],
    "profileIds": [
      "sourced-volkswagen-polo-31dfc7cdf338"
    ],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance VW Polo V 6R 1.2 TSI 90",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/3095-polo/3096-v-6r-2009-2014/6104-1-2-tsi/",
        "stage1Hp": 130,
        "stage1Nm": 215,
        "scope": "Old Polo V 6R 2009–14 1.2 TSI90 advertised stock175Nm vs Unlimited160; Stage1 130PS/215Nm."
      }
    ],
    "scope": "6R type/66kW 2012–14 only, 2014 model transition to 6C1 may have different ECU. Source original torque 160 vs175Nm; chain/DSG condition. Identify ECU software, EA211/EA888/EA189/EA288 engine code, DSG/TCU versus manual clutch capacity and fuel octane before calibration. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-vw-transporter-7j0-t6-20tdi204-2017-19",
    "make": "Volkswagen",
    "model": "Transporter",
    "rdwModel": "TRANSPORTER",
    "type": "7J0",
    "from": 2017,
    "to": 2019,
    "cc": 1968,
    "cylinders": 4,
    "kw": 150,
    "stockNm": 450,
    "fuel": "Diesel",
    "engine": "VW Transporter T6 7J0 2.0 BiTDI 204PS/150kW 1968cc",
    "power": [
      230,
      240
    ],
    "torque": [
      500,
      520
    ],
    "profileIds": [
      "sourced-volkswagen-transporter-bddee776acca"
    ],
    "extras": [
      {
        "provider": "shiftech",
        "title": "Shiftech VW Transporter T6 2.0 TDI CR EU6 204",
        "url": "https://www.shiftech.eu/en/chiptuning/car/volkswagen/transporter-multivan-caravelle/2015-t6/diesel/2.0-tdi-cr-eu6-204",
        "stage1Hp": 230,
        "stage1Nm": 500,
        "scope": "T6 2015+ 204/450 Stage1 230/500, no gearbox map, SCR/DPF intact."
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Transporter Multivan 2.0 TDI 204",
        "url": "https://www.atm-chiptuning.com/chiptuning/volkswagen-transporter-multivan-20-tdi-204pk/",
        "stage1Hp": 240,
        "stage1Nm": 520,
        "scope": "T6 204/450 Stage1 240/520; potential high torque needs DSG/clutch approval."
      }
    ],
    "scope": "7J0 T6 first admission2017–19 only; not 7J0 T5 180PS or T6 102PS. BiTDI turbo, gearbox DQ500 torque limits. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-renault-megane-rfb-12tce100-2017-19",
    "make": "Renault",
    "model": "Megane",
    "rdwModel": "MEGANE",
    "type": "RFB",
    "from": 2017,
    "to": 2019,
    "cc": 1197,
    "cylinders": 4,
    "kw": 74,
    "stockNm": 175,
    "engine": "Renault Megane IV RFB 1.2 TCe 100 PS /74kW H5Ft petrol",
    "power": [
      125,
      140
    ],
    "torque": [
      200,
      240
    ],
    "profileIds": [
      "sourced-renault-megane-6df54c1ead75",
      "sourced-renault-megane-bc243437f3cf"
    ],
    "scope": "RFB 74kW 2017-19, not 1.3TCe/H5Ht. Original torque 155Nm Unlimited vs175Nm ATM, actual ECU must be checked for EDC/manual. Confirm H5Ft/H4Dt/M9T diesel/petrol engine code, actual ECU, factory emissions after-treatment, service history, manual or EDC transmission limits. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-renault-master-mf-23dci145-2017",
    "make": "Renault",
    "model": "Master",
    "rdwModel": "MASTER",
    "type": "MF",
    "from": 2017,
    "to": 2017,
    "cc": 2299,
    "cylinders": 4,
    "kw": 107,
    "stockNm": 360,
    "fuel": "Diesel",
    "engine": "Renault Master III MF 2.3 dCi BiTurbo EU6 145PS /107kW 2299cc",
    "power": [
      195,
      210
    ],
    "torque": [
      420,
      440
    ],
    "profileIds": [
      "sourced-renault-master-6a9e7d3d355c",
      "sourced-renault-master-ae882afbe075"
    ],
    "scope": "2017 2.3dCi BiTurbo EU6 only, exclude later 2022 BlueDCi engine/ECU. Confirm service and legal DPF/SCR. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-renault-master-mf-23bluedci145-2022",
    "make": "Renault",
    "model": "Master",
    "rdwModel": "MASTER",
    "type": "MF",
    "from": 2022,
    "to": 2022,
    "cc": 2299,
    "cylinders": 4,
    "kw": 107,
    "stockNm": 360,
    "fuel": "Diesel",
    "engine": "Renault Master III MF 2.3 Blue dCi EU6 145PS /107kW 2299cc 2022",
    "power": [
      210,
      210
    ],
    "torque": [
      440,
      440
    ],
    "profileIds": [
      "sourced-renault-master-010cdf901dc2"
    ],
    "scope": "2022 BlueDCi source independent Shiftech + Unlimited. Not earlier Euro6 2017 BiTurbo engine, verify actual variant and SCR compliance. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-nissan-qashqai-j11-13digt160-2019-20",
    "make": "Nissan",
    "model": "Qashqai",
    "rdwModel": "NISSAN QASHQAI",
    "type": "J11",
    "from": 2019,
    "to": 2020,
    "cc": 1332,
    "cylinders": 4,
    "kw": 117,
    "stockNm": 260,
    "engine": "Nissan Qashqai J11 facelift 1.3 DIG-T GPF 160PS/117kW 1332cc petrol",
    "power": [
      165,
      175
    ],
    "torque": [
      300,
      310
    ],
    "profileIds": [
      "sourced-nissan-qashqai-cd00eb25fe7e"
    ],
    "scope": "J11 facelift 2019-20 1.3 DIG-T H5Ht GPF 160, not 1.2 DIG-T or LPG. Source Stage1 165–175PS; CVT/7DCT/manual limits. Verify HRA2DDT/H5Ft engine and actual ECU, correct fuel, chain/oil service and J11 manual versus X-Tronic/CVT torque capacity; do not apply a manual-only map to a CVT. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-ford-transit-fcd-20ecoblue130-2018-19",
    "make": "Ford",
    "model": "Transit",
    "rdwModel": "TRANSIT",
    "type": "FCD",
    "from": 2018,
    "to": 2019,
    "cc": 1995,
    "cylinders": 4,
    "kw": 96,
    "stockNm": 340,
    "fuel": "Diesel",
    "engine": "Ford Transit FCD 2.0 EcoBlue 130PS/96kW 1995cc diesel",
    "power": [
      190,
      210
    ],
    "torque": [
      440,
      470
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "shiftech",
        "title": "Shiftech Ford Transit 2017/2019 2.0 EcoBlue130",
        "url": "https://www.shiftech.eu/en/chiptuning/car/ford/transit/2019/diesel/2.0-ecoblue-130",
        "stage1Hp": 210,
        "stage1Nm": 470,
        "scope": "130PS/340Nm original published Stage1 210/470; 2017+ EcoBlue ECU-specific."
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Ford Transit 2.0 TDCI EcoBlue130",
        "url": "https://www.atm-chiptuning.com/chiptuning/ford-transit-20-tdci-ecoblue-130pk-11741/",
        "stage1Hp": 190,
        "stage1Nm": 440,
        "scope": "130PS/385Nm source original; ordinary Stage1 190/440. Difference source factory torque 340/385 unresolved."
      }
    ],
    "scope": "FCD exact 96kW/1995cc 2018-19; not 1996cc newer variant. Factory torque disagreement340/385Nm; wet belt service/DPF/AdBlue/manual clutch check. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  },
  {
    "id": "rdw-bulk-four-ford-transit-fed-20ecoblue130-2022",
    "make": "Ford",
    "model": "Transit",
    "rdwModel": "TRANSIT",
    "type": "FED",
    "from": 2022,
    "to": 2022,
    "cc": 1995,
    "cylinders": 4,
    "kw": 95.6,
    "stockNm": 340,
    "fuel": "Diesel",
    "engine": "Ford Transit FED 2.0 EcoBlue130 95.6kW 1995cc 2022",
    "power": [
      190,
      210
    ],
    "torque": [
      440,
      470
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "shiftech",
        "title": "Shiftech Ford Transit 2.0 EcoBlue130 Stage1",
        "url": "https://www.shiftech.eu/en/chiptuning/car/ford/transit/2019/diesel/2.0-ecoblue-130",
        "stage1Hp": 210,
        "stage1Nm": 470,
        "scope": "2019+ 2.0 EcoBlue 130/340→210/470, installed 2022 ECU firmware unknown."
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Ford Transit 2.0 EcoBlue130 Stage1",
        "url": "https://www.atm-chiptuning.com/chiptuning/ford-transit-20-tdci-ecoblue-130pk-11741/",
        "stage1Hp": 190,
        "stage1Nm": 440,
        "scope": "Ford 2.0 EcoBlue130/385→190/440, differs source original torque and hardware."
      }
    ],
    "scope": "FED 2022 95.6kW 1995cc only; exclude 2024 emissions update and 96kW FCD, 1996cc editions. Factory340/385Nm provider conflict. Strict Euro/DPF/AdBlue emissions compliance, installed diesel ECU, turbo and maintenance history and transmission/clutch torque validation required. Source-published ordinary Stage 1 only; confirm installed engine code, ECU firmware, fuel and clutch/automatic gearbox torque limits before any quotation. Not a NoordTune measurement or guaranteed result; Stage 2/3 numbers withheld."
  }
];
export const reviewedRdwBulkBatch4=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch4Count=reviewedRdwBulkBatch4.length;
