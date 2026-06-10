# RDW Lookup Integration

## Endpoint

`/api/rdw-lookup`

Methods:

- `GET /api/rdw-lookup?kenteken=JFR80T`
- `POST /api/rdw-lookup` with JSON body `{ "kenteken": "JFR80T" }`

Debug:

- Add `includeRaw=1` to include raw RDW vehicle and fuel rows.

## RDW Datasets

The integration currently calls:

- Main vehicle dataset: `m9d7-ebf2`
- Fuel dataset: `8ys7-d773`

The service reads `RDW_APP_TOKEN` and sends it as `X-App-Token`. Socrata also supports the `$$app_token` query parameter, but the header avoids leaking tokens in logs.

## Response Shape

The public response includes:

- Plate, make, model, type, variant, execution.
- Fuel descriptions.
- Engine cylinders, displacement, kW, and calculated pk.
- Dimensions, weight, top speed.
- CO2 and emissions fields from the fuel dataset.
- First admission, first NL registration, and APK expiry.
- Optional internal tuning catalog match.

Example:

```json
{
  "source": "RDW Open Data",
  "cached": true,
  "cacheTtlSeconds": 172800,
  "vehicle": {
    "plate": "JFR80T",
    "make": "Renault",
    "model": "Twingo",
    "fuel": "Benzine",
    "engine": {
      "displacementCc": 1149,
      "powerKw": 75,
      "powerHp": 102
    }
  },
  "tuningMatch": null
}
```

## Caching

Current phase:

- RDW fetches use Next `fetch` revalidation with `RDW_CACHE_TTL_SECONDS`.
- A module-level in-process cache returns hot lookup hits immediately.
- API responses include `X-RDW-Cache: hit|miss`.

Production recommendation:

- Add Redis, Vercel KV, Supabase, or Upstash as a shared cache.
- Keep the same TTL, usually 24-48 hours.
- Store only normalized public fields unless diagnostics require raw rows.

## Errors

The route returns:

- `400 INVALID_INPUT` when the body/query is missing.
- `400 INVALID_PLATE` when the normalized plate is not 6 alphanumeric characters.
- `404 NOT_FOUND` when RDW returns no vehicle.
- `429 RATE_LIMITED` when an IP exceeds `RDW_RATE_LIMIT_PER_HOUR`.
- `502 RDW_UNAVAILABLE` when RDW returns a non-OK response.

## Disclaimer

The UI displays:

> Data uit RDW Open Data, alleen ter informatie. Tuningwaarden zijn indicatief tot NoordTune de exacte ECU en motorvariant bevestigt.
