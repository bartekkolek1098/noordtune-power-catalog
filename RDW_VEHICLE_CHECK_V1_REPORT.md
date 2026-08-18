# NoordTune Vehicle Check V1 Report

Vehicle Check V1 extends the existing tuning lookup with a bounded, server-side pre-purchase check based only on official RDW Open Data. It does not present itself as a complete vehicle-history product and does not change catalog matching, Pricing V2, tuning values or service compatibility.

## Official datasets

| Source | RDW dataset | ID | Use |
| --- | --- | --- | --- |
| Registered vehicles | Gekentekende voertuigen | `m9d7-ebf2` | Core identity, registration, APK, odometer judgement, official indicators, dimensions and masses |
| Registered vehicle fuel | Gekentekende voertuigen brandstof | `8ys7-d773` | Fuel, net power, consumption, emissions and electric-range fields |
| Recall status | Terugroep actie status | `t49b-isb7` | Open recall reference/status rows for the plate |
| Recall details | Terugroep actie | `j9yg-7rg9` | Defect, remedy, producer reference and official information URL |
| Observed APK defects | Geconstateerde Gebreken | `a34c-vvps` | Recent plate-specific APK defect rows |
| APK defect reference | Gebreken | `hx2c-gt7k` | Official Dutch description for a defect code |

All requests are made from `src/lib/rdw.ts`. The browser calls only the NoordTune API route. Every RDW query has a required `$select` and bounded `$limit`; optional sources use `Promise.allSettled` and cannot turn a valid core vehicle result into a complete lookup failure.

## Fields used

### Vehicle and registration

- `vervaldatum_apk` / `vervaldatum_apk_dt`
- `datum_tenaamstelling` / `datum_tenaamstelling_dt`
- `datum_eerste_toelating` / `datum_eerste_toelating_dt`
- `datum_eerste_tenaamstelling_in_nederland` / matching date field
- `catalogusprijs`, `bruto_bpm`
- `wam_verzekerd`, `export_indicator`, `openstaande_terugroepactie_indicator`
- `taxi_indicator`, `wacht_op_keuren`, `tenaamstellen_mogelijk`
- `jaar_laatste_registratie_tellerstand`, `tellerstandoordeel`
- `code_toelichting_tellerstandoordeel`
- `maximum_massa_trekken_ongeremd`, `maximum_trekken_massa_geremd`
- `laadvermogen`, `massa_rijklaar`
- `eerste_kleur`, `tweede_kleur`, `aantal_zitplaatsen`, `aantal_deuren`
- existing make, model, type, variant, execution, engine and dimension fields

### Fuel and environment

- `brandstofverbruik_gecombineerd`
- `brandstof_verbruik_gecombineerd_wltp`
- `emissie_co2_gecombineerd_wltp`
- `co2_uitstoot_gecombineerd`
- `emissiecode_omschrijving`, `uitlaatemissieniveau`
- `nettomaximumvermogen`
- `elektrisch_verbruik_enkel_elektrisch_wltp`
- `actie_radius_enkel_elektrisch_wltp`, `actieradius`
- `klasse_hybride_elektrisch_voertuig`

### Recalls and APK defects

- Recall reference, status, producer reference, defect, remedy and official information URL
- APK report date, defect code, number of reported defects and inspection type
- Official defect description from the reference dataset when available

APK history is queried with a limit of 24 rows and returns at most 12 usable recent rows to the client. Recall status/details return at most 20 rows. Reference descriptions are bounded at 100 rows. Fuel rows are bounded at five.

## Purchase signal rules

There is deliberately no overall good/bad score.

| Area | Positive | Attention | Check required |
| --- | --- | --- | --- |
| APK | More than 60 days valid | Expires within 60 days or date unavailable | Expired |
| Odometer | RDW judgement is logical | No usable judgement | RDW judgement is illogical |
| Recalls | No open recall reported by available sources | Auxiliary recall status unavailable | Open indicator or open recall row |
| Transfer | Tenaamstellen mogelijk is yes | No claim when unknown | Tenaamstellen mogelijk is no |
| Registration | — | Possible import only when first admission precedes first Dutch registration by more than 30 days, or registration within 90 days | Export indicator or waiting for inspection |
| Insurance | — | WAM reported no, with a neutral dealer-stock caveat | — |
| Taxi | — | Current official taxi indicator, not a full usage history | — |

