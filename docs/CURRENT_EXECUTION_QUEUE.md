# Current Execution Queue

Last updated: 2026-10-03

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally a short atomic queue, not a historical log; completed detail belongs in Git history, PRs and task-specific docs.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **The user-facing site now has a Phone-first product identity.** PR #340 released task-first decision shortcuts; PR #342 (`e5f902250921eaa232779104bdfb4c37c6a0c3ac`) makes Phone Radar the homepage first-screen identity and upgrades the Phone hub first screen into a Buy / Keep / Verify / Recover decision surface. Eval Gate #1032 passed; production deployment `dpl_DLHuWXRtAJhxc3vPd7gtVaiFxwPB` is READY; homepage, Phone hub and the new isolated visual stylesheet returned HTTP 200. Browser QA passed route search, route-family tabs and a live decision shortcut with no reproduced overlap or horizontal overflow.
3. **Backend database coverage and public/SEO publication remain separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
4. Current Phone state is **135 comparison routes / 134 canonical normalized routes / 123 comparison↔canonical route-ID overlaps / 12 legacy-only comparison route IDs / 3 indexable routes**.
5. The backend database is **not complete**. Continue reviewed coverage expansion toward roughly **90%+ of the relevant low-cost route universe** while provenance and maintenance stay tractable.
6. **Data-eSIM remains a separate normalized backstage family.** PR #328 preserves **59 source-label providers / 72 evidence records / 159 versioned offers** under `data/esim/v1`; it is not Phone canonical data, not a production frontend input, and has no public/indexable surface.
7. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.
Data-eSIM backstage contract: `data/esim/README.md` + `data/esim/v1/manifest.json`.

## JUST COMPLETED — Phone-first homepage + Phone Radar visual identity

PR #342 is a bounded frontend product-identity and visual-quality release. It does not change the database, schema, backend, public URL families, sitemap policy or indexability.

Released behavior:

- homepage first screen now immediately identifies the product as **Phone Radar** instead of the older generic AI interruption framing;
- homepage H1 is **“Choose a phone number you can actually keep.”** and explains acquisition cost, keep cost, overseas SMS/OTP, signup friction and current evidence;
- first-screen task panel surfaces lowest keep cost, ChatGPT/OpenAI evidence, longest keep window and recently checked routes;
- Phone Radar H1 is **“Find a real phone route that still works later.”**;
- Phone hub explains the four decisions explicitly: **Buy / Keep / Verify / Recover**;
- existing three route families, global search, market filter, sorting, deep evidence, comparison behavior and task-first decision shortcuts remain intact;
- a separate responsive/dark-mode visual layer gives the homepage and Phone hub a restrained data-product identity without triggering an Astro rewrite or broad redesign.

Verification:

- PR #342 squash merge: `e5f902250921eaa232779104bdfb4c37c6a0c3ac`;
- Eval Gate #1032: PASS;
- Vercel production deployment `dpl_DLHuWXRtAJhxc3vPd7gtVaiFxwPB`: READY;
- apex homepage: HTTP 200 with new Phone-first title/H1;
- production Phone hub: HTTP 200 with new H1 and Buy / Keep / Verify / Recover panel;
- production `/media/phone-first-identity.css`: HTTP 200;
- browser preview QA: homepage layout PASS; Phone route search PASS; three route-family tabs PASS; lowest-keep-cost decision shortcut PASS; no reproduced text overlap/clipping/horizontal overflow at the checked desktop viewport;
- build/release boundary remains **135 comparison / 128 canonical / 3 indexable / 31 sitemap URLs**.

Do not immediately redesign again. Let this baseline gather behavior/search evidence; repair only a reproduced usability or visual defect.

## JUST COMPLETED — Phone Radar task-first decision shortcuts

PR #340 adds a bounded decision layer to the existing Phone canonical without adding pages or changing the data/publication contract.

Released shortcuts:

- **Lowest keep cost** — ranks non-HOLD routes with a known yearly keep cost using the stored CNY comparison value.
- **Longest keep window** — ranks non-HOLD routes by the documented keep-alive interval.
- **ChatGPT evidence** — exposes routes with normalized OpenAI/Codex community reports; report counts are evidence samples, not invented OTP success percentages, and HOLD routes remain visibly marked.
- **Recently checked** — ranks non-HOLD candidate routes by latest stored verification date, then source count.

The cards show market, network, SIM type, acquisition cost, yearly keep cost, keep window, verification date, evidence state/source count and route state, then open the existing deep route evidence flow. Deep global evidence is still loaded progressively rather than embedded into initial HTML.

