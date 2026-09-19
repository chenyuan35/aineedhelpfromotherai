# Q-015 — Cursor Usage Pool / Quota Explainer

Last updated: 2026-09-19

Status: **PLANNED / MEASUREMENT-GATED / RESEARCH STARTED**

Canonical page: `https://aineedhelpfromotherai.com/tools/cursor-usage-reset/`

This is a bounded deepening of the existing Cursor reset page. Do not create a second Cursor quota URL unless Search Console later proves a genuinely separate intent that cannot be served cleanly on the canonical.

## Why this task exists

Current Cursor usage behavior is harder to understand than a simple token counter:

- supported plans use two monthly usage pools: `Cursor Models` and `Other Models`;
- model choice changes burn rate because usage is priced at model cost, not raw token count alone;
- Cursor Router / Auto can route requests across models and therefore across pools;
- the dashboard is the account-specific source of truth for remaining allowance and reset date.

The user job is: **understand which pool is being consumed, why usage is dropping at its current rate, how much practical usage remains, and whether the user is likely to hit the limit before reset.**

Official rule sources verified 2026-09-19:

- `https://prod.cursor.com/help/models-and-usage/usage-limits`
- `https://cursor.com/docs/models-and-pricing`
- `https://cursor.com/terms/pricing`

## Current measurement state

Q-002 changed the Cursor title/meta in commit `ed1ba68b042901e193e6e9fb4c7f3804a6aea0c7` on 2026-09-17 09:13 +08, which is 2026-09-16 18:13 in the Search Console date basis (`America/Los_Angeles`).

GSC verified 2026-09-19:

| GSC date | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| 2026-09-13 | 38 | 0 | 4.42 |
| 2026-09-14 | 103 | 0 | 7.88 |
| 2026-09-15 | 141 | 0 | 6.74 |
| 2026-09-16 | 48 | 0 | 7.06 |

`settledThrough=2026-09-16`.

Because the SEO change landed during the evening of the Sep 16 GSC day, Sep 16 is a mixed day. The first clean post-change measurement date is **2026-09-17**, and no clean post-change day is settled yet.

Therefore: **do not judge Q-002 from the 330 pre/mixed impressions above.**

## Execution gates

### Gate A — clean CTR evidence

Start evaluation when GSC settles `2026-09-17` or later.

Use only clean post-change dates `>= 2026-09-17` for the Q-002 CTR decision.

Decision checkpoints:

1. At **>=300 clean post-change impressions**, perform the first decision review.
2. If evidence is still ambiguous, continue until roughly **500 clean post-change impressions**.
3. Do not keep waiting beyond 500 impressions merely to avoid a decision.

Record:

- clicks, impressions, CTR and average position;
- top queries for the canonical;
- whether query intent is still mainly reset timing or is expanding into quota/pool questions;
- whether zero-click behavior persists at positions where a click is realistically obtainable.

### Gate B — current Phone release closure

Do not implement the Cursor feature while Q-014J Phone visual closure is still actively blocking the current release path.

Research/specification may continue backstage. Production code starts only after the current Phone closure gate is complete or project priority is explicitly changed by new evidence.

### Gate C — official rule stability

Immediately before coding, refresh Cursor official docs and pricing. If pool names, included models, plan behavior or pricing semantics changed, update the implementation contract first.

## Q-015A — Research contract

Status: **STARTED**

Verify and record before implementation:

1. current plans that expose `Cursor Models` and `Other Models`;
2. model-to-pool mapping;
3. current per-million-token pricing fields: input, cache write, cache read, output;
4. current Cursor Token Rate rules where applicable;
5. Auto/Router behavior and when exact pool/model attribution is impossible;
6. dashboard fields a normal user can actually see without API access;
7. recent user confusion/failure patterns, especially “100% earlier than expected”, model disappearance, and pool ambiguity;
8. any plan-specific exception such as Start, Teams or Enterprise that would make one universal calculator misleading.

Stop research once further detail would not change the calculator inputs, outputs or warning states.

## Q-015B — MVP product contract

### Inputs

Required:

- plan;
- pool: `Cursor Models`, `Other Models`, or `Auto / not sure`;
- selected model, when known;
- current pool used percentage;
- next reset date/time from Cursor Spending.

Optional:

- current-cycle spend for that same pool;
- input tokens;
- cache-write tokens;
- cache-read tokens;
- output tokens.

Do not request Cursor credentials, API keys, session cookies or account connection.

### Outputs

Always available from percentage + reset date:

- pool used / remaining percentage;
- exact countdown to reset;
- estimated daily safe usage pace;
- projected exhaustion date based on observed cycle pace;
- whether current pace reaches 100% before reset.

Available when model/token detail exists:

- estimated model cost for the supplied token breakdown;
- explanation of which token categories are driving cost;
- comparison of the same token volume under selected supported models where useful.

Available when same-pool spend is supplied and trustworthy:

- implied included pool value estimate;
- estimated remaining included value.

Every monetary result must be labelled **estimate** unless it is copied directly from the user's Cursor dashboard.

### Auto / Router behavior

If the exact routed model is unknown:

- show `Mixed / estimated` rather than inventing a model;
- do not calculate one precise token cost from a guessed model;
- explain that Auto can draw from different pools depending on the routed model;
- prefer actual dashboard request-level cost/pool data when the user has it.

## Calculation rules

