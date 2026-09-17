# Phone Route Research Method — Community Reality First

Last updated: 2026-09-18

## Purpose

Phone Radar exists to surface practical phone-number routes that are hard for an ordinary user or generic search result to discover, reproduce and maintain.

This method governs Phone route research.

The core rule is:

> **Research what real users are successfully doing now, what is failing now, what it costs, how hard it is, and how the route changes over time.**

The research system is backstage. Its purpose is to improve user-facing decisions, not to produce a carrier encyclopedia.

## Primary research targets

For every route, prioritize recent operational outcomes:

- successful purchase/setup;
- setup refusal/failure;
- SMS/OTP reception success/failure;
- current acquisition cost;
- current keep-alive cost and method;
- overseas/China use in practice;
- eSIM/SIM conversion and reissue;
- same-number recovery/replacement;
- number loss/recycling incidents;
- support-assisted hidden plans or retention offers;
- support refusal/inconsistency;
- customer complaints;
- refunds, restorations and reversals after incidents;
- current tutorials/procedures;
- whether the route is improving, stable, degrading or effectively dead.

## Research order

Use this order:

1. **Find current first-hand community reports.** Search forums, comments, tutorials, user screenshots, support transcripts shared by users and other operational accounts.
2. **Find independent repetition.** Look for different users/authors/dates describing materially similar results. Avoid counting copied tutorials as separate confirmation.
3. **Extract the route.** Record exactly what the user did: starting SIM/account state, location, device, payment, support/app steps, cost, timing and result.
4. **Search for recent failures.** Find refusal cases, route breakage, account locks, number loss, SMS failure, price changes, enforcement waves and support inconsistency.
5. **Track incident resolution.** Record whether complaints led to restoration, refund, reversal, workaround, permanent loss or unresolved failure.
6. **Convert evidence into decision data.** Update only the fields that matter to users: SMS/OTP reliability signal, yearly keep-alive cost, setup difficulty, location practicality, stability/risk, continuity and tutorial steps.
7. **Stop.** Stop researching when more material would not change a user decision, warning, cost, difficulty, risk state or tutorial.

Do not make provider-by-provider documentation completeness a goal.

## What counts as strong operational evidence

### A. Repeated current first-hand success

Multiple independent users recently completed materially the same route with matching important steps and outcomes.

This is strong evidence that the route is operationally reproducible.

### B. Current first-hand success with detailed procedure

A single recent report with concrete actions, costs, screenshots or support interaction can establish a strong lead and may be enough for a monitored route when no meaningful contradiction exists.

### C. User-shared support/app/account interaction

A support chat, email, ticket, app/account screen or carrier message shared by a real user can establish a hidden procedure or account action even when it is not publicly advertised.

The useful question is whether another user can reproduce the result, not whether a marketing page describes it.

### D. Current failure/incident evidence

Recent refusal, number loss, SMS failure, abrupt enforcement, mass complaint or degraded support quality is first-class evidence.

Negative operational evidence can lower a route's status even when the product still exists and its marketing copy has not changed.

### E. Secondary tutorial/aggregation

Useful for leads and terminology. It becomes stronger when the author clearly reports personal use or links to independent first-hand outcomes.

Copied/circular material should not be counted repeatedly.

## Community reality over self-description

Phone Radar should not assume that a provider's self-description fully reflects how the service behaves in practice.

Examples of operational facts that matter more to the user include:

- a route that still works despite not being publicly promoted;
- a product that exists but regularly fails overseas activation;
- a number-recovery process that support actually performs;
- a mass number-recovery event after complaints;
- a service that remains technically available but has become less trustworthy after recent incidents;
- a hidden keep-alive method repeatedly used by current customers;
- a marketed feature that current users report as unreliable.

Operator-published pages may provide useful public price/product metadata when needed, but they are not an operational verification gate and do not automatically override recent first-hand outcomes.

If a legal, identity, safety or prohibited-use question materially affects whether a route can be recommended, investigate that specific issue from appropriate sources. Do not turn that into a routine carrier-documentation checklist for every route.

## Required route record

Capture only what is needed to support decisions and maintain freshness:

