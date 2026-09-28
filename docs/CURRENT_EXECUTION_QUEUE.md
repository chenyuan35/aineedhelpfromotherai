# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The current 135-route legacy comparison artifact remains valid product input behind the PR #263 manifest gate.
3. **Canonical v1 staged migration is proven, not yet coverage-parity.** After PR #280 it has 32 routes; 21 IDs overlap the 135-route comparison set and 114 remain legacy-only.
4. **Publication remains separate.** Canonical migration does not imply new route/market URLs, sitemap entries or indexability.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — UK MNO three-route canonical migration

Result: **PASS / Three + O2 Classic + EE migrated after current provenance reconciliation; no publication expansion.**

- PR #280 squash-merged as `39b9a620b300f218785e0a9b3ca85e45a9bc5168`; Eval Gate #896 and CI #165 passed; Vercel Preview and production succeeded;
- `three-uk-payg-180d-2026`, `o2-uk-classic-payg-6mo-2026`, and `ee-uk-payg-180d-2026` now exist in canonical v1 through reviewed packets;
- canonical `data/phone/v1` is 32 routes / 16 markets / 31 brands / 17 networks / 100 sources;
- overlap with the 135-route comparison set is 21; 114 comparison routes remain legacy-only; 169 of the 229 current legacy route-source IDs are still absent from canonical sources;
- Three stays candidate with the current 180-day chargeable-activity rule, corrected 15p standard SMS and GBP5 minimum top-up; Wi-Fi-only activity does not count and a disconnected number cannot be restored;
- O2 Classic stays observation/HOLD / avoid-route negative knowledge because current O2 guidance still says non-holders cannot switch to Classic;
- EE stays candidate with the current 160-day warning / 180-day hibernation / 90-day recovery / 270-day closure lifecycle, corrected 20p standard SMS and GBP5 minimum top-up, current acquisition URL, and physical PAYG voice-SIM semantics;
- QwenPaw default Agent (Kimi K3) independently ran read-only evidence retrieval and returned `RESEARCH CANDIDATE` findings; the coordinating session independently reconciled/admitted the data, so delegated output did not bypass the gate;
- the generic adapter reproduces all three reviewed comparison rows by exact deep equality; comparison coverage remains 135 routes, explicit indexability remains 3 routes, and the reviewed batch manifest remains authoritative;
- live Phone Directory returns HTTP 200; all three migrated standalone route URLs return HTTP 404, confirming no publication expansion.

## NEXT SESSION — US batch-A identity/provenance reconciliation before migration

**Session task:** work only on `us-directory-batch-a.json`: `ultra-mobile-paygo-3-2026`, `tello-paygo-credit-2026`, and `h2o-paygo-10-90d-2026`. The first gate is identity/provenance, not automatic migration.

### Scope

1. reverify current Ultra Mobile PayGo, Tello PAYG and H2O PayGo provider/source facts;
2. explicitly reconcile canonical `tello-us` against legacy `tello-paygo-credit-2026` before admission: do not duplicate one product under two route IDs, and do not collapse genuinely distinct product semantics into an alias;
3. preserve reviewed Tello economics: minimum PAYG top-up USD20 and 90-day credit expiry; remove/avoid the stale “one SMS every ~80 days” shorthand if it conflicts with current policy;
4. keep Ultra candidate semantics only if current USD3/month + roaming/activation facts remain supported;
5. keep H2O as observation/HOLD if China roaming or Wi-Fi Calling on the PAYG tier remains unverified;
6. if identity is lossless, map reviewed profiles through canonical snapshots and prove exact post-review adapter parity; do not migrate another batch or change publication/indexability.

### Definition of done

- a documented identity decision exists for `tello-us` vs `tello-paygo-credit-2026`;
- current source/economics fields for Ultra/Tello/H2O are reconciled without invented claims;
- if lossless representation is possible, the accepted US batch rows deep-equal their reviewed/current comparison rows after canonical adaptation;
- comparison remains 135 routes and explicit indexability remains 3;
- no new standalone URL or public comparison cutover occurs.

### Stop conditions

Stop and record the blocker if Tello identity cannot be represented without schema/alias redesign, any route loses provenance, a material contradiction cannot be represented honestly, exact adapter parity cannot be achieved, or publication/indexability would change. Do not compensate by switching to another batch.

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
