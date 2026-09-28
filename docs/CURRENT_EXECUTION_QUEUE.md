# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The current 135-route legacy comparison artifact remains valid product input behind the PR #263 manifest gate.
3. **Canonical v1 staged migration is proven across multiple reviewed routes, not yet coverage-parity.** After PR #270 it has 20 routes; nine IDs overlap the 135-route comparison set and 126 remain legacy-only.
4. **Publication remains separate.** Canonical migration does not imply new route/market URLs, sitemap entries or indexability.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — Taiwan two-route canonical migration

Result: **PASS / two more reviewed routes migrated; one stale target-row hold corrected from current official evidence; no publication expansion.**

- PR #270 squash-merged as `ff52777dcc01925c5a848258bc4f39a06c16aef0`; Eval Gate #873, CI #157, Vercel Preview and production deployment `dpl_GMuZ5gmRD5QCuHER7LhFJKrod2Z5` passed;
- `taiwan-mobile-prepaid-tw-2026` and `fareastone-prepaid-tw-2026` now exist in canonical v1 through reviewed migration packets;
- canonical `data/phone/v1` is now 20 routes / 11 markets / 19 brands / 7 networks / 67 sources;
- route-ID overlap with the 135-route comparison set increased from 7 to 9; 126 comparison routes remain legacy-only;
- legacy comparison routes reference 213 distinct source IDs; 186 remain absent from canonical sources;
- current FarEasTone official terms resolve the prior retention hold: six-month validity from activation/recharge, communication-credit recharge from NT$100, modeled as TWD 200/year (≈CNY 46 using the existing batch FX snapshot);
- the generic adapter reproduces both corrected Taiwan comparison rows by exact deep equality;
- legacy comparison coverage remains 135 routes, explicit indexability remains 3 routes, and the reviewed batch manifest remains authoritative;
- live Directory and comparison-index return HTTP 200; the FarEasTone standalone route remains HTTP 404/noindex.

## NEXT SESSION — Germany/Malaysia three-route canonical migration

**Session task:** continue staged canonical coverage with exactly one already-admitted three-route batch.

Use `de-my-directory-batch-f.json`: `aldi-talk-activity-window-2026`, `vodafone-callya-90d-2026`, and `hotlink-pantas-365-pass-2026`.

### Scope

1. verify each target row's current source/provenance before canonical admission;
2. reconcile only a target-row fact that current evidence proves stale, otherwise preserve its candidate/observation semantics;
3. map market / network / brand / route identities and complete source provenance into canonical v1;
4. carry all three comparison profiles through the existing canonical snapshot model and prove exact adapter parity after any bounded reconciliation;
5. keep `de-my-directory-batch-f.json` in the reviewed legacy manifest and keep the 135-route comparison artifact authoritative;
6. run canonical data checks plus existing admission/publication/release tests; do not migrate another batch or change publication/indexability.

### Definition of done

- all three routes exist in canonical v1 with complete references and provenance;
- canonical-derived comparison rows deep-equal their reviewed/current legacy rows;
- current 135-route comparison coverage and 3-route explicit indexability are unchanged;
- raw/staging delegated output still cannot bypass review;
- no public comparison cutover or new standalone URLs occur.

### Stop conditions

Stop and document the exact blocker if any route requires schema redesign, loses provenance, has unresolved contradictory current evidence, cannot reproduce the reviewed comparison row exactly, or changes publication/indexability. Do not compensate by broadening to another batch.

## Qwen / Kimi work lane

QwenPaw/Kimi remain high-throughput backstage research/data workers. Their outputs are `RESEARCH CANDIDATE` until reviewed; they do not control canonical admission, publication, roadmap or deployment.

## External waits

- **TikTok App Review — WAITING.** Do not alter the submitted configuration until review outcome.
- **Authority batch 2 — WAITING.** Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; no extra outreach merely to create activity.

## Do not do next

- do not bulk-migrate the remaining legacy batches; continue one reviewed batch at a time while exact parity is enforced;
- do not remove the PR #263 manifest gate yet;
- do not shrink the 135-route comparison surface to match the smaller canonical set;
- do not equate canonical admission with SEO/indexability;
- do not add a backend or redesign the schema for architectural neatness;
- do not let Qwen/Kimi raw output bypass review/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
