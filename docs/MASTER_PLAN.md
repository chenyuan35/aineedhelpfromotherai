# Master Plan — Traffic Utility Site

Last updated: 2026-09-23

This is the project-wide progress board. `PROJECT_CONTEXT.md` answers what is true now; this file answers where the project is going and what comes next. `docs/OPERATING_WORKFLOW.md` defines execution.

## North-star goal

Build `aineedhelpfromotherai.com` into a low-cost utility site that earns small, stable AdSense revenue from organic traffic. First practical target: about RMB 100/month, then scale only what proves demand and defensible user value.

## Strategic correction — 2026-09-23

Product selection now requires two substitution tests before search volume, SEO opportunity or implementation effort matter:

1. **Official-source gate:** why can the user not solve the job adequately from the provider's own page/account UI or one ordinary search?
2. **Independent-competitor gate:** why should the user use us instead of the strongest existing independent product already solving the same job?

A candidate advances only when the project can state a concrete durable advantage: information asymmetry, uncertainty reduction, aggregation, monitoring/freshness, meaningful computation, proprietary history, decision-cost reduction, or a narrower workflow solved materially better than incumbents.

Evidence and decisions: `docs/PRODUCT_VALUE_GATE.md` and `docs/PRODUCT_DIRECTION_RESET_2026-09-23.md`.

## Product hierarchy

### 1. Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT

Canonical: `/tools/phone-number-survival-guide/`.

Core user job:

> Find a real, currently workable phone/eSIM route for SMS/OTP, long-term number survival, or travel connectivity when provider pages do not answer whether it works in practice.

Defensible value comes from current independent community outcomes, route history and reconciliation across fragmented reports. Provider/operator pages are used by default for commercial metadata only.

Do not create country/provider doorway pages. Improve the existing canonical first.

### 2. AI Reset Radar — FROZEN / VALUE-REVIEWED PORTFOLIO

No new generic reset pages and no Cursor-first optimization.

Current classifications:

- Cursor Usage Reset — **DOWNGRADE**;
- Claude Code Limit Reset — **REPURPOSE**;
- GitHub Copilot Credits Reset — **KEEP / DIFFERENTIATE**;
- Manus Credits Reset — **DOWNGRADE**;
- Replit Usage Reset — **DOWNGRADE**;
- Bolt Tokens Reset — **REPURPOSE**;
- AI Credit Burn Rate Calculator — **KEEP / DIFFERENTIATE**.

Codex demand is real, but generic Codex reset tracking is already served by multiple mature independent trackers. Do not build a generic Codex reset radar/history/countdown clone. Future Codex work is research-only until a narrower non-duplicative user job is proven.

### 3. Relay Exit Risk — DATA-ACCRUAL EXPERIMENT

Preserve the accepted methodology and production surface. Continue legitimate historical snapshots/lifecycle accumulation. Direct search demand has not yet been demonstrated, so do not prioritize search-led feature expansion.

### Existing generic utilities — MAINTENANCE ONLY

Keep passing utilities stable. Do not expand merely because a calculator is cheap to build.

## Phase board

| Phase | Goal | Status | Exit gate |
|---|---|---|---|
| P0 Foundation | Stable static site, safe deploy flow, durable handoff | DONE | Completed |
| P1 Initial tool inventory | Establish first useful portfolio | DONE | Completed |
| P2 Discovery & indexing | Make current cohort discoverable/indexed | DONE | Completed |
| P3 First search signals | Obtain real page/query evidence | DONE | Completed |
| P4 Product-direction correction | Reject weak/commodity product jobs and choose a defensible growth surface | **DONE** | Product hierarchy and dual substitution gates accepted |
| P5 Phone canonical growth | Make the existing Phone canonical unmistakably solve the community-backed user job | **ACTIVE** | Existing URL communicates the job clearly, exposes decision-critical fields, and passes preview/production verification if changed |
| P6 Evidence-gated depth | Add only depth that survives value + competition gates | QUEUED | One or more validated improvements show measurable search/usage value |
| P7 Distribution, authority & AI discovery | Earn relevant referral/link/citation visibility | ACTIVE PILOT | At least one repeatable relevant source plus measurable visibility |
| P8 Monetization | Turn useful traffic into stable AdSense revenue | QUEUED | First ~RMB 100/month, then optimize without harming UX |

## Current sprint

1. **DONE — Product direction reset.** Combined Search Console, live keyword data, current competitor coverage and current community pain. Search volume/ranking are no longer allowed to choose the product by themselves.
2. **DONE — Reset-family product-value audit.** Seven pages classified; no deletion/redirect performed.
3. **DONE — Competition gate added.** Mature independent competitors are now a hard substitution test before implementation.
4. **DONE — Phone canonical intent/value audit.** The existing canonical passed the core product-shell test but failed source-role/freshness truth in several places. Evidence: `docs/PHONE_CANONICAL_CONTRACT_AUDIT_2026-09-23.md`.
5. **NEXT — One bounded existing-URL Phone contract repair.** Correct the reproduced source-role defects, add truthful route freshness/confidence, expose material blockers compactly, tighten price/value labels, remove stale Reset leakage and align support/meta copy. No new route/page.
6. **QUEUED — Re-measure Phone after the accepted change.** Use Search Console and meaningful interaction evidence; keep organic separate from referral/social.
7. **ONGOING — Relay data accrual.** No search-led expansion without evidence.
8. **WAIT — TikTok review and authority batch 2.** Do not disturb external waits before their triggers.

