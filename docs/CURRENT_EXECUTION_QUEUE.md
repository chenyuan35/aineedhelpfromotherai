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

### Q-009 — Homepage direct-help positioning

Status: **DONE / MEASURING**

- PR #84 first unified the existing three surfaces under one continuity story without adding a product.
- PR #85 then replaced the abstract first-screen wording with the direct hook **`AI stopped? Start here.`** and the choice **`What stopped?`**.
- The first viewport now maps **Reset · Access · Reliability** to three concrete jobs: usage limits, account-access phone continuity, and relay dependency risk.
- Phone remains the featured/primary product section; Reset gets the first immediate-action CTA because it already has proven search intent; Relay remains secondary.
- PR #85 merged as `98b3573b`. Eval Gate and Vercel passed; final apex desktop and mobile live fetches returned HTTP 200 with the new H1/title/meta.
- PR #87 added privacy-safe `home_job_select` analytics for first-screen `reset`, `access` and `reliability` choices, plus clearer first-screen placement labels for existing `tool_open` events. Production source verification confirmed the event tag is live.
- No new URL, provider, backend, image, paid dependency, or fourth product surface was created.

Measurement trigger:

- once GA4 has real homepage sessions, compare `home_job_select` by `job` and `placement` together with landing/tool-open behavior before changing the hero or CTA hierarchy again.
- until that trigger, do not rewrite the homepage again unless a verified usability defect appears.

### Q-011 — Historical build-to-present audit

Status: **DONE**

- PR #91 retired the first set of obsolete automatic Failure Memory/MCP workflows and aligned README/AI discovery text to the current product.
- PR #93 completed the deeper audit: remaining legacy auth/Render/npm automation is manual-only; stale root project/infrastructure docs now point to current fact sources; Vercel no longer proxies arbitrary `/api/*`; the direct backend defaults to health/status/diagnostics/Relay only and returns 410 for the old Failure Observatory/MCP/Memory/Agent surface.
- CI, Eval Gate and Vercel Preview passed before merge. Production Vercel and Qwen were verified after merge; Qwen dirty runtime data was preserved and only `api-server` was restarted. Relay Risk remains live and the old JSON `_tip` is gone.
- Three orphan test `node server.js` processes from old temporary audit worktrees were verified as non-production and removed, freeing about 260 MB RSS.
- Historical `/cases/` residual Search Console impressions do not justify revival or redirect; keep the real 404 and let the old index decay.
- Remaining blocker: GitHub repository description/topics still describe the old Failure Intelligence/MCP identity; current connector exposes no metadata-write action, so AIR-3 remains blocked rather than bypassed.

Durable detail: `docs/HISTORICAL_AUDIT_2026-09-17.md`.

### Q-012 — Task-list-first + daily Notion journal workflow

Status: **DONE**

- User-established durable cadence: every non-trivial work round starts from a bounded task checklist, then eligible items are executed continuously instead of waiting for item-by-item confirmation.
- Created the Notion page `aineedhelpfromotherai — Daily Project Journal` and wrote the 2026-09-17 entry with actual completed work, validation evidence, blockers and next triggers.
- Updated the Notion Project Operating Skill and GitHub workflow/plugin docs so the journal remains a human-readable traceability layer, never a competing source of truth.
- Canonical project state remains GitHub `main` plus verified production.

Durable detail: `docs/DAILY_NOTION_JOURNAL.md`.

## Current measurement facts

As checked on 2026-09-17:

- GSC `settledThrough`: **2026-09-14**.
- Indexing tracker: **18 tracked / 9 indexed / 9 not indexed / 0 pending / 0 errors / 0 warnings**.
- Phone canonical: `URL is unknown to Google`, no recorded crawl yet.
- Claude canonical: `URL is unknown to Google`, no recorded crawl yet.
- Phone public release date: **2026-09-16**.
- Phone and Claude pages both return HTTP 200, are indexable, self-canonical, have no `noindex`, and are linked from `/tools/`; no technical indexing blocker was found in the 2026-09-17 audit.
- Therefore current settled GSC data does **not yet cover the public Phone release**.
- Early GA4 zeroes are not a negative product verdict.

## Ordered next actions

### Q-013 — Phone hidden-route research reset + evidence audit

