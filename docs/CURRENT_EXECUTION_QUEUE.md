# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Backend database coverage and public/SEO publication are separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
3. After DB-C4D: **135 comparison routes / 101 canonical normalized routes / 90 comparison↔canonical route-ID overlaps / 45 comparison routes still legacy-only / 3 indexable routes**.
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

## ACTIVE — Backend database coverage DB-C5

Continue with the next distinct low-cost / decision-useful legacy-only routes. Legacy prices and labels are prioritization hints, not admission facts.

Candidates:

1. `one-me-2026`
2. `bhtelecom-ba-2026`
3. `yettel-prepaid-bg-2026`

### DB-C5 acceptance flow

1. preserve community/forum-discovered hidden mechanics even when provider public pages omit them; do not reject a mechanism merely because search cannot see it;
2. use first-party evidence for provider-controlled facts when available, but retain independent/community evidence and conflicts as separate provenance;
3. independently sample-audit at least 3 routes for stale claims, duplicate identity, hidden constraints and unsupported inference;
4. classify every candidate `REJECT`, `HOLD` or `ADMIT-BACKSTAGE`;
5. normalize accepted/HOLD routes through reviewed packets with missing fields left missing;
6. run canonical/integrity/publication-boundary tests and keep frontend/indexability unchanged;
7. merge only after Eval Gate + Preview pass, then continue the coverage track unless a real maintenance/evidence stop condition is reached.

## PARALLEL — Community-discovered data eSIM signal intake

NodeSeek `https://www.nodeseek.com/post-954805-1` is already captured on `main` as `data/phone/inbox/community-free-esim-nodeseek-954805-2026-09-29.json`, covering **8 providers / 9 offer mechanisms**: Airvoy, eSIM.io (free trial + wallet/PAYG), Nomad, Roamless, Firsty, USIMS, Eskimo and Jetpac.

This lane intentionally preserves hidden/community-discovered mechanics even when provider public pages do not document them. Claims keep their provenance strength and uncertainty; lack of an official page is not a rejection criterion.

QwenPaw/Kimi corroboration task `task-f93841364ef7` failed because its model RPM quota was exhausted. That failure does **not** invalidate or remove the captured NodeSeek signal; future community corroboration can resume when capacity is available.

## Measurement wait

Search Console remains too small for publication expansion. This does **not** block backend database coverage.

## Qwen / Kimi work lane

QwenPaw/Kimi are high-throughput backstage research/data workers. Raw output remains `RESEARCH_CANDIDATE` until reviewed. They do not control publication, roadmap, merge or deployment.

## External waits

- TikTok App Review — waiting; do not alter submitted configuration.
- Authority batch 2 — waiting; follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`.

## Do not do next

- do not stop backend coverage because public SEO measurement is waiting;
- do not bulk-admit the remaining 48 legacy-only routes without provenance + QC;
- do not equate canonical admission with SEO/indexability;
- do not duplicate same-product aliases;
- do not redesign backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
