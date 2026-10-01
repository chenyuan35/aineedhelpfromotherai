# Current Execution Queue

Last updated: 2026-10-01

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Backend database coverage and public/SEO publication are separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
3. DB-C9 is released with **135 comparison routes / 116 canonical normalized routes / 105 comparison↔canonical route-ID overlaps / 30 comparison routes still legacy-only / 3 indexable routes**; production publication boundaries are verified.
4. The backend database is **not complete**. Continue reviewed coverage expansion toward roughly **90%+ of the relevant low-cost route universe** while provenance and maintenance stay tractable.
5. **Public surface stays stable.** DB work must not create route pages, sitemap entries or ranking/publication changes without a separate publication decision.
6. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.

## JUST COMPLETED — Backend database coverage DB-C4D

The final 3 DB-C4 legacy-only routes were independently reviewed and normalized through approved backstage packets.

Result: **2 ADMIT-BACKSTAGE / 1 HOLD / 0 REJECT**. Elisa Prepaid Finland is ADMIT-BACKSTAGE: current provider material establishes EUR10 as the minimum balance top-up, 12 months validity after every recharge, a one-month expired receive/recharge window, and Finland-first activation. Cyta soeasy Cyprus is ADMIT-BACKSTAGE: EUR5 grants 365 days, followed by 7 days incoming-only plus 15 days before cancellation; prepaid identification is mandatory and non-EU passport identification is supported. HOT Mobile HOTALK is HOLD: current local recharge retailers corroborate a 66 ILS/180-day balance-validity mechanic, but a current provider number-deactivation/recycling rule and foreign-user identification flow remain unresolved; the old blanket no-KYC claim is withdrawn.

Canonical result after DB-C4D: **101 routes / 57 markets / 98 brands / 77 networks / 334 sources**. Comparison remains **135**, comparison↔canonical overlap is **90**, **45 comparison routes remain legacy-only**, and explicit indexability remains **3**. Full Phone checks preserve the 135-route comparison surface and 3-route publication boundary.

Release: PR #313 (`7c435d1ef0c897dbaf249f8caa2e098cbeb920ff`) merged after Eval Gate #965, CI #187 and Vercel Preview passed. Production verification confirmed the Phone hub and existing VOXI route at HTTP 200 and the non-indexable Elisa route at HTTP 404.

## JUST COMPLETED — Backend database coverage DB-C5

DB-C5 is merged and production-verified. Final disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `one-me-2026` — HOLD: current 90-day/EUR2 retention economics are documented, but Tourist Package roaming is unavailable outside Montenegro.
- `bhtelecom-ba-2026` — ADMIT-BACKSTAGE: current Ultra lifecycle, foreign-card top-up and visitor eSIM evidence are documented; China-specific OTP remains unverified.
- `yettel-prepaid-bg-2026` — HOLD: 365/395-day validity and EUR4.09 online top-up are documented, but the current remote foreign-passport registration path remains unresolved.

Released state: **104 routes / 60 markets / 101 brands / 80 networks / 346 sources / 93 comparison overlaps / 42 legacy-only / 3 indexable**. PR #315 squash-merged as `03370ed11c2922ea93454c9732868a97eeb211cb`; Eval Gate #969, CI #189 and Vercel Preview passed. Production verification: Phone hub 200, existing VOXI route 200, non-indexable `bhtelecom-ba-2026` route 404.

## JUST COMPLETED — Backend database coverage DB-C6

DB-C6 is merged and production-verified. Final disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `stc-sawa-sa-2026` — **HOLD**: current STC pages conflict on 180 vs 360-day prepaid validity, and non-citizen ID expiry/final departure can trigger suspension/cancellation.
- `claro-pre-ar-2026` — **ADMIT-BACKSTAGE**: current first-party evidence supports 180-day recharge validity plus 60-day active grace, passport tourist-SIM/foreigner eSIM acquisition and prepaid roaming; ARS2000 remains an observed current tier, not a contractual minimum. The pre-apply schema defect `evidenceState=official-confirmed` was corrected to canonical `admitted`.
- `skt-prepaid-kr-2026` — **HOLD**: KRW5000 maps to 30-day outgoing / 40-day incoming / 120-day number retention; passport onboarding exists, but stay-expiry recharge continuation is constrained and current T roaming guidance classifies PPS as roaming-unavailable.

Released state: **107 routes / 63 markets / 104 brands / 83 networks / 360 sources / 96 comparison overlaps / 39 legacy-only / 3 indexable**. `npm run phone:data:check` and the full frontend build passed; the build still emits only the existing 3 route detail pages. PR #318 squash-merged as `04b116c6de2c09eb614a0fbf1990b355c73d7400`; Eval Gate #975, CI #191 and Vercel Preview passed. Production verification: Phone hub 200, existing VOXI route 200, non-indexable `claro-pre-ar-2026` route 404.