Status: **ACTIVE — METHODOLOGY CORRECTED / AUDIT IN PROGRESS**

Trigger:

- A 2026-09-17 AIS Thailand community thread exposed a structural defect in the prior Phone evidence workflow: a support-assisted `49B Validity 365 Days` route was initially treated as weak because the exact price was not exposed on a public AIS product page, even though the thread reproduced a direct AIS customer-service confirmation and independent current user reports describe the same support-assisted route.

Methodology:

- For Phone hidden-route research, read and follow `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` before route work.
- Community/user evidence is the discovery layer. Direct carrier support messages, authenticated carrier/app flows and multiple independent recent reproductions can establish a legitimate hidden route even when there is no public marketing page for it.
- Public official pages are primarily constraint/conflict/freshness evidence for hidden-route work; lack of a public indexed page is not a rejection criterion.
- Never turn hidden-route research into KYC/geography/security bypass advice.

First confirmed audit findings:

- **AIS Thailand:** the `49B / 365 days` path should be treated as a support-confirmed hidden retention route candidate, not ordinary community hearsay. Public AIS material separately confirms a 365-day prepaid validity mechanism; the remaining gap is the public/persistent detail for the support-assisted THB 49 price/eligibility, not whether the carrier supports 365-day validity.
- **Sakura Mobile:** current production research had overseas SMS/roaming marked unknown, while a current Sakura first-party help page explicitly states Voice+Data SIM/eSIM abroad supports calls and SMS but not cellular data. This is a concrete missed-evidence defect.
- **Ultra Mobile:** current research had Wi-Fi Calling abroad marked unknown, while Ultra currently publishes that Wi-Fi Calling is available on all Ultra plans and can be used while traveling internationally to call/text over Wi-Fi. PayGo-specific applicability still needs careful route-level confirmation rather than assuming every general-plan statement applies identically.
- **H2O PayGo:** deeper research supports the existing caution rather than overturning it: H2O's current PayGo material is for personal use in the U.S., while current international roaming is tied to Unlimited/12-Month plans rather than the PayGo route.

Audit sequence:

1. Inventory every current production Phone route and every `unknown`/`partial` field that materially changes a buying or retention decision.
2. Search community-first for hidden plans, support-assisted packages, app/account options, current user reproductions, refusals and policy changes.
3. Classify each claim as public first-party rule, private first-party support artifact, reproduced carrier/app flow, independent first-hand report, or secondary tutorial/aggregation.
4. Search for independent replication and recent failure reports; do not count copied tutorials as separate evidence.
5. Use official/regulator material to check explicit legal/KYC/geography/termination conflicts and to bound the route, not to decide whether an unadvertised route exists.
6. Produce a discrepancy matrix: `current product claim -> deeper evidence -> correction needed / keep / conflict`.
7. Only after the matrix is complete decide which factual corrections should ship to the existing Phone canonical and which new hidden routes have enough reproduction evidence to enter the same canonical.
8. Keep production stable during the audit unless an existing user-facing claim is clearly wrong and delaying correction would materially mislead users.

Stop / reject conditions:

- the route depends on forged KYC, deceptive support stories, stolen identities, unauthorized access, security bypass or prohibited geography evasion;
- evidence is copied/circular rather than independently reproduced;
- recent failures show the route is stale or agent-specific and no reliable current path remains;
- a current explicit carrier/regulator restriction genuinely conflicts with the proposed workflow after plan/account differences are resolved.

This audit is now the priority Phone research task. Do not return to an "official-page directory" model.

### Q-010 — Wedge / Demand Validation Sprint

Status: **ACTIVE — RESET DISTRIBUTION PUBLISHED / MEASURING**

Purpose:

- increase learning velocity while GSC/GA4 measurement triggers mature;
- identify which existing surface most reliably converts a real external problem into meaningful product use;
- test **Reset / Access / Reliability** without creating a new feature, URL, provider family, backend, or paid dependency.

Decision rule:

> Prefer the action that reduces the largest important uncertainty with the least time, recurring cost, maintenance burden and irreversible risk.

Detailed session audit and rationale: `docs/SESSION_HANDOFF_2026-09-17.md`.

First bounded research pass: `docs/WEDGE_DEMAND_VALIDATION_2026-09-17.md`.

Current readout:

