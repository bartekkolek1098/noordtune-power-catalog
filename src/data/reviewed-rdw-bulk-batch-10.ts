/** Manual source-reviewed NL van batch 10, 2026-10-09.
 * No generic cross-brand transfer or inferred Stage2/3; source publications are indicative.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const seeds:readonly Seed[] = [
  {
    "id": "rdw-bulk-10-opel-vivaro-b-f7-16cdti95-euro6-2017-19",
    "make": "Opel",
    "model": "Vivaro",
    "rdwModel": "VIVARO-B",
    "type": "F7",
    "from": 2017,
    "to": 2019,
    "cc": 1598,
    "cylinders": 4,
    "kw": 70,
    "stockNm": 260,
    "engine": "Opel Vivaro B 1.6 CDTI 95 Euro6 R9M (single turbo) 1598cc/70kW",
    "fuel": "Diesel",
    "power": [
      145,
      145
    ],
    "torque": [
      350,
      370
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Opel Vivaro 2016–2019 1.6 dCi Euro6 95",
        "url": "https://www.ecu-soft.be/chiptuning/opel/vivaro/9276/1-6-dci-euro-6-95-12079",
        "stage1Hp": 145,
        "stage1Nm": 350,
        "scope": "Year-specific 2016–2019 Euro6 95PS/260Nm Stage1 145PS/350Nm, emissions system must remain functional.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "vtune",
        "title": "Vtune Opel Vivaro 2016–2019 1.6 CDTI Euro6 95",
        "url": "https://vtune.nl/chip-tuning-opel/opel-vivaro-2016-2019/",
        "stage1Hp": 145,
        "stage1Nm": 350,
        "scope": "2016–2019 1.6 CDTI Euro6 95/260 to145/350 ECU tune, not DigiChip module.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Opel Vivaro Euro6 95 1.6",
        "url": "https://www.atm-chiptuning.com/chiptuning/opel-vivaro-16-dci-euro-6-95pk/",
        "stage1Hp": 145,
        "stage1Nm": 370,
        "scope": "2016–18 Euro6 95/260→145/370, 2019 generation requires ECU verification and other year-specific publishers.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Exact RDW VIVARO-B F7, single diesel, first admitted 2017–19, original 70kW/1598cc. Distinguish Euro6 R9M D4 from older Euro5 R9M A4; ATM vs ECU/Vtune different torque outputs 350/370. No cross-copy to Renault Trafic, or 2019 new VIVARO type V. Stage 1 is published external source indication, not a NoordTune dyno result, safety certification or guaranteed output. Confirm actual engine generation, ECU software, Euro phase, engine health, manual/automatic gearbox limits, cooling and load before owner-specific work. Keep DPF, EGR, SCR and AdBlue road-legal and functional. Stage2/3 numeric values withheld."
  },
  {
    "id": "rdw-bulk-10-opel-vivaro-b-f7-16cdti120-euro6-2017-19",
    "make": "Opel",
    "model": "Vivaro",
    "rdwModel": "VIVARO-B",
    "type": "F7",
    "from": 2017,
    "to": 2019,
    "cc": 1598,
    "cylinders": 4,
    "kw": 89,
    "stockNm": 300,
    "engine": "Opel Vivaro B 1.6 CDTI 120 Euro6 1598cc/89kW R9M D4 conditional",
    "fuel": "Diesel",
    "power": [
      145,
      145
    ],
    "torque": [
      350,
      370
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance Opel Vivaro 2016–2019 1.6 dCi Euro6 120",
        "url": "https://www.br-performance.be/en-be/chiptuning/1-cars/42-opel/2205-vivaro/9276-2016-2019/9278-1-6-dci-euro-6/",
        "stage1Hp": 145,
        "stage1Nm": 350,
        "scope": "2016–2019 Opel Vivaro 1.6 Euro6 120/300 Stage1 145/350.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Opel Vivaro 2016–2019 1.6 dCi Euro6 120",
        "url": "https://www.ecu-soft.be/chiptuning/opel/vivaro/9276/1-6-dci-euro-6-120-12081",
        "stage1Hp": 145,
        "stage1Nm": 350,
        "scope": "2016–2019 120/300 to145/350.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Opel Vivaro Euro6 120",
        "url": "https://www.atm-chiptuning.com/chiptuning/opel-vivaro-16-dci-euro-6-120pk/",
        "stage1Hp": 145,
        "stage1Nm": 370,
        "scope": "ATM 2016–18 120/320 to145/370. Its 320Nm original conflicts with independent BR/ECU 300Nm; factory torque is NOT RDW.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Exact RDW VIVARO-B type F7 original 89kW rounds121PS (marketed 120PS). Original supplier torque 300/320Nm conflicts; 300Nm uses two 2016–19 independent publications. Check R9M engine code, Bosch EDC variant and gearbox. Excludes 1.6 BiTurbo125/145. Stage 1 is published external source indication, not a NoordTune dyno result, safety certification or guaranteed output. Confirm actual engine generation, ECU software, Euro phase, engine health, manual/automatic gearbox limits, cooling and load before owner-specific work. Keep DPF, EGR, SCR and AdBlue road-legal and functional. Stage2/3 numeric values withheld."
  },
  {
    "id": "rdw-bulk-10-opel-vivaro-b-f7-16biturbo125-euro6-2017-19",
    "make": "Opel",
    "model": "Vivaro",
    "rdwModel": "VIVARO-B",
    "type": "F7",
    "from": 2017,
    "to": 2019,
    "cc": 1598,
    "cylinders": 4,
    "kw": 92,
    "stockNm": 320,
    "engine": "Opel Vivaro B 1.6 CDTI BiTurbo 125 Euro6 R9M D4 1598cc/92kW",
    "fuel": "Diesel",
    "power": [
      165,
      175
    ],
    "torque": [
      370,
      390
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance Opel Vivaro 2016–2019 1.6 dCi BiTurbo125 Euro6",
        "url": "https://www.br-performance.lu/en-lu/chiptuning/1-cars/42-opel/2205-vivaro/9276-2016-2019/9279-1-6-dci-bi-turbo-euro-6/",
        "stage1Hp": 175,
        "stage1Nm": 390,
        "scope": "2016–2019 125/320 to175/390, genuine Opel Vivaro separate from Renault Trafic.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Opel Vivaro 2016–2019 1.6 BiTurbo125 Euro6",
        "url": "https://www.ecu-soft.be/chiptuning/opel/vivaro/9276/1-6-dci-bi-turbo-euro-6-125-12083",
        "stage1Hp": 175,
        "stage1Nm": 390,
        "scope": "2016–2019 125/320 to175/390.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Opel Vivaro 1.6 DCi BiTurbo125",
        "url": "https://www.atm-chiptuning.com/chiptuning/opel-vivaro-16-dci-bi-turbo-euro-6-125pk/",
        "stage1Hp": 165,
        "stage1Nm": 370,
        "scope": "ATM 2016–18 original 125/320 tuned165/370, vendor conflict 165–175/370–390 shown honestly.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only VIVARO-B F7 92kW 1598cc first admission 2017–19. 2019 confidence from BR and ECU 2016–19; ATM earlier software requires scan. Do not treat Stage 1 maxima as safe loaded-van or clutch limit. Stage 1 is published external source indication, not a NoordTune dyno result, safety certification or guaranteed output. Confirm actual engine generation, ECU software, Euro phase, engine health, manual/automatic gearbox limits, cooling and load before owner-specific work. Keep DPF, EGR, SCR and AdBlue road-legal and functional. Stage2/3 numeric values withheld."
  },
  {
    "id": "rdw-bulk-10-opel-vivaro-b-f7-16biturbo145-euro6-2019",
    "make": "Opel",
    "model": "Vivaro",
    "rdwModel": "VIVARO-B",
    "type": "F7",
    "from": 2019,
    "to": 2019,
    "cc": 1598,
    "cylinders": 4,
    "kw": 107,
    "stockNm": 340,
    "engine": "Opel Vivaro B 1.6 CDTI BiTurbo 145 Euro6 R9M D4 1598cc/107kW",
    "fuel": "Diesel",
    "power": [
      175,
      175
    ],
    "torque": [
      390,
      390
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Opel Vivaro 2016–2019 1.6 BiTurbo145 Euro6",
        "url": "https://www.ecu-soft.be/chiptuning/opel/vivaro/9276/1-6-dci-bi-turbo-euro-6-145-12085",
        "stage1Hp": 175,
        "stage1Nm": 390,
        "scope": "2016–2019 explicit 145/340 to175/390.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "vtune",
        "title": "Vtune Opel Vivaro 2016–2019 1.6 BiTurbo Euro6 145",
        "url": "https://vtune.nl/chip-tuning-opel/opel-vivaro-2016-2019/",
        "stage1Hp": 175,
        "stage1Nm": 390,
        "scope": "2016–2019 145/340 to175/390, software remap list not piggyback DigiChip.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only VIVARO-B F7 107kW 1598cc admitted2019, distinct from the 125PS/92kW. 2016–19 two independent suppliers agree but Euro6 firmware, actual BiTurbo, Bosch EDC17C84 and gearbox to be checked. Stage 1 is published external source indication, not a NoordTune dyno result, safety certification or guaranteed output. Confirm actual engine generation, ECU software, Euro phase, engine health, manual/automatic gearbox limits, cooling and load before owner-specific work. Keep DPF, EGR, SCR and AdBlue road-legal and functional. Stage2/3 numeric values withheld."
  },
  {
    "id": "rdw-bulk-10-ford-transit-connect-pu2-15tdci120-2015",
    "make": "Ford",
    "model": "Transit Connect",
    "rdwModel": "TRANSIT CONNECT",
    "type": "PU2",
    "from": 2015,
    "to": 2015,
    "cc": 1499,
    "cylinders": 4,
    "kw": 88,
    "stockNm": 270,
    "engine": "Ford Transit Connect 1.5 TDCi 120 1499cc/88kW 2015 (not 1.5 EcoBlue from 2018)",
    "fuel": "Diesel",
    "power": [
      140,
      140
    ],
    "torque": [
      320,
      330
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance Transit Connect II 1.5 TDCi 120 (2015–2018)",
        "url": "https://www.br-performance.lu/en-lu/chiptuning/1-cars/23-ford/12693-transit-connect/14273-ii-2013-2018/22987-1-5-tdci/",
        "stage1Hp": 140,
        "stage1Nm": 330,
        "scope": "Specifically Ford Transit Connect II 1.5 TDCi 120, 2015–2018; stock120PS/270Nm, ordinary Stage1 140PS/330Nm. Manual vs Powershift explicitly requires workshop distinction.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "tuningservice",
        "title": "Tuning Service Transit Connect II 2013–2016 1.5 TDCi120",
        "url": "https://tuningservice.nl/chiptuning/ford/transit-connect/2th-2013-2016/15-tdci-120pk/",
        "stage1Hp": 140,
        "stage1Nm": 320,
        "scope": "Transit Connect II 2013–2016 1.5 TDCi120 1499cc 270Nm engine XWGB Bosch EDC17C70; ordinary Stage1 140PS/320Nm.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "RDW 2015 FORD TRANSIT CONNECT PU2 diesel 1499cc 88kW; engine XWGB/Bosch ECU must be confirmed. Two Transit Connect-specific independently published 2015-inclusive sources: BR-Performance 2015–18 and Tuning Service 2013–16. Exclude ATM's 2016+ generation and shared Tourneo/Courier category results. Does not imply 2019/2024 EcoBlue calibration. Stage 1 is published external source indication, not a NoordTune dyno result, safety certification or guaranteed output. Confirm actual engine generation, ECU software, Euro phase, engine health, manual/automatic gearbox limits, cooling and load before owner-specific work. Keep DPF, EGR, SCR and AdBlue road-legal and functional. Stage2/3 numeric values withheld."
  },
  {
    "id": "rdw-bulk-10-peugeot-expert-v-20bluehdi177-2024",
    "make": "Peugeot",
    "model": "Expert",
    "rdwModel": "EXPERT",
    "type": "V",
    "from": 2024,
    "to": 2024,
    "cc": 1997,
    "cylinders": 4,
    "kw": 130,
    "stockNm": 400,
    "engine": "Peugeot Expert III facelift 2024 2.0 BlueHDi 177/180-marketed RDW130kW 1997cc",
    "fuel": "Diesel",
    "power": [
      205,
      205
    ],
    "torque": [
      440,
      460
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance Peugeot Expert 2024–25 2.0 BlueHDi177",
        "url": "https://www.br-performance.be/nl-be/chiptuning/1-wagens/43-peugeot/2328-expert-traveller/13067-2024/18305-2-0-bluehdi/",
        "stage1Hp": 205,
        "stage1Nm": 440,
        "scope": "Explicit 2024 facelift Expert/Traveller 177/400 normal Stage1 205/440.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "dtxchiptuning",
        "title": "DTX Expert/Traveller 2019–2024 2.0 BlueHDi177",
        "url": "https://dtxchiptuning.com/peugeot/expert-traveller/2019-2024/peugeot-expert-traveller-2019-2024-20-bluehdi-177hp/",
        "stage1Hp": 205,
        "stage1Nm": 460,
        "scope": "2019–2024 Expert 177PS/400Nm Stage1 205/460, Delphi DCM ECU candidates; 2024 exact facelift must be independently diagnosed.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only 2024 RDW Expert V 130kW=177PS 1997cc diesel. Strictly separate from 2019–22 180-marketed older ECU source and 2024 BlueHDi145 original106kW. 2024 177PS/400 original vendor reference differs slightly from older 180 marketing. Supplier torque 440 vs460 disagreement; individual emission-phase and EAT8 gearbox verification essential. Stage 1 is published external source indication, not a NoordTune dyno result, safety certification or guaranteed output. Confirm actual engine generation, ECU software, Euro phase, engine health, manual/automatic gearbox limits, cooling and load before owner-specific work. Keep DPF, EGR, SCR and AdBlue road-legal and functional. Stage2/3 numeric values withheld."
  }
];
export const reviewedRdwBulkBatch10=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch10Count=reviewedRdwBulkBatch10.length;
