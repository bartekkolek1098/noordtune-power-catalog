# NoordTune Power Catalog — NL van reviewed RDW Stage 1 batch 11

**Reviewed:** 2026-10-09. **Baseline production:** `ddf834b` (PR #54, Vercel READY). **Branch:** `feature/nl-vans-rdw-verified-batch11-20261009`.

## Independently published **indicative** normal Stage 1 references

The following four applications match *all* exact RDW technical identity dimensions: **make, exact handelsbenaming, type, first admission year, original registered kW, cylinder capacity and count, single diesel fuel**. Numbers are third-party tuner literature, not NoordTune guaranteed values, individual measured dyno output, a safe torque target for an installed gearbox, or direct RDW observations of torque.

| Registered technical application | Original RDW | Advertised source-original torque | Ordinary Stage 1 supplier publications |
|---|---|---|---|
| VW CRAFTER SYN1E 2023–24 2.0 TDI 140 Euro6D candidate | 1968 cc / 103 kW diesel | 340 Nm | 175 pk / 400 Nm |
| VW TRANSPORTER T6.1 7J0 2024 2.0 TDI 150 Euro6.2 candidate | 1968 cc / 110 kW diesel | 340 Nm | 190 pk / 420 Nm |
| VW TRANSPORTER T6.1 7J0 2024 2.0 TDI 110 | 1968 cc / 81 kW diesel | 250 Nm | **150–190 pk / 330–420 Nm** (strongly conflicting publications) |
| Renault MASTER MA 2017 2.3 dCi 130 Euro6 candidate | 2299 cc / 96 kW diesel | 340 Nm | 180 pk / 420 Nm |

### Exact external source evidence

- Crafter EU6D 140, **2021 onward**: [TSP](https://tsp-chiptuning.de/chiptuning/autos-kleintransporter/volkswagen/crafter/2021/diesel/20-tdi-eu6d-140ps) and [MasterTuning](https://database.mastertuning.it/en/increment-database/volkswagen/crafter/2021/20-tdi-eur6d-140hp). No copying 2017–20 ECU maps. Although the supplier page spans 2023–24, the ECU/Euro6 phase is *not* RDW-proven.
- Transporter **2024** T6.1 150: [VAGtechniek T6.1](https://www.vagtechniek.nl/chiptuning/volkswagen/transporter-multivan/t6.1/2.0-tdi-150pk/) and [Shiftech T6.1 2021+ 150 Euro6.2](https://www.shiftech.eu/fr/reprogrammation-moteur/voiture/volkswagen/transporter-multivan-caravelle/2021-t7/diesel/2.0-tdi-cr-eu6.2-150). Ordinary Stage1 **190/420**, **not** VAG Stage1+195/430.
- Transporter **2024** T6.1 110: [VAGtechniek 150/330](https://www.vagtechniek.nl/chiptuning/volkswagen/transporter-multivan/t6.1/2.0-tdi-110pk/), [Mobile Chiptuning 185/410](https://www.mobile-chiptuning.nl/chiptuning/auto/volkswagen/volkswagen-transporter-multivan-t6-1-2019-2024/), [Shiftech 2026 Bosch ECU unlock bulletin 190/420](https://www.shiftech.eu/en/news/bosch-md1cs004-md1cs104-calculator-almost-all-vag-20-tdi-diesel-engines-can-finally-be-remapped). **Massive supplier disagreement is NOT evidence the higher output is suitable for a 5-speed manual transmission**. Present vendor range, require a workshop torque cap, and avoid sales claims of those maxima.
- Renault Master **2017** Euro6 130: [BR-Performance 2016–19](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/45-renault/2536-master/8964-mk4-03-2016-2019/8966-2-3-dci-euro-6/) and [ECU-Soft 2016–19](https://www.ecu-soft.be/chiptuning/renault/master/8964/2-3-dci-euro-6-130-11625). Factory original 96kW mathematically rounds to ~131 metric PS despite marketing 130. Installed M9T engine and Bosch/Continental ECU subject to scan.

**Emission compliance:** DPF, EGR, SCR and AdBlue must remain road-legal and functional. VAG MD1CS104 may need physical ECU unlock; technical engine identity alone is not proof a particular ECU can be accessed, and a gearbox's torque limit is not a tuning supplier range. No public estimated Stage 2/3 output or automatic cross-brand/platform transfer.

## Selected-sample coverage and NL SEO

4 exact application profiles match **12 frozen positive technical observations** (Crafter 7, Transporter 150 two, Transporter 110 two, Master 130 one), with **60 adversarial mismatched identity negative tests**. The independently recalculated net sourced Stage 1 rose from **1,809 to 1,821/3,000 (60.70%, +12)**, with no already-covered rows counted twice. The denominator is the **unchanged purpose-selected, nonrandom historical 3,000-row RDW sample** and is explicitly **NOT representative of all Dutch registered vehicles**.

No new thin brand pages. Existing 18 indexable NL business-van models remain; 4 new *distinct* Dutch Stage1 van-engine pages increase 36→40. Indexable business van URLs 55→59, total canonical sitemap addresses 303→307; QA must confirm uniqueness, browser widths 320/390/1440 and unsupported automatic translations 404.

**Release:** keep rollback baseline `ddf834b` and require PASS `pnpm test:seo`, lint, TypeScript, optimized Next build, `pnpm qa:seo:nl-vans`, exact SHA Vercel Preview READY, PR merge, new production READY and live URL/sitemap smoke before claiming deployment.
