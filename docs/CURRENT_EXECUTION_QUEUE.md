# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Backend database coverage and public/SEO publication are separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
3. After DB-C1: **135 comparison routes / 65 canonical normalized routes / 54 comparison↔canonical route-ID overlaps / 81 comparison routes still legacy-only / 3 indexable routes**.
4. The backend database is **not complete**. Continue reviewed coverage expansion toward roughly **90%+ of the relevant low-cost route universe** while provenance and maintenance stay tractable.
5. **Public surface stays stable.** DB work must not create route pages, sitemap entries or ranking/publication changes without a separate publication decision.
6. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.

## JUST COMPLETED — Backend database coverage DB-C1

12/12 legacy-only candidates were independently dispositioned and normalized through reviewed packets.

Result: **3 ADMIT-BACKSTAGE / 9 HOLD / 0 REJECT**, all retained as provenance-bearing canonical rows with uncertainty preserved.

Material stale/conflicting legacy claims corrected in DB-C1 include Telkomsel Rp5,000/year, Vodacom 83-day inactivity, Grameenphone BDT995/5-year pricing, A1 12-vs-13-month validity, Vodafone→One Hungary product identity, Proximus 12-month validity vs 6-month no-use deactivation, and Cellcard's conflicting 30-vs-180-day expired-balance recovery wording.

Canonical result after DB-C1: **65 routes / 42 markets / 230 sources**. Comparison remains 135 and indexability remains 3.

## ACTIVE — Backend database coverage DB-C2

Process the next low-cost legacy-only evidence batch, selected from the current comparison set by legacy keep-cost signal and product distinctness. Legacy prices are only prioritization hints; every figure must be reverified before canonical admission.

Candidates:

1. `tesco-mobile-payg-uk-2026`
2. `vinaphone-giu-so-vn-2026`
3. `cellfie-ge-90-45d-2026`
4. `kyivstar-prepaid-274-91-2026`
5. `dialog-lk-365d-2026`
6. `safaricom-daima-2026`
7. `truemove-validity-pack-th-2026`
8. `cht-ruyi-180d-2026`
9. `telia-ee-180d-2026`
10. `mts-sokhranyayu-nomer-2026`
11. `etisalat-wasel-ae-2026`
12. `claro-pre-br-90d-2026`

### DB-C2 acceptance flow

1. fetch current first-party acquisition, lifecycle/retention, KYC, payment and SIM/eSIM facts;
2. collect current independent evidence where it materially tests real use or conflicts;
3. independently sample-audit at least 3 routes;
4. classify every candidate `REJECT`, `HOLD` or `ADMIT-BACKSTAGE`;
5. create reviewed packets only after evidence review and apply through the canonical importer;
6. run canonical/integrity/publication-boundary tests;
7. merge only after Eval Gate + Preview pass;
8. continue to DB-C3 rather than waiting on public SEO measurement, unless a real evidence/maintenance stop condition is reached.

## PARALLEL — Community-discovered data eSIM signal intake

A fresh NodeSeek community post (`https://www.nodeseek.com/post-954805-1`) was captured on 2026-09-29 as a backstage-only raw signal pack: `data/phone/inbox/community-free-esim-nodeseek-954805-2026-09-29.json`.

It contains **8 providers / 9 offer mechanisms**: Airvoy, eSIM.io (free trial + wallet/PAYG), Nomad, Roamless, Firsty, USIMS, Eskimo and Jetpac. This lane intentionally preserves community-discovered/hidden mechanics even when provider public pages do not document them. Claims retain their provenance strength and uncertainty; lack of an official page is not by itself a rejection criterion.

QwenPaw/Kimi task `task-f93841364ef7` was started to collect independent community corroboration/contradiction but hit model quota before completing. The raw NodeSeek signal itself is already merged on main via PR #301; do not discard it because corroboration is incomplete.

No frontend publication or public recommendation is authorized by raw intake.

## SESSION HANDOFF — 2026-09-29 17:31 +08

**GitHub main truth at handoff:** PR #301 is merged at `d41a3f88f672bd7cde1b5cf9b76fcc9b8d374516`. Therefore main still has the post-DB-C1 canonical state: **65 routes / 42 markets / 230 sources** until DB-C2 is actually merged.

**DB-C2 work is complete locally but NOT on GitHub yet.** On the Qwen VPS, fresh worktree `/tmp/aineedhelp-phone-db-c2-20260929` contains local branch `data/phone-db-c2-20260929` with local commit `e986e8e` (`data(phone): complete DB-C2 coverage batch`). The GitHub branch with the same name was created from main but currently does **not** contain that local commit because the Qwen VPS has no GitHub push credential.

The local DB-C2 result is **77 canonical routes / 47 markets / 264 sources**, with **66 comparison↔canonical route-ID overlaps / 69 comparison routes still legacy-only**. All 12 DB-C2 candidates have reviewed packets and were applied to canonical. `TrueMove` and `Claro` remain uncertainty-preserving HOLD rows rather than being dropped.

Local validation already passed:

- `npm run phone:data:check` — PASS after replacing the stale hard-coded UK route count assertion with an inclusion-based assertion;
- Phone canonical migration tests — PASS;
- frontend production build — PASS;
- Phone public-release audit — PASS;
- public boundary remains **135 comparison routes / 3 explicit indexable routes**; DB-C2 did not authorize new frontend/index/sitemap pages.

**NEXT SESSION FIRST ACTION — do not start DB-C3 before this:** safely transfer the local DB-C2 commit/changes into the GitHub branch `data/phone-db-c2-20260929`, open a PR, run Eval Gate + Vercel Preview, merge only if green, then verify main is 77 / 47 / 264 and publication remains 135 / 3. Do not touch the dirty production worktree. If direct Git push is still unavailable, use the GitHub connector/API path rather than adding credentials to the VPS.

After DB-C2 is merged and main verified, immediately select DB-C3 from the remaining **69 legacy-only** comparison routes, prioritizing low-cost or mechanically distinct routes. Do not pause backend expansion merely because SEO measurement is still waiting.

## Measurement wait

Search Console remains too small for publication expansion. This does **not** block backend database coverage.

## Qwen / Kimi work lane

QwenPaw/Kimi are high-throughput backstage research/data workers. Raw output remains `RESEARCH_CANDIDATE` until reviewed. They do not control publication, roadmap, merge or deployment.

## External waits

- TikTok App Review — waiting; do not alter submitted configuration.
- Authority batch 2 — waiting; follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`.

## Do not do next

- do not stop backend coverage because public SEO measurement is waiting;
- do not bulk-admit the remaining legacy-only routes without provenance + QC;
- do not equate canonical admission with SEO/indexability;
- do not duplicate same-product aliases;
- do not redesign backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
