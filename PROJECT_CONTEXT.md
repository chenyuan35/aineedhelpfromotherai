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
| Phone data / publication foundation | **DB-C23 RELEASED / 90%+ COVERAGE OBJECTIVE MET.** DB-C21 through DB-C23 extended the canonical backend to 156 routes / 86 markets / 153 brands / 116 networks / 593 sources. PR #368 (`2d0d727af1f18844b6c344a9402d62de5366dd61`) added eSIM.GG +372 and HK Mobi 365-day as backstage-only routes after DB-C22 added CMLink UK, DITO Philippines and AIS local as HOLD. `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md` reconstructs the known evidence-qualified universe at 159 distinct atomic routes, so current backend coverage is 98.1%. Public state remains 135 comparison routes / 3 indexable routes / 31 sitemap URLs. | Stop broad DB enumeration. Next audit whether all canonical data flows into the user-queryable frontend without making backstage rows indexable or recommendation-ranked. |
| Phone evidence acquisition | **COMMUNITY-FIRST / NORMALIZED DATA-ESIM LAYER ACTIVE.** PR #327 captured the reviewed community snapshots; PR #328 (`f0057d6c0c067f42d5817bce7e2c17dc1cdfb3ee`) normalized them into separate backstage `data/esim/v1` tables. PR #362 (`86060c1d5e01f460d168005f74b6e3cd0c820478`) resolved the previously unknown public provenance of the existing 2026-10-01 user-supplied later-delta to Linux.do `ESIM流量漫游合集 4.0` through reviewed manifest-level `resolvedSource` metadata without mutating the immutable raw snapshot. PR #364 (`569849dead592a35178f5fd7f7a13e5f5093aa20`) then added one dated multi-user USIMS availability/failure outcome snapshot from Linux.do without manufacturing a price offer. Counts are now 59 source-label providers / 73 evidence records / 159 versioned offers; pure data eSIM remains outside Phone canonical routes and is backstage-only / not-public / indexability none. | Continue append-only community/forum evidence acquisition. Require separate reviewed identity-linkage/publication decisions before any Phone canonical or public/indexable use. |
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
2. **Backend evidence/database coverage:** broad expansion is complete at 156 canonical routes and an audited 98.1% of the known evidence-qualified relevant route universe. Switch to maintenance plus a backend↔frontend integration audit; open another DB batch only on genuinely new evidence-qualified routes or cleared residual blockers.

Public publication remains a separate gate. Canonical/database admission does not create a route page, sitemap entry, market page or ranking claim.

## Current release baseline

- Phone comparison surface: **135 routes**.
- Phone normalized canonical: **156 routes / 86 markets / 153 brands / 116 networks / 593 sources**.
- Comparison↔canonical same-ID overlap remains **134**; DB-C20 adds three distinct post-legacy routes outside the 135-route comparison artifact.
- Comparison route IDs without a same-ID canonical row: **1** (`sakura-mobile-voice-2026`, intentionally excluded as a same-product alias of canonical `sakura-japan-voice-data`).
- Explicit indexable route pages: **3**.
- Data-eSIM backstage: **59 provider labels / 73 evidence records / 159 versioned offers**; PR #362 resolves public provenance for the existing Oct 1 later-delta, and PR #364 adds one dated USIMS community-outcome record without adding an offer or changing publication.
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
14. **DONE — DB-C21.** PR #366 normalized Fortress haha SIM as ADMIT-BACKSTAGE and csl 7-Eleven / Tune Talk 365 as HOLD. Post-release state: 151 routes / 86 markets / 148 brands / 114 networks / 574 sources; publication unchanged.
15. **DONE — DB-C22.** PR #367 (`a7feae58c048afc59af37a086292989cdd47e8fe`) normalized CMLink UK, DITO Philippines and AIS local prepaid as HOLD. Post-release state: 154 routes / 86 markets / 151 brands / 115 networks / 587 sources; CI #234, Eval Gate #1088 and Vercel passed.
16. **DONE — DB-C23.** PR #368 (`2d0d727af1f18844b6c344a9402d62de5366dd61`) normalized eSIM.GG +372 and HK Mobi 365-day as ADMIT-BACKSTAGE. Current state: 156 routes / 86 markets / 153 brands / 116 networks / 593 sources; CI #237, Eval Gate #1092 and Vercel production passed.
17. **DONE — Phone database 90%+ coverage audit.** `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md` defines the evidence-qualified denominator and records 156 / 159 = 98.1% current coverage. This is not a claim about every carrier/SIM SKU worldwide. Broad enumeration stops; residual candidates are LuckySIM HK, Saily U.S. phone number and China Telecom Macau / Macau blue-card.
18. **NEXT — backend↔frontend integration audit.** Verify whether all 156 canonical routes are available to the user-triggered finder/search path without manual frontend duplication. Preserve the 3-route SEO allowlist; distinguish not-indexable from not-user-queryable and never turn HOLD into a confident recommendation.
19. **PARALLEL — community evidence maintenance.** Continue append-only Phone and Data-eSIM evidence intake; no new DB batch without a distinct evidence-qualified route trigger.
20. **WAIT — Search Console publication decision.** Re-read at 20 settled Phone impressions or finalized data through 2026-10-05. TikTok Direct Post remains a separate review wait.

## Durable source pointers

- Product/value rules: `docs/PRODUCT_VALUE_GATE.md`
- Phone operating model: `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`
- Phone architecture: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`
- Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`
- Phone coverage closeout: `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md`
- Post-legacy coverage-gap audit: `docs/PHONE_POST_LEGACY_COVERAGE_GAP_AUDIT_2026-10-03.md`
- Data-eSIM contract: `data/esim/README.md` + `data/esim/v1/manifest.json`
- Current atomic queue: `docs/CURRENT_EXECUTION_QUEUE.md`
- Session contract: `docs/SESSION_EXECUTION_PROTOCOL.md`
- Authority/AI discovery: `docs/AUTHORITY_AND_AI_DISCOVERY.md`
- AI-native retrieval: `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`
