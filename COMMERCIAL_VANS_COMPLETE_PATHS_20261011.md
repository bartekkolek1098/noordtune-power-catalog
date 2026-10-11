# Jumpy, Movano and Daily — end-to-end catalog coverage

Baseline: `dfd6c110dfd0a8d62207e9179090fccf4c6b69be` (working desktop header and manual search). Branch: `feature/commercial-vans-complete-paths-20261011`.

## What changed

Nine reviewed engine families now have a common server-only evidence definition used by both manual selection and twelve explicit RDW applications. This prevents the previous structural problem where a newly researched RDW engine could be absent from the manual result path. Existing taxonomy, public vehicle pages, reference profiles and source-matching behavior are preserved; the new manual kind is a bounded `reviewed` selection, not a fabricated registry vehicle.

- Citroën Jumpy III: 1.5 BlueHDi100/120 (1499cc75/88kW), 2.0 BlueHDi145 (1997cc106kW,2021–23) and177 (1997cc130kW,2019–23).
- Opel Movano C: 2.2 diesel120/140/165 (2179cc88/103/121kW,2021–23), not old2299cc or later2184cc.
- Iveco Daily: 2.3 diesel136/100kW, old Euro6 (2017–19) and later Euro6Df (2020–23) separately. Only explicitly observed `35S14`/`35C14` plus exact RDW-type combinations are accepted; no general decoding of a Daily badge or missing type.

Each manual selection shows original rated kW/converted metric power, preserved individual supplier output pairs, separate power/torque ranges, a visible engine-scope warning, year validation and contact action. No plate lookup is triggered by manual selection. No source database is shipped to the browser. `Movano120` supplier stock torque differs300/310Nm: its manual stock-torque number is withheld rather than averaged.

## Actual net impact, not page-count coverage

A frozen **810-observation /174-cell** purposive RDW sample was collected before modifications, with public plates joined to fuels only in memory. Saved data contains technical aggregates, no plates, VINs, customer details or execution identifiers. The selection is the first45 plate-sorted records per chosen family/year and is **not a representative Netherlands fleet survey**. Electric and incomplete rows remain in the denominator.

| Sample family | Before source-linked | After source-linked | Net new |
|---|---:|---:|---:|
| Jumpy (270 observations) | 70 | 156 | +86 |
| Movano (270 observations) | 208 | 208 | 0 |
| Iveco selection (270 observations) | 3 | 62 | +59 |
| Total (810 observations) | 281 | 426 | **+145** |

The complete runtime pipeline is measured, not a strict-resolver-only baseline. Movano's previously source-linked cases are **not counted again**. All previously source-linked outcomes are retained. Other historical samples remain separate and are not summed to make a larger coverage percentage.

Three existing pending model topics become useful NL model hubs with nine individual engine articles: **25** model hubs, **94** van-engine pages, **114** model-linked RDW applications; intended sitemap **368** total URLs / **120** van URLs. No pending model-topic cards remains does **not** mean every engine in those model families is covered. Unknown3.0/156PSDaily, electric/CNG, oldMovano2.3, atypical types, newer ECU/facelift phases and unreviewed engines are still explicitly unresolved.

## Evidence and boundaries

Structured source URLs, exact output pairs and applicability notes are in `src/data/reviewed-commercial-vans.ts`. HTTP-status/HTML-SHA metadata are in `data/research/commercial-van-source-audit-20261011.json`; dynamic ECU-Soft source pages were also normally rendered in Chromium and have a rendered-content hash. A successful HTTP shell alone was not treated as numeric evidence. Source headlines claiming a provider measurement are **not** represented as a NoordTune measurement or evidence about the user's vehicle.

Published Stage1 ranges are comparisons, not a guaranteed interval, an independently approved calibration, fuel saving or safe transmission/load ceiling. Actual engine/ECU access, emissions phase, gearbox, cooling and service condition require workshop checks. Neither shared platform nor similar power permits cross-brand firmware transfer. **DPF/EGR/SCR/AdBlue remain road-legal and operational. Numeric Stage2/3 withheld.**

## Release gates

`test-commercial-van-paths.ts` checks the full810-row before/after sample,12 positive RDW scopes,180 negative identity mutations, every source audit, all application years, nine manual paths and invalid/no-year behavior. New browser QA covers27 manual family/locale journeys plus12 anonymous plate fixtures. Existing manual/header, plate-result and van SEO regressions run on the optimized build. The release requires exact-head Vercel READY and PR checks, a rollback tag to the baseline, then public-production API/browser and sitemap checks. Do not claim protected preview browser access when authentication prevents it.

## Completed local verification

Manual taxonomy integrity and existing BMW manual tests, the complete SEO/source suite, the full-runtime new810-row sample, lint, TypeScript and optimized build passed. The separate historical benchmark remains **1,854/3,000**. Browser checks against the fresh optimized server passed: **39 new end-to-end journeys** (27 manual family/locale paths +12 anonymous plate fixtures), **36 existing header viewport/locale cases and manual interaction regressions**, **32 prior compact-van plate-result journeys**, and every current van model/engine URL with sitemap368/van120 and unsupported EN/PL404. The manual Daily phone screenshot was visually reviewed; no private plates were used. Production checks are still required after release.
