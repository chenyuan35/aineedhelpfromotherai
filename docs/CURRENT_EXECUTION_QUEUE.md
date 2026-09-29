# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Backend database coverage and public/SEO publication are separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
3. After DB-C3: **135 comparison routes / 89 canonical normalized routes / 78 comparison↔canonical route-ID overlaps / 57 comparison routes still legacy-only / 3 indexable routes**.
4. The backend database is **not complete**. Continue reviewed coverage expansion toward roughly **90%+ of the relevant low-cost route universe** while provenance and maintenance stay tractable.
5. **Public surface stays stable.** DB work must not create route pages, sitemap entries or ranking/publication changes without a separate publication decision.
6. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.

## JUST COMPLETED — Backend database coverage DB-C3

12/12 DB-C3 legacy-only routes were independently reviewed and normalized through reviewed packets.

Result: **7 ADMIT-BACKSTAGE / 5 HOLD / 0 REJECT**. HOLD preserves unresolved current-cost, provider-text or eligibility constraints for ASDA Mobile, Lyca Mobile UK, LMT Karte, Free Mobile France and Good2Go Canada rather than guessing them away.

Material corrections include ASDA activity-vs-credit-expiry separation, Lyca UK's O2→EE network correction, LMT's withdrawn EUR18/year estimate, Telekom Easy's current 180-day post-top-up validity, CALENDAR's JPY7,860 entry + JPY5,400 extension, RedPocket's current USD110 annual renewal, and removal of Orange Romania's unsupported EUR42/year estimate.

Canonical result after DB-C3: **89 routes / 51 markets / 86 brands / 67 networks / 293 sources**. Comparison remains **135**, comparison↔canonical overlap is **78**, **57 comparison routes remain legacy-only**, and explicit indexability remains **3**. PR #305 squash-merged as `82299c03500f029db1fb6241fbaaf4d5bcbcb3f0`; Eval Gate #949 and Vercel Preview/production passed. Live hub + VOXI route are HTTP 200; non-indexable ASDA route remains HTTP 404.

## ACTIVE — Backend database coverage DB-C4

Continue with the next distinct low-cost / decision-useful legacy-only routes. Legacy prices and labels are prioritization hints, not admission facts.

Candidates:

1. `cosmote-frog-13mo-2026`
2. `optus-flex-plus-au-2026`
3. `lebara-fr-2026`
4. `smart-prepaid-ph-2026`
5. `mtn-ng-keepmynumber-2026`
6. `id-mobile-uk-2026`
7. `us-mobile-light-2026`
8. `lycamobile-us-2026`
9. `orange-sn-sama-numero-2026`
10. `elisa-prepaid-fi-2026`
11. `cyta-soeasy-cy-2026`
12. `hotmobile-il-2026`

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
- do not bulk-admit the remaining 57 legacy-only routes without provenance + QC;
- do not equate canonical admission with SEO/indexability;
- do not duplicate same-product aliases;
- do not redesign backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
