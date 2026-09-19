# Cursor Usage Pool / Quota Explainer — research evidence

Last updated: 2026-09-19

Status: **Q-015A research pass complete enough for MVP design; implementation remains gated by Q-002 clean CTR data and Q-014J Phone closure.**

## Official current behavior

Verified from Cursor official documentation on 2026-09-19:

1. Most current paid plans expose two separate monthly usage pools:
   - `Cursor Models`
   - `Other Models`
2. Both reset with the account/team monthly billing cycle.
3. Pro, Pro Plus and Ultra include both pools; Start covers Cursor Models only.
4. Third-party models draw from `Other Models` at model/API pricing.
5. Cursor first-party models draw from `Cursor Models`.
6. Model selection changes consumption speed because rates differ by model and token category.
7. Cursor Router / Auto bills at the model actually selected for each routed request, so a single Auto label is not enough to infer one exact cost.
8. The Spending dashboard is the account-specific source of truth for current allowance, remaining usage, reset date and on-demand usage.
9. BYOK behavior differs between individual and Teams/Enterprise plans and therefore should not be folded into one universal allowance calculation.
10. On-demand usage is separate from included pool balance and must not be presented as remaining included quota.

Official sources:

- `https://prod.cursor.com/help/models-and-usage/usage-limits`
- `https://cursor.com/docs/models-and-pricing`
- `https://cursor.com/terms/pricing`
- `https://cursor.com/pricing`

## Current plan/model implications for the MVP

The calculator must not use one fixed `$ per token` rate.

Current official pricing exposes separate rate fields by model, including:

- input;
- cache write when applicable;
- cache read;
- output.

Some models also have Fast variants with materially different prices. Therefore a user can consume fewer raw tokens while burning a larger share of included usage.

Implementation consequence:

- raw total token count alone is insufficient;
- when token breakdown is available, calculate each category separately;
- when only usage percentage is available, calculate pace from percentage/time rather than inventing dollar value;
- when Auto/Router is used without request-level model information, return `Mixed / estimated` rather than a precise model-cost result.

## Recent user evidence

### 1. Fewer tokens, faster 100%, models disappear

Cursor Community Forum, Sep 10–14, 2026:

`https://forum.cursor.com/t/usage-hits-100-with-fewer-tokens-gpt-claude-vanish-dashboard-hides-cost/171202`

A Pro Plus user reported the current cycle reaching 100% at materially fewer raw tokens than the previous cycle. The thread includes a Cursor staff response explaining that included usage is billed by request/model cost rather than raw token count and that Fast model usage can burn allowance faster.

Other users in the same thread reported similar unexpectedly fast percentage movement and difficulty identifying the cause from the self-serve dashboard.

Product implication:

- explain cost-weighted usage prominently;
- expose Fast/non-Fast differences when the selected model has them;
- never imply that token count should map linearly to percentage used.

### 2. Same workflow, unexpectedly high early-cycle usage

Cursor Community Forum, Sep 5, 2026:

`https://forum.cursor.com/t/change-in-token-usage-billing/170724`

A user reported consuming roughly 11% of the new monthly allowance after basic early-cycle work despite saying their workflow had not materially changed.

Product implication:

- depletion projection is useful even before the user understands exact model cost;
- percentage/time pace should be a first-class answer, not hidden behind token accounting.

### 3. Similar token composition, different pool outcomes

Cursor Community Forum, Sep 11, 2026:

`https://forum.cursor.com/t/why-is-my-cursor-pro-usage-limit-much-lower-than-other-pro-users/169668/18`

A user comparing two accounts reported substantially different Cursor Models pool depletion despite broadly similar cache-read-heavy token composition and described a support investigation.

Product implication:

- do not reverse-engineer a guaranteed plan allowance from public plan name alone;
- user dashboard percentage remains authoritative;
- any implied dollar allowance derived from user-entered spend + percentage must be explicitly labelled an estimate.

### 4. Dashboard percentage itself can be stale or disputed

Cursor Community Forum, Sep 1, 2026:

`https://forum.cursor.com/t/cursor-usages-is-not-showing-correct-information/170210`

A user reported one account's Spending percentage appearing stuck while other accounts updated normally.

Product implication:

- calculator should say that it transforms user-entered dashboard values; it cannot verify Cursor's backend accounting;
- no language such as `your true quota is...`.

### 5. Exhaustion behavior differs from simple model availability assumptions

Cursor Community Forum, Sep 7, 2026:

`https://forum.cursor.com/t/included-usage-exhausted-why-did-composer-2-5-fast-stop-being-available-for-free/170709`

A Cursor staff reply explained a limited reduced-speed courtesy amount after included usage exhaustion for the discussed Teams case, not an unlimited fallback.

Product implication:

- do not promise a universal post-100% fallback;
- show `what happens next depends on plan/account settings` and defer to Spending/on-demand settings.

## Search / CTR state

Q-002 title/meta change commit:

`ed1ba68b042901e193e6e9fb4c7f3804a6aea0c7`

Commit time: 2026-09-17 09:13 +08 = 2026-09-16 18:13 in Search Console's `America/Los_Angeles` date basis.

GSC checked 2026-09-19 and currently settles only through `2026-09-16`.

Observed page performance:

| Date | Impressions | Clicks | Position |
|---|---:|---:|---:|
| Sep 13 | 38 | 0 | 4.42 |
| Sep 14 | 103 | 0 | 7.88 |
| Sep 15 | 141 | 0 | 6.74 |
| Sep 16 | 48 | 0 | 7.06 |

Sep 16 is a mixed pre/post-change day. Clean post-change measurement begins Sep 17, which is not settled yet.

Conclusion: **there is no clean evidence yet that the Q-002 snippet change succeeded or failed.**

## MVP research conclusion

The opportunity is validated as a real user problem and fits the existing Cursor canonical.

The bounded useful product is not a generic `token calculator`. It is:

> **A browser-local explanation and pacing tool that starts from Cursor's actual pool percentage + reset date, then optionally uses model/token cost detail to explain why the percentage is moving.**

This design remains truthful when exact plan allowance is unknown and remains useful when Auto routing makes exact model attribution impossible.

Do not implement account scraping, private dashboard APIs, login sync, hidden endpoints or any attempt to infer undocumented account limits.
