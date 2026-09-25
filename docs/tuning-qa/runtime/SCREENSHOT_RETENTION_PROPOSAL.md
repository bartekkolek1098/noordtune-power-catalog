# Applied screenshot retention

The owner-authorized cleanup is applied after functional commit `920ae2e31f1610cc157307d75ae972264786a494`. It uses normal branch file changes; no history rewrite or force-push is involved.

**40 of 331 PNGs remain local (14.74 MB). 291 redundant PNGs were removed (88.03 MB).** This reduces the current screenshot set by 87.92% of files and 85.66% of bytes. The full [path, size, SHA-256 and archive manifest](screenshot-inventory.json) retains records for every original and final image.

## Retained set

| Evidence | PNGs |
| --- | ---: |
| Latest final review: four actual owner RDW cases, public GTI, non-public canonical Dacia, generic petrol, generic diesel, unsupported EV; 320/1440 px | 18 |
| Approved baseline and corrective full BMW/GTI results at 320/1440 px | 8 |
| Public BMW 320d, GTI, Golf R and manual Focus ST detail pages at 320/1440 px | 8 |
| Three manual reference results at 320/1440 px | 6 |

The latest images and all other tested widths/locales are documented in the [final accuracy review](../final-review/FINAL_ACCURACY_REVIEW.md). Historical retained images keep their original meaning and do not replace current acceptance evidence.

## Preserved archive and reports

Every removed PNG exactly matches its Git blob at [immutable commit 0c096a0](https://github.com/bartekkolek1098/noordtune-power-catalog/commit/0c096a051b277ee2e37a1f4f69fb83d3b05418e6). Forty historical Markdown/HTML image references were redirected to that checkpoint: image sources use the immutable raw URL; clickable links use its GitHub blob page. Historical pages are marked as archived checkpoint evidence.

All research, source comparisons, Markdown/HTML reports, browser JSON metrics, source/bundle boundary checks, coverage results and QA scripts remain. Historical JSON screenshot filenames retain their original checkpoint meaning; the complete manifest maps each removed filename to its exact archived bytes.

See the [cleanup report](../ARTIFACT_CLEANUP.md) and [complete local/archived artifact link audit](../artifact-link-audit.json). Build output, dependencies, browser profiles and caches are outside this evidence set and were not added.
