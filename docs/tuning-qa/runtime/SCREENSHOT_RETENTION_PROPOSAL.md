# Screenshot retention proposal

**Proposal only — owner review required before any deletion.** No files were deleted. No history rewrite or force-push is proposed.

Inventory: **313 PNG files (95.27 MB)** under docs/tuning-qa. The full path/size/SHA-256 manifest is [screenshot-inventory.json](screenshot-inventory.json).

| Directory | PNG files | Size |
| --- | ---: | ---: |
| . | 113 | 32.51 MB |
| corrective | 192 | 59.32 MB |
| runtime | 8 | 3.45 MB |

Exact byte duplicates: **51 groups / 51 extra copies**. Similar screenshots are not treated as exact duplicates unless their SHA-256 hashes agree.

## Proposed retained set

Retain **40 PNGs (14.69 MB)**: 32 existing checkpoint/interface examples plus all 8 latest runtime acceptance images. All proposed files now exist. This would reduce the visible screenshot set by 273 files and 80.59 MB, while the original evidence remains accessible through history or an owner-approved archive.


| Evidence category | Files | Why keep it |
| --- | ---: | --- |
| Approved baseline and first corrective BMW / GTI comparisons, 320 and 1440, full and summary | 16 | Preserves review history and representative appearance |
| BMW 320d, GTI, Golf R and manual Focus ST public details, 320 and 1440 | 8 | Public numeric output, options and quote regressions |
| Three manual reference results, 320 and 1440 | 6 | Manual workflow has no invented SEO route |
| Two complete comparison/contact sheets | 2 | Quick review without opening every original image |
| Latest four live owner results, 320 and 1440 | 8 | Direct acceptance evidence for this runtime fix |

The exact proposed keep paths and reasons are in the JSON manifest. Intermediate widths and EN/PL interactions remain covered by the complete machine-readable QA reports and reproducible QA scripts. The retained screenshots are representative visual evidence, not a replacement for those checks.

## Preserve all non-image evidence

Keep the research documents, live RDW facts, source comparisons, all24 before/after reports, runtime coverage JSON/Markdown, browser measurements, build/boundary checks, and QA scripts. Keep historical HTML and JSON reports as checkpoint evidence. They currently reference screenshots outside this proposed reduced set.

Before an approved cleanup commit, archive the original image set with an immutable reference or update historical report/index links to their existing Git commit paths. Verify every remaining Markdown/HTML/image reference after that change. Do not leave dangling image links or silently rewrite the meaning of an earlier QA report.

## Owner decision requested for a later cleanup

1. Approve or adjust the 40-image keep manifest.
2. Choose where the complete earlier screenshot archive should remain accessible.
3. Only then remove the explicitly approved redundant/superseded images in an ordinary follow-up commit on this same Draft PR.
4. Do not use history rewriting or force-push. The current implementation commit includes this proposal and retains all evidence.

Build output, node_modules, temporary browser profiles and local caches are outside this evidence inventory and must not be committed.
