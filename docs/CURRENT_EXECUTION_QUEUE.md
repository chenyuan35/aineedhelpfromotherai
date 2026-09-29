# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Backend database coverage and public/SEO publication are separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
3. After DB-C4B: **135 comparison routes / 95 canonical normalized routes / 84 comparison↔canonical route-ID overlaps / 51 comparison routes still legacy-only / 3 indexable routes**.
4. The backend database is **not complete**. Continue reviewed coverage expansion toward roughly **90%+ of the relevant low-cost route universe** while provenance and maintenance stay tractable.
5. **Public surface stays stable.** DB work must not create route pages, sitemap entries or ranking/publication changes without a separate publication decision.
6. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.

## JUST COMPLETED — Backend database coverage DB-C4B

The next 3 DB-C4 legacy-only routes were independently reviewed and normalized through approved backstage packets.

Result: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**. Smart Prepaid is HOLD because its ordinary 365-day loaded-value / 180-day zero-balance lifecycle is separate from the 30-day foreign-tourist SIM-registration cap. MTN Nigeria Keep My Number is ADMIT-BACKSTAGE with current NGN3,500/1y, NGN5,000/2y and NGN7,500/3y pricing plus the current visitor registration exception to NIN for stays under 24 months. iD Mobile is HOLD because current legal PAYG terms use a 120-day/four-month inactivity clock while current iD marketing/community copy says 180 days.

Canonical result after DB-C4B: **95 routes / 53 markets / 92 brands / 72 networks / 313 sources**. Comparison remains **135**, comparison↔canonical overlap is **84**, **51 comparison routes remain legacy-only**, and explicit indexability remains **3**. Full Phone checks preserve 135 comparison routes and the 3-route publication boundary.

Release: PR #309 (`518e7ab737e4ec53a8dba2740e1e752e83adc96a`) merged after Eval Gate #957, CI #183 and Vercel Preview passed; production deployed successfully. Live verification returned 200 for the Phone hub and VOXI route, while the non-indexable MTN Nigeria route returned 404.

## ACTIVE — Backend database coverage DB-C4

Continue with the next distinct low-cost / decision-useful legacy-only routes. Legacy prices and labels are prioritization hints, not admission facts.

Candidates:

1. `us-mobile-light-2026`
2. `lycamobile-us-2026`
3. `orange-sn-sama-numero-2026`
4. `elisa-prepaid-fi-2026`
5. `cyta-soeasy-cy-2026`
6. `hotmobile-il-2026`

### DB-C4 acceptance flow

1. preserve community/forum-discovered hidden mechanics even when provider public pages omit them; do not reject a mechanism merely because search cannot see it;
2. use first-party evidence for provider-controlled facts when available, but retain independent/community evidence and conflicts as separate provenance;
3. independently sample-audit at least 3 routes for stale claims, duplicate identity, hidden constraints and unsupported inference;
4. classify every candidate `REJECT`, `HOLD` or `ADMIT-BACKSTAGE`;
5. normalize accepted/HOLD routes through reviewed packets with missing fields left missing;
6. run canonical/integrity/publication-boundary tests and keep frontend/indexability unchanged;
7. merge only after Eval Gate + Preview pass, then continue to DB-C5 unless a real maintenance/evidence stop condition is reached.

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
- do not bulk-admit the remaining 51 legacy-only routes without provenance + QC;
- do not equate canonical admission with SEO/indexability;
- do not duplicate same-product aliases;
- do not redesign backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
