# Generic RDW range policy

Reviewed 2026-09-15. This policy changes runtime planning intervals only. It does not change any canonical/public stock or tuned figure, source reference peak, vehicle count, SEO route, ECU identification or commercial price.

## Resolution and evidence

The server still resolves each Stage through reference, public/curated, compatible canonical, then generic layers. A numerical catalog/reference source stays a source value. Generic Stages contain `powerRangeHp`, omit `powerHp`, and have `generic-indicative` provenance and Stage resolution level 4. A range is an indicative scenario, not verified tuning coverage, a dyno confidence interval or a NoordTune-approved target.

The full canonical database remains in the server module. The client receives one selected profile, per-Stage provenance and count-only diagnostics.

## Independent power intervals

The starting quantity is registered power converted to whole metric pk, matching the RDW stock-power display. Whole-pk conversion prevents tiny kW conversion differences from moving a five-pk endpoint or classifying a reference as unusually strong.

| Evidence category | Stage 1 factor interval | Stage 2 factor interval | Stage 3+ factor interval |
| --- | --- | --- | --- |
| Turbo diesel | 1.15–1.25 | 1.25–1.40 | 1.40–1.55 |
| Turbo petrol | 1.10–1.20 | 1.25–1.40 | 1.40–1.60 |
| Explicitly naturally aspirated | 1.02–1.05 | 1.05–1.10 | 1.08–1.15 |
| Unknown aspiration | 1.00–1.04 | 1.02–1.07 | 1.04–1.10 |

These are explicit local planning assumptions, not source-derived mechanical limits. Turbo categories require compatible model/engine evidence; diesel fuel alone does not prove turbocharging. The BMW 128ti reference has manufacturer TwinPower Turbo evidence. Unsupported hybrid/electric/gas-conversion configurations do not inherit an ICE multiplier.

Each Stage interval is independently `registered whole-pk stock × its table interval`. Bounds round outwards to five-pk increments. They may be clamped upwards to the preceding Stage's corresponding lower and upper bounds to avoid regression; no preceding Stage is multiplied. Overlapping or equal intervals are intentional: extra hardware does not establish a guaranteed increase for an unidentified engine configuration.

## Unusually strong sourced Stage 1

A source comparison's upper claim is not automatically selected. The stronger scenario applies only when the **lower** bound of a compatible sourced Stage 1 exceeds the rounded normal Stage 2 upper bound by more than three pk (the existing stock-rounding tolerance).

This suggests an unusually strong reference or possible factory de-rating; it does not prove identical hardware or additional tuning headroom. If no compatible later-Stage source exists:

- Stage 2 uses the same fixed Stage 1 source interval, with an upper uncertainty width of 20% of registered stock power.
- Stage 3+ independently uses that same fixed Stage 1 source interval, with an upper width of 40% of registered stock power.
- Lower additional gain is zero. No `Stage 1 × 1.05` or `Stage 2 × 1.08` calculation exists.
- Both Stages are broad conditional planning scenarios with `STRONG_STAGE1_REFERENCE_SCENARIO`, not model-specific targets.

The widths describe unverified planning scope; they are not researched limits or approved workshop recommendations.

## Torque

Generic torque exists only when a compatible source supplies stock torque. It uses independent stock-torque intervals, rounded to five Nm, with corresponding nondecreasing bounds. Previous generic torque is never multiplied. With no defensible stock torque, exact stock/Stage torque remains absent and the profile carries `GENERIC_TORQUE_UNAVAILABLE`.

## Owner acceptance configurations

| Detected configuration | Stage 1 | Stage 2 | Stage 3+ | Source distinction |
| --- | --- | --- | --- | --- |
| Defender 1999 cc, 177 kW, 2020 | 290 pk / 590 Nm | 320 pk / 660 Nm | 365 pk / 740 Nm | All three are unchanged canonical source figures from compatible `2.0 SD4` year copies; no generic calculation. RDW stock displays 241 pk; source stock is 240 pk, within rounding tolerance. |
| Transit Connect 1499 cc, 73.5 kW, 2018 | 125–140 pk / 330–340 Nm | 125–140 pk / 330–340 Nm | 140–155 pk / 330–350 Nm | Stage 1 is a conditional external-source comparison. Stages 2/3 are generic planning ranges. The engine-generation question remains open. |
| Transit Custom 1995 cc, 77 kW, 2019 | 190 pk / 440 Nm | 190–215 pk / 440–470 Nm | 190–235 pk / 440–505 Nm | Stage 1 is the retained external reference, carrying `NOORDTUNE_TARGET_REVIEW_REQUIRED`; it is not an approved or preferred NoordTune target. Stages 2/3 are broad strong-Stage-1 scenarios. |
| BMW 128ti 1998 cc, 195 kW, 2022 | 310 pk / 480 Nm | 330–375 pk / 480–540 Nm | 370–425 pk / 480–580 Nm | Stage 1 is the retained RON98 reference; Stages 2/3 are generic turbo-petrol scenarios. ECU/access remains separately conditional. |

## Transit Connect canonical inspection

The unchanged database has **zero Transit Connect records**. Its 281 Ford `1.5 TDCi` year-generated rows all describe 120-pk templates in other model families. They fail both the exact Connect-family requirement and the registered approximately 100-pk variant requirement. A shared 1.5 label is not sufficient evidence to borrow their Stage 2/3 figures.

The owner has no confirmed TDCi/EcoBlue evidence. The 2018 transition remains conditional, and registry type/variant/execution are not decoded speculatively. The previously researched Shiftech Stage 2 135 pk / 350 Nm application is labelled EU5, while Ford's introduction source describes Euro VI. It remains research-only until applicability is established. The BR/Unlimited Stage 1 endpoints compare published scopes; they are neither a mechanical limit nor a selected highest claim. See [runtime reference research](runtime/LIVE_RDW_AND_REFERENCE_RESEARCH.md) for source details.

## Regression coverage

Focused runtime tests cover exact source preservation; generic-only rounded ranges; monotonic bounds across all four categories; independent strong-Stage-1 scenarios; the 73.5-kW conversion boundary; missing torque; unsupported powertrains; wrong family/displacement/generation; duplicate collapse; runtime-only TCU suppression; and factual commercial identity metadata. Pricing consumes the detected identity separately and cannot change these technical intervals.
