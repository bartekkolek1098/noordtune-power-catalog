# NoordTune — Traffic, Indexability and Conversion Measurement Audit (2026-10-16)

## Scope and limitations
- Requested priority: Dutch customer acquisition, not mass production of more unverified engine pages.
- Public production baselines: `www.noordtune.nl` commit `bc7d7ae946e1a90e4632862d02781a1e0e56778a` (PR #31); `power.noordtune.nl` commit `a97270b4262d743e0f909abd6819fbce40719f23` (PR #74).
- GSC Wizard connected integration returned `payment_required` for account and property listing. As a result **no trustworthy Search Console indexed-URL counts, impressions, organic clicks or ranking queries can currently be read**. GSC is a separate, free first-party Google tool at https://search.google.com/search-console; the third-party paid integration is *not required* for the owner to use it.
- Both public `robots.txt` point to their own sitemaps and allow crawl; Power sitemap baseline 484 candidate canonical URLs, **not 484 proven Google-indexed URLs**.
- The power project had no Analytics component, despite a successfully served Vercel `/_vercel/insights/script.js` endpoint; before this release, Vercel Web Analytics returned 0 recorded pageviews/visitors for the Power project. This is **a tracking gap, not evidence of zero users**.

## Vercel Web Analytics — observed baseline
Aggregation queried directly from the authorized Vercel API on 2026-10-16, production scope.
- For `www.noordtune.nl` across 2026-09-18 through 2026-10-16 inclusive, `visits/count` returned **96 recorded visitors and 205 pageviews**. These numbers **may include automated browser QA and owner testing**, so they are not verified organic leads.
- `events/count` returned **4 tracked `power_catalog_click` events** for that inclusive interval and **0 `appointment_whatsapp_handoff` / `appointment_email_handoff` events**. These are event counts, not proved phone calls or new customer enquiries; client-side handoff events can be missing.
- `visits/aggregate` for settled data through 2026-10-16T01:00Z (a shorter window than the inclusive count) showed `/pl` at **51 views**, `/nl` **24 views**, `/en` **11 views** and the NL commercial van service route **9 views**.
- Aggregated referrer hostnames for the shorter settled window included `power.noordtune.nl` (**21 recorded WWW pageviews**), `google.com` (**12 recorded pageviews**), `bing.com` (**15 recorded pageviews**), and a large direct/unattributed bucket (**129 pageviews**). Referrer data does **not** establish which Google search terms generated clicks or whether arrivals were organic. The testing environment can contribute to these counts.
- Vercel custom-event aggregate across the shorter settled window showed **3 `power_catalog_click` events**, by source **2 `homepage_hero` and 1 `site_cta`**. Different observation windows explain why this differs from the count endpoint's 4 events. No contradiction about traffic should be inferred.

## Improvement implemented (Power Catalog)
- Add `@vercel/analytics@2.0.1` and mount one `<Analytics />` in the Next.js root layout. Privacy-oriented Vercel Web Analytics does not require a cookie and automatically strips query strings from its pageview presentation; do not attach any user input or plate to events.
- Add strictly whitelisted `catalog_enquiry_click` and `catalog_whatsapp_click` **click-intent** events to the most important customer actions. Exactly two attributes allowed: `locale` and fixed coarse `source`. Sources identify a passenger engine, business engine, manual selection, RDW profile, floating/mobile/header/vehicle WhatsApp buttons. They never carry a vehicle slug, VIN, number plate, search text, email, customer details, quotation contents or public URL.
- Exact-engine quote link keeps the existing server-validated `catalog-v1` hash handoff and behavior. Replace `rel=noreferrer` with `rel=noopener`, set explicit `referrerPolicy=origin` **only on the trusted catalog-to-WWW quote link**: the WWW can now attribute a referral to the Power origin but can never receive a plate, full URL path, year or query in the Referer header. External WhatsApp anchors retain `noreferrer`.
- Analytics is best effort: no tracking error may interrupt the user's real quote or WhatsApp action.
- The WWW site already has its own `@vercel/analytics@2.0.1` and event tracker; no WWW code change in this release.
- Vercel custom events are a product feature whose availability can depend on the project/team plan. Publishing code does **not** itself guarantee that custom events are billable/enabled. Verify Web Analytics is enabled in the Power project dashboard and check aggregate metrics after real users visit.

## Verification/release plan
- Unit/contract test `pnpm test:catalog-analytics`: one tracking script, two event names, eight predefined sources, exactly two eventData properties, 13 hostile/PPI input cases rejected, public quote link identity/URL/referrer policy intact.
- Existing `pnpm test:catalog-handoff`, `pnpm test:seo`, `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- Local Chrome QA `RDW_QA_URL=http://127.0.0.1:3161 pnpm qa:analytics:catalog`: three exact-engine paths, expected quote IDs and coarse attributes, tracked main WhatsApp CTAs, script load, responsive 320/390/1440; actual cross-domain Mercedes Sprinter quote handoff preserving `document.referrer` as origin-only and correct WWW prefill. Send no contact messages.
- After GitHub preview READY and merge, Vercel Production READY exact SHA + aliases power.noordtune.nl; repeat live browser test. Verify baseline analytics API after release; don't overclaim immediately if count stays 0 due dashboard setup or data lag.
- Rollback before release tag on prior power catalog main.

## Business next steps (data-driven)
1. Compare landing-page traffic per engine/van comparison and click-intent events over at least 7-14 real-user days, excluding local QA/owner traffic where possible.
2. Native Search Console: add or inspect verified `sc-domain:noordtune.nl` property covering www + power, submit both actual sitemaps and inspect a statistically meaningful NL page sample. This cannot be confirmed without accessible GSC property credentials.
3. Use actual high-impression, underperforming Dutch queries to choose further vetted Stage 1 engine coverage and original workshop case content.
