# Source refresh and review

## Commands

```sh
pnpm research:vtech --discover
pnpm research:vtech --limit 5
pnpm research:shiftech --limit 5
pnpm research:unlimited --limit 5
pnpm research:unlimited --refresh --limit 5
pnpm research:atm --limit 5
pnpm research:atm --url https://www.atm-chiptuning.com/chiptuning/ford-transit-connect-15-ecoblue-100pk/
pnpm research:rdw-fleet
pnpm research:rdw-sample
pnpm research:nl-priority
```

The provider commands inspect that provider independently. Cache expiry defaults to 30 days (`--max-age-days N`); `--refresh` explicitly re-fetches. A cached response is otherwise reused. RDW aggregates have a seven-day expiry. V-Tech discovery follows the ordinary published brand → model → year/generation → engine route tree; discovered years are deduplicated, never expanded into tuning profiles.

`research-fetch.cjs` maintains a private `.git/tuning-dataset-v1/http-cache` shared across V1/V2 so recorded access stops survive. Requests are HTTPS, read-only and paced at two seconds per provider host group. Robots policies are checked and expire after seven days. 401/403/429/CAPTCHA stops are retained; neither refresh nor cache expiry overrides them. BR-Performance and Celtic blocks recorded in V1 remain in force. Public search keys used by the ordinary Shiftech configurator are transient and never enter tracked manifests.

## Provider limitations recorded in V2