The previously completed DB-C6 delegated lanes remain the accepted worker evidence (`task-b8c31337863b` and `task-4f112e9f94f5`, both reconciled by the coordinator). One extra final Kimi recheck attempt failed because the current agent runtime had no active model configured; no output was accepted and this did not bypass coordinator QC.

## JUST COMPLETED — Backend database coverage DB-C7

DB-C7 is merged and production-verified. Final disposition: **0 ADMIT-BACKSTAGE / 3 HOLD / 0 REJECT**.

- `ifmobile-jp-2026` — **HOLD**: current 1GB voice-SIM price is JPY1,408/month, but IF Mobile ended the former identity-document-image + face-image web KYC flow on 2026-03-31. Current web verification uses JPKI or IC-chip reading + face verification, with an in-store counter as the documented alternative. Current passport-only nonresident remote signup and mainland-China SMS behavior remain unresolved.
- `rakuten-mobile-jp-2026` — **HOLD**: current SAIKYO floor is JPY1,078/month through 3GB and international service exists, but current foreign-national onboarding is a Japanese residence-card/special-permanent-resident-card identity path with matching address semantics. Rakuten also instructs customers to initialize Rakuten Link in Japan before travel.
- `linemo-jp-2026` — **HOLD**: LINEMO Best Plan is JPY990/month through 3GB plus a current JPY3,850 contract administration fee. Foreign applicants require residence-card based KYC; overseas SMS reception is free with World Support, but new-number contracts cannot enroll in World Support until the fifth billing month.

Released state: **110 routes / 63 markets / 107 brands / 84 networks / 372 sources / 99 comparison overlaps / 36 legacy-only / 3 indexable**. `npm run phone:data:check`, `npm run verify` and the full frontend build passed; the build still emits only the existing 3 route detail pages and 31 sitemap URLs. PR #320 squash-merged as `1efb329a35ecf4f8a47e3c95d0e7041013fd0923`; Eval Gate #979, CI #193 and Vercel Preview passed. Production verification: Phone hub 200, existing VOXI route 200, non-indexable `ifmobile-jp-2026` route 404.

Kimi worker task `task-e22548697159` independently returned HOLD for IF Mobile and exposed the post-April-2026 signup conflict; coordinator evidence remained more conservative where exact current first-party support was absent. QA task `task-40c3bef1495c` was still running when release gates closed, so no Rakuten/LINEMO delegated output was accepted; those two routes were released only from direct current first-party reconciliation plus automated checks.

## JUST COMPLETED — Backend database coverage DB-C8

DB-C8 is merged and production-verified. Final disposition: **0 ADMIT-BACKSTAGE / 3 HOLD / 0 REJECT**.

- `ahamo-jp-2026` — **HOLD**: current ahamo is JPY2,970/month for 30GB through 2026-11-30, with no application fee. Foreign-national onboarding remains residence-card/address gated; existing lines support overseas voice/SMS in more than 200 countries/regions, but mainland-China OTP is unverified. Official materials schedule a new JPY3,135/40GB entry tier from 2026-12-01.
- `iijmio-jp-2026` — **HOLD**: current 2GB voice service is JPY850/month. New voice/SMS signup requires a Japanese current address, compatible identity document and subscriber-name credit card; overseas-issued cards may fail. Voice SIM/eSIM supports overseas voice and SMS but not overseas data.
- `kt-prepaid-kr-2026` — **HOLD**: KT now exposes an exact prepaid recharge ladder up to KRW50,000/365 days, but passport-only/visitor service is short-term/90-day constrained unless identity is reverified/extended in-store. Welcome Prepaid explicitly provides no roaming, so it is not an overseas SMS/OTP route.

Released state: **113 routes / 63 markets / 110 brands / 86 networks / 386 sources / 102 comparison overlaps / 33 legacy-only / 3 indexable**. `npm run phone:data:check`, `npm run verify` and the full frontend build passed; the build still emits only the existing 3 route detail pages and 31 sitemap URLs. PR #322 squash-merged as `bc3a090dee5ff892666d633c159a91651099ab5b`; Eval Gate #983, CI #195 and Vercel Preview passed. Production verification: Phone hub 200, existing VOXI route 200, non-indexable `ahamo-jp-2026` route 404.

Kimi worker task `task-d802cb1b57d4` completed and was coordinator-reconciled. QA task `task-ef149eb596bf` failed on provider quota and contributed no accepted evidence. The initial headless QwenPaw task path also failed because it did not expose the configured active models; the working inter-agent background path was used instead.

## JUST COMPLETED — Backend database coverage DB-C9

DB-C9 is merged and production-verified. Final disposition: **0 ADMIT-BACKSTAGE / 3 HOLD / 0 REJECT**.

