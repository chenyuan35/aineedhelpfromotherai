# Product Direction Reset — 2026-09-23

Status: **ACCEPTED STRATEGIC CORRECTION / NO PRODUCTION CHANGE IN THIS ROUND**

## Why this reset exists

The project drifted from product-value judgment into keyword/technical optimization. Search demand and ranking evidence were allowed to promote pages whose core answer was already obvious, deterministic, or easily obtained elsewhere.

This review uses three evidence classes together:

1. current Search Console behavior;
2. live keyword-demand data;
3. current community pain and incumbent-product coverage.

The purpose is not to find another high-volume keyword to copy. It is to restore a defensible product thesis.

## Evidence

### Search Console

The exact Cursor page accumulated 290 clean post-change impressions / 0 clicks in the Sep 22 fresh-data read. Query rows include variants such as `cursor reset usage`, `when does cursor usage reset`, and `what time does cursor usage reset`. This proves Google can surface the page; it does not prove users need our product.

### Keyword demand

Ubersuggest US data collected Sep 23:

- `codex reset today`: 170 monthly searches;
- `codex reset usage`: 140;
- `codex reset weekly limit`: 30;
- `codex reset reddit`: 20;
- `when does cursor usage reset`: 40;
- `sms verification number`: 1,900;
- `free sms verification number`: 2,400;
- `temporary sms verification number`: 70;
- `temp sms verification number`: 50.

These numbers are demand signals only. They do not override the product-value or competition gates.

### Codex competitor saturation

A live web scan found multiple current independent Codex reset products already providing combinations of:

- Tibo/public-source monitoring;
- reset history;
- next-reset probabilities/windows;
- banked-reset tracking;
- personal countdowns;
- `/status` parsing;
- burn-rate/quota tracking;
- RSS/API/alerts;
- reset-vs-weekly-window explanations.

Examples observed in the scan include `codexresettracker.com`, `whendoescodexreset.com`, `resetradar.wiki`, `usagereset.com`, `codexreset.today`, `codexreset.dev`, and `codexreset.app`.

Conclusion: Codex has genuine uncertainty and genuine demand, but a generic Codex reset radar is already a crowded product. We must not pivot from one copied reset page into another copied reset tracker.

### Codex community pain that is still more interesting than a countdown

Recent r/codex discussions repeatedly surface problems such as:

- early/global resets changing the practical value of remaining weekly quota;
- users losing unspent quota when a global reset shifts the next weekly reset;
- banked resets being consumed without restoring the expected weekly limit;
- reset/display mismatches across clients;
- model/fast-mode changes causing unexpectedly faster quota burn;
- users asking whether to spend remaining quota before a likely global reset.

These are decision/diagnostic problems, not simple `when is the reset` questions.

### Phone Radar community pain

Current forum/Reddit evidence shows repeated demand for:

- a real mobile number, not data-only eSIM or VoIP;
- ability to receive OTP/SMS while abroad;
- activation outside the issuing country;
- app-specific verification behavior (WhatsApp, banks, delivery/local apps, Telegram/WeChat, etc.);
- low-cost long-term number retention;
- knowing which routes actually work now rather than what a carrier claims;
- KYC/roaming/activation constraints that differ by route and location.

This information is fragmented and changes over time. Provider pages cannot reliably certify real-world OTP success or remote activation. This is the strongest current fit with the project's information-advantage model.

### Relay Exit Risk demand

Ubersuggest US data returned 0 volume for `openai api relay` and `ai api relay`; generic `api relay` was 70 and mostly unrelated intent. Relay Exit Risk remains differentiated, but direct search demand is not yet demonstrated.

## Strategic decision

### 1. Phone Radar = primary growth product

Phone Radar is now the only surface approved for proactive product-depth work.

Core job:

> Help a user find a real, currently workable phone/eSIM route for SMS/OTP, long-term number survival, or travel connectivity when official/provider pages do not answer whether it works in practice.

The product must be community/outcome-led. Official pages may supply price, package, purchase and published terms only.

The canonical should become more obviously aligned with real search/user language around real phone numbers, SMS/OTP abroad, activation, retention and current route outcomes. Do not create country/provider doorway pages; improve the existing canonical first.

### 2. AI Reset Radar = frozen portfolio under value review

No new generic reset pages.

Do not add a Codex reset tracker merely because Codex demand is stronger than Cursor demand. Existing competitors already provide the obvious radar/history/countdown product.

Any future Codex work must first demonstrate a gap the mature trackers do not already solve well. Candidate gaps may include quota-loss decision support, reset-impact analysis, or reproducible diagnostics for banked-reset/client-state mismatches, but these are research hypotheses, not approved builds.

### 3. Relay Exit Risk = data-accrual experiment, not growth priority

Keep the accepted product and continue legitimate historical snapshot/lifecycle accumulation. Do not add search-led features until direct demand or meaningful usage evidence appears.

### 4. Existing generic utilities = maintenance only

Do not expand generic calculators because they are easy to build. They remain useful only where they already receive evidence-backed usage or provide real computation.

## Reset-family audit result

Current seven-page classification:

| Page | Classification | Reason |
|---|---|---|
| Cursor Usage Reset | **DOWNGRADE** | deterministic/account-visible reset job; 290 clean impressions / 0 clicks; weak reason to return |
| Claude Code Limit Reset | **REPURPOSE** | timer alone is weak; only worth future investment if converted into a real usage/burn/limit decision job |
| GitHub Copilot Credits Reset | **KEEP / DIFFERENTIATE** | remaining-credit pace projection can add computation beyond reading the account page; keep investment gated by demand |
| Manus Credits Reset | **DOWNGRADE** | current job is mostly remaining-credit arithmetic/reset information |
| Replit Usage Reset | **DOWNGRADE** | current reset/remaining usage job is largely provider-visible and low-information-advantage |
| Bolt Tokens Reset | **REPURPOSE** | pace/budget calculation is more defensible than the reset framing; future work should target budget planning, not reset lookup |
| AI Credit Burn Rate Calculator | **KEEP / DIFFERENTIATE** | provider-independent computation converts allowance/reset/task cost into actionable pace/budget guidance |

No URL is deleted or redirected in this round.

## Mandatory competition gate

Passing the official-source value gate is not enough. Before building or deepening a product, also answer:

> Why should the user use us instead of the best existing independent product solving the same job?

If a mature independent tool already provides the same monitoring, history, calculation, workflow and freshness at equal or better quality, the candidate is rejected unless we have a concrete differentiated advantage.

## Immediate execution order

1. Stop Cursor-first optimization and stop generic Reset expansion.
2. Use Phone Radar as the active product-growth surface.
3. Run one bounded Phone canonical intent/value audit focused on `real number + SMS/OTP abroad + retention/current outcome` using current community evidence and actual search language.
4. From that audit, make at most one bounded production change to the existing Phone canonical: positioning/SERP/first-screen decision value only; no new route/page unless evidence specifically requires it.
5. Keep Relay in data-accrual mode.
6. Keep Codex as competitor-gap research only until a non-duplicative user job is proven.

## Tool blockers recorded

- Ubersuggest produced three live reports, then hit its daily report quota. Do not rotate accounts or pay/upgrade without authorization.
- Ahrefs API access returned `Insufficient plan`.
- Semrush returned `no_api_units`.

These provider limits are research blockers only; they do not invalidate the evidence already collected.