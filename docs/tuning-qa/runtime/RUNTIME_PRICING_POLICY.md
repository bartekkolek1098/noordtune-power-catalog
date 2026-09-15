# Runtime commercial pricing policy — dataset v1 revision

Status: **draft local owner-review commercial prices**. These are indicative software budgets, not final approved prices or a diagnosis of ECU access. No technical output, canonical source value, public membership, service price or compatibility rule is changed by this policy.

## Price schedule

| Category | Stage 1 | Stage 2 | Stage 3+ |
|---|---:|---:|---:|
| classic-standard-diesel | €299 | €449 | €699 if scoped |
| standard-2010s | €399 | €549 | €799 if scoped |
| modern-standard | €449 | €599 | €899 if scoped |
| higher-complexity | €549 | €699 | €999 if scoped |
| advanced-unlock | Budget from €700 | Individual scope | Individual scope |

Amounts include VAT and are stored as integer cents. Ordinary Stage 2/3 budgets cover software calibration; required hardware and any advanced unlock require separate assessment. The €700 amount is the existing conditional Stage 1 package budget, not an automatic surcharge added to a software quote. The policy never falls back to €269 or a source `stage.price`.

## Resolution and precedence

1. Missing Stage, an explicit identity conflict, an unavailable applicable profile, or explicitly custom runtime work returns on-request. `stage.customHardware: true` returns on-request in every scope before any assignment. Runtime Stage 3 additionally requires `stage.hardwareScopeApproved: true`; a sourced numerical tuning output alone does not establish NoordTune's commercial hardware scope. Dataset v1 research profiles have no such owner approval.
2. Existing reviewed public assignments, their aliases and the three specific reference assignments take precedence. Existing numeric amounts stay unchanged. For a valid resolved runtime reference, a missing ordinary Stage 2/3 software amount uses that reference's existing category schedule; manual references retain their individual higher-stage scope. Advanced-unlock higher Stages remain individual everywhere. A generic rule does not reprice a reviewed Golf GTI/Focus ST assignment as a higher category.
3. An unassigned profile is eligible only when the server resolver attached a valid `runtimeCommercialIdentity`. It contains `resolved-compatible` or `resolved-generic`, actual RDW make/model, normalized petrol/diesel fuel and positive registered metric horsepower. Optional displacement, first-admission year and cylinder count retain the actual input facts; they do not come from a canonical year-copy label.
4. The rules below select the ordinary software category. A returned generic profile and a compatible canonical profile receive the same commercial category for the same facts. Estimate provenance, tuned hp/Nm and unknown ECU status do not select a price.
5. Existing access assessment remains separate. An applicable, explicitly identified BMW review scenario may use the €700 Stage 1 package. Confirmed access claims require identified-vehicle evidence. An unscoped confirmed unlock, or a possible unlock without an applicable package scenario, returns on-request. Higher advanced-unlock Stage scope remains individual.

An arbitrary `{make, model}` object, an unknown ID, an estimated/generated flag or `estimateApplicable: true` alone cannot create a runtime quote. The DTO marker is a server-resolution contract, not a cryptographic token or final quote authorization. The pricing module imports no catalog, server resolver or Node dependency.

## Exact ordinary-category rules

### Higher complexity — evaluated first

Any one of these conditions selects higher-complexity:

| Rule identifier | Condition |
|---|---|
| registered-output-at-least-250pk | Registered stock power ≥250 metric pk. Tuned power is not used. |
| displacement-at-least-2900cc | Registered displacement ≥2900 cc, covering common nominal 3.0-litre engines such as 2993 cc. |
| at-least-six-cylinders | Registered cylinder count ≥6. |
| explicit-performance-family | Model contains AMG, Cupra, vRS, GTI, GTD, Type R, RS/RS1–RS9, ST, GT/GT2/GT3/GT4, GTR, Nismo, BMW M1–M8/Mxxx i-or-d/1M–8M, or Golf/Polo/Scirocco R. |
| listed-premium-complexity-family | A listed premium make or model family below. Brand alone does not make every BMW, Audi or Mercedes higher-complexity. |
| listed-commercial-vehicle-family | A listed larger/commercial vehicle family below. Transit Connect and Transit Courier are excluded from the generic Transit rule. |

Premium makes: Land Rover, Range Rover, Jaguar, Porsche, Bentley, Aston Martin, Maserati, Ferrari, Lamborghini, McLaren and Rolls-Royce.

Premium model families:

- BMW: X3–X7, 5–8 Series/Serie/er or corresponding three-digit i/d/e badges; Z3/Z4/Z8.
- Audi: A6–A8, Q5–Q8, S3–S8, RS3–RS8 and R8.
- Mercedes-Benz: E, S, CL, CLS, GL, GLE, GLS and G, followed by Class/Klasse or a numeric badge.
- Volvo: XC90, S90 and V90.

Commercial families:

- Ford: Transit Custom and Transit; Transit Connect/Courier remain separate.
- Mercedes-Benz: Sprinter, Vito and Viano.
- Volkswagen: Transporter, Crafter and Multivan.
- Renault: Trafic and Master.
- Opel: Vivaro and Movano.
- Peugeot: Expert and Boxer.
- Citroën: Jumpy, Jumper, Dispatch and Relay.
- Toyota: ProAce.
- Fiat: Ducato, Talento and Scudo.
- Iveco: Daily.

These lists define draft commercial complexity only. They do not prove engine applicability, installed transmission, ECU model, lock or access method.

### Classic standard diesel — every condition is required

Rule `listed-classic-mainstream-diesel` requires:

- No preceding complexity rule.
- Diesel fuel.
- Known first admission no later than 2010.
- Registered power no greater than 135 metric pk.
- Known positive displacement no greater than 2100 cc.
- Known positive cylinder count no greater than four.
- A make/model from the following list.

