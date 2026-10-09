/** Manually source-reviewed NL commercial vans batch 11, 2026-10-09.
 * Supplier Stage1 indications only; no cross-engine ECU calibration inheritance.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const seeds:readonly Seed[] = [
  {
    "id": "rdw-bulk-11-vw-crafter-syn1e-20tdi140-eu6d-2023-24",
    "make": "Volkswagen",
    "model": "Crafter",
    "rdwModel": "CRAFTER",
    "type": "SYN1E",
    "from": 2023,
    "to": 2024,
    "cc": 1968,
    "cylinders": 4,
    "kw": 103,
    "stockNm": 340,
    "engine": "Volkswagen Crafter 2.0 TDI 140 (103kW) Euro6D post-2021 candidate, 2023-24 RDW SYN1E",
    "fuel": "Diesel",
    "power": [
      175,
      175
    ],
    "torque": [
      400,
      400
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "tsp-chiptuning",
        "title": "TSP VW Crafter EU6D 2.0 TDI 140 from 2021",
        "url": "https://tsp-chiptuning.de/chiptuning/autos-kleintransporter/volkswagen/crafter/2021/diesel/20-tdi-eu6d-140ps",
        "stage1Hp": 175,
        "stage1Nm": 400,
        "scope": "2021+ Crafter 140PS/340Nm 2.0 TDI EU6D, ordinary Stage1 175PS/400Nm. Availability and ECU protocol not universal.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "mastertuning",
        "title": "MasterTuning VW Crafter EU6D 2021-on 2.0 TDI140",
        "url": "https://database.mastertuning.it/en/increment-database/volkswagen/crafter/2021/20-tdi-eur6d-140hp",
        "stage1Hp": 175,
        "stage1Nm": 400,
        "scope": "2021 onward Volkswagen Crafter 2.0 TDI Euro6D 140/340, normal Stage1 175/400, independently published.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "2023–2024 registered 103kW 1968cc CRAFTER SYN1E only. This is a newer Euro6D source cohort; 2017–2020 ECU sources must not be reused. Source year does not guarantee Euro phase or ECU unlocked; 2023+ MD1CS104 possible. Source-published ordinary Stage 1 only, NOT NoordTune individual dyno test or gearbox approval. RDW make, handelsbenaming, technical type, original kW, cc, cylinders, diesel and admission year must match. Check actual engine code, ECU security lock, Euro6 generation and manual/automatic gearbox under work load. DPF, EGR, SCR, AdBlue remain functional and road legal. No Stage2/3 numeric claim."
  },
  {
    "id": "rdw-bulk-11-vw-transporter-7j0-t61-20tdi150-2024",
    "make": "Volkswagen",
    "model": "Transporter",
    "rdwModel": "TRANSPORTER",
    "type": "7J0",
    "from": 2024,
    "to": 2024,
    "cc": 1968,
    "cylinders": 4,
    "kw": 110,
    "stockNm": 340,
    "engine": "Volkswagen Transporter T6.1 2.0 TDI CR 150 110kW model2024, EU6.2 ECU MD1CS104 candidate",
    "fuel": "Diesel",
    "power": [
      190,
      190
    ],
    "torque": [
      420,
      420
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "vagtechniek",
        "title": "VAGtechniek Transporter T6.1 2.0 TDI CR 150",
        "url": "https://www.vagtechniek.nl/chiptuning/volkswagen/transporter-multivan/t6.1/2.0-tdi-150pk/",
        "stage1Hp": 190,
        "stage1Nm": 420,
        "scope": "Explicit VW Transporter T6.1 150PS/340Nm, regular Stage1 190PS/420Nm; Stage1+195/430 excluded.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "shiftech",
        "title": "Shiftech 2021+ Transporter T6.1 2.0 TDI EU6.2 150",
        "url": "https://www.shiftech.eu/fr/reprogrammation-moteur/voiture/volkswagen/transporter-multivan-caravelle/2021-t7/diesel/2.0-tdi-cr-eu6.2-150",
        "stage1Hp": 190,
        "stage1Nm": 420,
        "scope": "2021+ T6.1 EU6.2 original150PS/340Nm normal Stage1 190PS/420Nm, not automatically accessible ECU; verify hardware unlock.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Only first admitted 2024 original110kW 1968cc, RDW TRANSPORTER 7J0. Not 2020/2021 T6.1 150 data automatically, not T7 new shape. Some MD1CS104 VAG 2024 require off-site ECU unlocking; verify manual/DSG torque limit before offering. Source-published ordinary Stage 1 only, NOT NoordTune individual dyno test or gearbox approval. RDW make, handelsbenaming, technical type, original kW, cc, cylinders, diesel and admission year must match. Check actual engine code, ECU security lock, Euro6 generation and manual/automatic gearbox under work load. DPF, EGR, SCR, AdBlue remain functional and road legal. No Stage2/3 numeric claim."
  },
  {
    "id": "rdw-bulk-11-vw-transporter-7j0-t61-20tdi110-2024",
    "make": "Volkswagen",
    "model": "Transporter",
    "rdwModel": "TRANSPORTER",
    "type": "7J0",
    "from": 2024,
    "to": 2024,
    "cc": 1968,
    "cylinders": 4,
    "kw": 81,
    "stockNm": 250,
    "engine": "Volkswagen Transporter T6.1 2.0 TDI 110PS original81kW 1968cc 2024 MD1CS104 candidate",
    "fuel": "Diesel",
    "power": [
      150,
      190
    ],
    "torque": [
      330,
      420
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "vagtechniek",
        "title": "VAGtechniek T6.1 2.0 TDI110 normal Stage1",
        "url": "https://www.vagtechniek.nl/chiptuning/volkswagen/transporter-multivan/t6.1/2.0-tdi-110pk/",
        "stage1Hp": 150,
        "stage1Nm": 330,
        "scope": "Explicit Transporter T6.1 110PS/250Nm ordinary Stage1 150PS/330Nm, NOT Stage1+160/350.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "mobile-chiptuning",
        "title": "Mobile Chiptuning Transporter/Multivan T6.1 2019-2024 110",
        "url": "https://www.mobile-chiptuning.nl/chiptuning/auto/volkswagen/volkswagen-transporter-multivan-t6-1-2019-2024/",
        "stage1Hp": 185,
        "stage1Nm": 410,
        "scope": "T6.1 2019–2024 2.0 TDI 110PS listed Stage1 +75PS/+160Nm =185PS/410Nm, much higher than VAGtechniek; NOT safe general business-van gearbox torque.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "shiftech",
        "title": "Shiftech Bosch MD1CS104 VW Transporter 110 2026 published unlock",
        "url": "https://www.shiftech.eu/en/news/bosch-md1cs004-md1cs104-calculator-almost-all-vag-20-tdi-diesel-engines-can-finally-be-remapped",
        "stage1Hp": 190,
        "stage1Nm": 420,
        "scope": "2026 updated MD1CS104 2.0 TDI110 110PS/250Nm, listed Stage1 +80PS/+170Nm=190PS/420Nm. Specific ECU requires physical unlock and gearbox evaluation; upper claim not recommendation.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "Strict 2024 VW TRANSPORTER 7J0 81kW/1968cc only, not 150PS 110kW. Dramatically divergent ordinary Stage1 reports (150/330 vs 185/410 vs 190/420) must be disclosed as competing publisher indications, never a safe 5-speed gearbox limit or guarantee. Actual factory ECU, transmission and Euro6 phase must be confirmed; no blind file. Source-published ordinary Stage 1 only, NOT NoordTune individual dyno test or gearbox approval. RDW make, handelsbenaming, technical type, original kW, cc, cylinders, diesel and admission year must match. Check actual engine code, ECU security lock, Euro6 generation and manual/automatic gearbox under work load. DPF, EGR, SCR, AdBlue remain functional and road legal. No Stage2/3 numeric claim."
  },
  {
    "id": "rdw-bulk-11-renault-master-ma-23dci130-euro6-2017",
    "make": "Renault",
    "model": "Master",
    "rdwModel": "MASTER",
    "type": "MA",
    "from": 2017,
    "to": 2017,
    "cc": 2299,
    "cylinders": 4,
    "kw": 96,
    "stockNm": 340,
    "engine": "Renault Master III Mk4 facelift 2.3 dCi Euro6 130 96kW/2299cc type MA 2017",
    "fuel": "Diesel",
    "power": [
      180,
      180
    ],
    "torque": [
      420,
      420
    ],
    "profileIds": [],
    "extras": [
      {
        "provider": "br-performance",
        "title": "BR-Performance Renault Master Mk4 2016–2019 2.3 dCi Euro6",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/45-renault/2536-master/8964-mk4-03-2016-2019/8966-2-3-dci-euro-6/",
        "stage1Hp": 180,
        "stage1Nm": 420,
        "scope": "Master Mk4 03/2016–2019 2.3 dCi Euro6 marketing 130PS/340Nm→normal Stage1 180PS/420Nm.",
        "retrievedAt": "2026-10-09"
      },
      {
        "provider": "ecu-soft",
        "title": "ECU-Soft Master Mk4 2016–2019 2.3 dCi Euro6 130",
        "url": "https://www.ecu-soft.be/chiptuning/renault/master/8964/2-3-dci-euro-6-130-11625",
        "stage1Hp": 180,
        "stage1Nm": 420,
        "scope": "Renault Master 2016–2019 Eu6 dCi130 original130PS/340Nm Stage1 180PS/420Nm.",
        "retrievedAt": "2026-10-09"
      }
    ],
    "scope": "RDW MASTER MA 2299cc original96kW registered 2017, marketed130PS (96kW rounds131PS). Check engine M9T ECU, gearbox limit, workshop diagnostics; not Master2019 blue dCi 100kW / 135PS, nor shared Opel Movano. Source-published ordinary Stage 1 only, NOT NoordTune individual dyno test or gearbox approval. RDW make, handelsbenaming, technical type, original kW, cc, cylinders, diesel and admission year must match. Check actual engine code, ECU security lock, Euro6 generation and manual/automatic gearbox under work load. DPF, EGR, SCR, AdBlue remain functional and road legal. No Stage2/3 numeric claim."
  }
];
export const reviewedRdwBulkBatch11=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch11Count=reviewedRdwBulkBatch11.length;
