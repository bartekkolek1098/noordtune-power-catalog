# Local owner regression QA

`scripts/qa-v3-2-browser.cjs` accepts four comma-separated registrations through the **process environment** variable `NOORDTUNE_OWNER_QA_PLATES`, in the order of the owner cases in the request. Supply the values locally; do not put them in a source file, shell script, `.env` file or committed mapping.

Run a production build and start it on port 3120, then run `node --no-warnings scripts/qa-v3-2-browser.cjs`. `RDW_QA_URL` and `RDW_QA_OUTPUT` optionally override the URL/output directory. Reports strip registration fields and replace secret values with `OWNER-A` through `OWNER-D`, including error messages. Owner screenshots are disabled; optional screenshots use deterministic synthetic fixtures only. Historical browser entry points delegate to this suite.

With no owner variable, live owner checks explicitly report **SKIPPED**; the deterministic fixture suite still runs. Never interpret a skipped owner check as a live pass. The release gate `node scripts/check-owner-privacy.cjs` requires the four local values and an existing production build.

The browser suite validates POST transport and GET rejection, stage/quote content, DOM-before-click privacy, application requests and browser storage. It captures contact output after simulated clicks by replacing the browser opener; it does not open WhatsApp or send messages.

**Privacy contract:** Registration may be included only in the outbound WhatsApp message created after an explicit user contact action. It is not persisted or used in NoordTune-owned URLs, analytics or browser storage.

Historical feature commits may retain earlier artifacts. Only the current release tree is sanitized. The approved later release process uses squash merges; this task does not rewrite history or perform merges.
