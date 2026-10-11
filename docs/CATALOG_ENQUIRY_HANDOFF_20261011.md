# Public engine selection -> NoordTune enquiry (v1)

## Scope
Additive secondary form link; existing direct WhatsApp calls, RDW normalization, tuning references, prices, all SEO model/engine routes and sitemap contents remain unchanged.

The link carries only `kind`, registered public catalog `id`, and optional selected `year` in a versioned URL fragment. It never carries registration/VIN, raw RDW rows, user-entered text, price or a promised tuned output. The main site clears the fragment after parsing and looks up a trusted short engine label. The public endpoint `/api/enquiry-context` resolves only existing catalog entities, rejects mixed identifier namespaces and years outside scope, and does not fetch RDW. Invalid syntax returns400; unknown references return404.

Kinds: `manual` for taxonomy/reviewed manual selector IDs; `profile` for strictly reviewed RDW applications; `engine` for NL van-engine editorial slugs. General destinations preserve NL/EN/PL; Dutch engine landing pages can go to the business enquiry. Missing-source vehicles can still generate a public manual enquiry reference without inventing a Stage1 result.

## Receiver contract
`noordtune-www` uses the identical `catalog-enquiry-contract.ts`, a fixed-host server proxy and abortable browser request. Form defaults to advice, never an automatic package, filled question, sent enquiry or confirmed booking. User edits win over delayed prefill. Upstream failure leaves the contact form usable.

No database, environment secret, cookie-based identity, advertising spend, provider billing plan or project protection changes are needed.

## Checks and reproducibility
- `pnpm test:catalog-handoff`: five grouped tests cover BMW/year, all100 van-engine pages, all198 reviewed application IDs, all15 reviewed manual-van families and unsafe/unknown reference rejection.
- Existing lookup-privacy and manual-selector tests passed; no matching or power data was changed.
- Run `node --no-warnings scripts/prepare-catalog-handoff-qa.cjs <output-json>` from this repository to generate only synthetic browser fixtures. No RDW call is made.
- Main-site browser test uses `HANDOFF_FIXTURES` for that file, `HANDOFF_WWW_BASE`, `HANDOFF_CATALOG_BASE`, `HANDOFF_QA_OUT`. `HANDOFF_LOCAL_BRIDGE=1` explicitly routes the receiver request to a local catalog endpoint for pre-deployment tests; it is NOT verification of the deployed server-to-server proxy. Production tests must unset it.
- `HANDOFF_RECEIVER_ONLY=1` scopes a test to received links/form behavior and omits actual catalog-navigation checks. Full tests must unset it.

## Release gate and local build caveat
The local Windows Next build prints success but omits localized prerenders from its generated manifest. A clean isolated build of the original production UI reproduced the same condition (only3 nonlocalized static routes), so local catalog HTML browser success is NOT asserted. No runtime or security setting was relaxed to hide this. Require an actual fresh Git-linked hosted preview, correct commit and public-route checks before publishing catalog links. Main receiver local browser tests are separate from that gate.

Coordinate both repositories: validate receiver/contract first, confirm catalog endpoint compatibility, release in a safe order and verify the complete public flow. Keep independently tagged previous production SHAs. Public success/failure events and WhatsApp/email handoffs are not received leads or bookings; actual dashboard collection and account entitlement are separate from unit-tested event construction.