| Make | Listed families |
|---|---|
| Volkswagen / VW | Golf, Polo, Passat, Bora, Jetta |
| Ford | Focus, Fiesta, Mondeo, Fusion |
| Opel / Vauxhall | Astra, Corsa, Vectra, Zafira, Meriva |
| Renault | Clio, Mégane, Scénic, Laguna, Modus |
| Peugeot | 206, 207, 306, 307, 308, 406, 407 |
| Citroën | C2, C3, C4, C5, Xsara, Berlingo |
| Škoda | Fabia, Octavia, Superb, Roomster |
| SEAT | Ibiza, Leon, Toledo, Altea, Cordoba |
| Toyota | Yaris, Corolla, Auris, Avensis |
| Honda | Civic, Accord |

Names are case/accent insensitive. The 2010 threshold is a fixed commercial scope boundary, not a production-date inference or ECU-generation cutoff. Missing year/cylinder/displacement information cannot qualify a vehicle for the classic price. Older petrol, high-output diesel, premium and larger-commercial vehicles do not become €299 merely because of age.

### Standard 2010s and modern standard

After complexity and classic rules, `ordinary-2010s-commercial-scope` selects standard-2010s for known first admission in 2010–2019. Rule `ordinary-resolved-ice-default` uses modern-standard for other valid ordinary profiles, including a missing year or older vehicle without complete classic evidence. That fallback is deliberately conservative; its name does not claim a modern ECU. A recent registration does not imply €700, and no year rule changes access status.

Invalid/nonpositive power or optional technical facts, malformed year, missing make/model, unsupported fuel or a rejected resolution marker returns on-request. `workScope: "custom"` explicitly keeps genuinely custom work outside the schedule.

## Examples and preserved exceptions

| Vehicle scenario | Expected draft scope |
|---|---|
| Golf 1.9 TDI, 2007, 105 pk, 1896 cc, four cylinders; compatible/generic runtime profile | €299 / €449; Stage 3 on-request until hardware scoped (€699 schedule) |
| Same ordinary profile without cylinder evidence | €449 / €599; Stage 3 on-request (€899 schedule) |
| Ordinary Focus petrol or unassigned A3 diesel, first admission 2018 | €399 / €549; Stage 3 on-request (€799 schedule) |
| Same ordinary model, first admission 2020 | €449 / €599; Stage 3 on-request (€899 schedule) |
| H329XH Defender, 241 registered pk, 1999 cc | €549 / €699 from listed Land Rover complexity; Stage 3 on-request |
| Unassigned Transit Custom 2.0 | €549 / €699 from larger-commercial family; Stage 3 on-request |
| V978ZF exact reference | Preserved €549 Stage 1 and runtime €699 Stage 2; Stage 3 on-request (€999 if scoped) |
| V380ST exact conditional reference | Preserved €449 Stage 1 and runtime €549 Stage 2; Stage 3 on-request (€849 if scoped) |
| KKH27K exact BMW 128ti reference | Existing conditional €700 Stage 1 package; higher Stages on-request |
| Unassigned BMW 318i with a recent year alone | Ordinary €449 Stage 1; unknown ECU/access |
| Same resolved BMW with explicit applicable G20 identity review scenario | Conditional €700 Stage 1 package; higher Stages on-request |
| Existing reviewed Golf GTI public profile | Existing €449 / €549 assignment wins over generic GTI rule; custom/unscoped runtime Stage 3 remains on-request |
| Existing reviewed X3 E83 2.0d public profile | Existing €299 / €449 assignment wins over generic premium rule; custom/unscoped runtime Stage 3 remains on-request |

## Preserved explicit proposals

The 24 public model-engine and three reference entries were individually reasoned in the prior corrective review. They remain explicit overrides, not a blanket contemporary fallback. This revision does not claim to migrate their prices to the new runtime matrix.

| Existing assignment group | Count | Preserved software schedule / reference Stage 1 |
|---|---:|---|
| Public contemporary-standard | 17 | €449 / €549 / €849 if scoped |
| Public higher-complexity | 6 | €549 / €699 / €999 if scoped |
| Public classic diesel (X3 E83) | 1 | €299 / €449 / €699 if scoped |
| BMW 128ti reference | 1 | Conditional advanced package €700; later Stages individual |
| Transit Custom reference | 1 | €549; ordinary runtime Stage 2 uses €699 |
| Transit Connect reference | 1 | €449; ordinary runtime Stage 2 uses €549 |

Exact IDs and individual scope reasons remain in `draftVehiclePricingAssignments` in `src/data/pricing.ts`. The legacy `contemporary-standard` category is used only for those existing assignments. Custom-hardware and runtime Stage 3 scope checks override every row.

## Shared surfaces and verification

`resolveStageQuote(profile, stage, {scope: "vehicle"})` remains the single API for runtime pricing. Numeric runtime policy identifiers begin `draft-runtime-v1` and include the applied rule; newly filled reference software amounts use `draft-runtime-v1:reference-category`. Existing numeric assignments retain `draft-local-v1` identifiers. Callers use the same selected Stage quote in the UI and WhatsApp. Selected paid options are added once in integer cents; an on-request quote never becomes a numeric total from option prices alone.

The focused runtime pricing regressions run through `scripts/test-quote-policy.ts`. They cover all four ordinary schedules with explicit Stage 3 approval fixtures, year boundaries, unapproved/custom Stage 3, explicit-assignment precedence, family exceptions, missing classic evidence, conditional unlock budgets, rejected/custom inputs, absence of ECU/output mutation and matching range/price/options in NL/EN/PL WhatsApp messages.
