# Tuning reference scope review — 15 September 2026

This correction separates applicability of a peak tuning estimate from exact ECU identification, access assessment and a commercial quotation. The reference layer adds no canonical records or public routes. All 24 existing public profiles retain their original stock and Stage figures, including their estimation provenance.

## Targeted references

| Reference | Stock peak values | Stage 1 peak estimate | Applicability and conditions |
| --- | --- | --- | --- |
| BMW 128ti F40 | 265 pk / 400 Nm; 195 kW corresponds to the registry fixture | 310 pk / 480 Nm | 1998 cc petrol, 128ti identity, F40 context; Mosselman specifies RON98. ECU/access remains unconfirmed. |
| Transit Custom 2.0 EcoBlue 105 | 105 pk / 360 Nm | 190 pk / 440 Nm | Transit **Custom**, 1995 cc diesel, approximately 77 kW; BR scope is the 2019–2022 generation. Boundary/delayed registration keeps the reference conditional. |
| Transit Connect 1.5 TDCi 100 | 100 pk / 250 Nm | 125 pk / 330 Nm | Transit **Connect**, 1499 cc diesel, approximately 100 pk; **pre-facelift TDCi reference only**. A 2018 registration does not identify the engine generation. |

The new profiles deliberately contain no numeric Stage 2 or Stage 3 result. Mosselman's Stage 2 headline and body disagree on torque; the new layer therefore adopts only its internally consistent Stage 1 data. Available Stage 1 data remains visible when higher stages lack reference values.

Only peak values are retained. No tuner images, measured curves, promises, warranties or prices are copied into the product. Any chart derived from these numbers is a catalog illustration, not a NoordTune measurement.

### Source and retrieval provenance

All references below were inspected on **2026-09-15**. BMW's two requested pages were read directly. The primary BR pages and several Ford historical pages/PDFs were readable through their search-index representation; direct opens intermittently failed or redirected. Their indexed primary content supplies the figures above; this is not a claim that every direct endpoint succeeded live.