- **Reset first** for contextual distribution remains the active cohort.
- Claude Reset Threads post published on 2026-09-17 at 19:00 Asia/Shanghai and was verified through Metricool. Immediate reporting had not populated yet; same-evening GA4 remained 0 and is preliminary only.
- A second bounded channel test used the already-indexed Cursor Reset page on Mastodon `@mini24`, whose established account identity is AI tools / developer resources. The post was published and publicly verified at `https://mastodon.social/@mini24/117286383729244067`; no engagement automation was run.
- Existing account-fit inventory now separates usable channels from off-topic accounts: Mastodon and DEV Community are strong fits; X/Twitter is the next high-fit text-channel candidate; Medium/Hashnode are conditional on editorial-series fit; the current Reddit and Bluesky accounts are intentionally excluded because their established account identities do not fit this project.
- **Reliability second**, only when a concrete relay/domain can actually be checked and the evidence is sufficient; do not use the index as a scam/shutdown probability.
- **Access hold for link-based distribution**: Codex old-number lockout pain is strong, but the current Phone canonical only partially solves the post-hoc recovery job. Keep it as validation evidence until settled Phone data justifies a compact continuity layer inside the existing canonical.
- No production code or product surface changed during this distribution round.

First pass, in this order:

1. Read `docs/AUTHORITY_AND_AI_DISCOVERY.md` before any external distribution action. **DONE for the current pass.**
2. Find a bounded set of current high-intent contexts for three cohorts: **DONE for the current pass.**
   - Reset: Cursor / Claude / AI usage-limit or reset questions.
   - Access: AI account phone verification, durable-number, roaming/SMS, keep-alive or old-number access questions.
   - Reliability: relay/prepay/dependency-risk discussions where the existing Exit Risk checker directly applies.
3. Classify each context by actual user job, recency, activity, fit with an existing page, and whether a helpful contribution can stand on its own without a link. **DONE for the current pass.**
4. Prefer a few high-fit contexts over random traffic or mass posting. **DONE — Reset remains the first cohort; off-topic existing accounts were excluded rather than repurposed.**
5. Only post/share when the existing page genuinely solves the discussion; no promotional link drops, fake engagement, paid links, or spam. **DONE for the current bounded Threads + Mastodon tests.**
6. When an external action is actually taken, record it immediately in `docs/AUTHORITY_AND_AI_DISCOVERY.md` and keep referral/social traffic separate from Google organic. **DONE for the current pass.**
7. Compare available `home_job_select`, `tool_open`, `tool_action`, Phone-specific events, GA4 referral/direct behavior and GSC query growth as data appears. **NEXT MEASUREMENT STEP once Threads/Mastodon reporting exists.**

Stop / narrow conditions:

- one cohort is mostly bypass/temp-number/spam intent rather than the product's legitimate job;
- a channel requires mass promotion to produce any signal;
- the existing page does not genuinely solve the active discussion;
- the experiment starts demanding a new product surface or large infrastructure change before demand is proven.

This sprint does **not** override the existing Phone, Cursor, homepage, outreach-timing or AIR triggers below.

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

### Q-007 — Phone hidden-route/community watcher review

Status: **MONITOR / EVENT-DRIVEN**

Trigger:

- a material repeated community/support-assisted route, current failure pattern, or official-source change.

When triggered:

- use community/support/app evidence to identify the concrete route first;
- search for independent current reproduction and recent failure/refusal reports;
- classify direct carrier support/app artifacts separately from ordinary community claims;
- use current official/regulator evidence to check conflicts and hard constraints;
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
- repeated Cursor title changes without a post-change sample;
- repeated homepage promise/CTA rewrites before real first-screen behavior exists;
- mass community posting, generic link drops, or duplicated outreach merely to manufacture traffic.

## Execution rule

Do not stop after reporting a result when another **eligible** queued action exists.

For each work round:

1. execute the highest-priority eligible item;
2. verify the result;
3. record what changed, evidence, blocker and next trigger;
4. immediately advance to the next eligible item that does not violate a wait/block/scope gate;
5. if every remaining item is legitimately waiting or blocked, do bounded non-destructive preparation or monitoring rather than manufacturing production work.

The queue should stay short. Completed history belongs in Git/PRs and task-specific ledgers; remove or compress stale queue items instead of letting this file become another large roadmap.
