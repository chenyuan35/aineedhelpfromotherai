# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-10-03

This file is the compact current-facts source for the project. Historical execution detail belongs in task-specific docs, PRs, Git history and the Google Docs journal. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

After reading `AGENTS.md`, read this checkpoint before any deeper project inspection. Do not rescan the whole repository, VPS fleet, deployment history or old chats unless this checkpoint is stale, contradictory or the selected task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product direction | **STRATEGY RESET ACCEPTED 2026-09-23.** Search volume, rankings and technical polish no longer choose the product. Both official-source substitutability and independent-competitor substitutability are mandatory gates. Reset has been removed from primary site/discovery surfaces. | Active growth work stays on Phone Radar. Reset direct URLs remain preserved; Relay remains data-accrual only. |
| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / PHONE-FIRST SITE IDENTITY RELEASED.** PR #291 shipped the 135-route progressive global finder; PR #340 added task-first decision shortcuts; PR #342 (`e5f902250921eaa232779104bdfb4c37c6a0c3ac`) now makes Phone Radar the homepage first-screen product identity and upgrades the Phone hub first screen into a Buy / Keep / Verify / Recover decision surface. Eval Gate #1032 passed; Vercel production deployment `dpl_DLHuWXRtAJhxc3vPd7gtVaiFxwPB` reached READY; apex homepage, Phone hub and `phone-first-identity.css` returned HTTP 200. Preview browser QA also passed search, route tabs and a live decision shortcut with no reproduced overlap or horizontal overflow. | Keep the released frontend stable and measure behavior/search evidence before another public UX expansion. Continue backend evidence coverage independently. |
| Phone data / publication foundation | **DB-C20 RELEASED / BACKEND COVERAGE 148 ROUTES.** PR #360 (`c6f5ec5e34797745b1d6738ae8936a02510601c2`) normalized Vodafone NL Prepaid and One NZ Prepay as ADMIT-BACKSTAGE and CTExcel UK as HOLD, producing 148 routes / 86 markets / 145 brands / 114 networks / 565 sources. CI #226, Eval Gate #1069, Vercel Preview and production deployment `dpl_8dHPdkJX9RybHe9atEKd7bfNDuFT` passed. Live Phone hub is HTTP 200; all three DB-C20 standalone route URLs remain HTTP 404; sitemap remains 31 URLs and excludes the new backstage routes. | Do not manufacture DB-C21 from provider enumeration. Continue community evidence intake; re-open CMLink UK / DITO only on their documented evidence triggers, and make the next public Phone decision only when the Search Console trigger is met. |
| Phone evidence acquisition | **COMMUNITY-FIRST / NORMALIZED DATA-ESIM LAYER ACTIVE.** PR #327 captured the reviewed community snapshots; PR #328 (`f0057d6c0c067f42d5817bce7e2c17dc1cdfb3ee`) normalized them into separate backstage `data/esim/v1` tables. PR #362 (`86060c1d5e01f460d168005f74b6e3cd0c820478`) resolved the previously unknown public provenance of the existing 2026-10-01 user-supplied later-delta to Linux.do `ESIM流量漫游合集 4.0` through reviewed manifest-level `resolvedSource` metadata without mutating the immutable raw snapshot. Counts remain 59 source-label providers / 72 evidence records / 159 versioned offers; pure data eSIM remains outside Phone canonical routes and is backstage-only / not-public / indexability none. | Continue append-only community/forum evidence acquisition. Require separate reviewed identity-linkage/publication decisions before any Phone canonical or public/indexable use. |
| AI Reset Radar | **FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.** Seven-page value classification remains in the reset audit. | No Cursor-first optimization, no Q-015, no new generic reset pages and no generic Codex reset tracker. |
| Codex opportunity | Real demand exists, but current competitors already cover generic reset/history/countdown/quota jobs. | Competitor-gap research only; future build requires a narrower non-duplicative job. |
| Relay Exit Risk | **PRESERVE / DATA-ACCRUAL EXPERIMENT.** Product and methodology remain production-verified. | Continue legitimate historical snapshots/lifecycle accumulation. No search-led feature expansion without demand/usage evidence. |
| Search Console | **PHONE SAMPLE STILL TOO SMALL FOR PUBLICATION EXPANSION.** Windsor.ai finalized data is settled through 2026-09-28: 5 settled Phone impressions / 0 clicks. Fresh 2026-09-29..30 adds 5 non-finalized Phone impressions / 0 clicks; no route-detail row appeared. | Re-read when settled Phone impressions reach 20 or finalized data reaches 2026-10-05, whichever comes first. |
| Keyword research | Sep 23 evidence is sufficient for current direction; Ubersuggest hit daily quota, Ahrefs returned `Insufficient plan`, Semrush returned `no_api_units`. | Do not rotate accounts or upgrade/pay without authorization. |
| TikTok App Review | **BASE APP LIVE / DIRECT POST ADVANCED REQUEST RESUBMITTED — WAITING.** On 2026-10-02 the authorized production flow completed genuine `SELF_ONLY` Direct Post tests on creator `Ethereal` (`@healing...c`), TikTok returned terminal `PUBLISH_COMPLETE`, and the creator profile showed the posted review media. A 28-second real-flow MP4 was uploaded to the Content Posting API reapplication for app `7686819988157810696`, and the portal displayed `Your Application to request access to Content Posting API has been submitted!`. | Wait for TikTok review; the portal states approximately 2–4 weeks. Do not claim approval and do not submit again unless TikTok rejects or requests new evidence. See `docs/TIKTOK_DIRECT_POST_AUDIT_2026-10-02.md`. |
| Authority | **AIR-4 BATCH 2 SENT / WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. | Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; do not infer a link until independently verified. |
| Frontend foundation | The production static build now has a fail-closed Phone-first refinement stage plus isolated `phone-first-identity.css`. Figma was used as a visual-direction aid, but production truth remains the built/verified site. Astro/Tailwind remains a supporting foundation rather than a broad migration target. | Prefer bounded improvements on the existing canonical URL; do not redesign for its own sake. |
| Observer access | Qwen key-only SSH remains the verified observer-control path. The trial observer is disposable; `remote-desktop-commander.service` is not a reliable control channel. `codex-vps` remains a separate Relay-history host. | Do not repurpose `codex-vps`, `yuan` or `hermes`; keep valuable observer summaries off-host. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass provider blockers. |