- provider / route / country;
- number type;
- discovery source/date;
- purchase/acquisition path;
- starting SIM/eSIM/account state;
- identity/KYC friction actually encountered;
- location/device prerequisites actually encountered;
- support/app/manual steps;
- acquisition cost;
- keep-alive cost and interval;
- estimated yearly keep-alive cost;
- SMS/OTP successes and failures;
- overseas/China behavior actually reported;
- same-number replacement/recovery outcome;
- number-loss/recycling reports;
- support refusal/inconsistency;
- incident and resolution history;
- tutorial/procedure links;
- last successful reproduction;
- last failure/refusal;
- current route state;
- sample/observation count when available.

## SMS/OTP reliability

SMS/OTP reliability is a primary Phone Radar metric.

Do not fabricate a success percentage from anecdotal evidence.

Until enough observations exist for a defensible numeric rate, derive a qualitative signal from:

- recent success count;
- recent failure count;
- observation recency;
- independence of reports;
- whether failures are service-specific or route-wide;
- whether the route has recently changed.

If a future numeric percentage is shown, the internal model must retain the observation window and sample size.

## Setup difficulty

Setup difficulty is derived from actual friction:

- identity/KYC steps;
- travel/local-presence requirement;
- first-network attachment;
- customer-service contact;
- app/account-only steps;
- payment restrictions;
- physical SIM/eSIM/device needs;
- conversion/reissue work;
- typical support back-and-forth.

Do not use a difficulty score that cannot be traced to these practical steps.

## Stability / risk state

Do not reuse Relay Exit Risk for phone routes.

Until a dedicated numeric methodology exists, use descriptive states such as:

- `stable`;
- `watch`;
- `degrading`;
- `conflicting`;
- `retired`.

Relevant inputs include:

- recent failures;
- number loss/recycling;
- enforcement waves;
- support inconsistency;
- overseas continuity;
- recovery quality;
- refund/restoration outcomes;
- direction of recent community sentiment and outcomes.

The state should be able to change over time.

## Event-history model

A route should not be flattened into one permanent rule.

Track important events chronologically, for example:

`stable → enforcement wave → complaints → refund/restoration → partial recovery → watch`

This is especially important for routes where trust changes faster than product availability.

## Admission / demotion rule

A route becomes useful when there is enough current operational evidence for a reasonable user decision.

Typical positive patterns:

- repeated recent first-hand success;
- a detailed current successful route plus supporting independent reports;
- reproducible support/app/account behavior;
- a hidden route with clear cost, prerequisites and current users who can reproduce it.

Demote or hold a route when:

- recent failures materially outnumber current successes;
- success depends on a single unexplained support exception;
- the process is stale;
- number loss/recovery risk worsens;
- costs change enough to remove the route's advantage;
- the route cannot be reproduced without deceptive or unsafe behavior.

## Search targets

Actively search for signals such as:

- 保号 / keep number / extend validity;
- 客服开通 / support enabled / retention package / hidden plan;
- 低月租 / no monthly fee / cheap yearly keep-alive;
- 换 eSIM / replacement QR / same number / SIM swap;
- 国外激活 / activate abroad / roaming activation;
- Wi-Fi Calling / VoWiFi / SMS over Wi-Fi / OTP abroad;
- 漫游收短信 / incoming SMS / OTP success;
- 套餐下架 / stopped working / failed / refused;
- 恢复号码 / number restored / refund / compensation;
- 回收号码 / recycled number / number reclaimed;
- 已上车 / 实测 / 刚开通 / 客服给我开了 / 失效了 / 涨价了;
- current video/tutorial walkthroughs;
- comment threads where users report success after following a tutorial.

## Safety and legitimacy

Community-first research does not mean bypass research.

Do not recommend forged KYC, stolen identities, deceptive support stories, unauthorized account access, security bypass, or prohibited geography evasion.

A legitimate hidden/support-assisted/app/account route is in scope when users are actually reproducing it.

## Maintenance

Operational routes decay quickly.

Therefore:

- record the last successful reproduction;
- record the last failure/refusal;
- track meaningful incidents and their outcomes;
- prefer recent independent reports over many copied old posts;
- demote routes whose real-world outcomes worsen;
- surface current tutorials rather than stale instructions;
- recheck only when a route matters to the user's decision or a new event changes its status.

The target is not documentation completeness. The target is a better and more current decision than a generic search result can provide.
