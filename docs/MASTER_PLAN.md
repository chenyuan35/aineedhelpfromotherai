# Master Plan — Traffic Utility Site

Last updated: 2026-09-23

This is the project-wide progress board. `PROJECT_CONTEXT.md` answers what is true now; this file answers where the project is going and what comes next. `docs/OPERATING_WORKFLOW.md` defines execution.

## North-star goal

Build `aineedhelpfromotherai.com` into a low-cost utility site that earns small, stable AdSense revenue from organic traffic. First practical target: about RMB 100/month, then scale only what proves demand and defensible user value.

## Strategic correction — 2026-09-23

Product selection requires two substitution tests before search volume, SEO opportunity or implementation effort matter:

1. **Official-source gate:** why can the user not solve the job adequately from the provider's own page/account UI or one ordinary search?
2. **Independent-competitor gate:** why should the user use us instead of the strongest existing independent product already solving the same job?

A candidate advances only when the project can state a concrete durable advantage: information asymmetry, uncertainty reduction, aggregation, monitoring/freshness, meaningful computation, proprietary history, decision-cost reduction, or a narrower workflow solved materially better than incumbents.

Evidence and decisions: `docs/PRODUCT_VALUE_GATE.md` and `docs/PRODUCT_DIRECTION_RESET_2026-09-23.md`.

## Phone product correction — shipped 2026-09-23

The earlier Phone implementation correctly moved away from official-documentation framing, but the long-term-number UX remained too flat and too small-shortlist-oriented. The accepted correction is defined in `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` and was shipped through PR #203.

The product model is:

- Phone Radar is a visual **carrier/number directory + comparison matrix**;
- hierarchy: `market → host network/carrier group → brand/MVNO → concrete route/product/acquisition path → observed events`;
- the user sees real landed cost, CNY estimate, yearly keep cost, exact keep action, data/tariff, China/overseas activation, KYC/device/payment friction, Wi-Fi Calling/roaming SMS, service-specific verification evidence, recycling/suspension history, refund/recovery outcomes, trend, evidence count and freshness;
- detailed guides explain how to acquire, activate, test, keep and recover a route;
- rankings are transparent/use-case-specific; no arbitrary hidden score;
- compatibility percentages are allowed only as observed rates with visible denominator/date when enough independent recent samples exist;
- operator pages provide commercial facts, while forum/community evidence provides operational reality.

The first shipped implementation is a bounded UK pilot on the existing canonical, not a new URL or country doorway family.

## Product hierarchy

### 1. Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT

Canonical: `/tools/phone-number-survival-guide/`.

Core user job:

> See, in one visual directory, what a real number route actually costs to obtain and maintain, what services it currently works with, how stable the number is, and exactly how to get it—without reading fragmented forum threads first.

Defensible value comes from current independent community outcomes, cheap acquisition paths, discounts, true landed cost, keep-alive methods, app compatibility observations, route history and reconciliation across fragmented reports.

The UK pilot now exposes Vodafone UK / VOXI / Lebara UK / O2 / Giffgaff groupings, dense comparison fields, evidence-gated service observations and detailed guide flow. Data SIM/eSIM and Temporary SMS remain separate top-level families.

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
| P5 Phone canonical growth | Turn the existing Phone canonical into the accepted carrier/number directory and comparison matrix | **DONE — UK PILOT SHIPPED / PRODUCTION VERIFIED** | PR #203 merged; Eval #693 passed; Vercel production succeeded; live canonical verified HTTP 200 with grouped UK matrix + guide flow |
| P6 Evidence-gated depth | Add only depth that survives value + competition gates | **QUEUED / MEASUREMENT GATE FIRST** | One or more validated improvements show measurable search/usage value |
| P7 Distribution, authority & AI discovery | Earn relevant referral/link/citation visibility | ACTIVE PILOT | At least one repeatable relevant source plus measurable visibility |
| P8 Monetization | Turn useful traffic into stable AdSense revenue | QUEUED | First ~RMB 100/month, then optimize without harming UX |

## Current sprint

