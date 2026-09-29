# Current Execution Queue

Last updated: 2026-09-30

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Backend database coverage and public/SEO publication are separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
3. DB-C5 is released with **135 comparison routes / 104 canonical normalized routes / 93 comparison↔canonical route-ID overlaps / 42 comparison routes still legacy-only / 3 indexable routes**; production publication boundaries are verified.
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

## NEXT — Backend database coverage DB-C6

Bounded first batch: `stc-sawa-sa-2026`, `claro-pre-ar-2026`, `skt-prepaid-kr-2026`. Reverify current lifecycle, minimum keep cost, foreign-user/KYC/acquisition constraints and overseas SMS/OTP utility. Use real QwenPaw agent delegation for at least one independent lane and reconcile all delegated output before admission. No public/indexability change.

## PARALLEL — Community-discovered data eSIM signal intake

NodeSeek `https://www.nodeseek.com/post-954805-1` is already captured on `main` as `data/phone/inbox/community-free-esim-nodeseek-954805-2026-09-29.json`, covering **8 providers / 9 offer mechanisms**: Airvoy, eSIM.io (free trial + wallet/PAYG), Nomad, Roamless, Firsty, USIMS, Eskimo and Jetpac.

This lane intentionally preserves hidden/community-discovered mechanics even when provider public pages do not document them. Claims keep their provenance strength and uncertainty; lack of an official page is not a rejection criterion.

QwenPaw/Kimi corroboration task `task-f93841364ef7` failed because its model RPM quota was exhausted. That failure does **not** invalidate or remove the captured NodeSeek signal; future community corroboration can resume when capacity is available.

## Measurement wait

Search Console remains too small for publication expansion. This does **not** block backend database coverage.

## Qwen / Kimi work lane

QwenPaw/Kimi are high-throughput backstage research/data workers. Raw output remains `RESEARCH_CANDIDATE` until reviewed. They do not control publication, roadmap, merge or deployment. DB-C5 used real console delegation: BH Telecom task `task-4915eea85664` completed and was reconciled; One Montenegro task `task-a71d7e8af5fd` ended `failed / Task cancelled`; no delegated result was accepted, and the failure is an explicit worker blocker rather than hidden single-agent fallback.

## External waits

- TikTok App Review — waiting; do not alter submitted configuration.
- Authority batch 2 — waiting; follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`.

## Do not do next

- do not stop backend coverage because public SEO measurement is waiting;
- do not bulk-admit the remaining 42 legacy-only routes without provenance + QC;
- do not equate canonical admission with SEO/indexability;
- do not duplicate same-product aliases;
- do not redesign backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
