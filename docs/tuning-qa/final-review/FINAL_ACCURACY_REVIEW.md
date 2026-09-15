# Final accuracy and commercial coverage review

Validated 2026-09-15 for existing Draft PR #13. This pass preserves the approved server resolver, public catalog and page layout. Generic stages now show rounded intervals, ordinary runtime profiles receive draft software budgets, and source/ECU conditions remain visible in the selected Stage and WhatsApp text.

## Four live owner cases

Power is metric pk. Prices below are indicative starting budgets in EUR for Stage 1 / Stage 2 / Stage 3+, including VAT. Software scope excludes separately assessed hardware and advanced unlock work, except the explicitly conditional BMW Stage 1 package.

| Plate / RDW identity | Stage 1 pk / Nm | Stage 2 pk / Nm | Stage 3+ pk / Nm | Draft prices |
| --- | --- | --- | --- | --- |
| H329XH — Defender, 1999 cc, 241 pk, 2020-06-12 | 290 / 590 | 320 / 660 | 365 / 740 | 549 / 699 / 999 |
| V380ST — Transit Connect, 1499 cc, 100 pk, 2018-10-17 | 125–140 / 330–340 | 125–140 / 330–340 | 140–155 / 330–350 | 449 / 549 / 849 |
| V978ZF — Transit Custom, 1995 cc, 105 pk, 2019-04-29 | 190 / 440 | 190–215 / 440–470 | 190–235 / 440–505 | 549 / 699 / 999 |
| KKH27K — BMW 128ti, 1998 cc, 265 pk, 2022-09-14 | 310 / 480 | 330–375 / 480–540 | 370–425 / 480–580 | 700 / individual / individual |

Defender's three peaks are unchanged figures from the existing canonical `land-rover-defender-2-0-sd4-2020` technical profile and equivalent year copies; they are not new generic calculations or measured NoordTune outputs. Registered 241 pk is kept separate from source stock 240 pk.

Connect Stage 1 compares published external references. It is conditional, not a mechanical limit; TDCi/EcoBlue remains unconfirmed at every selected Stage. The unchanged canonical database has no compatible Connect profile for later Stages. Custom retains the external Stage 1 peak with `NOORDTUNE_TARGET_REVIEW_REQUIRED`; it is not a preferred NoordTune target. Later Connect/Custom/BMW outputs are generic scenarios. BMW's Stage 1 reference retains its RON98 condition and an unconfirmed unlock scenario.

## Policies and coverage

The [range policy](../GENERIC_RANGE_POLICY.md) documents independent stock-based intervals, outward five-pk rounding and nondecreasing bounds. A strong sourced Stage 1 uses the same fixed source anchor for broad later scenarios; no recursive 1.05/1.08 multiplication remains. Exact source figures and source comparisons stay intact. The chart draws range bands and the full selected interval reaches WhatsApp.

The [runtime pricing policy](../runtime/RUNTIME_PRICING_POLICY.md) lists every rule and exception. Explicit assignments win. Ordinary resolved references fill missing software budgets from their assigned category; unassigned ordinary runtime profiles use listed complexity rules, a tightly scoped classic-diesel rule, or the contemporary default. Age never establishes ECU access. Custom/unscoped work and advanced-unlock higher Stages remain individual. Pricing cannot mutate technical output, provenance, identity or ECU status.

The fixed [coverage report](../runtime/runtime-coverage.md) retains 64 normal-ICE fixtures. This is a regression sample, not a fleet survey or verified tuning coverage.

| Stage | Reference | Public catalog | Canonical estimate | Generic indication | Numeric price |
| --- | ---: | ---: | ---: | ---: | ---: |
| Stage 1 | 4.69% | 6.25% | 50.00% | 39.06% | 100% (64/64) |
| Stage 2 | 0% | 6.25% | 50.00% | 43.75% | 96.88% (62/64) |
| Stage 3+ | 0% | 6.25% | 50.00% | 43.75% | 96.88% (62/64) |

All 64 have numeric power at every Stage; 39 have source-backed or explicitly estimated torque information. Only the two applicable BMW advanced scenarios have individual higher-Stage prices. Classic €299 behavior is covered by dedicated runtime pricing tests. The [ranked top-20 backlog](../TUNING_PROFILE_BACKLOG.md) prioritizes replacing generic output with applicable source evidence; no backlog profiles were implemented.

## Validation

| Check | Result |
| --- | --- |
| `pnpm catalog:audit` | Pass: 0 critical groups, 18 existing warning groups; 24 public / 58,586 canonical / 175,758 stages / 291 sitemap URLs |
| `pnpm test:tuning` | Pass: 106 focused regression cases, 491 surface assertions and 78 coverage fixtures / 2,787 assertions |
| `pnpm lint` | Pass; final QA-script edits also syntax/lint checked |
| `pnpm typecheck` | Pass after the production build |
| `pnpm build` | Pass |
| Client source boundary | `CLIENT_IMPORTS_SERVER_CATALOG: 0`; five client roots, 57 transitive modules |
| Built bundle | [25 browser JS chunks](browser-bundle-check.json), 1,419,276 bytes; zero matches for 58,562 non-public canonical IDs |
| Browser acceptance | [44 cases passed](browser-acceptance.json), zero browser errors or clipped content |
| Source parity | [78 source/config/script files compared](source-validation.json) against the validation copy; zero differences |

Browser acceptance uses the actual HTTP RDW route for all four owner plates: four NL widths (320, 390, 768, 1440) plus EN/PL at 320. Five additional identities are explicitly synthetic DTOs produced by the real server normalizer/resolver: public GTI, non-public canonical Dacia, generic petrol Toyota, generic diesel Skoda and unsupported Tesla EV, each at all four widths. They are not claims about real plates. Unsupported EV output/price remains on request, with no unscoped fuel-specific options. Other cases exercise all Stage rows, source/range copy, prices, paid options, WhatsApp agreement and actual chart paths/bands. No WhatsApp message was sent.

## Retained final screenshots

These show the selected Stage 1 plus all Stage rows; the executable browser report also verifies selection of Stages 2/3.

| Case | 320 px | 1440 px |
| --- | --- | --- |
| Live Defender | [image](h329xh-320.png) | [image](h329xh-1440.png) |
| Live Connect | [image](v380st-320.png) | [image](v380st-1440.png) |
| Live Custom | [image](v978zf-320.png) | [image](v978zf-1440.png) |
| Live BMW 128ti | [image](kkh27k-320.png) | [image](kkh27k-1440.png) |
| Synthetic public GTI | [image](public-exact-320.png) | [image](public-exact-1440.png) |
| Synthetic canonical Dacia | [image](canonical-nonpublic-320.png) | [image](canonical-nonpublic-1440.png) |
| Synthetic generic petrol | [image](generic-petrol-320.png) | [image](generic-petrol-1440.png) |
| Synthetic generic diesel | [image](generic-diesel-320.png) | [image](generic-diesel-1440.png) |
| Synthetic unsupported EV | [image](unsupported-ev-320.png) | [image](unsupported-ev-1440.png) |