## JUST COMPLETED — Backend database coverage DB-C15

DB-C15 released in PR #348 (`6bd972ffa7c40642de29a4a9a996736601080c5a`). Final disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `smarty-uk-2026` — ADMIT-BACKSTAGE; current SMARTY evidence establishes a GBP6 rolling voice entry plan, eSIM, no credit search, supported payment methods, paused incoming calls/texts, a 220-day inactive-account closure threshold and free incoming SMS in mainland China. Paused-plus-roaming behavior is not guaranteed, and 60 consecutive days abroad can trigger full-service suspension.
- `movistar-pre-pe-2026` — HOLD; current Movistar Peru evidence establishes an active prepaid product, S/5 recharge floor, a seven-month no-recharge cancellation threshold and foreign-national in-person biometric requirements. Prepaid-specific overseas incoming SMS / mainland-China / OTP behavior and reliable foreign-card execution remain unresolved.
- `talkmobile-uk-payg-closed-2026` — HOLD / negative knowledge; PAYG closed on 31 August 2017. Current Talkmobile SIM-only subscriptions are a different product and are not substituted into the dead PAYG route.

Released backend state: **134 routes / 80 markets / 131 brands / 105 networks / 491 sources / 123 comparison overlaps / 12 legacy-only route IDs / 3 indexable**. CI #215 and Eval Gate #1044 passed. Vercel production deployment `dpl_2R2BiBiCEdRKSaBEb4vVRYH96YAH` is READY on merge `6bd972ffa7c40642de29a4a9a996736601080c5a`. Live apex, Phone canonical and sitemap return HTTP 200; sitemap remains 31 URLs and all three DB-C15 standalone route URLs return 404.

## NEXT — Backend database coverage DB-C16

Bounded batch: `mint-mobile-us-2026`, `tmobile-prepaid-connect-2026`, `visible-25-2026`.

Definition of done:

- reverify current product identity and whether the route still exists/is purchasable;
- reverify lifecycle / keep-alive economics;
- reverify foreign-user KYC and acquisition path;
- reverify overseas SMS / OTP / roaming behavior;
- reverify payment constraints;
- preserve source provenance, uncertainty and reviewed admission states;
- pass the canonical importer/QC and existing Phone regression gates;
- **no public URL, sitemap or indexability change**.

Stop conditions:

- source conflict that cannot be reconciled conservatively;
- same-product alias collision;
- missing evidence that makes admission unsafe;
- provider/account blocker that requires authorization or payment.

Keep `sakura-mobile-voice-2026` excluded; it remains the known same-product alias blocker for canonical `sakura-japan-voice-data`.

## PARALLEL — Community Data-eSIM evidence intake

The three reviewed snapshots remain normalized only through the explicit `data/esim/v1` manifest. Raw inbox snapshots remain immutable provenance inputs.

Continue to append price/mechanic versions without overwriting history. Preserve community/third-party/referral/promotion, IP/egress, FUP/throttle and voice/SMS/number uncertainty as evidence. Do not auto-publish, auto-rank or force pure data eSIM into Phone-number/retention canonical routes.

Delegated worker output remains `RESEARCH_CANDIDATE` until coordinator review. Worker failure never invalidates already captured evidence and never bypasses QC.

## Measurement wait

Search Console remains too small for another publication wave. Finalized data through 2026-09-28 shows **5 Phone impressions / 0 clicks**; fresh 2026-09-29..30 adds **5 non-finalized impressions / 0 clicks** and no route-detail row.

Re-read when either:

- settled Phone impressions reach **20**, or
- finalized data reaches **2026-10-05**.

This wait does **not** block DB-C16 or community evidence acquisition.

## External waits

- TikTok — base application Live; targeted Direct Post remediation and the required genuine `SELF_ONLY` publication proof are complete. The Content Posting API reapplication for app `7686819988157810696` was submitted on 2026-10-02 with the real 28-second demo video; the portal confirmation says review may take approximately 2–4 weeks. Do not claim approval and do not submit again unless TikTok rejects or requests new evidence. See `docs/TIKTOK_DIRECT_POST_AUDIT_2026-10-02.md`.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify any claimed citation/link independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not trigger another broad frontend redesign without measured behavior or a reproduced UX defect;
- do not treat backend admission as authorization for SEO/indexable pages;
- do not bulk-admit the remaining 12 legacy-only route IDs without provenance + QC;
- do not duplicate same-product aliases;
- do not manufacture ranking/recommendation confidence from sparse evidence;
- do not auto-publish or rank Data-eSIM community evidence;
- do not redesign the backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