- `lguplus-prepaid-kr-2026` — **HOLD**: current evidence splits the legacy label between LG U+’s short-stay visitor SIM and the separate U+ UMobile MVNO prepaid product. The visitor SIM is not a long-term retention route, while U+ UMobile prepaid lists roaming as unavailable; do not merge the two product identities.
- `mts-by-2026` — **HOLD**: MTS Belarus now documents the 60-day forced-block and 180-day no-operation withdrawal clocks, but the current foreign-guest tariff explicitly disables both Roaming and SMS Roaming for foreign citizens/stateless persons.
- `bakcell-cin-az-2026` — **HOLD**: existing CIN 1 lines have current AZN3.99/30-day and AZN0.99/6-day lifecycle mechanics, but CIN 1 is now in Bakcell’s tariff archive and current new acquisition is not established. The deeper closure sequence remains historical-only evidence.

Released state: **116 routes / 65 markets / 113 brands / 89 networks / 400 sources / 105 comparison overlaps / 30 legacy-only / 3 indexable**. `npm run phone:data:check`, `npm run verify` and the full frontend build passed; the frontend remains **135 comparison routes / 3 route detail pages / 0 market detail pages / 31 sitemap URLs**. PR #324 squash-merged as `ac742c7398053a057a9b0e06d2ffcab717d28146`; Eval Gate #987, CI #197 and Vercel Preview passed. Production verification: Phone hub 200, existing VOXI route 200, non-indexable `lguplus-prepaid-kr-2026` route 404, sitemap 31 URLs.

QwenPaw/Kimi task `task-24b1c44a3cc4` returned useful research-candidate evidence before a terminal model-execution failure; accepted facts were independently reverified by the coordinator. The requested qwen-code second pass was unavailable because no enabled ACP runner was configured, and Tavily returned 403; neither blocker was treated as evidence.

## NEXT — Backend database coverage DB-C10

Bounded batch: `starhub-prepaid-sg-2026`, `jazz-pk-2026`, `vodafone-eg-2026`. These are the next three legacy-only route IDs after excluding `sakura-mobile-voice-2026`, which remains the known same-product alias blocker for canonical `sakura-japan-voice-data`. Reverify current product identity, lifecycle/keep economics, foreign-user KYC/acquisition path, overseas SMS/OTP/roaming behavior and payment constraints before admission. Delegated output remains `RESEARCH_CANDIDATE` until coordinator reconciliation. No public/indexability change.

## JUST COMPLETED — Data-eSIM normalized backstage layer

PR #328 (`f0057d6c0c067f42d5817bce7e2c17dc1cdfb3ee`) formalized the three reviewed Data-eSIM inbox signals into a separate backstage-only `data/esim/v1` normalization layer. The admitted inputs remain the 9 free mechanisms, the 46-entry NodeSeek price snapshot, and the 13-entry later delta plus its 2 explicit updates; raw inbox evidence remains immutable.

The normalizer preserves source-label identity until reviewed resolution, append-only/versioned price history, community claim strength and provenance, third-party/reseller/referral/promotion/task/ad/wallet acquisition signals, IP/egress, FUP/throttle/unlimited mechanics, and independent data/voice/SMS/number capability states. Pure Data-eSIM evidence has `canonicalPhoneRouteId=null` by default and does not enter the Phone-number canonical route database.

Verification: **59 source-label providers / 72 evidence records / 159 versioned offers**; `npm run phone:data:check` PASS, `npm run verify` PASS, `git diff --check` PASS, Eval Gate #995 PASS and Vercel PASS. Existing standalone CI did not trigger because its repository path filter excludes `data/**` / `scripts/**`; no no-op commit was added to force it. The **135-route comparison / 116-route Phone canonical / 3-indexable-route** public boundary remains unchanged.

Qwen/Kimi were explicitly unavailable for this session and were not used. Future Data-eSIM intake stays backstage until separate evidence/value/publication gates authorize any public surface.

## Measurement wait

Search Console remains too small for publication expansion. Finalized data through 2026-09-28 shows 5 Phone impressions / 0 clicks; fresh 2026-09-29..30 adds 5 non-finalized impressions / 0 clicks across the Hong Kong guide and keep-alive index. Re-read when settled Phone impressions reach 20 or finalized data reaches 2026-10-05. This does **not** block backend database coverage.

## Qwen / Kimi work lane

QwenPaw/Kimi are high-throughput backstage research/data workers. Raw output remains `RESEARCH_CANDIDATE` until reviewed. They do not control publication, roadmap, merge or deployment. DB-C9 used the live inter-agent background path: task `task-24b1c44a3cc4` produced research-candidate evidence before a terminal model-execution failure, and coordinator re-verification decided admission. The requested qwen-code second pass had no enabled ACP runner and Tavily returned 403; those capability failures did not bypass evidence QC.

## External waits

- TikTok App Review — waiting; do not alter submitted configuration.
- Authority batch 2 — waiting; follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`.

## Do not do next

- do not stop backend coverage because public SEO measurement is waiting;
- do not bulk-admit the remaining 30 legacy-only routes without provenance + QC;
- do not equate canonical admission with SEO/indexability;
- do not duplicate same-product aliases;
- do not redesign backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