1. **DONE — Product direction reset.** Search volume/ranking are no longer allowed to choose the product by themselves.
2. **DONE — Reset-family product-value audit.** Seven pages classified; no impulsive deletion/redirect.
3. **DONE — Competition gate added.** Mature independent competitors are a hard substitution test before implementation.
4. **DONE — Phone same-URL source-role correction.** PR #198 corrected homepage + existing Phone canonical framing and exposed more practical route evidence.
5. **DONE — Phone carrier-directory product correction.** `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` fixed the hierarchy, matrix fields, ranking/evidence rules, cost model and guide contract.
6. **DONE — UK pilot implementation/release.** PR #203 shipped the bounded UK matrix/mobile implementation on the existing canonical. Eval Gate #693 passed; Vercel Preview/production status succeeded; forced live production fetch returned HTTP 200 and confirmed the matrix, guide, and unchanged Data/Temporary families.
7. **NEXT — Re-measure Phone after evidence accrues.** Do not interpret the first hours after deployment as meaningful search evidence. Use Search Console plus meaningful interaction evidence; keep organic separate from referral/social/direct and AI referral.
8. **ONGOING — Relay data accrual.** No search-led expansion without evidence.
9. **WAIT — TikTok review and authority batch 2.** Do not disturb external waits before their triggers.

## Phone directory implementation contract

Status: **SHIPPED 2026-09-23 via PR #203 (`084de00f`)**.

Source of truth: `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md`.

Implemented MVP rules:

- preserved `/tools/phone-number-survival-guide/`;
- preserved the three top-level families;
- Long-term SMS/OTP now renders a grouped UK country/network/brand/route matrix;
- desktop uses a compact comparison matrix with horizontal access to dense metrics;
- mobile uses compact grouped cards from the same normalized data;
- shows landed acquisition cost, approximate CNY cost when supported, yearly keep cost/action, activation/KYC/Wi-Fi Calling/roaming state, service-specific evidence, continuity events, refund/recovery state, trend, sample count and freshness;
- provides detailed in-page guides;
- uses a small UK pilot first rather than weak global bulk-fill;
- no arbitrary 0–100 Phone risk score;
- observed success percentages require visible sample size/date and at least five reasonably independent recent route+service+operation observations;
- missing data remains missing and cannot improve rank;
- community/forum evidence drives operational claims; provider pages provide commercial metadata.

The current UK packet does not meet the `n >= 5` threshold for the displayed app route+service+operation samples, so the release shows counts/qualitative states rather than fabricated percentages.

## Measurement rules

- Search Console is a distribution signal after a product passes value/competition gates; it is not the product selector.
- A known product-model defect should be corrected before waiting for GSC to validate the wrong interface.
- After the directory correction ships, allow a meaningful post-deploy window before interpreting search performance.
- High impressions with low/no clicks may indicate weak SERP fit, weak user job, or both; diagnose before snippet-only rewrites.
- Clicks with weak tool usage should lead to existing-canonical UX/value improvements based on interaction evidence.
- Google organic, social/referral, AI referral and direct/repeat behavior remain separate.
- Monetization work waits for meaningful traffic.
- Expansion to another market/network must pass evidence quality + product value gates; shipping one pilot is not evidence to bulk-expand.

## Decision rules

- Every new product, expansion and winner-optimization task must pass `docs/PRODUCT_VALUE_GATE.md`.
- Do not build a wrapper around official documentation.
- Do not build a clone of a mature independent product without a specific user-visible advantage.
- Search volume cannot rescue a weak or commoditized user job.
- Existing pages are not grandfathered in because development effort has already been spent.
- Phone operational reality comes from current independent user/community outcomes and route history.
- Operator/provider pages serve commercial metadata by default, not operational certification.
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
| Current Phone directory/matrix contract | `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` |
| UK Phone evidence packet | `docs/PHONE_UK_PILOT_SOURCE_PACKET_2026-09-23.md` |
| Normalized UK pilot data | `frontend/tools/phone-number-lifecycle-mvp/uk-directory-pilot.json` |
| Prior Phone same-URL audit | `docs/PHONE_CANONICAL_CONTRACT_AUDIT_2026-09-23.md` |
| Execution procedure | `docs/OPERATING_WORKFLOW.md` |
| Phone research method | `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` |
| Search performance evidence | `docs/GSC_MEASUREMENT_2026-09-22.md` + current GSC reads |
| Relay methodology | `docs/RELAY_RISK_METHODOLOGY.md` |
| Authority/referral | `docs/AUTHORITY_AND_AI_DISCOVERY.md` + original Gmail threads |