## Phone canonical audit result

Audit status: **COMPLETE / CHANGE REQUIRED**.

KEEP:

- the existing canonical URL;
- three fixed families;
- route-first visual dashboard;
- inline Full guide;
- current title and H1;
- compact route identity, family-specific metrics and direct purchase actions.

CHANGE:

- homepage Phone framing still uses the retired `Official rules first` / `documented carrier rules` model;
- the Full guide currently exposes provider capability data as `SMS / current reality`;
- route-level freshness/confidence is not visible;
- material KYC/local-presence blockers are buried inside generic setup/detail text;
- some price/value labels are placeholders rather than reproduced current values;
- Phone still contains a stale related link to Claude Reset.

The next implementation remains bounded to those existing-URL defects. Operational claims must come from current independent/user outcomes; provider/operator data remains valid for current prices, package names, promotions, stock, purchase paths and published terms/constraints.

### Phone repair contract

The next bounded implementation must:

1. correct source-role truth on homepage Phone framing and Phone Full guide;
2. add compact route-level freshness/confidence from real evidence, with missing data lowering confidence rather than inventing a neutral value;
3. expose material KYC/local-presence blockers as concise metadata/warnings when they change the decision;
4. retain remote practicality and keep-alive cost while distinguishing official terms from reproduced operational outcomes;
5. replace generic live-price placeholders with last-verified values where available, otherwise state that checkout pricing is dynamic;
6. remove the stale Phone → Claude Reset related link;
7. align meta/support copy only after the underlying data-source truth is fixed.

Definition of done:

- existing Phone canonical only;
- no new route, country/provider doorway page or temporary-SMS backend;
- no fake OTP percentage, confidence score or Phone risk score;
- targeted tests pass;
- real Vercel Preview passes desktop/mobile light/dark checks;
- CI/Eval + Preview are green before merge;
- apex production is independently verified after merge.

## Measurement rules

- Search Console is a distribution signal after a product passes the value and competition gates; it is not the product selector.
- High impressions with low/no clicks may indicate weak SERP fit, weak user job, or both. Diagnose product value before rewriting snippets.
- Cursor's previous 300-impression checkpoint is retired as an automatic investment trigger.
- Phone's current lack of exact-page Search Console rows does not prohibit the bounded repair because independent demand/community evidence supports the underlying user job and the audit reproduced concrete contract defects.
- Google organic, social/referral, AI referral and direct/repeat behavior remain separate.
- Monetization work waits for meaningful traffic.

## Decision rules

- Every new product, expansion and winner-optimization task must pass `docs/PRODUCT_VALUE_GATE.md`.
- Do not build a wrapper around official documentation.
- Do not build a clone of a mature independent product without a specific user-visible advantage.
- Search volume cannot rescue a weak or commoditized user job.
- Existing pages are not grandfathered in because development effort has already been spent.
- Phone operational reality comes from current independent user/community outcomes and route history.
- Operator/provider pages serve commercial metadata and published constraints by default, not operational certification.
- One clear user task per page; avoid thin/near-duplicate/keyword doorway pages.
- Improve existing URLs before adding similar URLs.
- Missing data lowers confidence; do not fabricate certainty.
- No fake OTP percentages, arbitrary Phone risk scores, Relay shutdown probabilities or fake calibration claims.
- Keep AI discovery non-adversarial and provider blockers explicit.

## External waits

### TikTok App Review

Status: **SUBMITTED / WAITING**. Do not Recall or change submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested.

### Authority batch 2

Status: **SENT / WAITING**. Learn Cursor + explainx.ai were sent 2026-09-22. Do not add a third target or follow up before 2026-09-29 or later. Verify original Gmail threads and public links before any follow-up.

## Tool/provider blockers

- Ubersuggest: Sep 23 live evidence collected, then daily report quota exhausted; do not rotate accounts or upgrade without authorization.
- Ahrefs: current API access returned `Insufficient plan`.
- Semrush: current connector returned `no_api_units`.

Treat these as provider limits, not evidence failures.

## Source-of-truth map

| Need | Source |
|---|---|
| Current factual state | `PROJECT_CONTEXT.md` |
| Whole-project stage / priorities | `docs/MASTER_PLAN.md` |
| Atomic next actions | `docs/CURRENT_EXECUTION_QUEUE.md` |
| Product/competition gates | `docs/PRODUCT_VALUE_GATE.md` |
| Sep 23 strategy evidence | `docs/PRODUCT_DIRECTION_RESET_2026-09-23.md` |
| Execution procedure | `docs/OPERATING_WORKFLOW.md` |
| Phone canonical audit | `docs/PHONE_CANONICAL_CONTRACT_AUDIT_2026-09-23.md` |
| Phone durable definition | `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` |
| Phone research method | `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` |
| Phone visual baseline | `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md` + `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md` |
| Search performance evidence | `docs/GSC_MEASUREMENT_2026-09-22.md` + current Windsor Search Console reads |
| Relay methodology | `docs/RELAY_RISK_METHODOLOGY.md` |
| Authority/referral | `docs/AUTHORITY_AND_AI_DISCOVERY.md` + original Gmail threads |
| AI retrieval | `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` |
| Code/deployment truth | GitHub `main` + verified production |