- [BMW manufacturer launch specification](https://www.press.bmwgroup.com/united-kingdom/article/detail/T0318330EN_GB/the-new-bmw-128ti): model identity, stock power/torque and November 2020 launch.
- [Mosselman 128ti F40 reference](https://www.mosselmanturbo.com/nl/bmw-128ti-f40-265hp): Stage 1 peak values and RON98 condition.
- [Ford Transit Custom manufacturer brochure](https://www.ford.ie/content/dam/guxeu/ie/Documents/Brochures/CVs/BRO-New_transit_custom.pdf): EcoBlue 105 PS / 77 kW / 360 Nm stock configuration.
- [BR-Performance Transit Custom reference](https://www.br-performance.be/fr-be/reprogrammation/1-voitures/23-ford/12695-transit-custom/14309-i-facelift-2-2019-2022/23049-2-0-ecoblue/): scoped Stage 1 estimate.
- [Ford's 2015 Transit Connect release](https://media.ford.com/content/fordmedia/feu/gb/en/news/2015/06/01/ford-delivers-class-leading-fuel-efficiency--segment-first-techn.html): the 1.5 TDCi 100 PS / 250 Nm configuration and replacement of earlier 1.6 TDCi engines.
- [BR-Performance Transit Connect TDCi reference](https://www.br-performance.be/nl-be/chiptuning/1-wagens/23-ford/12693-transit-connect/14273-ii-2013-2018/22985-1-5-tdci/): 2015–2018 TDCi scope and Stage 1 estimate.
- [Ford's 2018 Transit Connect engine change](https://media.ford.com/content/fordmedia/feu/gb/en/news/2018/07/06/new-ford-transit-connect-cuts-fuel-bills-for-operators-by-up-to-.html): the new EcoBlue 75/100/120 PS range arrived in mid-2018. This overlap prevents engine identification from registration year alone.
- [BMW's fourth-generation 1 Series launch](https://www.press.bmwgroup.com/global/article/detail/T0442625EN/the-all-new-bmw-1-series): the successor generation launched in 2024; the reference remains scoped to F40, with registration dates used as context.

## The 2018 Connect exception

The sanitized RDW facts establish the full Transit Connect identity, 1499 cc diesel and 73.5 kW. They do not independently decode the opaque type/variant into TDCi versus EcoBlue. The resolver does not infer an engine code from the variant prefix and does not use a registration cutoff to claim the earlier engine.

The result is a **conditional pre-facelift 1.5 TDCi reference**, explicitly labelled before applying its 125 pk / 330 Nm estimate. Meaningful documented engine identification can clear that specific condition. Explicit EcoBlue identification rejects this TDCi reference and returns `CONNECT_ECOBLUE_REFERENCE_UNAVAILABLE`; another engine is never substituted.

## Individual retained catalog limitations

### BMW G20/G21 320i

The existing source retains 270 Nm stock torque. The [BMW 2019 Touring specification](https://www.press.bmwgroup.com/poland/article/attachment/T0297058PL/432766) lists 300 Nm for the 1998 cc / 184 hp configuration. The source numbers remain unchanged as requested. `SOURCE_STOCK_TORQUE_DISCREPANCY` and a visible profile condition flag the retained torque and derived gains for a separate source correction. This issue does not hide every Stage.

### BMW F20/F21 118i

The public profile is based on a 2016 generated source with an unspecific engine label. Its plate applicability is limited to the later 1499 cc engine and remains conditional. The earlier 1598 cc / same-power version cannot inherit that estimate.

[BMW's March 2015 specification](https://www.press.bmwgroup.com/slovak/article/attachment/T0206606SK/298406) documents the earlier four-cylinder 1598 cc / 136 hp version. [BMW's summer 2015 update](https://www.press.bmwgroup.com/poland/article/detail/T0221323PL/zmiany-specyfikacyjne-w-modelach-bmw-w-lecie-2015?language=pl) documents the change to the three-cylinder 136 hp version from July. The profile exposes `ENGINE_DISPLACEMENT_SCOPE_1499`; equal power and first registration do not erase the displacement distinction.

### Other broad BMW engine labels

The server applies narrowly named public-model displacement constraints to broad source labels while preserving their peak figures: 118d/120d/318d/520d use the 1995 cc scope; 330d uses 2993 cc; G20/G21 320i uses 1998 cc. These constrain model applicability and do not identify a physical ECU. Supporting primary examples include [BMW 1 Series specifications](https://www.press.bmwgroup.com/slovak/article/attachment/T0206606SK/298406), [BMW 330d Touring specifications](https://www.press.bmwgroup.com/global/article/attachment/T0214827EN/347575), [BMW 520d specifications](https://www.press.bmwgroup.com/portugal/article/attachment/T0166908PT/291315), and the 320i manufacturer specification above.

## Behavioral verification

`scripts/test-tuning-estimates.ts` passes 19 executable cases, including:

- Every one of the 24 public profiles passes the actual identity resolver with compatible manufacturer/model/fuel/displacement/power/generation/year facts and retains all three numeric Stages: **72/72**.
- BMW 320d, Golf GTI, Golf R and manual Focus ST retain specific existing peak results.
- All three targeted references expose useful Stage 1 values independently of ECU status or quotation state.
- BMW 320d Stage 2 retains 245 pk / 520 Nm when its vehicle-specific advanced-unlock commercial scope is on-request.
- Wrong Ford families, fuel, displacement, stock power and established generation remain rejected.
- Equivalent copies collapse; different output profiles remain unresolved.
- Existing fuel rules exclude diesel-only services from the petrol reference and petrol-only services from diesel references; unknown reference transmissions enable no TCU option.
- Missing critical identity and explicit Connect EcoBlue evidence produce specific unavailable reasons rather than a misleading customer-vehicle conflict claim.
- All three references are accessible through manual quick search and brand/model/year/engine selection. A bounded `mode=reference` API fetch supplies the same profile and scoped quote to the inline consumer, without a public vehicle route or unrelated partial-match fallback results.

The suite is included in `pnpm test:tuning`. Full UI/build/audit evidence and proposed local commercial assignments are recorded in the main corrective review.
