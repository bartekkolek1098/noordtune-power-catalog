# Tuning QA artifact cleanup

Applied after functional commit `920ae2e31f1610cc157307d75ae972264786a494` under the owner-approved final pass. This cleanup changes evidence files and their links only.

## Files and size

| Measure | Before | After | Removed |
| --- | ---: | ---: | ---: |
| PNG files | 331 | 40 | 291 |
| PNG bytes | 102,764,835 | 14,738,089 | 88,026,746 |

PR changed-file count against unchanged `main`: **417 before cleanup → 128 after cleanup**. The task started at 389 files before the new functional changes and final evidence. The removed bytes leave the current tree; their immutable Git history remains available.

The retained set contains 18 final-review images and 22 representative historical images. All four owner cases, public/reference/canonical/generic paths, an unsupported EV and responsive extremes remain directly reviewable. See the [retention record](runtime/SCREENSHOT_RETENTION_PROPOSAL.md) and [full image/hash/archive manifest](runtime/screenshot-inventory.json).

## Historical evidence remains accessible

All 291 removed files were verified against the exact archived Git blob at [commit 0c096a0](https://github.com/bartekkolek1098/noordtune-power-catalog/commit/0c096a051b277ee2e37a1f4f69fb83d3b05418e6) before deletion. No removed image differs from its archived bytes. The 40 rewritten references resolve to 36 distinct archived URLs; all returned HTTP 200 in the pre-cleanup HEAD check.

| Historical report | References moved to immutable archive |
| --- | ---: |
| TUNING_IDENTITY_PRICING_FIX_REVIEW.md | 4 |
| docs/tuning-qa/corrective/corrective-results.html | 4 |
| docs/tuning-qa/corrective/visual-comparison.html | 16 |
| docs/tuning-qa/visual-comparison.html | 16 |

All historical Markdown/HTML content remains, with a compact archive notice and a link to the current review. No old screenshot was replaced with a different result under the same filename. Existing JSON/browser measurements are unchanged; removed image filenames remain mapped in the manifest rather than rewriting historical test results.

## Link verification

The [artifact link audit](artifact-link-audit.json) checks every local Markdown/HTML artifact reference, including the latest [final accuracy review](final-review/FINAL_ACCURACY_REVIEW.md), and every immutable screenshot archive URL used by those reports. Local targets must exist; archived screenshot paths must exist in commit 0c096a0 and match the recorded removed bytes. The archive URLs are also checked by HTTP HEAD. Research websites and application URLs are outside this artifact-existence check.

Final audit: **26 Markdown/HTML files, 74 local artifact links (30 to local PNGs), 40 archived screenshot references and six archive-commit references**. All 37 distinct archive URLs returned HTTP 200. All 40 retained PNG hashes and 291 exact archive mappings passed. **Zero broken local links, missing archived targets, inventory mismatches or HTTP failures.**

All JSON reports, research, catalog/source data, runtime tests, browser checks and production validation evidence are retained. No source code, dependencies, application configuration or Git history were changed by this cleanup.
