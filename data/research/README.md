# Tuning profile research

Only factual observations belong in `batches/*.json`. Retain each provider's original values, units, identity, URL, retrieval timestamp and applicability limits. Never add source descriptions, images, prices, HTML, search credentials or invented engine combinations.

`scripts/research-fetch.cjs` checks robots rules, spaces requests by at least two seconds per provider and caches responses privately under `.git/tuning-dataset-v1`. Authentication, CAPTCHA, 403 and rate-limit responses stop further requests to that provider. The read-only Shiftech configurator helper discovers identities; discovery alone is not accepted tuning evidence. Rendered public page captures are hashed separately from HTTP responses, with this distinction recorded in observation notes.

Run `node --no-warnings scripts/build-tuning-profiles.ts` to rebuild the server dataset and three review manifests. The build is deterministic from its factual inputs. Run `node --no-warnings scripts/test-tuning-consensus.ts` for consensus checks.

An explicit `consensusGroup` records a manually reviewed counterpart relationship. It never changes a provider's raw identity. The build validates make, exact model family, fuel, displacement, stock output and overlapping year bands, then uses the intersection of source applicability. Unreviewed relationships are kept separate. One provider has one vote; mirrored pages do not create independent corroboration. All stage values remain in the manifest. Missing Stage 2/3 data remains missing.

Refresh one provider in bounded batches, recheck robots/access rules and compare the new factual observations before replacing the previous snapshot. A blocked provider requires a later authorized public-access opportunity, not another endpoint or proxy. Review conflicting output, engine transitions and hardware requirements before approving NoordTune targets.
