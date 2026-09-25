# Phone Radar — Comparison UI Benchmark

Date: 2026-09-25
Status: ACCEPTED RESEARCH / NO PRODUCTION CHANGE

## Goal

Define the visual comparison model Phone Radar should use as its evidence-qualified route inventory grows. The target is not to imitate one competitor. It is to combine proven comparison patterns with Phone Radar's unique evidence: real landed cost, keep-alive cost/action, app-specific SMS/OTP outcomes, setup friction, continuity incidents, recovery/refund history and freshness.

This benchmark extends, rather than replaces, `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` and `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md`.

## Product constraint

"Make the numbers complete" means **make each admitted route record decision-complete**, not mass-fill countries/providers with weak data.

A route is complete enough for frontstage comparison only when the fields material to the user's decision are sourced, explicitly unknown, or visibly conflicting. Missing evidence must stay missing. No global bulk-fill, guessed OTP percentages or arbitrary risk score is authorized by this benchmark.

## Current industry references

### eSIMDB — dense browse/filter/table model

Current global comparison page exposes thousands of plans from more than 160 brands, puts filters for data, validity and price directly above the result set, and renders dense comparable columns such as provider/plan, data, validity, price per GB and price. It also exposes an explicit last-updated date.

Useful pattern for Phone Radar:

- immediate results, not a research article first;
- compact decision columns;
- powerful optional filters;
- freshness visible near the comparison surface;
- dense catalog remains scan-friendly.

Do not copy:

- popularity labels as if they were an evidence-backed Phone recommendation;
- data-eSIM-specific price/GB logic into long-term SMS routes.

Reference: `https://esimdb.com/region/global`

### Uswitch — network grouping + faceted filters with counts

Current UK SIM comparison groups brands by underlying networks in its filters (for example Vodafone-network brands, O2-network brands and Three-network brands), shows result counts next to filter options, and lets users refine by monthly cost, data, roaming destination, contract length and features. Result cards keep network identity, price, contract/data and purchase action close together.

Useful pattern for Phone Radar:

- host-network grouping should remain first-class;
- filter choices should show result counts when practical;
- filter taxonomy should map to real decision jobs, not internal telecom terminology;
- route identity + important facts + action stay visually together.

Do not copy:

- promoted/commercial ordering as evidence ranking;
- monthly-plan fields that do not help the Phone route job.

Reference: `https://www.uswitch.com/mobiles/compare/sim_only_deals/`

### WhistleOut — human-language decision framing

Current comparison entry asks a very small number of plain-language questions about lines, data and budget before narrowing plans. The strength is the understandable language and explicit mapping from user need to filter state.

Useful pattern for Phone Radar:

- filters should say things like `Remote setup`, `Keep under ¥50/year`, `ChatGPT evidence`, `eSIM`, rather than expose research-field names;
- user intent should map directly to a visible shortlist.

Do not copy:

- questionnaire-first gating. Phone Radar's accepted contract requires real routes to appear immediately; filters refine rather than block results.

Reference: `https://www.whistleout.com/CellPhones`

### Kimovil — pin a small set and compare side by side

Current comparison surface lets users choose up to four devices for a dedicated datasheet comparison, while its broader catalog exposes many filters and ordering controls.

Useful pattern for Phone Radar:

- allow the user to pin a small set of routes (target: up to four) and switch to a fixed side-by-side comparison;
- keep the browse surface and the deep comparison surface distinct;
- selected comparison should preserve identical field order so differences are obvious.

Do not copy:

- dozens of equal-weight filters. Phone Radar should expose only decision-critical filters by default and hide advanced ones.

References:

- `https://www.kimovil.com/en/compare`
- `https://www.kimovil.com/en/compare-smartphones`

## Accepted Phone Radar visual model

Phone Radar should converge on three connected modes using the same normalized data.

### 1. Browse — default visual dashboard

Borrow the density of eSIMDB and network hierarchy of Uswitch.

Top controls:

- family: Long-term SMS/OTP / Data SIM/eSIM / Temporary SMS;
- country/market;
- host network;
- route form: eSIM / physical / either where relevant;
- remote setup;
- service evidence: ChatGPT/OpenAI, Telegram, WhatsApp when available;
- keep-cost band for long-term routes;
- freshness;
- sort.

Long-term default sort choices:

- practical relevance;
- lowest real landed cost;
- lowest yearly keep cost;
- strongest current service evidence;
- freshest verification;
- easiest remote setup.

Filters are optional and never gate initial results.

### 2. Compare — pin 2–4 routes

Borrow the dedicated compare model from Kimovil/GSMArena-style product comparisons.

A small sticky `Compare selected` tray appears after a user pins routes. The compare view uses routes as columns and decision fields as rows.

Recommended row groups:

