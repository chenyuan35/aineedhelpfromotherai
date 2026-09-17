# Session Handoff — 2026-09-17

Purpose: preserve the useful decisions from the Sep 17 working session, explicitly discard the low-value parts, and give the next session a direct execution starting point without relying on chat memory.

This document is a handoff aid, not a new source of truth. `PROJECT_CONTEXT.md`, `docs/MASTER_PLAN.md`, `docs/OPERATING_WORKFLOW.md`, `docs/CURRENT_EXECUTION_QUEUE.md`, task-specific ledgers, GitHub `main`, and verified production remain authoritative.

## What was valuable in this conversation

### 1. Plugin orchestration was turned into a real workflow

The useful conclusion was not “install more plugins.” It was to assign each connected tool one bounded role around GitHub:

- Notion Skill = role/bootstrap instructions, not current project state.
- GitHub = code, current facts, plan, queue, issues, PRs, durable decisions.
- GSC Wizard = first-party indexing/query/impression/CTR evidence.
- SE Ranking / other SEO providers = secondary estimates only when quota is usable.
- Firecrawl = bounded extraction or competitor/page-change work when it saves manual effort; do not duplicate existing watchers.
- Gmail / Metricool = distribution actions whose outcomes must be written back to GitHub.
- Mem / Linear = optional scratchpad or mirrored execution surfaces, never competing truth stores.

Durable workflow: `docs/PLUGIN_ORCHESTRATION.md`.

### 2. The execution style was corrected

A major failure mode in the session was stopping after each small action to explain status. The useful correction was to make work batch-oriented:

`execute highest-priority eligible item -> verify -> record -> immediately advance to next eligible item`.

`docs/CURRENT_EXECUTION_QUEUE.md` now exists specifically so the assistant does not repeatedly ask “what next?” or spend a new session reconstructing state.

### 3. Phone verification continuity was narrowed instead of allowed to expand scope

The bounded Codex / ChatGPT / OpenAI API / Claude research produced a provisional **NARROW** result. “Will I need this number again?” is real, especially for Codex-style failure cases, but current evidence does not justify a new verification product, Codex-only page family, temporary-number direction, or fourth product surface.

The useful product interpretation is: verification continuity may become a compact decision layer inside the existing Phone Number Survival Guide after real post-release behavior/search data exists.

Durable detail: `docs/PHONE_VERIFICATION_CONTINUITY_VALIDATION.md` and Issue #78.

### 4. Cursor became the first real search-signal experiment

GSC showed real Cursor impressions with zero clicks. The correct response was a small CTR experiment on the existing URL instead of building another feature or URL.

Pre-change settled baseline:

- 2026-09-13: 38 impressions, 0 clicks, avg position 4.42.
- 2026-09-14: 103 impressions, 0 clicks, avg position 7.88.
- Two-day total: 141 impressions, 0 clicks.

PR #82 changed only title/meta. Do not touch it again until a materially larger post-change sample exists.

### 5. The homepage finally got a concrete first-screen job

The most important product/marketing diagnosis in the conversation was that the old homepage did not tell a first-time visitor what to do or why the site should be remembered.

The useful resolution is now live:

- hook: **`AI stopped? Start here.`**
- question: **`What stopped?`**
- memorable map: **Reset · Access · Reliability**
- Reset: `When can I use AI again?`
- Access: `Will I still control the number?`
- Reliability: `Can I depend on this relay?`

Phone remains the featured primary product section. Reset gets the first immediate-action CTA because it already has live search intent. Relay remains the unique risk-information surface.

PR #87 then added a privacy-safe `home_job_select` event so the next homepage decision can be based on behavior instead of taste.

### 6. The next strategic principle is learning velocity, not founder imitation

The Jobs/Musk comparison was useful only as a prompt to identify a better decision rule. The project should not imitate personalities.

The better rule is:

> Choose the next action that reduces the largest important uncertainty with the least time, cost, maintenance burden, and irreversible risk.

A practical heuristic is:

`priority ~ potential impact × evidence strength × information gain / (time cost × recurring cost × irreversibility)`

This is not a numeric scoring system that must be mechanically calculated. It is a guard against doing work merely because it is possible.

The key operating question becomes:

> What can the next action prove or disprove fastest?

## What was low-value or should not be repeated

### 1. Repeated progress explanations

Several turns spent time explaining that work was running, why GSC lagged, or what had just happened. That created avoidable friction. Unless the user asks for a status report or an authorization is required, continue executing the queue and report at the end of the batch.

### 2. Date-language confusion

Saying “wait until Sep 16” on Sep 17 was imprecise. The real condition is data-state based: wait until GSC `settledThrough >= 2026-09-16` and the window actually covers the Phone public release.

Use trigger conditions, not vague calendar phrasing.

### 3. Too much abstract strategy without an executable test