## Immediate priority

Run two tracks in parallel without confusing them:

1. **User-facing Phone value:** the homepage and Phone canonical now present Phone Radar as the primary product. PR #342 is the current production visual/identity baseline; do not add another design layer or public URL merely to create visible activity. Measure real search/interaction behavior and fix only reproduced usability gaps.
2. **Backend evidence/database coverage:** DB-C20 is released at 148 canonical routes. No DB-C21 batch is selected. Continue append-only community evidence acquisition and only form a new reviewed batch when fresh evidence resolves a deferred route trigger or identifies a genuinely distinct low-cost route with current operational evidence; CMLink UK and DITO Philippines remain deferred.

Public publication remains a separate gate. Canonical/database admission does not create a route page, sitemap entry, market page or ranking claim.

## Current release baseline

- Phone comparison surface: **135 routes**.
- Phone normalized canonical: **148 routes / 86 markets / 145 brands / 114 networks / 565 sources**.
- Comparison↔canonical same-ID overlap remains **134**; DB-C20 adds three distinct post-legacy routes outside the 135-route comparison artifact.
- Comparison route IDs without a same-ID canonical row: **1** (`sakura-mobile-voice-2026`, intentionally excluded as a same-product alias of canonical `sakura-japan-voice-data`).
- Explicit indexable route pages: **3**.
- Data-eSIM backstage: **59 provider labels / 72 evidence records / 159 versioned offers**; PR #362 resolves public provenance for the existing Oct 1 later-delta without count or publication changes.
- Phone task-first decision shortcuts: **released in PR #340 / merge `60ff5457f2cc7982f0916b296427f0c1007c5c76`**.
- Phone-first homepage + Phone hub visual identity: **released in PR #342 / merge `e5f902250921eaa232779104bdfb4c37c6a0c3ac` / Eval Gate #1032 PASS / production `dpl_DLHuWXRtAJhxc3vPd7gtVaiFxwPB` READY**.

## Current execution sequence

