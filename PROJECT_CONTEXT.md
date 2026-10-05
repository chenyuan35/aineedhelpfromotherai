# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-10-05

This file is the compact current-facts source for the project. Historical execution detail belongs in task-specific docs, PRs, Git history and the Google Docs journal. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

After reading `AGENTS.md`, read this checkpoint before any deeper project inspection. Do not rescan the whole repository, VPS fleet, deployment history or old chats unless this checkpoint is stale, contradictory or the selected task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product direction | **STRATEGY RESET ACCEPTED 2026-09-23.** Search volume, rankings and technical polish no longer choose the product. Both official-source substitutability and independent-competitor substitutability are mandatory gates. Reset has been removed from primary site/discovery surfaces. | Active growth work stays on Phone Radar. Reset direct URLs remain preserved; Relay remains data-accrual only. |
| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / PHONE-FIRST SITE IDENTITY RELEASED.** PR #291 shipped the 135-route progressive global finder; PR #340 added task-first decision shortcuts; PR #342 (`e5f902250921eaa232779104bdfb4c37c6a0c3ac`) now makes Phone Radar the homepage first-screen product identity and upgrades the Phone hub first screen into a Buy / Keep / Verify / Recover decision surface. Eval Gate #1032 passed; Vercel production deployment `dpl_DLHuWXRtAJhxc3vPd7gtVaiFxwPB` reached READY; apex homepage, Phone hub and `phone-first-identity.css` returned HTTP 200. Preview browser QA also passed search, route tabs and a live decision shortcut with no reproduced overlap or horizontal overflow. | Keep the released frontend stable and measure behavior/search evidence before another public UX expansion. Continue backend evidence coverage independently. |
| Phone data / publication foundation | **100% OF CURRENT KNOWN EVIDENCE-QUALIFIED ATOMIC UNIVERSE + CANONICAL FINDER INTEGRATION RELEASED.** Canonical is now 159 routes / 87 markets / 156 brands / 117 networks / 633 sources, covering 159/159 currently known evidence-qualified relevant atomic routes after the bounded Saily, LuckySIM and China Telecom Macau residual admissions. This is not a census of every worldwide carrier SKU. PR #370 (`46ac86e04e97f67d7a6fb3f9e1cf700fa237197a`) established the generated finder/lazy-detail path; the current index exposes all 159 canonical rows. Saily is `voip-second-line`; LuckySIM Hong Kong and China Telecom Macau Easy PASS are `real-mobile`; all three residual admissions remain `backstage-only` / `hold` where uncertainty persists. The Macau route now has first-party 180-day lifecycle/recharge-reset evidence, current eSIM support and ordinary incoming-SMS capability, while service-specific bank/app OTP reliability remains unresolved. Historical deep comparison stays 135 routes; explicit indexability stays 3 routes; sitemap stays 31 URLs. | Broad enumeration remains stopped. Maintain evidence/freshness and measure usage/search signals; re-open database expansion only for genuinely new evidence-qualified atomic routes. |
| Phone evidence acquisition | **COMMUNITY-FIRST / NORMALIZED DATA-ESIM LAYER ACTIVE.** PR #327 captured the reviewed community snapshots; PR #328 (`f0057d6c0c067f42d5817bce7e2c17dc1cdfb3ee`) normalized them into separate backstage `data/esim/v1` tables. PR #362 (`86060c1d5e01f460d168005f74b6e3cd0c820478`) resolved the previously unknown public provenance of the existing 2026-10-01 user-supplied later-delta to Linux.do `ESIM流量漫游合集 4.0` through reviewed manifest-level `resolvedSource` metadata without mutating the immutable raw snapshot. PR #364 (`569849dead592a35178f5fd7f7a13e5f5093aa20`) then added one dated multi-user USIMS availability/failure outcome snapshot from Linux.do without manufacturing a price offer. Counts are now 59 source-label providers / 73 evidence records / 159 versioned offers; pure data eSIM remains outside Phone canonical routes and is backstage-only / not-public / indexability none. | Continue append-only community/forum evidence acquisition. Require separate reviewed identity-linkage/publication decisions before any Phone canonical or public/indexable use. |
| AI Reset Radar | **FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.** Seven-page value classification remains in the reset audit. | No Cursor-first optimization, no Q-015, no new generic reset pages and no generic Codex reset tracker. |
| Codex opportunity | Real demand exists, but current competitors already cover generic reset/history/countdown/quota jobs. | Competitor-gap research only; future build requires a narrower non-duplicative job. |
| Relay Exit Risk | **PRESERVE / DATA-ACCRUAL EXPERIMENT.** Product and methodology remain production-verified. | Continue legitimate historical snapshots/lifecycle accumulation. No search-led feature expansion without demand/usage evidence. |
| Search Console | **PHONE SAMPLE STILL TOO SMALL FOR PUBLICATION EXPANSION.** Windsor.ai standard read on 2026-10-04 shows settled Phone data through 2026-09-29 at **8 impressions / 0 clicks**. Fresh/non-finalized Phone data through 2026-10-03 adds **10 impressions / 0 clicks**. `force_refresh` is blocked by the current Windsor trial plan's hourly-refresh restriction; standard reads still work. | Re-read when settled Phone impressions reach 20 or finalized data reaches 2026-10-05, whichever comes first. Do not pay/upgrade merely to force refresh. |
| Keyword research | Sep 23 evidence is sufficient for current direction; Ubersuggest hit daily quota, Ahrefs returned `Insufficient plan`, Semrush returned `no_api_units`. | Do not rotate accounts or upgrade/pay without authorization. |
| TikTok App Review | **BASE APP LIVE / DIRECT POST ADVANCED REQUEST RESUBMITTED — WAITING.** On 2026-10-02 the authorized production flow completed genuine `SELF_ONLY` Direct Post tests on creator `Ethereal` (`@healing...c`), TikTok returned terminal `PUBLISH_COMPLETE`, and the creator profile showed the posted review media. A 28-second real-flow MP4 was uploaded to the Content Posting API reapplication for app `7686819988157810696`, and the portal displayed `Your Application to request access to Content Posting API has been submitted!`. | Wait for TikTok review; the portal states approximately 2–4 weeks. Do not claim approval and do not submit again unless TikTok rejects or requests new evidence. See `docs/TIKTOK_DIRECT_POST_AUDIT_2026-10-02.md`. |
| Authority | **AIR-4 BATCH 2 SENT / WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. | Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; do not infer a link until independently verified. |
| Frontend foundation | The production static build now has a fail-closed Phone-first refinement stage plus isolated `phone-first-identity.css`. Figma was used as a visual-direction aid, but production truth remains the built/verified site. Astro/Tailwind remains a supporting foundation rather than a broad migration target. | Prefer bounded improvements on the existing canonical URL; do not redesign for its own sake. |
| Observer access | Qwen key-only SSH remains the verified observer-control path. The trial observer is disposable; `remote-desktop-commander.service` is not a reliable control channel. `codex-vps` remains a separate Relay-history host. | Do not repurpose `codex-vps`, `yuan` or `hermes`; keep valuable observer summaries off-host. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass provider blockers. |