“Focus,” “be like Jobs,” “move fast like Musk,” and similar frameworks are not evidence. Keep only the part that changes a test, priority, or stop condition.

### 4. Homepage copy churn

Once PR #85 and PR #87 shipped, further homepage rewriting became low-value without real sessions. The current hero must stay stable until behavior exists, except for a verified usability defect.

### 5. Plugin abundance as a goal

A connector is not valuable because it is available. Adding overlapping SEO/search/project-management plugins can create more quota problems, synchronization work, and false sources of truth. Use the smallest useful tool chain.

### 6. Fixed traffic quotas and percentage allocations without evidence

Ideas such as “get exactly 100–300 users” or permanently allocate “50% Reset / 35% Phone / 15% Relay” are useful only as rough planning prompts. They are not current facts or durable allocation rules.

The better target is qualified learning: high-intent users facing the actual problem, separated by job/channel, with observable actions.

## Current product thesis after this session

The site should be understood as a recovery/continuity utility for AI power users when their workflow gets interrupted:

- **Reset** answers when usage becomes available again.
- **Access** protects the phone-number/account dependency that may matter again later.
- **Reliability** evaluates a relay dependency using evidence and accumulated history.

Current provisional funnel roles, subject to data:

- **Reset = likely acquisition wedge** because it already has search impressions.
- **Phone = primary differentiation candidate** because the user problem is deeper and more defensible, but post-release search data is not settled yet.
- **Relay = unique/data-compounding surface** with a narrower audience and longer-term history advantage.

These are hypotheses, not permanent hierarchy rules. Real behavior/search/referral evidence can change them.

## Next decision system: Wedge / Demand Validation Sprint

The next stage should not be “build another feature.” It should identify the first repeatable path from a stranger with a real problem to meaningful product use.

### Objective

Find which of **Reset / Access / Reliability** most reliably turns high-intent external demand into:

`relevant visit -> first-screen/job selection -> tool open -> useful action -> possible return/referral`.

The goal is not raw visitor count. Random traffic has low information value.

### First bounded pass

Work in three cohorts:

1. **Reset** — active Cursor / Claude / AI usage-limit/reset questions.
2. **Access** — active AI account phone verification, durable-number, roaming/SMS, keep-alive or old-number access questions.
3. **Reliability** — active relay/prepay/dependency-risk discussions where the Exit Risk checker directly applies.

For each cohort:

- find a small set of current, high-intent contexts first;
- classify the user job and whether an existing page genuinely solves it;
- only contribute or link where the tool is directly relevant; no promotional link drops or forum spam;
- keep Google organic, social/community referral, AI referral, and direct/repeat traffic separate;
- use `home_job_select`, `tool_open`, `tool_action`, Phone-specific events, GSC, and GA4 as available;
- record every external action/outcome in `docs/AUTHORITY_AND_AI_DISCOVERY.md` when an action is actually taken.

### Decision after the pass

Do not ask “which product do we like most?” Ask which surface is producing the strongest combination of:

- repeated independent problem signals;
- qualified visits;
- meaningful tool actions;
- return/share/referral behavior;
- organic query growth or stronger search fit;
- maintainable differentiation.

Then deepen only that existing surface first. Do not create a fourth surface.

## Existing triggers that still control work

Do not override the current queue while running the demand-validation pass:

- **Phone:** first real decision only after GSC settled data covers the Sep 16 public release; make one KEEP / ADJUST / NARROW decision before changing production Phone positioning.
- **Cursor:** wait for roughly 300–500 additional post-change impressions before another title change unless a clear defect appears.
- **Homepage:** wait for real `home_job_select` / tool-open behavior before another hero/CTA rewrite.
- **Authority email:** first-round follow-up is due around Sep 18–20; do not resend early.
- **AIR:** keep ordered retrieval blockers intact; no paid quota bypass or speculative provider optimization.

## Handoff instruction for the next conversation

The next session must still start with the normal GitHub-main sequence:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md` Current progress checkpoint
3. `docs/MASTER_PLAN.md`
4. `docs/OPERATING_WORKFLOW.md`
5. `docs/CURRENT_EXECUTION_QUEUE.md`

Then read this file only because the queue points to the new wedge/demand-validation work.

Do not restart the strategic discussion from scratch. Do not rewrite the homepage again. Do not build a new feature merely to stay busy.

The next eligible non-destructive work is to begin the bounded Wedge / Demand Validation Sprint: locate current high-intent contexts for Reset, Access and Reliability, classify them, and prepare/execute only contextually useful distribution actions under the existing authority/distribution rules.

## Notion decision

Do **not** duplicate this changing handoff state into the Notion Project Operating Skill. That Skill should remain stable bootstrap instructions. GitHub is the correct handoff location because every new project session is required to read GitHub `main` before acting.

If a human-readable Notion page is later desired, it should be a pointer/index to GitHub, clearly labeled non-authoritative, rather than a manually maintained second copy of current project state.
