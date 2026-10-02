# Current Execution Queue

Last updated: 2026-10-02

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally a short atomic queue, not a historical log; completed detail belongs in Git history, PRs and task-specific docs.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **The user-facing Phone canonical has now advanced beyond a carrier list.** PR #340 (`60ff5457f2cc7982f0916b296427f0c1007c5c76`) released task-first decision shortcuts for lowest known yearly keep cost, longest documented keep window, OpenAI/Codex evidence and recently checked candidate routes. Eval Gate #1027 passed; Vercel production is READY; the production hub and shortcut JS returned HTTP 200.
3. **Backend database coverage and public/SEO publication remain separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
4. Current Phone state is **135 comparison routes / 128 canonical normalized routes / 117 comparison↔canonical route-ID overlaps / 18 legacy-only comparison route IDs / 3 indexable routes**.
5. The backend database is **not complete**. Continue reviewed coverage expansion toward roughly **90%+ of the relevant low-cost route universe** while provenance and maintenance stay tractable.
6. **Data-eSIM remains a separate normalized backstage family.** PR #328 preserves **59 source-label providers / 72 evidence records / 159 versioned offers** under `data/esim/v1`; it is not Phone canonical data, not a production frontend input, and has no public/indexable surface.
7. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.
Data-eSIM backstage contract: `data/esim/README.md` + `data/esim/v1/manifest.json`.

## JUST COMPLETED — Phone Radar task-first decision shortcuts

PR #340 adds a bounded decision layer to the existing Phone canonical without adding pages or changing the data/publication contract.

Released shortcuts:

- **Lowest keep cost** — ranks non-HOLD routes with a known yearly keep cost using the stored CNY comparison value.
- **Longest keep window** — ranks non-HOLD routes by the documented keep-alive interval.
- **ChatGPT evidence** — exposes routes with normalized OpenAI/Codex community reports; report counts are evidence samples, not invented OTP success percentages, and HOLD routes remain visibly marked.
- **Recently checked** — ranks non-HOLD candidate routes by latest stored verification date, then source count.

The cards show market, network, SIM type, acquisition cost, yearly keep cost, keep window, verification date, evidence state/source count and route state, then open the existing deep route evidence flow. Deep global evidence is still loaded progressively rather than embedded into initial HTML.

Verification:

- PR #340 squash merge: `60ff5457f2cc7982f0916b296427f0c1007c5c76`;
- Eval Gate #1027: PASS;
- Vercel production deployment `dpl_BbvDGk4EFrV1dWnRo6JdXJ1i5Rbu`: READY;
- production Phone hub: HTTP 200;
- production `phone-decision-shortcuts.js`: HTTP 200;
- publication boundary unchanged: **135 comparison / 128 canonical / 3 indexable**.

## JUST COMPLETED — Backend database coverage DB-C13

DB-C13 released in PR #338 (`3e5d6f58369eb4f53947f7a611a177ca58e7615c`). Final disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `telenor-kontantkort-se-2026` — HOLD; current sales/recharge economics and foreign-user registration remain unresolved.
- `telia-dk-prepaid-2026` — HOLD; the legacy prepaid identity is preserved but no current prepaid successor purchase/recharge/retention rule is established.
- `telemach-prepaid-si-2026` — ADMIT-BACKSTAGE; current FREE2GO pricing/recharge and 90/180/270-day lifecycle are normalized.

Released backend state: **128 routes / 76 markets / 125 brands / 101 networks / 461 sources / 117 comparison overlaps / 18 legacy-only route IDs / 3 indexable**.

## NEXT — Backend database coverage DB-C14

Bounded batch: `ooredoo-hala-qa-2026`, `claro-pre-cl-2026`, `claro-pre-co-2026`.

Definition of done:

- reverify current product identity;
- reverify lifecycle / keep-alive economics;
- reverify foreign-user KYC and acquisition path;
- reverify overseas SMS / OTP / roaming behavior;
- reverify payment constraints;
- preserve source provenance, uncertainty and reviewed admission states;
- pass the canonical importer/QC and existing Phone regression gates;
- **no public URL, sitemap or indexability change**.

Stop conditions:

- source conflict that cannot be reconciled conservatively;
- same-product alias collision;
- missing evidence that makes admission unsafe;
- provider/account blocker that requires authorization or payment.

Keep `sakura-mobile-voice-2026` excluded; it remains the known same-product alias blocker for canonical `sakura-japan-voice-data`.

## PARALLEL — Community Data-eSIM evidence intake

The three reviewed snapshots remain normalized only through the explicit `data/esim/v1` manifest. Raw inbox snapshots remain immutable provenance inputs.

Continue to append price/mechanic versions without overwriting history. Preserve community/third-party/referral/promotion, IP/egress, FUP/throttle and voice/SMS/number uncertainty as evidence. Do not auto-publish, auto-rank or force pure data eSIM into Phone-number/retention canonical routes.

Delegated worker output remains `RESEARCH_CANDIDATE` until coordinator review. Worker failure never invalidates already captured evidence and never bypasses QC.

## Measurement wait

Search Console remains too small for another publication wave. Finalized data through 2026-09-28 shows **5 Phone impressions / 0 clicks**; fresh 2026-09-29..30 adds **5 non-finalized impressions / 0 clicks** and no route-detail row.

Re-read when either:

- settled Phone impressions reach **20**, or
- finalized data reaches **2026-10-05**.

This wait does **not** block DB-C14 or community evidence acquisition.

## External waits

- TikTok App Review — waiting; do not alter submitted configuration until review changes state.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify any claimed citation/link independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not treat backend admission as authorization for SEO/indexable pages;
- do not bulk-admit the remaining 18 legacy-only route IDs without provenance + QC;
- do not duplicate same-product aliases;
- do not manufacture ranking/recommendation confidence from sparse evidence;
- do not auto-publish or rank Data-eSIM community evidence;
- do not redesign the backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
