# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The current 135-route legacy comparison artifact remains valid product input behind the PR #263 manifest gate.
3. **Canonical v1 staged migration is proven, not yet coverage-parity.** After PR #276 it has 29 routes; 18 IDs overlap the 135-route comparison set and 117 remain legacy-only.
4. **Publication remains separate.** Canonical migration does not imply new route/market URLs, sitemap entries or indexability.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — Italy/Spain/Singapore three-route canonical migration

Result: **PASS / three reviewed routes migrated with current provenance reconciliation; no publication expansion.**

- PR #276 squash-merged as `952b6d13516bbb7756078c90d0c6d4e4880e4545`; Eval Gate #885 and CI #163 passed;
- `tim-prepaid-12mo-2026`, `movistar-prepago-6mo-2026`, and `singtel-hi-prepaid-passport-30d-2026` now exist in canonical v1 through reviewed packets;
- canonical `data/phone/v1` is 29 routes / 16 markets / 28 brands / 15 networks / 89 sources;
- overlap with the 135-route comparison set is 18; 117 comparison routes remain legacy-only;
- TIM retains the official 12-month lifecycle, current EUR5 recharge path, month-13 receive-only behavior and documented post-expiry reactivation window;
- Movistar retains the official six-month recharge lifecycle, EUR5 minimum recharge and 54-day receive/recovery tail;
- Singtel remains HOLD / negative knowledge for passport-only users: passport registration is capped at 30 days, self-registration is data-only, and durable retention requires Singpass or a Singapore-issued ID/work pass;
- the generic adapter reproduces all three reviewed comparison rows by exact deep equality;
- comparison coverage remains 135 routes, explicit indexability remains 3 routes, and the reviewed batch manifest remains authoritative;
- live Phone Directory returns HTTP 200; all three migrated standalone route URLs remain HTTP 404, confirming no publication expansion.

## NEXT SESSION — UK MNO three-route canonical migration

**Session task:** continue staged canonical coverage with exactly one already-admitted three-route batch.

Use `uk-mno-directory-batch-e.json`: `three-uk-payg-180d-2026`, `o2-uk-classic-payg-6mo-2026`, and `ee-uk-payg-180d-2026`.

### Scope

1. reverify the three target source IDs and current provider/provenance state before admission;
2. preserve Three UK and EE candidate semantics unless current evidence proves a target fact stale;
3. preserve O2 Classic PAYG as observation/HOLD negative knowledge unless current first-party evidence establishes a valid current route;
4. map market/network/brand/route identities and carry all three profiles through canonical snapshots without disturbing the existing UK pilot routes;
5. prove exact post-review adapter parity and keep `uk-mno-directory-batch-e.json` in the reviewed manifest;
6. run canonical/admission/publication/release checks; do not migrate another batch or change publication/indexability.

### Definition of done

- all three UK MNO batch routes exist in canonical v1 with complete references/provenance;
- canonical-derived rows deep-equal their reviewed/current comparison rows;
- comparison remains 135 routes and explicit indexability remains 3;
- existing Lebara/Giffgaff/VOXI public pilot behavior is unchanged;
- raw delegated output still cannot bypass review;
- no public comparison cutover or new standalone URL occurs.

### Stop conditions

Stop and record the blocker if any route requires schema redesign, loses provenance, has an unresolved contradiction that cannot be represented honestly, cannot reproduce the reviewed comparison row exactly, or changes publication/indexability. Do not compensate by broadening to another batch.

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
