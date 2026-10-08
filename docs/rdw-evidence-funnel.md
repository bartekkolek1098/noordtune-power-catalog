# RDW identity and source-backed Stage 1: frozen-sample coverage

**Method:** frozen 250-group / 3,000-row purposive historical RDW cohort. Not random, not representative of the Dutch fleet, and not a universal RDW coverage estimate.

## Three different customer outcomes

| Measurement | Sample count | Denominator | Meaning |
|---|---:|---:|---|
| RDW make + model present | 3,000 | 3,000 | A recognizable RDW registration, not a matching engine tune |
| RDW original engine kW present | 2,983 | 3,000 | Factory power exists in the registration; torque/ECU do not |
| Full technical fields incl. RDW body type | 2,260 | 3,000 | Make/model/engine kW/cc/cylinders/year/type/single ordinary ICE fuel |
| Ordinary ICE, interpretable RDW base | 2,590 | 3,000 | Safe denominator for a petrol/diesel Stage 1 discovery funnel |
| **Stage 1 numeric with linked published sources** | **1,439** | **3,000** | Indicative; always requires physical ECU/transmission verification |
| Stage 1 source-linked among ordinary ICE | 1,439 | 2,590 | Source links within the interpretable petrol/diesel subset only |
| Stage 1 generic numeric (not sourced) | 0 | 3,000 | Not considered verified Stage 1 coverage |
| Stage 1 generated/canonical numeric | 0 | 3,000 | Not considered verified Stage 1 coverage |
| Stage 1 other unverified numeric | 5 | 3,000 | Not considered verified Stage 1 coverage |
| Stage 1 numerical output withheld | 1,556 | 3,000 | Do not invent an output; refer to workshop quote |
| Public numerical Stage 3 | 0 | 3,000 | Stage 3 output must remain withheld |

**Source-linked Stage 1: 47.97% of this frozen, nonrandom sample; 55.56% relative to the ordinary-ICE interpretable subset.** Neither number is a Dutch-fleet percentage.

## Priority groups with no complete source-linked Stage 1

| Rank in frozen fleet priority | Make / model / engine displacement | Frozen year band | Sample rows | Without sourced Stage 1 | Technical fields complete |
|---:|---|---|---:|---:|---:|
| 20 | FORD TRANSIT CONNECT, 1499 cc | 2020–2024 | 12 | 12 | 12 |
| 39 | FORD FOCUS, 1596 cc | 2000–2004 | 12 | 12 | 0 |
| 45 | HYUNDAI I20, 998 cc | 2020–2024 | 12 | 12 | 4 |
| 50 | PEUGEOT 3008, 1598 cc | 2020–2024 | 12 | 12 | 2 |
| 59 | BMW 320I, 1998 cc | 2015–2019 | 12 | 12 | 11 |
| 61 | FORD KA, 1242 cc | 2010–2014 | 12 | 12 | 12 |
| 62 | PEUGEOT 108, 998 cc | 2015–2019 | 12 | 12 | 9 |
| 67 | SUZUKI ALTO, 996 cc | 2010–2014 | 12 | 12 | 12 |
| 71 | OPEL KARL / VIVA, 999 cc | 2015–2019 | 12 | 12 | 11 |
| 74 | NISSAN NISSAN QASHQAI, 1197 cc | 2015–2019 | 12 | 12 | 12 |
| 76 | SKODA OCTAVIA, 1395 cc | 2020–2024 | 12 | 12 | 0 |
| 77 | HYUNDAI I10, 998 cc | 2015–2019 | 12 | 12 | 12 |
| 88 | SKODA OCTAVIA, 1498 cc | 2025–2029 | 12 | 12 | 1 |
| 90 | FIAT FIAT PANDA, 1242 cc | 2010–2014 | 12 | 12 | 12 |
| 95 | CITROEN C3, 1199 cc | 2015–2019 | 12 | 12 | 12 |
| 100 | TOYOTA TOYOTA COROLLA, 1987 cc | 2020–2024 | 12 | 12 | 0 |
| 106 | RENAULT MEGANE, 1197 cc | 2010–2014 | 12 | 12 | 12 |
| 108 | TOYOTA TOYOTA C-HR, 1987 cc | 2020–2024 | 12 | 12 | 0 |
| 109 | SEAT LEON, 1595 cc | 2005–2009 | 12 | 12 | 4 |
| 110 | BMW 320I, 1998 cc | 2020–2024 | 12 | 12 | 12 |
| 118 | SEAT IBIZA, 999 cc | 2015–2019 | 12 | 12 | 12 |
| 120 | PEUGEOT 5008, 1598 cc | 2010–2014 | 12 | 12 | 11 |
| 121 | CITROEN C4, 1587 cc | 2005–2009 | 12 | 12 | 0 |
| 125 | NISSAN NISSAN JUKE, 999 cc | 2020–2024 | 12 | 12 | 12 |
| 127 | NISSAN NISSAN MICRA, 999 cc | 2020–2024 | 12 | 12 | 12 |

This queue **does not prove turbocharged compatibility**. Resolve factory kW, exact generation and drivetrain using sources before publishing results. Cars with naturally aspirated engines, EVs, LPG, hybrids or disputed gearbox/ECU must not inherit generated power figures.

## Reproduce

`pnpm qa:rdw-funnel` recalculates the whole bounded cohort against the production RDW normalizer and compares deterministic, sanitized JSON/Markdown results. `pnpm report:rdw-funnel` explicitly rewrites the two tracked aggregate reports after an approved code change.