Each displayed signal explains what RDW reports, why the point may matter and what the buyer can verify next. Both official admission dates remain visible. A difference of zero through 30 days creates no import attention signal; a difference above 30 days is shown only as a possible import. This threshold is a conservative NoordTune presentation rule, not an official RDW import or fraud classification. A recent registration is information, not a fraud claim.

Recall presentation uses an explicit `open`, `clear` or `unknown` state. Positive open evidence always wins. A false official indicator plus an available recall-status source and no open row is `clear`; missing or incomplete evidence is `unknown`. If RDW reports an open recall while the detail sources are unavailable, the result remains check-required and explicitly says that the details are temporarily unavailable.

## Result structure and failure behavior

The public DTO contains structured `ownershipRegistration`, `roadworthiness`, `odometer`, `insurance`, `recalls`, `apkHistory`, `purchaseSignals`, `financial`, `towing`, `environment` and `sourceStatus` sections. Raw upstream rows are never returned.

- Core registered-vehicle source unavailable: controlled `RDW_UNAVAILABLE` response.
- Valid plate not found: existing `NOT_FOUND` behavior.
- Fuel, recall or APK source unavailable: core result remains usable and the source is labelled `unavailable`.
- No recall/defect codes: detail source is labelled `not-applicable`.
- A detail reference that cannot resolve all requested codes: labelled `partial`.
- Requests use a five-second default timeout, one bounded retry and an in-flight deduplication map.
- Cache entries use SHA-256 plate keys, a six-hour default TTL and a 250-entry in-process cap. `RDW_CACHE_TTL_SECONDS` remains available as an environment override.
- Cache and in-flight values use a plate-free internal DTO. The clear plate is added only to the response for the current caller.

## Privacy decisions

- The customer API accepts lookup input through `POST` JSON only. A `GET` request is not processed and receives the framework-standard method response.
- No plate-specific pages, canonicals or sitemap URLs exist.
- No plate is written to `localStorage`, `sessionStorage` or analytics events.
- No owner identity or personal data is requested or returned.
- The cache is ephemeral process memory. Its key is a SHA-256 digest and its value is plate-free; no database or durable plate log was added.
- The client receives only the result DTO needed to display the check. Redundant normalized-plate data, request durations, cache TTL and other implementation details stay server-internal.

The audit treats a plate-based `GET` handler, a serialized clear plate in the cache, public operational metadata or an invalid default cache TTL as critical errors.

## Response measurements

Measurements were made locally against the production build, using an official public test record and POST requests. Network conditions can vary.

| Version | Request | Runtime | Body size |
| --- | --- | ---: | ---: |
| Before Vehicle Check V1 | Cold | 2.437 s | 726 B |
| Before Vehicle Check V1 | Warm | 0.212 / 0.185 s | 725 B |
| Vehicle Check V1 | Cold | 0.359 s | 3,553 B |
| Vehicle Check V1 | Warm | 0.0016 / 0.0013 s | 3,552 B |

The larger body is the intentional structured purchase-check result, not raw RDW data. The first response contained four bounded APK defect items, no open recall and six explicit source statuses. Cache hits return the original `fetchedAt` value, and the UI labels it as a temporarily reused result rather than implying a new RDW request.

## SEO routes

- Dutch: `https://power.noordtune.nl/nl/kentekencheck`
- English: `https://power.noordtune.nl/en/vehicle-check`
- Polish: `https://power.noordtune.nl/pl/sprawdz-auto`

Each route has a localized canonical, matching `nl`/`en`/`pl` alternates, Open Graph/Twitter metadata and `WebApplication`, `BreadcrumbList` and `FAQPage` structured data. The sitemap intentionally changes from 291 to 294 unique absolute URLs.

## UI and state summary

