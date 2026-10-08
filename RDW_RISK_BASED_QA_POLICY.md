# NoordTune RDW — risk-based release QA (fast data releases)

This document replaces the previous blanket policy of rerunning 75–238 browser scenarios **on every data-only powertrain batch**. It **does not reduce exact RDW identity, provenance, safety, privacy, or pricing rules.** The new default is one true customer browser journey per engine in the *new* batch plus deterministic representative regression checks for the *previous* batch, followed by immediate expansion to full suites if a relevant mismatch appears.

## Two different release risk levels

### 1. Source-only RDW engine-data batch: FAST browser gate

Use only when application behavior is unchanged: added/reviewed records, generation/body/fuel/cc/original kW and Stage1 source observations. **Manual review of the git diff is mandatory.** Do not classify a change as data-only because the file happens to live in `src/data`: a modification to the RDW matcher, source validator, stock-power converter, fallback, service pricing, form or rendering logic is **high risk**.

- **During authoring:** `pnpm test:rdw:focused` checks every released old/new source application, original kW/cc/body/fuel/year, 560 adversarial negative scopes, source publisher independence and withholding numerical Stage2/3. Use targeted tests after each new set of manifest rows; do not run Chromium for each small correction.
- **Once on the final reviewed branch head, before merge:** full `pnpm test:tuning` **once**, including source/identity/privacy regressions and deterministic `pnpm qa:rdw-funnel` of all 3,000 unchanged frozen RDW technical observations. Run lint/typecheck/SEO/build once for final SHA. Update the report deliberately if source coverage changes. This preserves the honesty of the net coverage delta.
- **Immutable, exact-commit Vercel Preview READY:** `pnpm qa:rdw:fast-browser` with `RDW_QA_URL` pointing to the exact protected Preview (same-project, short-lived OIDC inherited from `.env.local`), plus actual HTTP GET 200 / GET RDW 405 / malformed POST 400. Preview protection remains enabled.
- **After verified exact-SHA merge and Vercel production alias READY:** repeat `pnpm qa:rdw:fast-browser` **once** against `https://power.noordtune.nl`; independently verify NL/EN/PL HTTP 200, sitemap valid/no Stage3, API guards, and that production alias resolves to the exact squash-merge commit.

**Current fast browser selection** (`RDW_QA_MODE`): **20** one-per-engine QA journeys for the latest batch, rotating NL/EN/PL and mobile 320/390/desktop 1180px, **+5** deterministically selected earlier-engine boundary/regression journeys = **25 total per Preview or production**. The previous blanket full-browser gate ran **100+75=175 journeys**, often again with Audi/Mégane/Octavia duplicates. The fast gate reduces these two bulk groups' repeated browser UI interactions by **150/175 (85.7%)**, without skipping one new engine's executable exact factory/spec/source checks. It does **not claim 25 tests are equivalent to full cross-locale/cross-viewport coverage**.

Source-only changes still require author review of manufacturer vs tuner *stock* torque, installed ECU ambiguity, engine/gearbox mismatch, wet-belt/DPF/EAT/DSG health and actual source publication; two matching catalogue URLs are not a dyno guarantee. Never invent numeric Stage2/3 or nationwide fleet percentages.

### 2. Matcher / runtime / UI / security / privacy change: FULL browser gate

Run `pnpm qa:rdw:full-browser`: the existing **100 + 75 = 175** exact new/old bulk UI journeys, plus additional Audi, Renault, Octavia and critical exception fixtures **when their code paths are affected**. Run all `pnpm test:tuning` privacy and identity tests, full 3,000-row report, SEO and actual API smoke, and repeat high-risk browser checks on Preview and production. Examples of full-gate triggers:

- `src/lib/rdw*.ts`, `src/lib/rdw-tuning-estimate.ts`, `src/data/verified-rdw-applications.ts` matching logic (not just appending a reviewed seed), `src/data/reviewed-rdw-bulk-batch.ts` compiler/validators, source matching or units.
- React/Next RDW form, results, gain boxes, source-rendering, chart, CTA, accessibility, translations, catalogue/selector pricing, Stage2/Stage3 hiding or general page layout changes.
- Any privacy, input-validation, authentication, API, cache, query-parameter or deployment configuration change; inconsistent source publications, an unusual transmission/ECU boundary, or **any fast-gate failure**.
- Periodic full regression or major release after a series of source-only batches; run full when uncertainty is material, not merely because a batch contains many rows.

For any failure, fix and rerun the exact failed scope, then affected neighbor scopes, upgrading to full if common logic might be involved. Do not use repeated full QA calls to make an engine-source claim more credible: external evidence and strict RDW original identity are the proper confidence gate.

## Reproducible commands

| Command | Purpose |
|---|---|
| `pnpm test:rdw:focused` | Fast exact powertrain/source and negative-scope checks for both current bulk manifests, plus plan integrity tests |
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
