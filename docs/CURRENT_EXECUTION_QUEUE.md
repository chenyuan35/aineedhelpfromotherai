# Current Execution Queue

Last updated: 2026-09-17

This file is the atomic execution queue for `aineedhelpfromotherai.com`.

It does **not** replace `PROJECT_CONTEXT.md` or `docs/MASTER_PLAN.md`. Those remain the canonical project facts and roadmap. This queue only answers three operational questions for the next work round:

1. What was just completed?
2. What is the next eligible action?
3. What trigger, stop condition, or blocker controls that action?

If this queue conflicts with GitHub `main` facts or verified production state, the canonical fact sources and verified production win.

## Recently completed

### Q-001 — Phone verification-continuity validation pass

Status: **DONE**

- PR #81 merged on 2026-09-17.
- Four-service evidence matrix completed for Codex, ChatGPT, OpenAI API and Claude.
- English vs Chinese demand comparison completed.
- First bounded competitor/SERP classification completed.
- Product checkpoint remains **provisional NARROW**: verification continuity may become a compact decision layer inside the existing Phone canonical, not a new product or URL family.
- No production Phone repositioning was authorized or shipped.

Durable detail: `docs/PHONE_VERIFICATION_CONTINUITY_VALIDATION.md` and Issue #78.

### Q-002 — Cursor answer-first CTR experiment

Status: **DONE / MEASURING**

- PR #82 merged on 2026-09-17.
- Existing Cursor URL retained.
- Only build-time SEO title and meta description changed.
- Production title now: `When Does Cursor Usage Reset? Monthly Reset Calculator`.
- Production description now leads with the current answer: usage resets monthly with the billing cycle, not daily.
- H1, calculator logic, official-source claims and URL are unchanged.
- Production fetch verified HTTP 200 and the new metadata.

Baseline before the change:

- 2026-09-13: 38 impressions, 0 clicks, average position 4.42.
- 2026-09-14: 103 impressions, 0 clicks, average position 7.88.
- 141 settled impressions total for the two-day signal, 0 clicks.
- Visible queries include `cursor usage reset`, `does cursor reset daily`, `what time does cursor usage reset`, `when do cursor credits reset`, and `when does cursor reset usage`.

## Current measurement facts

As checked on 2026-09-17:

- GSC `settledThrough`: **2026-09-14**.
- Indexing tracker: **18 tracked / 9 indexed / 9 not indexed / 0 pending / 0 errors / 0 warnings**.
- Phone canonical: `URL is unknown to Google`, no recorded crawl yet.
- Phone public release date: **2026-09-16**.
- Therefore current settled GSC data does **not yet cover the public Phone release**.
- Early GA4 zeroes are not a negative product verdict.

## Ordered next actions

### Q-003 — Phone first real post-release measurement

Status: **WAITING ON DATA TRIGGER**

Trigger:

- GSC `settledThrough >= 2026-09-16`, or a later settled date that actually covers the public release.

When triggered, execute in this order:

1. Check Phone URL indexing state and last crawl.
2. Check Phone page impressions, queries, clicks, CTR and average position.
3. Check GA4 Phone landing/page sessions and available Phone behavior events such as `phone_route_result`, reminder/export actions and repeat/direct behavior if data exists.
4. Compare the evidence with `docs/PHONE_VERIFICATION_CONTINUITY_VALIDATION.md`.
5. Make exactly one decision: **KEEP**, **ADJUST**, or **NARROW**.
6. Record that decision in GitHub before any production change.

Do not repeatedly request indexing merely because the URL is still unknown before the normal tracker cadence has had time to work.

### Q-004 — Cursor CTR experiment readout

Status: **ACTIVE MEASUREMENT**

Trigger:

- the new title/description has been crawled and a materially larger post-change sample exists; target roughly **300–500 additional impressions** before another title change unless an obvious defect appears.

When triggered:

1. Compare post-change clicks, CTR, average position and query mix against the pre-change baseline.
2. If clicks/CTR improve at comparable positions, keep the title and continue measuring.
3. If CTR remains effectively zero, inspect actual query mix and rendered SERP/snippet behavior before changing copy again.
4. Do not add a new Cursor URL or new feature merely to respond to a CTR problem.

### Q-005 — Authority outreach round-one follow-up

Status: **SCHEDULED / NOT YET DUE**

Trigger:

- 5–7 days after the 2026-09-13 first outreach round, i.e. approximately **2026-09-18 through 2026-09-20**.

When triggered:

1. Read `docs/AUTHORITY_AND_AI_DISCOVERY.md` first.
2. Read the original three Gmail threads.
3. Classify each target as `REPLIED`, `LINKED`, `DECLINED`, `NO RESPONSE`, or follow-up due.
4. Independently verify any claimed link/citation before counting it.
5. Only after this review decide whether to send the prepared second batch.

Do not resend early and do not increase outreach volume because the first round is quiet.

### Q-006 — Indexing cohort monitor

Status: **MONITOR**

- Keep the 18-URL tracker running.
- Watch for the next crawl/index wave.
- Do not churn manual resubmissions.
- Treat new indexing as a signal to measure queries/CTR, not as permission to add more pages.

### Q-007 — Phone official-source and community watcher review

Status: **MONITOR / EVENT-DRIVEN**

Trigger:

- a material official-source hash/content change, or a repeated high-signal community pattern.

When triggered:

- manually review the evidence;
- separate provider fetch/block failures from actual policy changes;
- do not auto-rewrite production guidance from watcher output;
- keep the resource-tight observer workload frozen.

### Q-008 — AI retrieval integration blockers

Status: **HOLD / BLOCKED**

- Follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` in order.
- Do not bypass Tavily quota/auth/provider blockers by inventing a result.
- Do not skip a blocked/waiting AIR task to perform speculative provider-specific optimization.
- No paid upgrade without explicit user approval.

## Anti-scope-creep guard

Until an explicit trigger above fires, do **not** create:

- a fourth product surface;
- a second Phone canonical;
- provider/country/keyword doorway pages;
- a temporary-number/OTP marketplace;
- new accounts/email/SMS backends;
- new workloads on the resource-tight trial observer;
- paid SEO/data dependencies;
- repeated Cursor title changes without a post-change sample.

## Execution rule

Do not stop after reporting a result when another **eligible** queued action exists.

For each work round:

1. execute the highest-priority eligible item;
2. verify the result;
3. record what changed, evidence, blocker and next trigger;
4. immediately advance to the next eligible item that does not violate a wait/block/scope gate;
5. if every remaining item is legitimately waiting or blocked, do bounded non-destructive preparation or monitoring rather than manufacturing production work.

The queue should stay short. Completed history belongs in Git/PRs and task-specific ledgers; remove or compress stale queue items instead of letting this file become another large roadmap.