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
| Registration | — | Possible import or registration within 90 days | Export indicator or waiting for inspection |
| Insurance | — | WAM reported no, with a neutral dealer-stock caveat | — |
| Taxi | — | Current official taxi indicator, not a full usage history | — |

Each displayed signal explains what RDW reports, why the point may matter and what the buyer can verify next. A date difference between first admission and first registration in the Netherlands is only an import signal; import is not labelled as negative. A recent registration is information, not a fraud claim.

## Result structure and failure behavior

The public DTO contains structured `ownershipRegistration`, `roadworthiness`, `odometer`, `insurance`, `recalls`, `apkHistory`, `purchaseSignals`, `financial`, `towing`, `environment` and `sourceStatus` sections. Raw upstream rows are never returned.

- Core registered-vehicle source unavailable: controlled `RDW_UNAVAILABLE` response.
- Valid plate not found: existing `NOT_FOUND` behavior.
- Fuel, recall or APK source unavailable: core result remains usable and the source is labelled `unavailable`.
- No recall/defect codes: detail source is labelled `not-applicable`.
- A detail reference that cannot resolve all requested codes: labelled `partial`.
- Requests use a five-second default timeout, one bounded retry and an in-flight deduplication map.
- Cache entries use SHA-256 plate keys, a 48-hour default TTL and a 250-entry in-process cap.

## Privacy decisions

- The customer interface uses `POST`; it does not put a plate in an indexed result route.
- No plate-specific pages, canonicals or sitemap URLs exist.
- No plate is written to `localStorage`, `sessionStorage` or analytics events.
- No owner identity or personal data is requested or returned.
- The cache is ephemeral process memory. Its key is a SHA-256 digest; no database or durable plate log was added.
- The client receives only the normalized result DTO needed to display the check.

The existing backwards-compatible API `GET` handler remains available, but all NoordTune customer UI traffic uses `POST` to avoid browser-history query strings.

## Response measurements

Measurements were made locally against the production build, using an official public test record and POST requests. Network conditions can vary.

| Version | Request | Runtime | Body size |
| --- | --- | ---: | ---: |
| Before Vehicle Check V1 | Cold | 2.437 s | 726 B |
| Before Vehicle Check V1 | Warm | 0.212 / 0.185 s | 725 B |
| Vehicle Check V1 | Cold | 0.359 s | 3,553 B |
| Vehicle Check V1 | Warm | 0.0016 / 0.0013 s | 3,552 B |

The larger body is the intentional structured purchase-check result, not raw RDW data. The first response contained four bounded APK defect items, no open recall and six explicit source statuses. Cache hits returned the same result without another upstream call.

## SEO routes

- Dutch: `https://power.noordtune.nl/nl/kentekencheck`
- English: `https://power.noordtune.nl/en/vehicle-check`
- Polish: `https://power.noordtune.nl/pl/sprawdz-auto`

Each route has a localized canonical, matching `nl`/`en`/`pl` alternates, Open Graph/Twitter metadata and `WebApplication`, `BreadcrumbList` and `FAQPage` structured data. The sitemap intentionally changes from 291 to 294 unique absolute URLs.

## UI and state summary

- Vehicle identity appears first.
- Purchase attention summary and deterministic signals follow.
- Registration, APK, odometer, recall, vehicle, fuel/environment and recent defect details are grouped into readable panels.
- The existing exact-match/manual-review tuning flow, Pricing V2 calculator and tuning WhatsApp quote follow the purchase check.
- A separate purchase-inspection CTA asks NoordTune to inspect diagnostics, fault codes, live data and technical condition.
- NL, EN and PL landing/result copy was checked at 320, 360, 390, 430, 768, 1024 and 1440 px with no document-level horizontal overflow.

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
- Auxiliary dataset availability and completeness remain controlled by RDW.
- A physical inspection price is intentionally not published in V1.
