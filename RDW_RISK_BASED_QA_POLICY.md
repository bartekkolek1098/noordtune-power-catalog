# NoordTune RDW — risk-based release QA (fast data releases)

This document replaces the previous blanket policy of rerunning 75–238 browser scenarios **on every data-only powertrain batch**. It **does not reduce exact RDW identity, provenance, safety, privacy, or pricing rules.** The new default is one true customer browser journey per engine in the *new* batch plus deterministic representative regression checks for the *previous* batch, followed by immediate expansion to full suites if a relevant mismatch appears.

## Two different release risk levels

**2026-10-08 batch 4 note:** 25 source-reviewed engine rows raise the 3,000-cohort source-linked Stage 1 from 1,672 to 1,773 (+101 NET). This release ALSO corrects an existing incorrect BMW 320i **1 Series** label to **3 Series** in the verified-profile display. That small UI text behavior change makes this release **high-risk for the browser gate (FULL)**, even though RDW matching rules and power math remain untouched. Future source-only additions can return to FAST.

### 1. Source-only RDW engine-data batch: FAST browser gate

Use only when application behavior is unchanged: added/reviewed records, generation/body/fuel/cc/original kW and Stage1 source observations. **Manual review of the git diff is mandatory.** Do not classify a change as data-only because the file happens to live in `src/data`: a modification to the RDW matcher, source validator, stock-power converter, fallback, service pricing, form or rendering logic is **high risk**.

- **During authoring:** `pnpm test:rdw:focused` checks every released old/new source application, original kW/cc/body/fuel/year, 1,187 adversarial negative scopes across all four batches, source publisher independence and withholding numerical Stage2/3. Use targeted tests after each new set of manifest rows; do not run Chromium for each small correction.
- **Once on the final reviewed branch head, before merge:** full `pnpm test:tuning` **once**, including source/identity/privacy regressions and deterministic `pnpm qa:rdw-funnel` of all 3,000 unchanged frozen RDW technical observations. Run lint/typecheck/SEO/build once for final SHA. Update the report deliberately if source coverage changes. This preserves the honesty of the net coverage delta.
- **Immutable, exact-commit Vercel Preview READY:** `pnpm qa:rdw:fast-browser` with `RDW_QA_URL` pointing to the exact protected Preview (same-project, short-lived OIDC inherited from `.env.local`), plus actual HTTP GET 200 / GET RDW 405 / malformed POST 400. Preview protection remains enabled.
- **After verified exact-SHA merge and Vercel production alias READY:** repeat `pnpm qa:rdw:fast-browser` **once** against `https://power.noordtune.nl`; independently verify NL/EN/PL HTTP 200, sitemap valid/no Stage3, API guards, and that production alias resolves to the exact squash-merge commit.

**Current fast browser selection**: fourth batch **25** one-per-engine journeys (rotating NL/EN/PL and 320/390/1180px), plus **4 + 4 + 5** deterministic historical regressions = **38 real UI journeys per target**. Full mode is **(25+15+20+15) × 5 = 375 journeys**, required for changes to UI, matching, security, or fallback. Source-only updates use 38, never pretend this replaces full locale/viewport QA.

Source-only changes still require author review of manufacturer vs tuner *stock* torque, installed ECU ambiguity, engine/gearbox mismatch, wet-belt/DPF/EAT/DSG health and actual source publication; two matching catalogue URLs are not a dyno guarantee. Never invent numeric Stage2/3 or nationwide fleet percentages.

### 2. Matcher / runtime / UI / security / privacy change: FULL browser gate

Run `pnpm qa:rdw:full-browser`: the existing **125 + 75 + 100 + 75 = 375** exact new/old bulk UI journeys, plus additional Audi, Renault, Octavia and critical exception fixtures **when their code paths are affected**. Run all `pnpm test:tuning` privacy and identity tests, full 3,000-row report, SEO and actual API smoke, and repeat high-risk browser checks on Preview and production. Examples of full-gate triggers:

- `src/lib/rdw*.ts`, `src/lib/rdw-tuning-estimate.ts`, `src/data/verified-rdw-applications.ts` matching logic (not just appending a reviewed seed), `src/data/reviewed-rdw-bulk-batch.ts` compiler/validators, source matching or units.
- React/Next RDW form, results, gain boxes, source-rendering, chart, CTA, accessibility, translations, catalogue/selector pricing, Stage2/Stage3 hiding or general page layout changes.
- Any privacy, input-validation, authentication, API, cache, query-parameter or deployment configuration change; inconsistent source publications, an unusual transmission/ECU boundary, or **any fast-gate failure**.
- Periodic full regression or major release after a series of source-only batches; run full when uncertainty is material, not merely because a batch contains many rows.

For any failure, fix and rerun the exact failed scope, then affected neighbor scopes, upgrading to full if common logic might be involved. Do not use repeated full QA calls to make an engine-source claim more credible: external evidence and strict RDW original identity are the proper confidence gate.

## Reproducible commands

| Command | Purpose |
|---|---|
| `pnpm test:rdw:focused` | Fast exact powertrain/source and negative-scope checks for all four source-reviewed bulk manifests, plus plan integrity tests |
| `pnpm test:tuning` | Complete original regression suite + frozen 3,000-case evidence report comparison, once on final head |
| `pnpm report:rdw-funnel` | Explicitly regenerate aggregate source-linked counts after approved data modifications |
| `pnpm qa:rdw:fast-browser` | 25 true synthetic RDW browser journeys in current bulk state, default smoke mode; `RDW_QA_URL` supplies target |
| `pnpm qa:rdw:full-browser` | 175 full language/viewport journeys on both bulk groups, high-risk changes and major reviews |

Windows Powershell usage, local production server on port 3157:
```powershell
pnpm build
pnpm start -p 3157
# In a separate terminal on the same checked-out commit:
$env:RDW_QA_URL = "http://127.0.0.1:3157"
pnpm qa:rdw:fast-browser
```

Protected immutable Vercel Preview, with short-lived linked project OIDC in `.env.local`:
```powershell
$env:RDW_QA_URL = "https://exact-preview-host.vercel.app"
node --env-file=.env.local --no-warnings scripts/qa-rdw-browser-gate.cjs --smoke
```
Never check in or print `.env.local`, never turn off Preview protection, and never send the token or synthetic plate outside the project's origin/expected RDW POST. Production: set `RDW_QA_URL=https://power.noordtune.nl` and run the same fast command with no OIDC.

Both cohort browser scripts retain their original **full** mode by default: omitting `RDW_QA_MODE` runs all cases, so old external test runners do not silently lose coverage. Smoke/regression modes and single-engine debugging are explicit. `scripts/test-rdw-qa-risk-plan.cjs` ensures every new engine is checked once, full mode stays unchanged, and regression covers meaningful diesel / fractional factory-kW / rare-cylinder boundaries. New bulk batches must update the current/older cohort selection in `qa-rdw-browser-gate.cjs` before using the fast release gate.
