/** Manually reviewed RDW van source-evidence expansion batch 14, 2026-10-10.
 * Selected targeted ProAce, ProAce City and Boxer technical cohorts.
 * Supplier ordinary Stage 1 references; NO Stage 2/3 figures or exhaust-system deletes.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const seeds:readonly Seed[] = [
  {
    "id": "rdw-bulk-14-toyota-proace-v-20d4d122-2020-22",
    "make": "Toyota",
    "model": "ProAce",
    "rdwModel": "PROACE",
    "type": "V",
    "from": 2020,
    "to": 2022,
    "cc": 1997,
    "cylinders": 4,
    "kw": 90,
    "stockNm": 340,
    "engine": "Toyota ProAce II type V 2.0 D-4D 122 / registered 90kW 1997cc, 2020–22, Euro6 edition",
    "fuel": "Diesel",
    "power": [
      205,
      210
    ],
    "torque": [
      450,
      460
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "shiftech",
        "title": "Shiftech ProAce 2020 2.0 D-4D 122",
        "url": "https://www.shiftech.eu/en/chiptuning/car/toyota/proace/2020/diesel/2.0-d-4d-122",
        "stage1Hp": 210,
        "stage1Nm": 450,
        "scope": "Toyota ProAce specifically 2020 122PS/340Nm ordinary Stage1 210PS/450Nm; NO Stage2 220/470.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "procartuning",
        "title": "ProCarTuning ProAce 2020+ 2.0 D-4D 122",
        "url": "https://procartuning.nl/toyota-proace-2020-2-0-d-4d-122pk.html",
        "stage1Hp": 205,
        "stage1Nm": 460,
        "scope": "Toyota ProAce 2020 onward 122PS original 340Nm, ordinary Stage1 +83PS/+120Nm to205/460, vendor published, not owner dyno.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "ProAce original RDW 90kW rounds122PS and 1997cc; not the 106kW 145PS 2022+ nor 130kW 177PS. The 205–210PS vendor figures are unusually aggressive for a loaded delivery van; torque 450–460Nm must NOT be offered without ECU and gearbox assessment. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-toyota-proace-v-20d4d150-2019",
    "make": "Toyota",
    "model": "ProAce",
    "rdwModel": "PROACE",
    "type": "V",
    "from": 2019,
    "to": 2019,
    "cc": 1997,
    "cylinders": 4,
    "kw": 110,
    "stockNm": 370,
    "engine": "Toyota ProAce II type V 2.0 D-4D 150 110kW 1997cc, 2016–19 generation",
    "fuel": "Diesel",
    "power": [
      200,
      200
    ],
    "torque": [
      460,
      460
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance Toyota ProAce 2016–2019 D-4D 150",
        "url": "https://www.br-performance.be/en-be/chiptuning/1-cars/53-toyota/6753-proace-proace-verso-proace-city/8520-2016-2019/9743-2-0-d-4d/",
        "stage1Hp": 200,
        "stage1Nm": 460,
        "scope": "Toyota ProAce 2016–2019 150PS/370Nm -> ordinary Stage1 200PS/460Nm; emission hardware retained.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Toyota ProAce 2016–2019 D-4D 150",
        "url": "https://www.ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/8520/2-0-d-4d-150-12727",
        "stage1Hp": 200,
        "stage1Nm": 460,
        "scope": "Toyota ProAce 2016–2019 150PS/370Nm -> Stage1 200PS/460Nm; independent publisher.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only RDW PROACE type V 1997cc original110kW first admitted 2019. Do not automatically apply to later Euro6D 2020–21 110kW, since ECU generation may change. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-toyota-proace-v-20d4d177-2020-24",
    "make": "Toyota",
    "model": "ProAce",
    "rdwModel": "PROACE",
    "type": "V",
    "from": 2020,
    "to": 2024,
    "cc": 1997,
    "cylinders": 4,
    "kw": 130,
    "stockNm": 400,
    "engine": "Toyota ProAce II 2.0 D-4D 177PS / registered130kW 1997cc 2020–24",
    "fuel": "Diesel",
    "power": [
      205,
      210
    ],
    "torque": [
      450,
      460
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "dtxchiptuning",
        "title": "DTX Toyota ProAce 2020+ 2.0 D-4D 177",
        "url": "https://dtxchiptuning.com/toyota/proace/2020/toyota-proace-2020-greater-20-d-4d-177hp/",
        "stage1Hp": 205,
        "stage1Nm": 460,
        "scope": "Toyota ProAce 2020 onwards 177PS/400Nm to205PS/460Nm ordinary Stage1, Delphi DCM7.1A candidate.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "motortech",
        "title": "Motortech Toyota ProAce 2020 2.0 D-4D 177",
        "url": "https://motortech.fr/reprogrammation/voiture/toyota/proace/2020/2.0-d-4d-177",
        "stage1Hp": 210,
        "stage1Nm": 450,
        "scope": "2020 Toyota ProAce 177PS/400Nm to210/450; external dyno indication, not copied Peugeot engine record.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Exact 130kW 1997cc PROACE V, not 106kW ProAce 145 or 2024 e-ProAce. Later 2024 facelift ECU can differ; physical EU6/SCR and EAT8/gearbox code check before offering. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-toyota-proace-v-15d4d100-2020-23",
    "make": "Toyota",
    "model": "ProAce",
    "rdwModel": "PROACE",
    "type": "V",
    "from": 2020,
    "to": 2023,
    "cc": 1499,
    "cylinders": 4,
    "kw": 75,
    "stockNm": 254,
    "engine": "Toyota ProAce II 1.5 D-4D 100 marketed, registered75kW 1499cc 2020–23",
    "fuel": "Diesel",
    "power": [
      140,
      145
    ],
    "torque": [
      300,
      340
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Toyota ProAce 2019–2023 1.5 D-4D 100",
        "url": "https://www.ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/11203/1-5-d-4d-100-16423",
        "stage1Hp": 140,
        "stage1Nm": 340,
        "scope": "2019–2023 Toyota ProAce/City family supplier 100PS/254Nm to140/340. Confirm actual 1499cc vs other generation.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Toyota ProAce 2020+ 1.5 D-4D 100",
        "url": "https://www.atm-chiptuning.com/chiptuning/toyota-proace-15-d-4d-100pk/",
        "stage1Hp": 145,
        "stage1Nm": 300,
        "scope": "Toyota ProAce specifically 2020+ 1499cc 100PS/270Nm Stage1 145/300; original 254 vs270Nm supplier divergence.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only Toyota PROACE RDW V 1499cc Diesel 75kW and first admission 2020–23; NOT ProAce CITY type E. Suppliers disagree on original torque 254 vs270Nm and tuned 300 vs340; ECU Bosch MD1CS003/MD1CS016 phase requires VIN-specific confirmation. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-toyota-proace-v-15d4d120-2020-23",
    "make": "Toyota",
    "model": "ProAce",
    "rdwModel": "PROACE",
    "type": "V",
    "from": 2020,
    "to": 2023,
    "cc": 1499,
    "cylinders": 4,
    "kw": 88,
    "stockNm": 300,
    "engine": "Toyota ProAce II 1.5 D-4D 120 marketed, registered88kW 1499cc 2020–23",
    "fuel": "Diesel",
    "power": [
      150,
      160
    ],
    "torque": [
      340,
      360
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "shiftech",
        "title": "Shiftech Toyota ProAce 2020 1.5 D-4D 120 Stage1",
        "url": "https://www.shiftech.eu/en/chiptuning/car/toyota/proace/2020/diesel/1.5-d-4d-120",
        "stage1Hp": 150,
        "stage1Nm": 340,
        "scope": "Toyota ProAce 2020 120PS/300Nm to ordinary Stage1 150/340. Stage2 160/360 excluded from THIS publisher.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Toyota ProAce 2020 onward 1.5 D-4D 120",
        "url": "https://www.atm-chiptuning.com/chiptuning/toyota-proace-15-d-4d-120pk/",
        "stage1Hp": 160,
        "stage1Nm": 360,
        "scope": "ProAce 2020+ 1.5 D-4D 120PS/300Nm ordinary Stage1 160/360, Bosch MD1CS003 1499cc.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only Toyota PROACE type V, 1499cc 88kW, original120PS marketing, not 75kW 100PS or Toyota ProAce City type E. 2023 Euro6 software/ECU unlock needs assessment. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-toyota-proace-city-e-15d4d75-2020-22",
    "make": "Toyota",
    "model": "ProAce City",
    "rdwModel": "PROACE CITY",
    "type": "E",
    "from": 2020,
    "to": 2022,
    "cc": 1499,
    "cylinders": 4,
    "kw": 56,
    "stockNm": 230,
    "engine": "Toyota ProAce City type E 1.5 D-4D 75 marketed / original registered56kW 1499cc 2020–22",
    "fuel": "Diesel",
    "power": [
      115,
      115
    ],
    "torque": [
      300,
      300
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Toyota ProAce City 2019–2023 1.5 D-4D 75",
        "url": "https://www.ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/11203/1-5-d-4d-75-16421",
        "stage1Hp": 115,
        "stage1Nm": 300,
        "scope": "2019–23 1.5D4D 75PS/230Nm ordinary Stage1 115PS/300Nm; Euro/MD1 unlock dependent.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Toyota ProAce City 1.5 D-4D 75",
        "url": "https://www.atm-chiptuning.com/chiptuning/toyota-proace-city-15-d-4d-75pk/",
        "stage1Hp": 115,
        "stage1Nm": 300,
        "scope": "Specific ProAce City from2019 1499cc 75PS/230Nm to115/300 ordinary Stage1.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only RDW PROACE CITY E 1499cc original56kW (~76 metric PS) 2020–22, not ProAce 75kW 100PS or ProAce City Electric. ECU MD1CS003 actual unlock required. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-toyota-proace-city-e-15d4d100-2020-23",
    "make": "Toyota",
    "model": "ProAce City",
    "rdwModel": "PROACE CITY",
    "type": "E",
    "from": 2020,
    "to": 2023,
    "cc": 1499,
    "cylinders": 4,
    "kw": 75,
    "stockNm": 254,
    "engine": "Toyota ProAce City E 1.5 D-4D 100 marketed 75kW 1499cc 2020–23",
    "fuel": "Diesel",
    "power": [
      140,
      145
    ],
    "torque": [
      300,
      340
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Toyota ProAce City 2019–2023 1.5 D-4D 100",
        "url": "https://www.ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/11203/1-5-d-4d-100-16423",
        "stage1Hp": 140,
        "stage1Nm": 340,
        "scope": "Specific Toyota ProAce City/ProAce family 2019–23 100PS/254Nm to140/340 ordinary Stage1.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM ProAce City 1.5 D-4D100",
        "url": "https://www.atm-chiptuning.com/chiptuning/toyota-proace-city-15-d-4d-100pk/",
        "stage1Hp": 145,
        "stage1Nm": 300,
        "scope": "Toyota ProAce City 2019 onward 1499cc 100PS/270Nm to145PS/300Nm Stage1; source-original torque conflicts.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only RDW PROACE CITY E original75kW 1499cc 2020–23. Same nominal 100PS as ProAce larger van but distinct RDW body/type. 254 vs270 original vendor torque discrepancy; transmission/load verification. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-toyota-proace-city-e-15d4d130-2020-23",
    "make": "Toyota",
    "model": "ProAce City",
    "rdwModel": "PROACE CITY",
    "type": "E",
    "from": 2020,
    "to": 2023,
    "cc": 1499,
    "cylinders": 4,
    "kw": 96,
    "stockNm": 300,
    "engine": "Toyota ProAce City 1.5 D-4D 130 marketed / RDW96kW 1499cc first admitted 2020–23",
    "fuel": "Diesel",
    "power": [
      160,
      160
    ],
    "torque": [
      350,
      360
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Toyota ProAce City 2019–23 1.5 D-4D131",
        "url": "https://ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/11203/1-5-d-4d-131-16425",
        "stage1Hp": 160,
        "stage1Nm": 350,
        "scope": "2019–23 131PS/300Nm to ordinary Stage1 160PS/350Nm. 96kW RDW rounds131PS marketing130.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "atm-chiptuning",
        "title": "ATM Toyota ProAce City 1.5 D-4D130",
        "url": "https://www.atm-chiptuning.com/chiptuning/toyota-proace-city-15-d-4d-130pk/",
        "stage1Hp": 160,
        "stage1Nm": 360,
        "scope": "ProAce City 1.5 D-4D130 1499cc/300Nm Stage1 160PS/360Nm; Bosch MD1CS003 candidate.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only Toyota PROACE CITY type E 1499cc 96kW 2020–23; source torque350 vs360, and actual 2024 ECU new generation separate row. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-toyota-proace-city-e-15d4d130-2024",
    "make": "Toyota",
    "model": "ProAce City",
    "rdwModel": "PROACE CITY",
    "type": "E",
    "from": 2024,
    "to": 2024,
    "cc": 1499,
    "cylinders": 4,
    "kw": 96,
    "stockNm": 300,
    "engine": "Toyota ProAce City facelift 2024 type E 1.5 D-4D 130 original96kW 1499cc",
    "fuel": "Diesel",
    "power": [
      160,
      160
    ],
    "torque": [
      350,
      350
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR Performance Toyota ProAce/City 2024+ 1.5 D-4D 130",
        "url": "https://www.br-performance.be/en-be/chiptuning/1-cars/53-toyota/6753-proace-proace-verso-proace-city/13055-2024/19265-1-5-d-4d/",
        "stage1Hp": 160,
        "stage1Nm": 350,
        "scope": "Explicit 2024 Toyota ProAce City/ProAce 130PS/300Nm to160/350 ordinary Stage1, 2024 phase.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "amc-motorsport",
        "title": "AMC Toyota ProAce ProAce City 2024 1.5 D-4D130",
        "url": "https://amc-motorsport.ro/configurator/toyota/proace-proace-verso-proace-city/2024/1-5-d-4d-130hp/",
        "stage1Hp": 160,
        "stage1Nm": 350,
        "scope": "Toyota ProAce City 2024 1.5D4D 130PS/300Nm Stage1 160/350, separate publisher, verify exact ECU.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only RDW PROACE CITY E 2024 96kW1499cc Diesel, sources explicitly 2024+. Does NOT inherit 2020–23 1.5D4D old ECU; on-site unlock/EDC transmission required. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-peugeot-boxer-y-20bluehdi130-2017-19",
    "make": "Peugeot",
    "model": "Boxer",
    "rdwModel": "BOXER",
    "type": "Y",
    "from": 2017,
    "to": 2019,
    "cc": 1997,
    "cylinders": 4,
    "kw": 96,
    "stockNm": 340,
    "engine": "Peugeot Boxer type Y 2.0 BlueHDi130 96kW 1997cc 2017–19",
    "fuel": "Diesel",
    "power": [
      200,
      200
    ],
    "torque": [
      450,
      450
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Peugeot Boxer 2.0 BlueHDi130 pre-2019",
        "url": "https://www.atm-chiptuning.com/chiptuning/peugeot-boxer-20-bluehdi-130pk/",
        "stage1Hp": 200,
        "stage1Nm": 450,
        "scope": "Boxer 2.0 BlueHDi130 1997cc/130PS/340Nm to200/450 normal Stage1; Delphi DCM6.2C/7.1B possibilities.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Boxer 2014–2019 2.0 BlueHDi130",
        "url": "https://www.ecu-soft.be/chiptuning/peugeot/boxer/5946/2-0-bluehdi-130-12099",
        "stage1Hp": 200,
        "stage1Nm": 450,
        "scope": "2014–19 Peugeot Boxer 130PS/340Nm to200/450 Stage1, 1997cc nominal scope.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only RDW PEUGEOT BOXER type Y 1997cc96kW registered 2017–19. Not the 2179cc or 2184cc Boxer. 200PS/450Nm is high advertised peak, not a safe sustainable hauling/camper rating. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-peugeot-boxer-y-22bluehdi120-2020-23",
    "make": "Peugeot",
    "model": "Boxer",
    "rdwModel": "BOXER",
    "type": "Y",
    "from": 2020,
    "to": 2023,
    "cc": 2179,
    "cylinders": 4,
    "kw": 88,
    "stockNm": 310,
    "engine": "Peugeot Boxer 2.2 BlueHDi 120 marketed, RDW88kW 2179cc 2020–23 Delphi DCM7.1B",
    "fuel": "Diesel",
    "power": [
      185,
      195
    ],
    "torque": [
      430,
      430
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Peugeot Boxer 2.2 BlueHDi120",
        "url": "https://www.atm-chiptuning.com/chiptuning/peugeot-boxer-22-bluehdi-120pk/",
        "stage1Hp": 185,
        "stage1Nm": 430,
        "scope": "2019+ 2179cc Boxer 120PS/310Nm ordinary Stage1 185/430, Delphi DCM7.1B; not stage1+.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "br-performance",
        "title": "BR Peugeot Boxer 2019–2023 2.2 BlueHDi120",
        "url": "https://www.br-performance.be/en-be/chiptuning/1-cars/43-peugeot/2323-boxer/10883-2019-2023/11085-2-2-bluehdi/",
        "stage1Hp": 195,
        "stage1Nm": 430,
        "scope": "2019–23 Boxer 120PS/310Nm ordinary Stage1 195/430, supplier bound, gearbox/camper limits unknown.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only PEUGEOT BOXER Y 2179cc88kW Diesel, first admission2020–23; source 185 vs195PS conflict; same nominal 2.2 family as 140/165 but distinct stock kW and ECU. No 2024 2184cc application. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-peugeot-boxer-y-22bluehdi140-2020-23",
    "make": "Peugeot",
    "model": "Boxer",
    "rdwModel": "BOXER",
    "type": "Y",
    "from": 2020,
    "to": 2023,
    "cc": 2179,
    "cylinders": 4,
    "kw": 103,
    "stockNm": 340,
    "engine": "Peugeot Boxer Y 2.2 BlueHDi 140 marketed, RDW103kW 2179cc 2020–23",
    "fuel": "Diesel",
    "power": [
      185,
      195
    ],
    "torque": [
      430,
      430
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Peugeot Boxer 2.2 BlueHDi140",
        "url": "https://www.atm-chiptuning.com/chiptuning/peugeot-boxer-22-bluehdi-140pk/",
        "stage1Hp": 185,
        "stage1Nm": 430,
        "scope": "2019+ Boxer 2179cc 140PS/340Nm to185/430 ordinary Stage1.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "shiftech",
        "title": "Shiftech Peugeot Boxer EU6b 2019 2.2 BlueHDi140",
        "url": "https://www.shiftech.eu/en/chiptuning/car/peugeot/boxer/2019-iii/diesel/2.2-bluehdi-eu6b-140",
        "stage1Hp": 195,
        "stage1Nm": 430,
        "scope": "EU6b Boxer 2019+ 140/340 Stage1 195/430; not Stage2 205/450.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "br-performance",
        "title": "BR Boxer 2019–23 2.2 BlueHDi140",
        "url": "https://www.br-performance.be/en-be/chiptuning/1-cars/43-peugeot/2323-boxer/10883-2019-2023/11087-2-2-bluehdi/?stage=9925",
        "stage1Hp": 195,
        "stage1Nm": 430,
        "scope": "BR 2019–23 Boxer 140/340 Stage1 195/430, not guaranteed loaded vehicle.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only PEUGEOT BOXER type Y RDW original103kW2179cc first admitted2020–23. Different from 2024 Boxer 2184cc 103kW with new emission/ECU platform, no cross-generational matching. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  },
  {
    "id": "rdw-bulk-14-peugeot-boxer-y-22bluehdi165-2020-23",
    "make": "Peugeot",
    "model": "Boxer",
    "rdwModel": "BOXER",
    "type": "Y",
    "from": 2020,
    "to": 2023,
    "cc": 2179,
    "cylinders": 4,
    "kw": 121,
    "stockNm": 370,
    "engine": "Peugeot Boxer Y 2.2 BlueHDi165 121kW 2179cc 2020–23",
    "fuel": "Diesel",
    "power": [
      185,
      195
    ],
    "torque": [
      430,
      430
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "atm-chiptuning",
        "title": "ATM Peugeot Boxer 2.2 BlueHDi165",
        "url": "https://www.atm-chiptuning.com/chiptuning/peugeot-boxer-22-bluehdi-165pk/",
        "stage1Hp": 185,
        "stage1Nm": 430,
        "scope": "2019+ Boxer 2179cc 165PS/370Nm to185/430 Stage1; conservative supplier entry.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "shiftech",
        "title": "Shiftech Boxer 2019 2.2 BlueHDi Euro6b 165",
        "url": "https://www.shiftech.eu/en/chiptuning/car/peugeot/boxer/2019-iii/diesel/2.2-bluehdi-eu6b-165",
        "stage1Hp": 195,
        "stage1Nm": 430,
        "scope": "Boxer EU6b165 370Nm Stage1 195PS/430Nm. Exclude Stage2 205/450.",
        "retrievedAt": "2026-10-10"
      },
      {
        "provider": "powerconcept",
        "title": "Powerconcept Peugeot Boxer 2019+ 2.2 BlueHDi165",
        "url": "https://www.powerconcept.be/reprogrammation/peugeot/boxer/2019-g/22-bluehdi-165hp",
        "stage1Hp": 185,
        "stage1Nm": 430,
        "scope": "Boxer exactly 2179cc 165/370 to185/430, direct specific Peugeot application.",
        "retrievedAt": "2026-10-10"
      }
    ],
    "scope": "Only PEUGEOT BOXER type Y 2179cc121kW 2020–23. Not newly introduced 2024 2184cc 132kW/180PS. Supplier power185–195, no guarantee loaded camper torque. Supplier published ordinary Stage 1 values only, NOT measured or guaranteed by NoordTune, NOT gearbox torque approval. Exact RDW type, original kW, cc, 4 cylinders, single diesel, first admission must match. VIN, engine code, ECU generation, unlock, emission phase and gearbox/clutch/loading require workshop inspection. DPF, EGR, SCR and AdBlue must remain fully functional and road-legal. No Stage 2/3 numbers; no cross-brand file transfer."
  }
];
export const reviewedRdwBulkBatch14=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch14Count=reviewedRdwBulkBatch14.length;
