# Stage 1 for commercial vans — reviewed RDW batch 5 (NL)

**Status:** source-reviewed numeric data, owner/workshop confirmation REQUIRED for every vehicle. This batch does not authorize ECU or gearbox support automatically.

**Branch:** `feature/nl-vans-rdw-stage1-batch5-20261009` on production baseline `8c0c4ba`. The previous release is recoverable using `backup/catalog-before-bedrijfswagens-2026-10-09` or a revert PR.

## Scope and exact RDW facts

The 3,000-row frozen diversity sample contains **15 exact observations** across five newly reviewed, non-overlapping homologation variants. **Net improvement is +2 source-linked Stage 1 results: 1,773 → 1,775 / 3,000 (59.17%)**, because the other 13 observations already had source-linked answers through older resolvers. This sample is purposively selected; these are *not* Dutch fleet shares. The Stage 2 displayed numeric count changes **69 → 61** for eight newly reviewed exact applications: this strict source-scoped Stage 1 matcher withholds Stage 2/3 when no matching independent Stage 2/3 evidence was approved. This is an intentional precaution, not a claimed increase in Stage 2 coverage.

| Application | RDW type | First admission | Original registered power | Displacement | External Stage 1 (HP) | External Stage 1 (Nm) | Observations |
|---|---|---|---|---|---|---|---|
| Ford Transit Custom 2.2 TDCi 100 | FCC | 2015–2016 | 74 kW = 101 metric PS (marketed 100) | 2198 cc | 180 | 420 | 3 |
| Ford Transit Custom 2.2 TDCi 125 | FCC | 2016 | 92 kW = 125 metric PS | 2198 cc | 180 | 420 | 2 |
| Ford Transit Custom 2.0 EcoBlue 130 | FCC | 2020 | 95.6 kW = 130 metric PS | 1995 cc (sources nominal 1996 cc) | 170–190 | 430–440 | 1 |
| Mercedes Sprinter W906 2.1 CDI 143 | 906BB35 | 2018 | 105 kW = 143 metric PS | 2143 cc | 190–200 | 430–480 | 2 |
| Peugeot Expert III 2.0 BlueHDi 120 | V | 2018–2019 | 90 kW = 122 metric PS (marketed 120) | 1997 cc | 200 | 450 | 7 |

**Critical caveat:** The factory torque value is a motor **source-published Nm** reference; RDW does not report universal factory torque. No Stage 2 or Stage 3 numerical output is inferred or displayed.

## Independent tuner references

| Exact engine | Publishers |
|---|---|
| Ford Custom 2.2 100 | [ATM](https://www.atm-chiptuning.com/chiptuning/ford-transit-custom-22-tdci-100pk/), [Van Drie Performance](https://vandrieperformance.nl/voertuigen/ford-transit-custom-2012-2016-2-2-tdci-100pk/) |
| Ford Custom 2.2 125 | [ATM](https://www.atm-chiptuning.com/chiptuning/ford-transit-custom-22-tdci-125pk/), [ECU-Soft](https://www.ecu-soft.be/chiptuning/ford/transit-transit-custom/5931/2-2-tdci-125-5971) |
| Ford Custom 2.0 EcoBlue 130 | [ATM](https://www.atm-chiptuning.com/chiptuning/ford-transit-custom-20-tdci-ecoblue-130pk-11631/) at 170/430, [ECU-Soft](https://www.ecu-soft.be/chiptuning/ford/transit-custom/14309/2-0-ecoblue-130-26217) at 190/440, [Van Drie](https://vandrieperformance.nl/voertuigen/ford-transit-custom-2019-2022-2-0-ecoblue-130pk/) at 190/440 |
| Sprinter W906 OM651 143 | [ATM](https://www.atm-chiptuning.com/chiptuning/mercedes-benz-sprinter-214314-cdi-143pk/) at 190/430, [BR-Performance](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/8732-w906-2016-2018/8734-214-314-cdi/) at 200/480 |
| Expert III 2.0 BlueHDi 120 | [ATM](https://www.atm-chiptuning.com/chiptuning/peugeot-expert-traveller-20-bluehdi-120pk/), [Shiftech](https://www.shiftech.eu/en/chiptuning/car/peugeot/expert-traveller/2016-iii/diesel/2.0-bluehdi-120), [Tuning Service](https://tuningservice.nl/chiptuning/peugeot/expert-traveller/2016-2019/20-bluehdi-120pk/) at 200/450 |

All source metadata includes scope and `retrievedAt = 2026-10-09`. The initial external reports may disagree about **factory Nm**, generation and final gains, hence broad 2.0 EcoBlue / Sprinter numerical ranges and strict owner-review requirements.

## Technical safeguards

- Ford 2.2 TDCi (2198cc) is NOT Ford 2.0 EcoBlue (1995cc RDW); fitted SID ECU, wet belt, injection, clutch, DPF/SCR and gearbox require inspection.
- Transit Custom 2020 might be **Micro Hybrid** despite a single RDW diesel fuel field. The ECU and electrification require a separate scan, and supplier values are not automatic gearbox-safe claims.
- Sprinter W906 214/314 2.1 OM651 (2143cc) is NOT W907/W910 or OM654 1950cc. Model-year 2018 overlaps; RDW type `906BB35` plus physical chassis/ECU identification is essential.
- Expert type V 2.0 DW10 1997cc/90kW is NOT Expert type X, 1.5 BlueHDi, Toyota Proace, Opel Vivaro, or electric e-Expert. OEM Nm source conflict 320 vs 340Nm must stay explicit.
- SCR/AdBlue, EGR and DPF systems on public-road Dutch vans **remain functional**. The product provides compliant diagnostics/repair guidance, not emissions-system removal.

## Runtime and SEO impact

- Strict owner-reviewed whitelist from `reviewedRdwBulkBatch5` is appended to `verifiedRdwApplications`, thereby affecting exact input matching only. No global heuristics are loosened and no existing ranges/prices are edited.
- Existing `nlVanModels` count remains **15**, searchable models **22**. Stage 1 engine detail pages rise **5 → 10** by reusing the established template; sitemap URLs rise **269 → 274**.
- Ford Transit Custom model gains three separate engines, Mercedes Sprinter W906 gains one, Peugeot Expert III gains one. **Vito and Toyota Proace/City still have no public numeric Stage 1 values** until technical approval.
- No automatic EN/PL duplicate pages.
- Customer-specific vehicle ownership, mileage, DPF, SCR, ECU and gearbox checks are still mandatory; source figures are not actual NoordTune dynamometer measurements.

## Quality gates

- `node --no-warnings scripts/test-rdw-bulk-reviewed-5.ts`: every new exact input selects its own application; 15 frozen RDW positive observations, **75 adversarial negative identity tests**; Stage 2/3 no numerics.
- `pnpm test:seo`: existing routes and Stage1 sources still correct, 274 unique URLs and 23 numeric audited van applications.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- `pnpm qa:seo:nl-vans` on optimized SSG build checks indexing and representative real browser journeys.
- Coverage report `node --no-warnings scripts/report-rdw-evidence-funnel.ts` computes actual delta for the fixed 3,000-row cohort. This report is not a representation of all vehicles in the Netherlands.

Release via one draft PR, exact-commit Vercel Preview, and a single production smoke test if merged. Keep rollback tag.
