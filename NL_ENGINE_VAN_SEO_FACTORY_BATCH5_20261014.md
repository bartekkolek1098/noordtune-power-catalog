# NoordTune SEO Factory NL — batch 5, 14 October 2026

Previous production: `99bbca876367b89be285c6afba647a52af3af1d2` (PR #69).

## Scope of this publication
- **Five new individually authored Dutch Stage 1 engine guides** from already reviewed source records:
  - SEAT Leon II 1P 1.4 TSI 125, 1390 cc / 92 kW, 2009–2011
  - SEAT Leon III 5F 1.0 EcoTSI 115, 999 cc / 85 kW, 2015–2020
  - Nissan Juke F15 1.2 DIG-T 115, 1197 cc / 85 kW, 2014–2019
  - Skoda Octavia II 1Z 1.4 TSI 122, 1390 cc / 90 kW, 2009–2013
  - Skoda Octavia III 5E 1.4 TSI 140, 1395 cc / 103 kW, 2013–2015
- **Two manually written model-generation comparison hubs**, SEAT Leon 1P versus 5F and Skoda Octavia 1Z versus 5E, containing separate RDW factory specs, technical differences, workshop considerations, two new FAQs each and links to the appropriate engine guides.
- **One exact commercial van engine guide** for Volkswagen Caddy 2KN 2.0 TDI 140 / 103 kW from 2013–2014, segregated from the already published 2015 Caddy identity.
- New profiles retain individually authored intros, workshop checks, generation-specific cautions and two distinct FAQ answers. Source values and independent tuner links are *inherited from previously reviewed applications*, not invented and not represented as NoordTune dyno results.
- Source-reviewed Wikimedia Commons Skoda 5E-generation image with attribution, and existing appropriately matched, CC BY 3.0 Caddy 2KN-generation image. A Seat 5F *Cupra* photo was deliberately not used for the ordinary 1.0 EcoTSI because the pictured trim is not the described vehicle.
- SEO-only technical identity overlays for the five older profiles. The historic RDW resolver and original reviewed records are left unchanged. Every added model/kW/type/cc/year constraint is traced to already existing frozen purposive RDW test fixtures and independent Stage 1 sources; there are explicit negative generation checks.
- Existing vehicle and van browsing, RDW, exact-engine prefilled enquiry, pricing, other languages, Stage 2/3 caution, and road-compliant SCR/DPF/AdBlue are preserved.

## SEO and test expectations
- NL engine pages: 68 -> **73**; van engine pages: 100 -> **101**; NL model comparison hubs: 19 -> **21**; official Stage 1 pages under these groups from existing evidence only.
- New canonical URLs: 5 passenger engines + 2 model hubs + 1 commercial van engine = **8**.
- Total canonical sitemap URLs: 435 -> **443**; no duplicate EN/PL pages or inflated index claims.
- The 129 audited base van RDW applications are unchanged; source links and pre-existing vehicle stage figures are unaffected.
- `scripts/test-nl-legacy-engine-scope.ts` verifies all five exact SEO scopes, separation from original RDW applications, source requirements and two hubs, plus Caddy generation.
- Existing RDW test suites for Seat Leon 1P, Skoda 1Z/5E and the two 85 kW Leon/Juke profiles pass their frozen test fixtures and adversarial negatives.
- Release gate: `pnpm typecheck`, `pnpm test:seo`, `pnpm test:catalog-handoff`, `pnpm lint`, `pnpm build`; local production Playwright for all NL engine/model/van and sitemap routes. Deploy only with exact GitHub/Vercel SHA, then HTTP 200, canonical and sitemap production checks.

## Exclusions
- BMW 118i F40 source record lacks the independent directly retrievable tuner-page scope required by the NL SEO whitelist.
- Caddy 1.4 TGI/CNG is not a normal petrol/diesel Stage 1 publication and must receive separate fuel-specific review.
- Neither 2015 Caddy 140 nor 2020+ Leon/Octavia/Juke sibling motors inherit another generation's public tuning figures.
- The indexable URL count is **not** a claim about Google indexing or ranking.
