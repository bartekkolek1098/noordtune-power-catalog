# NoordTune SEO Factory NL — Exact Engine Enquiry Handoff (14-10-2026)

Baseline Power Catalog: f980a32d86b6eeed0def9ee4e3b995d96f166022 (PR #68). Main NoordTune WWW: 728648ffd246b60b731db4df41b9f3c843d0da62 (PR #27).

## Work completed
- The existing prefilled enquiry bridge for 100 commercial van engine pages now also supports 68 indexed Dutch engine profiles at `/nl/motoren/[slug]`.
- Each engine guide has an explicit **Offerteformulier voor deze motor** link opening the established WWW NL contact form.
- All 19 manually curated model-comparison hubs include the same exact-engine action on each engine card; choosing the quote button transfers that precise reviewed engine, not merely the model or an inferred model family.
- **Important collision fix:** some original `/nl/motoren/` slugs overlap `/nl/bedrijfswagens/motoren/` slugs. The enquiry contract retains `kind=engine` and v1 format, but approved passenger engine IDs use `auto-<published-slug>` internally. Existing van `kind=engine&id=<van-slug>` links are unchanged. The WWW parser needs no modification.
- The server accepts only a published passenger engine slug after the `auto-` prefix. It validates actual application-year membership (not just the min/max envelope) and returns an exact public label with no plate, VIN, customer data, free text, price or Stage 1 guarantee. Out-of-range or nonexistent engine IDs return 404.
- RDW selector, historical customer-result references, pricing, tuning figures, canonical, local sitemaps, external sources and legal emissions messaging remain unchanged.

## Release verification
- `pnpm test:catalog-handoff` checks all 68 passenger engines, the 100 existing van engines, 19 model hubs, year gaps, legacy slug collisions and negative input.
- `pnpm typecheck`, `pnpm test:seo`, `pnpm lint`, `pnpm build`, and local/production browser checks.
- `RDW_QA_URL=http://127.0.0.1:3136 pnpm qa:seo:nl-passenger-enquiry` tests local API, all 68 published engines, 19 model hubs, desktop/mobile, correct contact URLs and no unapproved identifiers.
- Post-deploy check: exact Vercel production commit and real browser handoff into live `www.noordtune.nl/nl/contact`, using only a public engine slug, never submitting a real message.

## Publication principle
This is conversion and internal-journey improvement, **not 68 newly created SEO URLs** and not a claim that Google has indexed or ranked them.
