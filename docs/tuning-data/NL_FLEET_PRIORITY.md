# Netherlands fleet priority V2

## Exact population and counts

Source: [RDW vehicle registrations, m9d7-ebf2](https://opendata.rdw.nl/resource/m9d7-ebf2.json). The 16 September 2026 query counts **11,327,762** published non-exported registrations: **10,185,281 passenger cars** and **1,142,481 commercial vehicles with permitted maximum mass at most 3,500 kg**. This operational population does not establish insurance, road use or an active individual owner's registration. Commercial records with unknown permitted mass are excluded by the predicate.

The API performs the aggregation. The pipeline retains the **5,000 largest groups**, covering **10,155,079 registrations**, grouped by exact RDW make, trade name, displacement, cylinder count, class and five-year first-admission band. The two aggregate responses total **818,387 bytes**. No complete vehicle-row database is downloaded. Null fields, ordinary naturally aspirated cars, hybrids and EVs remain in the denominator. A first-admission band does not prove an engine generation or build date.

`data/research/nl-fleet-model-priority.json` stores predicates, full SoQL, source URLs, timestamps, response hashes, deterministic tie ordering, population totals and each exact group count. Two sequential requests are not a transactional database snapshot. Counts describe their recorded retrieval times.

```sh
node scripts/research-rdw-fleet.cjs
node scripts/research-rdw-fleet.cjs --refresh
node --no-warnings scripts/build-nl-technical-priority.ts
```

Requests are cached, paced and retried only for transient network/server failures. Authentication, rate limits, robots denials and CAPTCHA are not bypassed. The aggregate limit is explicit; the report does not claim to have enumerated every distinct group.

## Derived technical priority

Fuel and combustion-engine net maximum kW are in [RDW fuel data, 8ys7-d773](https://opendata.rdw.nl/resource/8ys7-d773.json). They are **not joined across the entire fleet**. A model/displacement count must never be copied into each power/fuel variant as if those variants were individually counted.

The priority score is:

`20 × log10(1 + exact group count) + 20 generic fallback + 20 no sourced result + 10 single-source + 12 light van + 8 workshop relevance + 8 ambiguity`.

All modifiers are binary. Workshop relevance means a light van, published diesel application, or explicit turbo engine-family label. Canonical year copies add no priority. Known bad canonical model/fuel/displacement cross-products are removed from the hint inventory; remaining generated identities stay explicitly unvalidated. Baseline scores are frozen for before/after comparisons. `--rerank` deliberately starts a new priority snapshot.

`nl-technical-priority.json` keeps published stock-output scenarios, actual bounded live-sample identities, and canonical research hints separate. Published/live scenarios take precedence over unvalidated hypotheses. Only groups without published/live scenarios use canonical hypotheses to expose research gaps. Provider engine codes/generations are never inserted into an RDW model to force a match. Sample type/variant/execution facts are genuine RDW fields.

## Coverage interpretation

For top 50/100/250/500/1000 priority groups, A = sourced multi-source/approved, B = sourced single-source, C = compatible catalog, D = generic fallback, E = unresolved. A group takes the least-covered evaluated distinct fuel/output/year-scope scenario. Scenario years lie within the intersection of the RDW band and published applicability.

The weighted table sums **exact RDW group counts**, once per group, under these **derived scenario classifications**. Its meaning is *conditional model/displacement reach*. Unknown output/fuel distributions, incomplete variant sets and generated hypotheses prevent calling this exact tuning coverage of individual vehicles. `exactTunedVehicleCoverage` is therefore null. Identity percentages likewise describe evaluated priority groups, not all factory configurations. A/B availability does not prove every vehicle in that group is source covered.

The 90/85/75/60 percent goals remain aspirations; unsupported powertrains and unresolved groups are not removed to improve a percentage. The final V2 report gives the measured results and remaining gaps.

## Bounded live sample

`research-rdw-sample.cjs` selects three plate-sorted records per chosen group: two common passenger models per priority make and twenty different van models. The resulting **222 real published non-exported registrations across 28 makes and 74 groups** are a purposive QA sample, not a random fleet estimator. The sample uses an exact plate join to the fuel dataset and retains all **253 fuel rows**; electric/hybrid rows are not dropped to manufacture an ICE identity.

Tracked fixtures contain a hashed identifier and sanitized RDW facts. Raw plates and fuel query URLs containing plates stay in private `.git` cache. The final QA report records model, registered stock output, selected layer/profile, stages, quote category and fallback/ambiguity reasons. Sample proportions are never extrapolated to fleet power/fuel shares.

`node scripts/research-rdw-sample.cjs --verify-registration` separately rechecks the bounded sample against the live primary dataset. All **222** records were present with `export_indicator=Nee`, a nonempty `datum_tenaamstelling` and `tenaamstellen_mogelijk=Ja`. This verifies the published current registration indicators, without asserting insurance or actual road use. The six verification queries, timestamps and hashes are recorded without plate-bearing query URLs.

See [the V2 report](NL_FLEET_COVERAGE_V2_REPORT.md) for final coverage, the paired V1 comparison, browser checks, and the highest-priority remaining gaps.
