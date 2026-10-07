# Global Tuning Output Rebuild V2

Baseline: current production main before customer-safety PR22.

## What the scan established

- V-Tech public configurator taxonomy: **4,722 exact discovered configuration URLs**, **60 brands**, **462 make/model families**.
- Existing September competitor evidence: **3,377 source pages** and **3,572 Stage 1/2 observations**.
- Existing NoordTune source-backed tuning profiles: **1,269**.
- Current canonical selector/RDW rows: **58,586**.
- Multi-source Stage 1 configuration groups: **42**.
- Stage 1 groups currently suitable for a conservative bounded range under the V2 policy: **28**.
- Stage 1 single-source conditional groups: **3,032**.
- Stage 1 conflict/review groups: **14**.
- Stage 2 evidence groups: **309**. These are not automatically publishable because hardware/fuel/transmission scope must be reviewed.
- Generated cross-product risk candidates without a matching V-Tech taxonomy row: **1,844**. Absence is a risk signal, not proof of non-existence.

## Root cause of the 204 hp Volkswagen problem

The current generated catalog builds large make-level model × trim Cartesian products. A Volkswagen trim such as '2.0 BiTDI 204' can therefore be attached to models for which that configuration was never established.

The scan reproduces the problematic generated Golf 204 hp BiTDI row: **volkswagen-golf-2-0-bitdi-2012: Stage 1 245 hp, Stage 2 275 hp**.

V-Tech taxonomy independently shows that Volkswagen 204 hp spans materially different vehicles and engines, including T6/T6.1 2.0 TDI commercial vehicles, Touareg 3.0 TDI, Golf IV 2.8 V6 and Multivan T7 2.0 TSI. **204 hp cannot be a tuning identity key.**

## Stage 1 policy

1. Match exact compatible vehicle configuration first.
2. Keep each provider observation independently traceable.
3. Require at least two independent compatible providers for an automatic public range.
4. If compatible source spread is within 6% power and 10% torque, publish a conservative range; if a point is required, use the lower defensible bound.
5. Never use 'competitor + 4 hp'.
6. Single-source evidence stays conditional.
7. Material source conflict means split identity or withhold — never average incompatible variants.
8. Generic/canonical multiplier output is never customer-facing.

## Stage 2 policy

Stage 2 is retained as a product, but numeric publication is stricter than Stage 1.

A public Stage 2 number requires compatible vehicle identity **and** actual Stage 2 source evidence **and** sufficiently defined hardware/fuel/transmission scope. Otherwise it stays custom/on request.

The ratio analysis is kept only as QA to find outliers. It must never generate customer values.

## Database rebuild architecture

- **Discovery layer:** competitor/manufacturer taxonomy; V-Tech is useful here even when its product is an external PowerChip module.
- **Identity layer:** make/model/generation/year/engine/fuel/displacement/stock output/engine code where evidenced.
- **Technical layer:** ECU/TCU application evidence, never fitted-unit inference.
- **Observation layer:** raw provider Stage 1/2 facts.
- **Consensus layer:** NoordTune approved Stage 1/2 output + confidence.
- **Commercial layer:** NoordTune software/hardware/TCU price scope.
- **SEO publication layer:** only identities passing confidence gates.

The full lookup database should be broad; the SEO-public page set should remain curated.

## Largest taxonomy providers / makes

- Volkswagen: 547
- BMW: 481
- Audi: 473
- Mercedes: 395
- Renault: 276
- Ford: 269
- Opel: 222
- Seat: 185
- Volvo: 178
- Citroen: 172
- Skoda: 170
- Peugeot: 130
- Fiat: 118
- Kia: 112
- Toyota: 86

## Immediate order

1. Release PR22 customer-safety guard and public Stage 3 removal after owner approval.
2. Replace model × trim cross-product generation with real discovered vehicle configurations.
3. Import the V-Tech taxonomy as discovery-only rows.
4. Attach existing Unlimited / ATM / Shiftech / Mosselman evidence to exact identities.
5. Promote multi-source conservative Stage 1 ranges.
6. Research Stage 2 hardware scope family by family.
7. Expand public SEO pages only after data gates pass.

No production data, pricing or SEO page expansion is changed by this research branch.

