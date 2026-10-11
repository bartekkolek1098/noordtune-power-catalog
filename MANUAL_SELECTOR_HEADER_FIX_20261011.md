# Desktop navigation and manual catalog result repair

Baseline: `c91aa1cf65ea73256cb2f1d3acfe1005297609ea`. Branch: `fix/desktop-header-manual-results-20261011`.

## Reproduced faults

The catalog header kept a 1,280px maximum width even when the 1,536px breakpoint enabled larger menu labels, a larger logo and the phone contact. Navigation children overflowed their flex area and overlapped the logo/language controls. The main NoordTune website expands to 1,536px at this breakpoint; the catalog now mirrors that exact size change. Logo, ordering, destinations, languages and mobile dialog are retained.

The BMW 1 / 2021 / 118i 1.5 103kW 140PS / F40 selection is `tax-99f71fb1a966f40d`. It is a discovery-taxonomy row, not a published vehicle page. Its previous red button called `focusConfigurator('rdw-configurator')`, an element which does not exist before a successful plate lookup. The taxonomy branch also intentionally skipped fetching any tuning data. Thus the button was a no-op, not merely a mislabeled search.

## Repaired manual flow

A bounded `mode=selection` API resolves a known taxonomy ID and explicit year. It returns catalog identity immediately, plus an optional comparison of existing publisher Stage 1 values when make, model/badge, generation, fuel, nominal displacement, exact catalog PS and source year are compatible. The same existing source-matching checks remain in use; the RDW lookup resolver and source data are not changed. No registry type, VIN, actual ECU, measurements or inferred gains are invented.

The manual selection now loads its result in the left filter panel rather than an empty stretched card. The red action is **Szukaj / Bekijk resultaten / View results** and opens/focuses the actual result. Quick search selections without a year show data and ask for a year before exposing source-dependent figures. Results include original power, Stage 1, computed power gain, torque, named source links and a contact action retaining engine/year. Unsupported selections still show their catalog details and a clear review message. Plate lookup is a separate optional link targeting the existing `rdw-check` input, not the conditional configurator.

BMW F40 118i 140 comparison preserves Shiftech's 180PS/260Nm and Mosselman's 170PS/300Nm as separate source pairs. The summary range is 170–180PS / 260–300Nm with RON98 disclosure, not a claimed blended tune or NoordTune measurement. Source-year limits and the separate 136PS variant remain protected. Stage 2/3 are not introduced into this new result.

API validation rejects nonexistent IDs, invalid or out-of-range years. Cancellation guards prevent an old response overwriting a newer engine selection. Errors include an explicit retry action. Parent filter resets clear old results. Client modules only import the small DTO, never the server source database.

## Regression checks

`test:manual-selector`: original 4,592-row discovery taxonomy integrity plus BMW reproduction, exact factory PS/year limits, no data mutation, safe pending outcomes and a 46-selection sample.

`qa:manual-selector`: three languages; header overlap/hit-testing at 12 widths from 320 to 2,560px; mobile dialog; four dropdowns; automatic result; red button; source links; RON disclosure; contact payload; optional plate input; responsive result; quick search; stale-response races; clear/reset; failed request and retry; invalid API queries. Screenshots and browser report are stored outside the repository.

No production release is claimed until the optimized build, these browser checks and existing SEO/plate-result regressions pass, followed by exact-SHA Vercel build and live production checks. Previous `c91aa1c` is the rollback baseline. Sitemap/engine coverage counts are not increased by this UI repair.

## Completed local release gates

- Original taxonomy integrity and new manual-result unit tests PASS (customer BMW, source/year/power boundaries and 46 sampled valid selections).
- ESLint, TypeScript and optimized Next build PASS.
- New browser gate PASS: 36 header language/viewport cases, dropdown and quick-search workflows, pending output, source display, cancellation races, retry, contact and optional plate focus.
- Existing reference API stage payload matches the previous production version exactly; reference and public vehicle-page branches remain reachable in PL/NL/EN (six additional checks).
- Existing SEO suite PASS with the unchanged 356 sitemap entries; plate-result regression PASS 32/32 privacy-safe browser journeys.
- Fixed desktop header and manual-result mobile/desktop screenshots reviewed. Screenshots are stored only in the external QA directory, not committed.

Remote preview and public production must still be verified for the committed SHA; the above is not a claim of a deployed production change.