- Vehicle identity and the original RDW check timestamp appear first in both contexts.
- On the Power Catalog homepage, a compact purchase summary shows counts, APK, odometer, recalls and transfer status before the tuning result. `Tuning & power` is the default view, so Stage results and Pricing V2 remain immediately accessible.
- On the dedicated Vehicle Check landing pages, the full purchase check is the default view. Critical signals and the pre-purchase inspection CTA stay visible, while secondary registration, technical, environmental, APK-history, recall-detail and source-status sections are collapsible without another request.
- A localized two-view control switches between purchase and tuning results without changing the URL, clearing component state or repeating the RDW request.
- The purchase context gives visual priority to the inspection CTA; the catalog context gives priority to the tuning quote and vehicle page. Both lead paths remain available.
- NL, EN and PL landing/result copy was checked at 320, 360, 390, 430, 768, 1024 and 1440 px with no document-level horizontal overflow.

## Public value explanations

The financial fields retain their official values but now avoid suggesting current commercial value:

- Catalog price is labelled as the original RDW list price and explained as a historical new-vehicle price, not current market value.
- Gross BPM is labelled as gross BPM at registration and explained as registration information, not automatically the BPM currently payable.

Vehicle Check does not calculate market value, depreciation, current BPM or purchase value.

## Landing route compatibility

The existing dynamic folder `src/app/[locale]/[brand]` remains in place to avoid changing public routes. Inside the dispatcher, the parameter is treated as a neutral localized landing slug rather than a vehicle brand. The three reserved routes remain `/nl/kentekencheck`, `/en/vehicle-check` and `/pl/sprawdz-auto`; future top-level brand pages must account for this dispatcher.

## Preview QA

Authenticated QA passed on the Vercel Preview for Draft PR #12:

`https://noordtune-power-catalog-git-fe-9740b9-bartekkolek1098s-projects.vercel.app`

- `/nl`, `/en`, `/pl` and all three localized Vehicle Check routes loaded with their correct localized titles and controls.
- An official exact-match test record showed vehicle identity, freshness, the compact purchase summary and the tuning result by default on the catalog homepage. The full purchase view opened without changing the URL or repeating the lookup.
- An official no-match test record stayed positive and advisory: vehicle detected, indicative estimate, manual NoordTune review and WhatsApp follow-up remained available.
- The dedicated Vehicle Check route defaulted to the full purchase view, kept critical signals and the inspection CTA visible, exposed tuning through the view switch and collapsed six secondary detail groups. Expanding a group required no new request and did not change the URL.
- A repeated lookup displayed the neutral temporary-cache label while retaining the original RDW check time.
- EN and PL result controls displayed `Purchase check` / `Tuning & power` and `Kontrola przed zakupem` / `Tuning i moc`, with localized freshness labels.
- Invalid client input stayed on the same plate-free route and returned the localized validation message.
- At requested widths 320, 360, 390, 430, 768, 1024 and 1440 px, both the catalog and Vehicle Check pages had no document-level horizontal overflow or out-of-viewport fixed CTA.

The browser harness blocks direct navigation to API paths, so the Preview `GET` method was not inferred from that navigation. The built route was separately verified locally as 405, the public UI used authenticated Preview POST lookups successfully, and the catalog audit makes a plate-based exported `GET` handler a critical failure. Deterministic fixtures cover all four recall states, APK/odometer/transfer/WAM conditions, partial auxiliary failure, the conservative import threshold and serialized plate-free cache values without using customer data in the report.

## Deliberately not claimed

Vehicle Check V1 does not claim access to:

- owner identity or complete ownership history
- individual odometer readings
- complete damage or maintenance history
- finance, lien or pandrecht information
- market value
- non-RDW theft databases
- a guarantee of mechanical condition

No RDW warning does not guarantee good mechanical condition. A physical inspection, diagnostic scan and document review remain recommended before purchase.

## Known limitations

- Official APK defect descriptions are Dutch; EN/PL pages label them as official Dutch source descriptions rather than inventing translations.
- RDW recall data is status-based. No open row does not prove a vehicle has never been recalled; a VIN check with the manufacturer/dealer may still be useful.
- RDW does not expose the individual odometer readings used for its judgement through this result.
- An in-process cache accelerates repeat lookups but is not shared between serverless instances.
- The six-hour cache improves freshness but cannot guarantee that an upstream RDW state did not change after `fetchedAt`; the timestamp is therefore shown to the customer.
- Auxiliary dataset availability and completeness remain controlled by RDW.
- A physical inspection price is intentionally not published in V1.