## Latest maintenance checkpoint — Ultra + H2O evidence density

PR #394 (`459be509372d214a8f8cb4143eafa1be49664f37`) applied the reviewed Ultra Mobile PayGo Telegram packet to canonical data. Ultra now has **5 exact Telegram registration-verification observations from 5 distinct sources: 3 success / 0 failure / 2 mixed / observed success 60.0% / grade C**. It remains `admitted` + `backstage-only`; publication did not expand.

The 2026-10-05 H2O PayGo maintenance adds three independent route-level sources to the existing `h2o-paygo-10-90d-2026` record and reconciles a material overseas-continuity conflict: a 2024 community report says PayGo Wi-Fi Calling/activation abroad worked, while the current PrepaidCompare profile says Wi-Fi Calling is monthly-plan only and a 2026 China-use guide reports recurring support resets. Current H2O terms still frame service as personal use in the U.S. only. H2O therefore remains `hold` + `backstage-only`; no app/service percentage is created because no exact app sample meets the evidence threshold. The source corpus is now **633**; canonical/publication counts remain **159 routes / 87 markets / 156 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## Latest release checkpoint — ClubSIM Telegram evidence density

PR #390 (`0a2c6a8e9b1529ec227b4a717d37c88cf51109fd`) normalized seven deduplicated exact `clubsim-sms-pack-6hkd-2026 + Telegram + registration-verification` observations from seven distinct dated community source records. The generated aggregate is **n=7 / 7 distinct sources / 2 success / 3 failure / 2 mixed / observed success 28.6% / grade C (Mixed / weak)**. This is a bounded observed community sample, not a universal ClubSIM probability; prefix, client, proxy/IP and roaming conditions remain material. ClubSIM stays `admitted` but `backstage-only` and is not promoted merely because its keep cost is HK$6/year.

Eval Gate #1160 passed; Vercel Preview passed; production deployment `dpl_8U971UeoANGmLdu86JfNoPdmD5C4` reached READY. The live ClubSIM lazy-detail JSON and `phone-route-summaries.json` both returned HTTP 200 with the new aggregate. Canonical is now **159 routes / 87 markets / 156 brands / 117 networks / 625 sources**; publication remains **135 comparison / 3 indexable / 31 sitemap URLs**.

## Latest release checkpoint — Phone evidence-gated Top decision layer

PR #388 (`f171726bde05245bc41c284d718ab32a64298f40`) released the first evidence-gated Top decision layer on the existing Phone Radar canonical. The default long-term-number view now derives **Lowest setup cost**, **Lowest yearly keep**, **Longest verified keep window**, **Best app-verification evidence**, and **Best-documented continuity** from normalized canonical data. Top winners are restricted to admitted, user-visible real-mobile long-term routes; HOLD and backstage-only rows cannot win. Service success percentages remain `null` unless the exact route + service + operation aggregate has at least **5 deduplicated observations from 5 distinct source records**. The layer also exposes compact decision facts including source count, KYC state, keep action, roaming-SMS evidence and continuity-warning signals. It does **not** invent a ban/recycle probability or arbitrary 0–100 safety score.

