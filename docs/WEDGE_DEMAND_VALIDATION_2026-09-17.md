# Wedge / Demand Validation — First Bounded Pass

Date: 2026-09-17
Status: research pass complete; no production change and no external post/link drop made in this pass.

This note supports Q-010 in `docs/CURRENT_EXECUTION_QUEUE.md`. It records current high-intent contexts for the existing **Reset / Access / Reliability** surfaces and whether the current product already solves the active user job well enough to justify contextual distribution.

## Measurement checkpoint

GSC Wizard re-check on 2026-09-17 still reports `settledThrough=2026-09-14`.

- Phone canonical still reports `URL is unknown to Google`, with no recorded crawl.
- Phone therefore still has no settled post-release GSC window.
- Cursor still has the same settled baseline: Sep 13 = 38 impressions / 0 clicks; Sep 14 = 103 impressions / 0 clicks.
- No Phone/Cursor production change is triggered by this pass.

## Cohort readout

### 1. Reset — strongest immediately usable wedge

Current examples:

- Reddit r/ClaudeCode, Sep 2: `/limit-reset` discussion, about 667 votes when checked. Users explicitly ask whether the command consumes weekly usage and how the session reset relates to the weekly limit.
  - Source: `https://www.reddit.com/r/ClaudeCode/comments/1w5r1hv/this_is_new_limitreset_resets_your_session_limit/`
- Reddit r/ClaudeCode, Sep 16: `Limits are fixed!`, about 110 votes when checked. Users discuss sudden usage-window changes and how to notice them in account usage details.
  - Source: `https://www.reddit.com/r/ClaudeCode/comments/1whrr18/limits_are_fixed/`
- Reddit r/ClaudeCode, Sep 15: post about the Sep 13 promotion ending and the new permanent weekly-limit level, about 187 votes when checked; comments discuss whether another reset will happen.
  - Source: `https://www.reddit.com/r/ClaudeCode/comments/1wgtxrv/anthropic_really_likes_rubbing_it_in_reminder_the/`

User job:

- distinguish session reset from weekly reset;
- keep the exact account-specific reset visible;
- avoid assuming that an unexpected/provider-triggered refill changes the next weekly reset;
- understand what is documented vs what is only observed in the community.

Existing-page fit: **HIGH**.

`/tools/claude-code-limit-reset/` already tracks session and weekly reset times side by side, uses the timestamp shown by Claude, and explicitly says Anthropic public documentation checked for the page does not document `/limit-reset` as replenishing weekly quota.

Distribution implication: Reset is currently the cleanest cohort for a contextual contribution because the existing page directly solves the question without requiring a new feature or unsupported policy claim.

### 2. Access — strongest pain, but current distribution fit is only partial

Current examples:

- OpenAI Codex issue #25749, opened Jun 2 and still open when checked: users can authenticate normally and use ChatGPT but are blocked from Codex by an inaccessible legacy phone number; the issue has many same-problem reports and visible reactions.
  - Source: `https://github.com/openai/codex/issues/25749`
- OpenAI Codex issue #25837, opened Jun 2 and still open when checked: user moved countries, changed numbers, and cannot use paid Codex because there is no usable number-change path.
  - Source: `https://github.com/openai/codex/issues/25837`
- OpenAI Developer Community, Jul 7: paid user reports ChatGPT/platform login works with SSO/passkey while Codex still requires verification against an old number.
  - Source: `https://community.openai.com/t/codex-sign-in-asks-for-phone-verification-on-paid-account/1381357/117`

User job:

- know before binding an important account whether durable control of the number may matter later;
- understand that login authentication and a later product-specific phone gate can be separate layers;
- avoid losing access because a number is recycled, cancelled, or no longer reachable.

Existing-page fit: **MEDIUM / PARTIAL**.

The Phone Number Survival Guide solves durable-number selection, activation, SMS/OTP, travel, keep-alive and recovery. The separate validation ledger has strong Codex continuity evidence, but the production Phone canonical has not yet been repositioned around a service-specific verification-continuity result.

Distribution implication: do **not** drop the Phone link into Codex lockout threads yet. The pain is strong, but a post-hoc locked-out user needs a direct recovery answer that the current public page does not fully provide. Keep this as validation evidence until settled Phone behavior/search data justifies a compact continuity layer inside the existing canonical.

### 3. Reliability — real demand, but channel/context sensitive

Current examples:

- NodeLoc Sep 15–16: `关于少年拿云中转站跑路的事宜及中转站后续宣传要旨`, about 110 replies / 1.4k views when checked. The discussion triggered stricter promotion/deposit expectations for relay sellers.
  - Discovery surface: `https://www.nodeloc.com/`
- NodeLoc Sep 15–17: `中转站求推荐`, about 6 replies / 131 views when checked. The user asks for a free or very cheap relay, which is directly adjacent to a prepay/dependency-risk decision.
  - Source: `https://www.nodeloc.com/t/topic/108863`
- NodeLoc Sep 14: Yukiapi promotion thread explicitly references the recent relay shutdown/runaway discussion while presenting a new low-price relay offer.
  - Source: `https://www.nodeloc.com/t/topic/108588`

User job:

- decide whether a relay is dependable enough before prepaying or depending on it;
- separate current reachability/pricing evidence from lifecycle history and community survival expectations;
- avoid treating one anecdote or one community accusation as a calibrated fraud/shutdown probability.

Existing-page fit: **MEDIUM-HIGH**, but only when a concrete relay/domain can actually be checked.

`/tools/relay-exit-risk-checker/` is designed for this decision, but its 0–100 number is an evidence index, not a shutdown/fraud/scam probability. Missing evidence lowers confidence.

Distribution implication: a generic vendor-ad or already-failed-relay thread is not automatically a good place to link the checker. The strongest contextual use is a prepay/recommendation discussion where a candidate relay domain is available and the checker has enough evidence to return a meaningful result.

## Current wedge decision

For the next contextual distribution experiment, the order is:

1. **Reset first** — strongest combination of recency, activity and direct existing-page fit.
2. **Reliability second** — real live demand, but only when a concrete candidate domain and enough evidence exist.
3. **Access hold** — pain is real and strategically important, but current production-page fit is not yet strong enough for link-based distribution into lockout/recovery threads.

This is a distribution/readiness ordering for Q-010, not a permanent product hierarchy and not authorization for a new URL or feature.

## Stop / guard conditions

- No mass posting or repeated link drops.
- No posting into bypass/temp-number/OTP-circumvention contexts.
- No claims that Relay Exit Risk is a shutdown, scam or fraud probability.
- No Phone production repositioning before settled post-release evidence.
- No homepage or Cursor metadata churn while their existing measurement gates are still active.
- Record any actual external contribution immediately in `docs/AUTHORITY_AND_AI_DISCOVERY.md`.
