# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The current 135-route legacy comparison artifact remains valid product input behind the PR #263 manifest gate.
3. **Canonical v1 staged migration is proven, not yet coverage-parity.** After PR #274 it has 26 routes; fifteen IDs overlap the 135-route comparison set and 120 remain legacy-only.
4. **Publication remains separate.** Canonical migration does not imply new route/market URLs, sitemap entries or indexability.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — Hong Kong three-route canonical migration

Result: **PASS / three reviewed routes migrated with bounded provenance reconciliation; no publication expansion.**

- PR #274 squash-merged as `251528d3e279e8a99b075601bb8e2742d186ba5e`; Eval Gate #881, CI #161, Vercel Preview and production passed;
- `clubsim-sms-pack-6hkd-2026`, `sosim-recharge-ladder-2026`, and `threehk-diy-recharge-2026` now exist in canonical v1 through reviewed packets;
- canonical `data/phone/v1` is 26 routes / 13 markets / 25 brands / 12 networks / 82 sources;
- overlap with the 135-route comparison set is 15; 120 comparison routes remain legacy-only;
- legacy comparison routes reference 218 distinct source IDs; 176 remain absent from canonical sources;
- ClubSIM retains the current official-web HK$6 SMS-pack price while explicitly preserving the 2026 in-app availability conflict instead of presenting HK$6 as guaranteed across channels;
- SoSIM now uses the current HK$33 official entry price and the official HK$100→180d / HK$200→365d / HK$500+→730d validity ladder plus conditional expired-number recovery;
- 3HK DIY no longer inherits the unrelated SIM World International Supreme Card HK$50/365d voucher table; the retained DIY model uses DIY-specific official baseline plus independent recharge reproduction;
- batch source metadata can now preserve exact per-source URLs through the legacy comparison rebuild;
- the generic adapter reproduces all three reviewed comparison rows by exact deep equality;
- comparison coverage remains 135 routes, explicit indexability remains 3 routes, and the reviewed batch manifest remains authoritative;
- live Directory and comparison-index return HTTP 200; all three migrated standalone route URLs remain HTTP 404/noindex.

## NEXT SESSION — Italy/Spain/Singapore three-route canonical migration

**Session task:** continue staged canonical coverage with exactly one already-admitted three-route batch.

Use `it-es-sg-directory-batch-h.json`: `tim-prepaid-12mo-2026`, `movistar-prepago-6mo-2026`, and `singtel-hi-prepaid-passport-30d-2026`.

### Scope

1. reverify the three target source IDs and current provider/provenance state before admission;
2. preserve TIM and Movistar candidate semantics unless current evidence proves a target fact stale;
3. preserve Singtel’s passport-based 30-day validity/registration blocker as negative knowledge rather than converting it into a recommendation;
4. map market/network/brand/route identities and carry all three profiles through canonical snapshots;
5. prove exact post-review adapter parity and keep `it-es-sg-directory-batch-h.json` in the reviewed manifest;
6. run canonical/admission/publication/release checks; do not migrate another batch or change publication/indexability.

### Definition of done

- all three IT/ES/SG routes exist in canonical v1 with complete references/provenance;
- canonical-derived rows deep-equal their reviewed/current comparison rows;
- comparison remains 135 routes and explicit indexability remains 3;
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