Eval Gate #1156 passed; Vercel Preview passed; production deployment `dpl_3HFruLPEyUj7hafRpQAAiBEQxSdL` reached READY. The apex Phone Radar and live `phone-route-summaries.json` returned HTTP 200 with the new decision fields. Canonical/publication counts at that release baseline were **159 routes / 87 markets / 156 brands / 117 networks / 618 sources**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## Immediate priority

Run two tracks in parallel without confusing them:

1. **User-facing Phone value:** the homepage and Phone canonical now present Phone Radar as the primary product. PR #342 is the current production visual/identity baseline; do not add another design layer or public URL merely to create visible activity. Measure real search/interaction behavior and fix only reproduced usability gaps.
2. **Backend evidence/database coverage:** broad expansion is complete at 159 canonical routes and 159/159 of the current known evidence-qualified relevant atomic route universe. This is not a census of every global carrier SKU. The PR #370 finder path now carries all canonical rows while preserving selective publication. Switch to maintenance/evidence refresh; open another DB batch only on genuinely new evidence-qualified routes.

Public publication remains a separate gate. Canonical/database admission does not create a route page, sitemap entry, market page or ranking claim.

## Current release baseline

- Phone comparison surface: **135 routes**.
- Phone normalized canonical: **159 routes / 87 markets / 156 brands / 117 networks / 633 sources**.
- Phone user-queryable canonical finder: **159 routes** via generated `phone-route-summaries.json`; route detail evidence is lazy-loaded from `phone-route-data/<id>.json`.
- Comparison↔canonical same-ID overlap remains **134**; DB-C20 adds three distinct post-legacy routes outside the 135-route comparison artifact.
- Comparison route IDs without a same-ID canonical row: **1** (`sakura-mobile-voice-2026`, intentionally excluded as a same-product alias of canonical `sakura-japan-voice-data`).
- Explicit indexable route pages: **3**.
- Data-eSIM backstage: **59 provider labels / 73 evidence records / 159 versioned offers**; PR #362 resolves public provenance for the existing Oct 1 later-delta, and PR #364 adds one dated USIMS community-outcome record without adding an offer or changing publication.
- Phone task-first decision shortcuts: **released in PR #340 / merge `60ff5457f2cc7982f0916b296427f0c1007c5c76`**.
- Phone-first homepage + Phone hub visual identity: **released in PR #342 / merge `e5f902250921eaa232779104bdfb4c37c6a0c3ac` / Eval Gate #1032 PASS / production `dpl_DLHuWXRtAJhxc3vPd7gtVaiFxwPB` READY**.

## Current execution sequence

1. **DONE — Phone publication architecture + progressive global finder.** Layered database/query/publication boundaries are released; historical deep comparison stays 135 routes and explicit indexability stays 3.
2. **DONE — Data-eSIM normalized backstage layer.** Pure data eSIM remains separate from Phone-number/retention canonical and public/indexable surfaces.
3. **DONE — Phone task-first decision shortcuts + Phone-first identity.** PR #340 and PR #342 are the current visual/product baseline.
4. **DONE — Canonical backend coverage through DB-C23 + bounded Saily/LuckySIM/China Telecom Macau residual admissions.** Current state is 159 routes / 87 markets / 156 brands / 117 networks / 633 sources; the final known Macau residual is normalized as backstage HOLD with first-party lifecycle evidence, and ClubSIM now carries a threshold-qualified but weak/mixed Telegram registration sample.
5. **DONE — Phone database coverage audit.** `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md` now records 159/159 of the current known evidence-qualified relevant atomic universe after the Macau lifecycle blocker cleared. This is not a global carrier census; broad enumeration stays stopped.
6. **DONE — Canonical backend ↔ finder integration.** PR #370 / `46ac86e04e97f67d7a6fb3f9e1cf700fa237197a` established generated summaries and lazy per-route evidence; the current path now carries all 159 canonical routes while preserving 135 comparison / 3 indexable / 31 sitemap URLs.
7. **PARALLEL — community/provider evidence maintenance.** PR #390 matured ClubSIM Telegram evidence; PR #394 matured Ultra Mobile PayGo Telegram evidence to n=5 / 60.0% observed success / grade C; the 2026-10-05 H2O PayGo pass reconciles conflicting overseas Wi-Fi Calling evidence without manufacturing app observations and keeps H2O HOLD. Continue one-route-at-a-time maintenance; no new DB batch without a genuinely distinct evidence-qualified route trigger.
8. **WAIT — Search Console publication decision.** 2026-10-04 check remains below gate at 8 settled Phone impressions / 0 clicks through 2026-09-29; re-read at 20 settled Phone impressions or finalized data through 2026-10-05, whichever comes first.
9. **WAIT — TikTok Direct Post review.** Do not resubmit unless TikTok rejects or requests new evidence.
10. **ONGOING — Relay data accrual / authority pilot.** No search-led Relay expansion without demand evidence; follow the authority ledger for external follow-up.

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