- **V-Tech:** the current [public configurator](https://sklep.vtech.pl/konfigurator-powerchip/) serves PowerChip One, Premium and Premium + AI hardware-package gains. The previous public `/chip-tuning/` routes returned 404; an indexed legacy development-host page was unavailable. Current external-module facts are preserved under `packages`, including stock PS, published gains and derived stock-plus-gain PS. Unknown stock torque and fuel stay unknown. These packages supply **zero ordinary ECU-remap consensus votes**. An adapter must not rename them Stage 1/2/3 to manufacture corroboration.
- **Shiftech:** the direct HTTP response may be a JavaScript shell. Public search data is discovery only. V2 tuning facts are extracted from retrieved rendered public application pages with explicit stock and Stage tables. Their hash covers that rendered extraction. A shell refresh is `not-comparable`; it cannot replace accepted values. The disallowed `/_nuxt/` path is not fetched to work around this limitation. Retrieve an allowed rendered page and retain its timestamp/hash before reviewing a change.
- **Unlimited Tuning:** category breadcrumbs establish make/model/year/fuel scope. The actual product table supplies stock, **Normal** or explicitly labelled **Stage 1** remap and explicitly labelled Stage 2 values. Ecotuning, Stage 1+ and Xtreme are not silently substituted. Missing category fuel, ambiguous generation or incomplete stock fields remain unresolved unless separately corroborated. Explicit hybrids, Niro, HSD, PHEV/MHEV/HEV and hybrid model suffixes stay outside ordinary ICE scope. A tuned value below the published stock output/torque is retained as a rejected observation for review.

## ATM provider added in V3

`research:atm` uses the shared robots-aware, paced private cache and refresh comparison. Its `--url` mode saves a review candidate in `.git/nl-fleet-v3/atm-review`; neither mode promotes facts. ATM's public breadcrumb establishes make, model and generation. Only the actual stock comparison, specification table and explicitly numbered numeric Stage controls supply facts. A generic Stage 2 information panel and Stage 1+ control do not supply Stage 2 output. ECU alternatives and engine codes are retained only when explicitly published and never identify an installed ECU from a registration.

`availability` records provider-specific available, unavailable, development-pending, hybrid-only or different-ECU applicability. Negative applications contribute no remap vote, even if stale numeric markup remains. They do not imply that NoordTune cannot tune the vehicle. A source with both remap and module methods contributes at most one vote from an explicit ordinary remap table; a module-only method is deferred. Search-index availability can be stale: record any discrepancy with a freshly retrieved page, and use the actual current page for accepted evidence.

V3 checks all 985 V2 selected-value checkpoints as well as the V1 set. `v3-source-changes.json` compares V2 to V3; `v3-v1-source-changes.json` gives the cumulative V1 comparison. The historical V2 report stays frozen. Gains above 45% in Stage 1 power or torque require compatible independent corroboration or explicitly validated factory de-rating evidence; otherwise owner review remains required.

## Applicability and stock evidence

The V2 batches retain raw provider identity alongside any reviewed interpretation. A missing Unlimited fuel category may be corroborated by the unique fuel classification in a retrieved Shiftech sitemap application route for the same make/model, nominal displacement and exact stock PS, with a generation start within three years. `identityEvidence` retains the sitemap URL, timestamp, hash and application URLs; `unresolvedIdentity` retains the original incomplete facts. Those routes supply fuel scope only, **zero tuning values and zero second-provider Stage votes**.

`reviewedScope` only narrows a published period. A single matching V-Tech stock-output/nominal-displacement generation, with contiguous listed years and a start within two years, can narrow the tuner period. An official manufacturer's model archive can bound a matching tuner generation instead: `v2-manufacturer-scopes.json` covers Aygo I, Peugeot 107 and up!. A manufacturer's model period does not establish an engine variant's individual introduction date. The original tuner stock/output applicability still has to match. Other open periods spanning more than ten years remain deferred unless independent matching tuner scopes provide a defensible intersection.

`v2-counterpart-links.json` documents cross-provider equivalence rather than editing original source labels. Links require make/model/fuel, compatible displacement, exact stock PS, compatible stock torque and a unique generation counterpart. The builder checks the technical facts again and intersects periods. Every changed V1 value or period appears in `v2-source-changes.json`, with before/after values, concrete source URLs, retrieval hashes and the counterpart explanation. One provider still gets one consensus vote.

The X-trail / X-Trail 1.6 dCi 130 observations share an independently reviewed T32 2014–2017 scope and identical stock identity. They form one multi-source profile; capitalization does not create a second technical identity. The distinct published 2017 facelift remains separate. Distinct-count and duplicate checks normalize labels and do not use year endpoints to inflate technical counts.

Official Suzuki, Nissan and Kia evidence identifies specific electrified applications whose tuner labels can omit that fact. These observations cannot become ordinary ICE remaps. The runtime adds the same narrow powertrain guards, including Niro, Suzuki 129 PS BoosterJet and the Qashqai 158 PS variant; it preserves the older conventional 140 PS Suzuki and 160 PS Qashqai applications. Ordinary registration year alone never proves a hybrid or locked ECU.

Dutch `t/m 2014` means **through 2014**. End-only categories do not establish a generation start; the parser retains their end and leaves the identity incomplete. Two Ford tables labelled both `TDCi` and `EcoBlue` are also deferred as `ENGINE_FAMILY_LABEL_CONFLICT`. Neither the first token nor first-registration year resolves that conflict.

## Review-only output

Refresh writes `.git/nl-fleet-v2/refresh/<provider>.json`: previous/candidate hash, retrieval status, cached state, comparable factual observations and a review disposition. Historical raw responses stay in private cache. HTML, marketing prose, images, dyno graphs, pricing and keys are not copied into tracked research facts. Dynamic page tokens can change a hash without changing technical values, so reviewers compare extracted facts as well as hashes.

**No refresh command runs the dataset builder, modifies accepted batches or promotes customer values.** Candidate facts require a reviewed batch edit. Review make, model, generation, fuel, displacement, stock output/torque, package class and independent provider identity. Preserve every original observation. A corroborating page must apply to the same engine/generation; one provider receives one vote even across mirrors.

After a reviewed edit:

1. Run `pnpm tuning:build-data` and inspect `source-pages.json`, `profile-consensus.json`, `unresolved-conflicts.json` and `v2-source-changes.json`.
2. Compare all 280 V1 checkpoints. Any changed selected value needs a concrete new independent source and an explicit before/after record. Identity or year changes require an applicability explanation too.
3. Rebuild the frozen NL priority queue's current classifications; do not re-rank it to improve the before/after result.
4. Run the tuning, live-sample and bundle-boundary checks; validate API payloads, browser/UI/WhatsApp agreement, pricing, lint, typecheck and production build.
5. Commit the reviewable facts and report. Owner review remains required where sources disagree or applicability/hardware is incomplete.

To revise the priority order for a later research round, explicitly run `node --no-warnings scripts/build-nl-technical-priority.ts --rerank` and document the new baseline. Never equate a new priority ordering with improved coverage.
