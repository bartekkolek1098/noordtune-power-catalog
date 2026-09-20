# Customer flow correction

**READY FOR OWNER REVIEW** — supersedes RELEASE-CANDIDATE-CLEAN. No owner approval is implied.

Starting head: `a105e8229b582df8c6852f403e0a618a9fcad828`; existing branch `feature/nl-fleet-coverage-v3`, Draft [PR #16](https://github.com/bartekkolek1098/noordtune-power-catalog/pull/16), base `feature/nl-fleet-coverage-v2`. This report covers the committed product tree; the resulting commit SHA and exact-head authenticated Preview results are recorded in that PR after the normal push.

## 1. Navigation: reproduced cause and correction

The previous page-labelled fallback reached `#rdw-estimate-details` and opened sources for unpublished source, reference, canonical and generic results. Those were misleading labels and the wrong destination, with no route or hydration error. A genuine published page worked; a fabricated vehicle ID produced an actual 404. An unpublished canonical manual result could construct an unpublished route.

A server-resolved typed action now permits a real link only for an existing public vehicle with matching technical identity, provenance and Stage figures. Source/reference/heuristic IDs and pricing aliases do not establish a route. Other useful results use a button to focus and scroll to the chart, Stage table and options. Repeated mouse/keyboard actions preserve Stage, options and quote; reduced motion and sticky-header spacing are respected. A new lookup also resets the secondary source accordion. Published navigation explicitly explains the catalog-family price scope and fresh selection on the destination.

| Action | NL | EN | PL |
|---|---|---|---|
| Existing page | Open tuningpagina | Open tuning page | Otwórz stronę tuningu |
| Inline configuration | Bekijk volledige configuratie | View full configuration | Zobacz pełną konfigurację |

## 2. Actual clicks and route content

[Browser acceptance](docs/tuning-data/customer-flow/browser-acceptance.json): **120 lookup click cases** = eight fixtures × five widths × three locales. Covers published, unpublished source, BMW/Custom reference, canonical, generic, invalid destination and genuinely equal sourced torque. Tests click, repeat via keyboard, verify focus/header clearance, preserve selection and contact quote, expand secondary details, perform consecutive searches and navigate back. Invalid IDs resolve inline instead of linking to a broken route.

All **24 public vehicle routes × NL/EN/PL = 72** pass HTTP, actual heading/model/engine/Stage output, chart and forbidden-copy checks. **Nine manual flows** pass: BMW reference, unpublished canonical Giulietta and published Golf in each locale. **Nine linked Stage pages** pass actual route/content checks. These are genuine local server responses; lookup fixtures alone intercept synthetic registration responses with production-normalized DTOs. The contact opener is stubbed; no messages are sent.

Widths: **320, 390, 768, 1024, 1440**. Four inspected synthetic screenshots: [BMW 320](docs/tuning-data/customer-flow/reference-bmw-320.png), [BMW 1440](docs/tuning-data/customer-flow/reference-bmw-1440.png), [Custom 320](docs/tuning-data/customer-flow/reference-custom-320.png), [Custom 1440](docs/tuning-data/customer-flow/reference-custom-1440.png). No owner registrations or clipped configuration targets. Approved layout and CTA position are retained.

## 3. Customer copy before / after

Previously, NL/EN/PL could expose the same English algorithm/source-scope prose, such as “Rounded local planning range”, “unknown-aspiration” and owner-review instructions. Raw research notes are now removed from customer DTOs and replaced by a typed presentation shared by UI and explicit-click contact messages. Internal evidence and original source records remain intact; unknown codes have no raw-text fallback.

| Locale | Stage details heading | Generic estimate copy |
|---|---|---|
| NL | Details van deze Stage | Algemene schatting, geen meting of bevestigde modelvariant. De exacte configuratie wordt vóór uitvoering gecontroleerd. |
| EN | Details of this Stage | General estimate, not a measurement or a confirmed model variant. The exact configuration is checked before work. |
| PL | Szczegóły tego Stage | Ogólna estymacja, nie pomiar ani wynik dla potwierdzonej wersji silnika. Dokładną konfigurację sprawdzimy przed realizacją. |

Catalog/reference copy briefly states indicative values and confirmation before work. Typed requirements preserve specified RON, verified hardware, supported transmission limits and conditional engine generation. Unknown torque has a compact localized state while known power, prices and charts remain. Sources show clean provider links and localized applicability, without heuristic entries or raw scope paragraphs. Summary, table, chart, details and contact notes use the same selected Stage. Charts remain labelled peak illustrations, never measured rpm curves.

## 4. Stage 2 diagnosis — exact frozen counts

[Complete audit and per-case evidence](data/research/customer-flow-stage-audit.json). Counts are disjoint per field; interval intersection includes boundaries. D takes precedence over C. E flags differing fuel/source identity as unconfirmed comparability, not proof that providers are incompatible. Distinct/unavailable complete each denominator.

| Cause | Frozen 400 power | Frozen 400 torque | Public 24 power | Public 24 torque |
|---|---:|---:|---:|---:|
| A — genuinely sourced equal peak | 0 | 0 | 0 | 0 |
| B — rounded coincidence | 3 | 2 | 0 | 0 |
| C — generic interval overlap | 151 | 1 | 0 | 0 |
| D — clamped lower bound / flat peak | 144 | 151 | 0 | 0 |
| E — differing scope / source | 0 | 0 | 0 | 0 |
| F — wrong Stage mapping | 0 | 0 | 0 | 0 |
| Catalog equal | 0 | 0 | 0 | 0 |
| Distinct | 46 | 44 | 24 | 24 |
| Unavailable | 56 | 202 | 0 | 0 |

Within those counts: **56 identical power intervals**, **37 clamped flat power peaks**, **121 clamped flat torque peaks**. Identical-interval and flat-peak measures are different, not additional disjoint categories. All six causes have focused regression fixtures, including actual retained sourced equality and artificial clamps.

Two retained sourced equal-torque applications outside the frozen cohort were confirmed: Suzuki Vitara 1.4 Boosterjet 140 (2017), **290 Nm** at both Stages; Golf 1.9 TDI IP 130 (1997), **380 Nm** at both. Values remain unchanged. No undocumented gearbox-limit or improved-curve explanation is added. Generic Stage 2 remains selectable and numeric as an estimated hardware/calibration scenario; an overlap or clamp is explicitly not independently established extra output. Different source/fuel scopes do not imply a coherent guaranteed increasing package ladder.

## 5. Reproduced examples and remaining evidence gaps

| Application | Preserved output | Corrected presentation / gap |
|---|---|---|
| BMW 128ti | S1 **310 PS / 480 Nm**; sourced S2 **≈320 PS**, torque unknown | Inline configuration; S2 known power stays visible, torque unavailable independently; retained fuel/hardware scope. S2 torque still requires evidence. |
| Transit Custom 2.0 105 | S1 **190 PS / 440 Nm**; generic S2 **190–215 PS / 440–470 Nm** | S2 is an estimated configuration scenario; extra gain is unconfirmed. No source/reference S2 was invented. |
| Transit Connect 1.5 100 | Conditional S1 **≈125 PS / 330 Nm**; S2 **125–140 PS / 330–340 Nm** | TDCi/EcoBlue family remains conditional without confirmed engine evidence. |
| Defender 2.0 | S1 **290 PS / 590 Nm**; S2 **320 PS / 660 Nm** | Canonical figures and family separation retained; unpublished result opens inline. |
| Suzuki Vitara 1.4 | S1/S2 **290 Nm** | Honest sourced equal peak, without an invented torque benefit. |

Stage 3 still requires the existing hardware review; a number never authorizes a fixed hardware package. No broad research, new dataset records or technical-value corrections were made. Owner review remains necessary for the unresolved evidence above and final product acceptance.

## 6. Intentional assertion changes and preservation

- **Zero numeric/provenance, identity or quote golden changes** across the original 400 cases; all **1,200 Stage quotes** match the starting head. Historical inputs are unchanged. [Comparison](data/research/customer-flow-preservation.json).
- Assertions intentionally replace always-English raw requirement/workflow strings with localized typed requirements/limitations. All **672 quote-surface assertions** pass. New metadata records Stage scope, selected evidence, raw/rounded/clamped generic basis and comparison; it does not alter gains, prices or resolver priority.
- The generated Kia/Hyundai acceptance artifact gains that metadata only; its outputs/quotes remain unchanged. The technical-service review fingerprint reflects the resolver annotation change.
- QA assertions allow the normal locale cookie, compare heading text independently of CSS uppercase, and use an existing Giulietta manual fixture. The browser report separates viewport width from target width. These are test corrections, not relaxed numeric expectations.
- Price matrix, service prices, heuristic constants and source datasets are unchanged. Reference-first per-Stage policy, exact identity/date, Ford separation, ECU assessment, conditional pricing, options once, POST lookup/GET 405 and explicit-click contact privacy remain covered.

## 7. Validation

All required commands **PASS**: `pnpm catalog:audit`, `pnpm test:tuning`, `pnpm test:nl-fleet-v2`, `pnpm test:nl-fleet-v3`, `pnpm test:nl-fleet-v3-2`, `pnpm lint`, `pnpm typecheck`, `pnpm build`. The initial typecheck/build exposed an audit-script type annotation; after correcting it, both final runs pass. No golden values were changed to resolve failures.

Local browser results: **161 deterministic regressions**, **22 genuine HTTP owner checks**, **120 focused lookup clicks**, **72 vehicle routes**, **nine manual flows**, **nine Stage-page checks** pass. The 161-case regression ran before the final accordion-reset/manual-label fix; the focused suite and owner checks ran against the final production build and explicitly verify consecutive-search/reset behavior. Owner input exists only in process-local `NOORDTUNE_OWNER_QA_PLATES`; [owner evidence](docs/tuning-data/customer-flow/owner-browser/browser-acceptance.json) uses aliases and no screenshots. Without input, owner QA is skipped and the 161 deterministic cases still run.

[Runtime boundary](data/research/customer-flow-boundary.json): **24 public vehicles / 291 sitemap URLs**, zero client full-dataset imports, zero private catalog/source ID leaks. Browser JS: **25 chunks / 1,435,463 bytes**, **+12,531 bytes** versus the starting head. [Privacy gate](data/research/customer-flow-privacy.json) scans current commit candidates, browser JS and static HTML. [Validation summary](data/research/customer-flow-validation.json).

## 8. Hosted verification and release boundary

Exhaustive widths, route content, synthetic lookups and owner HTTP checks above are **local production-build QA**. Authenticated Chrome Preview access is available; the newly pushed exact-head Preview must be verified separately. Its SHA, deployment URL, real hosted actions and result are recorded in PR #16 after deployment. This pre-push report does not claim that hosted check has already passed; public unauthenticated access may still redirect to Vercel SSO. Protection is not disabled.

Only the existing branch receives a normal push. Draft state and base remain unchanged; no Ready action, retarget, fold, merge or manual deployment. Approved main/production `4d12e510953fb57c3f8f84a737880ff860a617e7`, PR #12 and noordtune-www remain protected. Stop at **READY FOR OWNER REVIEW**.