1. Never estimate remaining allowance from raw total tokens alone.
2. Model cost must use the current model's separate input/cache/output rates.
3. Percentage-based pace is independent of token pricing and remains usable when token detail is absent.
4. Projected exhaustion uses observed cycle pace, not a universal requests-per-day assumption.
5. Derive the estimated cycle start from the next monthly reset only when the user does not provide enough history; label that derivation as estimated.
6. A past reset timestamp is invalid and must produce a correction state, not a negative countdown.
7. `0%` usage must not produce divide-by-zero or a fake exhaustion date.
8. `100%` usage must clearly show exhausted now.
9. On-demand usage must be separated from included usage; do not present paid overage as included pool balance.

## Q-015C — UI change scope

Modify the existing page only:

`frontend/tools/cursor-usage-reset/index.html`

Expected first-screen order:

1. short answer explaining the two pools and monthly reset;
2. current reset countdown;
3. compact `Which pool/model are you using?` controls;
4. current used percentage;
5. immediate answer cards: remaining %, likely pool, projected exhaustion, reset countdown;
6. optional advanced cost/token inputs behind a disclosure/advanced section.

Keep the page useful for a user who only wants a reset timer. Do not force advanced quota fields before showing the existing reset answer.

No backend or database. All user-entered values stay browser-local.

## Q-015D — SEO / content rules

Do not automatically rewrite title/meta again when the feature ships.

First use Q-002 clean post-change data.

If Q-002 improves CTR:

- preserve the working snippet unless query evidence supports a bounded change;
- deepen the on-page tool without discarding the reset intent that already ranks.

If Q-002 remains at 0 clicks after >=300 clean post-change impressions with useful positions:

- inspect actual queries;
- consider a bounded snippet/hero rewrite that combines reset + quota explanation;
- do not create a new URL merely to chase another keyword variant.

Answer-first copy should clearly state:

- usage resets with the billing cycle;
- two pools are tracked separately on supported plans;
- model pricing changes consumption speed;
- Cursor Spending remains the source of truth for the user's account.

## Q-015E — Analytics

Add only events that answer a product question:

- `cursor_pool_select`;
- `cursor_model_select`;
- `cursor_quota_calculate`;
- `cursor_advanced_open`;
- preserve existing reset-save/copy behavior if already tracked.

Do not collect token text, account identifiers, email, plan billing details or other personal account data in analytics parameters.

## Q-015F — Tests

Add a dedicated contract/unit test, expected path:

`scripts/test-cursor-usage-reset.mjs`

Minimum assertions:

- canonical unchanged;
- no login/account connection language;
- two-pool labels present;
- Auto/unknown state present;
- 0%, 100%, missing %, and invalid-date states;
- percentage pace calculation;
- token-cost calculation across input/cache/output categories;
- no divide-by-zero;
- no negative remaining balance;
- no precise model claim in Auto/unknown state;
- local-storage keys remain page-specific;
- mobile-safe controls and accessible labels exist;
- official source links present and verification date refreshed.

Run relevant public build/audit plus Eval Gate.

## Q-015G — Preview acceptance

A production code PR may leave Draft only after a real Preview is checked at desktop and mobile widths.

Verify:

- reset-only use remains fast;
- advanced fields do not dominate the first screen;
- pool/model controls are understandable without reading documentation;
- remaining %, exhaustion estimate and reset countdown are visually distinct;
- uncertainty is visible for Auto/Router;
- light/dark states preserve hierarchy;
- no horizontal overflow;
- calculations update correctly when switching plan/pool/model;
- no account data leaves the browser.

## Q-015H — Release and measurement

After merge and production verification:

1. verify HTTP 200, canonical and official-source links;
2. verify calculator behavior on production;
3. record release commit/date in `PROJECT_CONTEXT.md` and `CURRENT_EXECUTION_QUEUE.md`;
4. measure GSC queries/CTR separately from pre-feature data;
5. measure GA4 usage of quota controls separately from pageviews;
6. decide from evidence whether users use the quota explainer or mostly the reset timer.

Success signals:

- organic clicks begin or CTR improves on existing impressions;
- users interact with quota controls rather than only landing and leaving;
- no increase in support/confusion caused by false precision;
- the existing canonical serves both reset and quota-intent queries without needing another near-duplicate page.

Failure / stop signals:

- official rules change too quickly for a maintainable model mapping;
- the feature requires account login/API access to be truthful;
- Auto routing makes the promised calculation materially misleading;
- users do not use quota controls after meaningful traffic;
- a new page would only duplicate the same query intent;
- implementation expands into account sync, SaaS billing analytics or a backend usage tracker.

## Rollback

Keep the production implementation bounded to the existing Cursor page plus its dedicated tests/analytics. If the quota explainer proves confusing or unmaintainable, remove the advanced section while preserving the existing reset calculator and canonical URL.

## Exact execution order

1. **Now:** maintain this plan and refresh official Cursor rule research; no production code yet.
2. **When GSC settles Sep 17+:** begin clean Q-002 post-change measurement.
3. **At >=300 clean post-change impressions:** first CTR decision; continue to ~500 only if ambiguous.
4. **After Q-014J Phone visual closure:** if the Cursor opportunity still passes the evidence gate, open a fresh implementation branch.
5. Implement Q-015B/C/E/F only; no new URL/backend.
6. Local tests -> PR -> Eval Gate -> real Vercel Preview -> desktop/mobile visual acceptance.
7. Merge -> production verification -> post-release GSC/GA4 measurement.
8. Deepen, hold, or rollback from observed behavior; do not expand by default.
