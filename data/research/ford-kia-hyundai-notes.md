# Ford and Kia/Hyundai research scope

## Captured facts

- 35 distinct Ford and 40 Kia/Hyundai Shiftech application tables were retrieved. Each observation preserves the published stock and Stage values. The explicitly labelled 48V Sportage is retained as mild-hybrid evidence and excluded from ordinary ICE runtime acceptance.
- Three independent Unlimited Tuning counterparts were reviewed: Transit EcoBlue 105, Ceed 1.4 T-GDI 140, and Sportage QL 1.6 T-GDI 177. Their category pages establish the narrower year scopes. The second provider does not create another vehicle profile.
- Unlimited's Normal programme is recorded as Stage 1 with that mapping stated. Xtreme and Stage 1+ values remain separately labelled notes. They are never relabelled Stage 2. The Ceed page explicitly publishes Stage 2 and specifies supporting exhaust hardware.
- Two fetched official Kia releases validate stock/powertrain context. They do not supply tuning figures or identify the ECU or transmission of an individual vehicle.

## Applicability limits

- Shiftech usually publishes a generation start, not an engine introduction date or final model year. Raw observation end years remain absent. Separate generation-boundary evidence conservatively bounds applicability using the next published generation start.
- Connect TDCi and EcoBlue stay separate. The provider's 2016 EcoBlue generation label is not proof of a 2016 EcoBlue engine. TDCi pages explicitly labelled EU5 do not establish applicability to an unknown Euro VI engine. The Unlimited Connect comparison lacks a fetched exact generation band, so no accepted identity was invented for it.
- Sportage NQ5 136 PS pages disagree: the 2021-labelled page lists stock 320 Nm and Stage 1 150 PS/360 Nm, while the 2024-labelled page lists stock 280 Nm and Stage 1 160 PS/340 Nm plus Stage 2 170 PS/360 Nm. These are retained separately, with an applicability discrepancy requiring review.
- Kia's official European 2021 release distinguishes 180 PS combustion-engine output from HEV 230 PS and PHEV 265 PS system outputs. It also identifies 150/180 PS mild-hybrid petrol options and a 136 PS diesel option with mild-hybrid technology. Missing electrification detail in tuner rows remains unknown.
- Sportage 177 Stage 1 torque and Ceed 140 Stage 2 power materially differ between the independent providers. Source values are preserved so consensus can select conservatively and request owner review.

## Retrieval

Direct Shiftech HTTP returns a JavaScript shell. The application facts were captured from actual rendered public page opens; each observation's SHA-256 hashes the privately cached rendered text. HTTP status is omitted when that renderer did not expose it. Raw rendered text and direct HTTP bodies remain under `.git/tuning-dataset-v1`, outside committed artifacts.

BR returned a Cloudflare 403. Celtic had an existing shared 403 stop. Neither provider was retried through an alternate domain, proxy or browser bypass. Their search snippets were not accepted as factual tuning evidence. Ford Media's old 2015 URL redirected to its current home page; the 2018 page timed out and the shared fetcher could not establish a usable robots policy. Those attempts were not presented as retrieved manufacturer evidence.