1. **DONE — Global progressive Phone finder.** PR #291 exposes the admitted 135-route comparison layer on the existing canonical URL while preserving the 3-route SEO allowlist.
2. **DONE — Canonical backend coverage through DB-C19.** PR #356 leaves only the known Sakura same-product alias without a same-ID canonical row; all other 134 comparison IDs now overlap canonical. Publication boundary remains unchanged.
3. **DONE — Data-eSIM normalized backstage layer.** PR #328 keeps pure data eSIM separate from Phone-number/retention canonical routes and public/indexable surfaces.
4. **DONE — Phone task-first decision shortcuts.** PR #340 adds lowest keep cost, longest keep window, OpenAI/Codex evidence and recently checked views.
5. **DONE — Phone-first frontend identity / visual-quality release.** PR #342 changes the homepage first screen from generic AI interruption framing to Phone Radar, gives the Phone hub an explicit Buy / Keep / Verify / Recover value model, preserves the three route families/search/decision shortcuts, and leaves the public publication boundary unchanged. Eval Gate #1032 and production verification passed.
6. **DONE — DB-C14.** PR #346 normalized `ooredoo-hala-qa-2026` as ADMIT-BACKSTAGE and `claro-pre-cl-2026` / `claro-pre-co-2026` as HOLD.
7. **DONE — DB-C15.** PR #348 normalized `smarty-uk-2026` as ADMIT-BACKSTAGE and `movistar-pre-pe-2026` / `talkmobile-uk-payg-closed-2026` as HOLD.
8. **DONE — DB-C16.** PR #350 normalized `tmobile-prepaid-connect-2026` as ADMIT-BACKSTAGE and `mint-mobile-us-2026` / `visible-25-2026` as HOLD.
9. **DONE — DB-C17.** PR #353 normalized Cricket, Google Fi Flexible and Beeline Uzbekistan as HOLD.
10. **DONE — DB-C18.** PR #354 normalized Zain Kuwait eeZee and Omantel Hayyak as ADMIT-BACKSTAGE and BTC Bahamas as HOLD.
11. **DONE — DB-C19.** PR #356 normalized `digicel-jm-2026` and `tigo-tz-2026` as HOLD. Released canonical coverage is 145 routes / 86 markets / 142 brands / 112 networks / 547 sources with 134 comparison overlaps and the unchanged 3-route publication boundary.
12. **DONE — post-legacy Phone coverage-gap audit.** Five distinct missing routes were sample-audited. Vodafone NL Prepaid, CTExcel UK and One NZ Prepay were selected for DB-C20; CMLink UK and DITO Philippines were deferred. Audit only; no canonical/publication change.
13. **DONE — DB-C20.** PR #360 normalized Vodafone NL Prepaid and One NZ Prepay as ADMIT-BACKSTAGE and CTExcel UK as HOLD. Canonical is now 148 routes / 86 markets / 145 brands / 114 networks / 565 sources; publication remains 135 comparison routes / 3 indexable routes / 31 sitemap URLs.
14. **PARALLEL — community Data-eSIM evidence intake.** Append versions; do not overwrite provenance or auto-link ambiguous identities. PR #362 resolves the Linux.do public source for the existing Oct 1 later-delta without mutating raw evidence or changing counts/publication. No DB-C21 is selected from directory enumeration alone.
15. **WAIT — Search Console publication decision.** Re-read at 20 settled Phone impressions or finalized data through 2026-10-05. Until that trigger or a genuine new route-evidence trigger occurs, keep production stable rather than manufacturing a new main-track task.
16. **WAIT — TikTok Direct Post advanced review.** Targeted remediation, genuine production `SELF_ONLY` publication proof and one Content Posting API resubmission are complete. The portal says approximately 2–4 weeks; no repeat submission unless TikTok rejects or requests additional evidence. Authority follow-up remains a separate wait.

## Durable source pointers

- Product/value rules: `docs/PRODUCT_VALUE_GATE.md`
- Phone operating model: `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`
- Phone architecture: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`
- Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`
- Post-legacy coverage-gap audit: `docs/PHONE_POST_LEGACY_COVERAGE_GAP_AUDIT_2026-10-03.md`
- Data-eSIM contract: `data/esim/README.md` + `data/esim/v1/manifest.json`
- Current atomic queue: `docs/CURRENT_EXECUTION_QUEUE.md`
- Session contract: `docs/SESSION_EXECUTION_PROTOCOL.md`
- Authority/AI discovery: `docs/AUTHORITY_AND_AI_DISCOVERY.md`
- AI-native retrieval: `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`
