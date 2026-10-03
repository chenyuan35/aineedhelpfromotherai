# Current Execution Queue

Last updated: 2026-10-03

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally a short atomic queue, not a historical log; completed detail belongs in Git history, PRs and task-specific docs.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **The user-facing site now has a Phone-first product identity.** PR #340 released task-first decision shortcuts; PR #342 (`e5f902250921eaa232779104bdfb4c37c6a0c3ac`) makes Phone Radar the homepage first-screen identity and upgrades the Phone hub first screen into a Buy / Keep / Verify / Recover decision surface. Eval Gate #1032 passed; production deployment `dpl_DLHuWXRtAJhxc3vPd7gtVaiFxwPB` is READY; homepage, Phone hub and the new isolated visual stylesheet returned HTTP 200. Browser QA passed route search, route-family tabs and a live decision shortcut with no reproduced overlap or horizontal overflow.
3. **Backend database coverage and public/SEO publication remain separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
4. Current Phone state is **135 comparison routes / 145 canonical normalized routes / 134 comparison↔canonical route-ID overlaps / 1 comparison ID without a same-ID canonical row / 3 indexable routes**. The remaining ID is `sakura-mobile-voice-2026`, intentionally excluded as a same-product alias of canonical `sakura-japan-voice-data`.
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

## JUST COMPLETED — Backend database coverage DB-C19

DB-C19 is released. Final disposition: **0 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `digicel-jm-2026` — HOLD; current Digicel Jamaica terms establish a four-month no-usage deactivation rule and new-number assignment after reactivation. Current visitor acquisition, international top-up and China roaming exist, but the exact qualifying activity that resets the four-month clock is not defined, so no minimum annual keep-alive cost is invented.
- `tigo-tz-2026` — HOLD; the stable legacy Tigo route ID now maps to current Yas Tanzania rather than duplicating the rebranded product. Current Yas terms allow suspension/number re-allocation after 90 days of continuous non-use and current roaming lists China, while TCRA visitor registration is scoped to non-citizens staying no more than four months. A durable foreign-user keep-number path is not established.

Released backend state: **145 routes / 86 markets / 142 brands / 112 networks / 547 sources / 134 comparison overlaps / 1 comparison ID without a same-ID canonical row / 3 indexable**. The remaining ID is the intentional Sakura same-product alias blocker. PR #356 squash-merged as `f9c151b8a33d3edc1160893977a5c6c60d99a361`; CI #224 and Eval Gate #1059 passed. Vercel Preview `dpl_98FfZqhp1Uv4eVQFvRkXQXgEy4VT` and production `dpl_CtnXBiZ5cP19ggPFTYDbW1feJ1E8` are READY. Live apex, Phone canonical and sitemap return HTTP 200; sitemap remains 31 URLs and both DB-C19 standalone route URLs return 404.

## NEXT — Post-legacy Phone coverage-gap audit

Purpose: the comparison-to-canonical migration backlog is functionally closed. Before defining DB-C20, identify genuinely missing low-cost long-term number routes outside the existing 135-route comparison set instead of extending the database by provider-directory enumeration.

Definition of done:

- compare the current 145-route canonical set against current community/watcher evidence and known low-cost long-term number patterns;
- use community-first research for actual acquisition/retention/overseas-use evidence, then use provider sources only for current commercial/provider-controlled facts;
- dedupe same-product aliases, rebrands and already-covered acquisition paths against canonical before shortlisting;
- produce a bounded shortlist of at most five genuinely distinct missing routes with provenance, user-value reason, current product identity and the material unknowns that would affect admission;
- sample-audit at least three shortlisted candidates for source quality, duplication and unsupported inference;
- select at most three candidates for a later DB-C20 batch only if the evidence survives the audit;
- **no canonical admission, public URL, sitemap or indexability change in the audit itself**.

Stop conditions:

- no genuinely distinct candidate has current independent operational evidence;
- the apparent gap is only provider-directory coverage, stale/copied material or a duplicate/alias;
- evidence is too weak to justify a bounded follow-on batch;
- provider/account access would require authorization or payment.

Keep `sakura-mobile-voice-2026` excluded; it remains the known same-product alias of canonical `sakura-japan-voice-data`, not a missing product candidate.

## PARALLEL — Community Data-eSIM evidence intake

The three reviewed snapshots remain normalized only through the explicit `data/esim/v1` manifest. Raw inbox snapshots remain immutable provenance inputs.

Continue to append price/mechanic versions without overwriting history. Preserve community/third-party/referral/promotion, IP/egress, FUP/throttle and voice/SMS/number uncertainty as evidence. Do not auto-publish, auto-rank or force pure data eSIM into Phone-number/retention canonical routes.

Delegated worker output remains `RESEARCH_CANDIDATE` until coordinator review. Worker failure never invalidates already captured evidence and never bypasses QC.

## Measurement wait

Search Console remains too small for another publication wave. Finalized data through 2026-09-28 shows **5 Phone impressions / 0 clicks**; fresh 2026-09-29..30 adds **5 non-finalized impressions / 0 clicks** and no route-detail row.

Re-read when either:

- settled Phone impressions reach **20**, or
- finalized data reaches **2026-10-05**.

This wait does **not** block the post-legacy coverage-gap audit or community evidence acquisition.

## External waits

- TikTok — base application Live; targeted Direct Post remediation and the required genuine `SELF_ONLY` publication proof are complete. The Content Posting API reapplication for app `7686819988157810696` was submitted on 2026-10-02 with the real 28-second demo video; the portal confirmation says review may take approximately 2–4 weeks. Do not claim approval and do not submit again unless TikTok rejects or requests new evidence. See `docs/TIKTOK_DIRECT_POST_AUDIT_2026-10-02.md`.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify any claimed citation/link independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not trigger another broad frontend redesign without measured behavior or a reproduced UX defect;
- do not treat backend admission as authorization for SEO/indexable pages;
- do not bulk-admit the remaining legacy-only route IDs without provenance + QC;
- do not duplicate same-product aliases;
- do not manufacture ranking/recommendation confidence from sparse evidence;
- do not auto-publish or rank Data-eSIM community evidence;
- do not redesign the backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
