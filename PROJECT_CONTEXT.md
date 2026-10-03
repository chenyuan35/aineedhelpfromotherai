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
| Phone data / publication foundation | **135-ROUTE COMPARISON / 134-ROUTE CANONICAL / 3 INDEXABLE.** DB-C15 released in PR #348 (`6bd972ffa7c40642de29a4a9a996736601080c5a`). Canonical `data/phone/v1` is 134 routes / 80 markets / 131 brands / 105 networks / 491 sources; 123 route IDs overlap the 135-route comparison set and 12 remain legacy-only, including the known Sakura same-product alias blocker. SMARTY UK is ADMIT-BACKSTAGE; Movistar Peru and the discontinued Talkmobile PAYG route are HOLD. Public URL, sitemap and indexability boundaries remain unchanged. | Start bounded DB-C16 with `mint-mobile-us-2026`, `tmobile-prepaid-connect-2026`, and `visible-25-2026`; keep `sakura-mobile-voice-2026` excluded and preserve the 3-route indexability allowlist. |
| Phone evidence acquisition | **COMMUNITY-FIRST / NORMALIZED DATA-ESIM LAYER ACTIVE.** PR #327 captured the reviewed community snapshots; PR #328 (`f0057d6c0c067f42d5817bce7e2c17dc1cdfb3ee`) normalizes them into separate backstage `data/esim/v1` tables: 59 source-label providers / 72 evidence records / 159 versioned offers. Pure data eSIM remains outside Phone canonical routes; surface state is backstage-only / not-public / indexability none. | Continue append-only community/forum evidence acquisition. Require separate reviewed identity-linkage/publication decisions before any Phone canonical or public/indexable use. |
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
2. **Backend evidence/database coverage:** continue reviewed normalization toward broad low-cost route coverage. DB-C15 is released; the next bounded batch is DB-C16: `mint-mobile-us-2026`, `tmobile-prepaid-connect-2026`, `visible-25-2026`.

Public publication remains a separate gate. Canonical/database admission does not create a route page, sitemap entry, market page or ranking claim.

## Current release baseline

- Phone comparison surface: **135 routes**.
- Phone normalized canonical: **134 routes / 80 markets / 131 brands / 105 networks / 491 sources**.
- Comparison↔canonical route-ID overlap: **123**.
- Legacy-only comparison route IDs: **12**.
- Explicit indexable route pages: **3**.
- Data-eSIM backstage: **59 provider labels / 72 evidence records / 159 versioned offers**.
- Phone task-first decision shortcuts: **released in PR #340 / merge `60ff5457f2cc7982f0916b296427f0c1007c5c76`**.
- Phone-first homepage + Phone hub visual identity: **released in PR #342 / merge `e5f902250921eaa232779104bdfb4c37c6a0c3ac` / Eval Gate #1032 PASS / production `dpl_DLHuWXRtAJhxc3vPd7gtVaiFxwPB` READY**.

## Current execution sequence

1. **DONE — Global progressive Phone finder.** PR #291 exposes the admitted 135-route comparison layer on the existing canonical URL while preserving the 3-route SEO allowlist.
2. **DONE — Canonical backend coverage through DB-C15.** PR #348 leaves 12 comparison route IDs legacy-only and preserves the publication boundary.
3. **DONE — Data-eSIM normalized backstage layer.** PR #328 keeps pure data eSIM separate from Phone-number/retention canonical routes and public/indexable surfaces.
4. **DONE — Phone task-first decision shortcuts.** PR #340 adds lowest keep cost, longest keep window, OpenAI/Codex evidence and recently checked views.
5. **DONE — Phone-first frontend identity / visual-quality release.** PR #342 changes the homepage first screen from generic AI interruption framing to Phone Radar, gives the Phone hub an explicit Buy / Keep / Verify / Recover value model, preserves the three route families/search/decision shortcuts, and leaves the public publication boundary unchanged. Eval Gate #1032 and production verification passed.
6. **DONE — DB-C14.** PR #346 normalized `ooredoo-hala-qa-2026` as ADMIT-BACKSTAGE and `claro-pre-cl-2026` / `claro-pre-co-2026` as HOLD. CI #213 and Eval Gate #1040 passed; production deployment `dpl_CbrVsm9tunqZhduPZu2Dd7kP76AA` is READY on merge `cc7a2e8c79e477481118123bbea21734fddc417e`. Live apex, Phone canonical and sitemap return HTTP 200; sitemap remains 31 URLs with only the existing 3 explicit route pages.
7. **DONE — DB-C15.** PR #348 normalized `smarty-uk-2026` as ADMIT-BACKSTAGE and `movistar-pre-pe-2026` / `talkmobile-uk-payg-closed-2026` as HOLD. CI #215 and Eval Gate #1044 passed; production deployment `dpl_2R2BiBiCEdRKSaBEb4vVRYH96YAH` is READY on merge `6bd972ffa7c40642de29a4a9a996736601080c5a`. Live apex, Phone canonical and sitemap return HTTP 200; sitemap remains 31 URLs and all three DB-C15 standalone route URLs remain 404.
8. **NEXT — DB-C16.** Reverify `mint-mobile-us-2026`, `tmobile-prepaid-connect-2026`, and `visible-25-2026` for current product identity, lifecycle/keep economics, foreign-user KYC/acquisition, overseas SMS/OTP/roaming and payment constraints before admission. Keep Sakura excluded; no public/indexability change.
9. **PARALLEL — community Data-eSIM evidence intake.** Append versions; do not overwrite provenance or auto-link ambiguous identities.
10. **WAIT — Search Console publication decision.** Re-read at 20 settled Phone impressions or finalized data through 2026-10-05.
11. **WAIT — TikTok Direct Post advanced review.** Targeted remediation, genuine production `SELF_ONLY` publication proof and one Content Posting API resubmission are complete. The portal says approximately 2–4 weeks; no repeat submission unless TikTok rejects or requests additional evidence. Authority follow-up remains a separate wait.

## Durable source pointers

- Product/value rules: `docs/PRODUCT_VALUE_GATE.md`
- Phone operating model: `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`
- Phone architecture: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`
- Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`
- Data-eSIM contract: `data/esim/README.md` + `data/esim/v1/manifest.json`
- Current atomic queue: `docs/CURRENT_EXECUTION_QUEUE.md`
- Session contract: `docs/SESSION_EXECUTION_PROTOCOL.md`
- Authority/AI discovery: `docs/AUTHORITY_AND_AI_DISCOVERY.md`
- AI-native retrieval: `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`