**Cost**
- real landed acquisition cost;
- approximate CNY cost + FX date;
- minimum reproduced yearly keep cost;
- current deal/acquisition state.

**Setup**
- SIM/eSIM;
- remote/China activation state;
- KYC/local-presence friction;
- payment/device constraint;
- Wi-Fi Calling / roaming SMS.

**Apps**
- ChatGPT/OpenAI;
- Telegram;
- WhatsApp;
- other service only when useful evidence exists.

Every app cell shows observation count/date; an observed rate appears only when the existing `n >= 5` gate is satisfied.

**Continuity**
- recycling/loss incidents;
- suspension/closure events;
- recovery/reissue/port-out;
- refund outcome;
- current trend;
- last verified.

Missing and conflicting values remain visibly different from positive values.

### 3. Guide — textual execution layer

The existing Full guide remains the text layer, opened inline from the selected route rather than as a long research article.

Required order:

1. What to buy
2. Real cost breakdown
3. Requirements
4. Buy / obtain
5. Activate
6. Test SMS/OTP before binding important accounts
7. App-specific observed outcomes
8. Keep the number alive
9. Current failure modes / route history
10. Recovery / refund / reissue / port-out
11. Current deal if live
12. Last checked + strongest sources

The guide should answer execution questions; raw evidence reconciliation remains backstage.

## Graphical components unique to Phone Radar

The interface should add visuals only where the data is real and decision-useful.

### Landed-cost breakdown

Show a compact segmented breakdown where evidence exists:

`purchase + required top-up + shipping + adapter/intermediary + material fees = landed cost`

Unknown components remain `Unknown`; they are never rendered as zero.

### Keep-alive timeline

For long-term routes, show the reproduced cadence visually, for example:

`Day 0 activation → Day 150 reminder window → before Day 180 chargeable action`

The visual is driven by the sourced interval, not a generic progress score.

### App-evidence chips

Examples:

- `ChatGPT · 2 success · n<5`
- `Telegram · 1 success / 1 failure · Mixed`
- `WhatsApp · no recent sample`

When the percentage gate is satisfied, show `9/10 · 90% observed`, including the evidence window.

### Route-history timeline

Use dated event markers rather than a risk gauge, for example:

`cheap acquisition → closure wave → partial restoration → mixed refunds → Watch`

This preserves uncertainty and makes changes over time understandable.

### Freshness / evidence badge

Every route should visibly show:

- `Checked <date>`;
- source/observation count or sample basis;
- `Conflicting` when unresolved evidence materially changes the decision.

## Desktop contract

The current 16-field matrix contains valuable detail but a permanently ~1960px-wide table should not be the only comparison experience as the catalog grows.

Target desktop hierarchy:

1. immediate shortlist with 5–7 decision-critical columns;
2. sticky identity column and sticky header;
3. expandable `All details` mode for the full field set;
4. pin-to-compare for 2–4 routes;
5. guide opens next to the selected route context.

Default long-term columns:

- route / host network;
- landed cost;
- keep / year + interval;
- remote setup / KYC;
- app evidence summary;
- continuity/trend;
- freshness + actions.

The full matrix retains deeper fields without forcing every user to scan all of them at once.

## Mobile contract

Do not reproduce the desktop matrix horizontally.

Each route card should show above the fold:

- brand/route + host network;
- landed cost;
- keep/year;
- remote setup state;
- app evidence chips;
- trend/freshness;
- `Guide` + `Get`;
- `Compare` pin.

Secondary fields expand inside the card. A sticky compare tray can open a vertically sectioned 2–4 route comparison.

## What should remain unchanged

- one canonical Phone URL remains the default comparison surface;
- three route families remain separate jobs;
- network → brand → route hierarchy remains intact;
- no universal `best` carrier claim;
- no arbitrary 0–100 Phone risk score;
- no fabricated compatibility probability;
- no country/provider doorway families;
- current public rows are not bulk-expanded until evidence is sufficient.

## Implementation sequence

This benchmark does not authorize immediate production churn. When a bounded visual implementation is selected, use this order:

1. add pin-to-compare state and a compact compare tray;
2. reduce the default long-term matrix to the decisive columns while preserving `All details`;
3. add filter/sort controls with result counts where inexpensive;
4. add real-data visuals (cost breakdown, keep timeline, app observation chips, event timeline) only where the normalized data supports them;
5. verify 1440 / 390 / 320 widths, light/dark, no overflow and first-route visibility;
6. Preview + Eval Gate + production verify before merge.

## Success condition

The target user should be able to answer in under one comparison flow:

- Which routes can I actually obtain?
- What will each really cost to start and keep?
- Which one has current evidence for the service I care about?
- What friction or continuity problem should I know before buying?
- Which 2–4 routes are worth comparing directly?
- What exact steps do I follow after choosing?

That is the standard for "complete": visual decision data first, execution text second, raw research backstage.