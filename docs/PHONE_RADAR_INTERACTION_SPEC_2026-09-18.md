# Phone Radar — Interaction Specification

Date: 2026-09-18
Status: ACCEPTED DIRECTION / READY FOR IMPLEMENTATION

## 1. Core product model

Phone Radar serves users who want an answer quickly, not users who want to study telecom research.

The product has **three fixed route families** and **two experience layers**.

### Three route families

1. **Long-term SMS / OTP numbers** — real mobile numbers intended to be kept.
2. **Data SIM / eSIM routes** — travel or long-term data products.
3. **Temporary SMS platforms** — short-lived/rented SMS reception services.

These are different user jobs. They share one Phone Radar shell, but each uses the metrics that matter to that job.

### Two experience layers

**Layer A — Visual dashboard.** Default. The user should understand the shortlist in seconds without reading a guide.

**Layer B — Full guide.** Opened only when the user wants to act. It explains purchase, setup, use, keep/recharge/renew, main failure mode and recovery where relevant.

## 2. Product principle: reduce decisions

Phone Radar is responsible for doing the synthesis before the user arrives.

Do not ask the user to:

- learn the research method;
- read multiple sources before choosing;
- compare dozens of equal-weight options;
- complete a long questionnaire before seeing routes;
- interpret ambiguous technical fields;
- decide which caveats matter.

Instead:

- show a small current shortlist;
- make the most important tradeoffs visually obvious;
- use plain labels;
- surface one-line caveats only when they change the decision;
- provide a full guide only after the user chooses to open it;
- keep the next action obvious.

The user may stop at the visual dashboard if they only need a quick answer.

## 3. Canonical and navigation

Keep the existing canonical:

`/tools/phone-number-survival-guide/`

Immediately below the heading, show three compact family choices:

- **Long-term SMS / OTP**
- **Data SIM / eSIM**
- **Temporary SMS**

Default to **Long-term SMS / OTP**.

Country is a filter/tag, not primary navigation and not the research sequence.

A full guide may open in an in-page detail panel/drawer/anchored state. Do not create a second Phone canonical or provider/country doorway pages merely to simulate depth.

## 4. First-screen composition

### Header

Use a short utility-first heading, for example:

> **Find the right phone route fast.**
>
> Compare long-term numbers, data eSIMs and temporary SMS options without reading a telecom manual.

No research-method explanation in the hero.

### Family switch

The three family choices are visible immediately and visually restrained.

Switching family changes dashboard metrics, shortlist and filters without changing the overall page shell.

### Shortlist

A real route should appear immediately after the family switch.

Default to a small useful shortlist rather than a long unranked catalog. The goal is not to force the user to compare everything.

## 5. Long-term SMS / OTP dashboard

### Primary metrics

1. **SMS / OTP** — qualitative recent reliability signal;
2. **Yearly keep-alive** — real annual retention cost/range;
3. **Setup effort** — low / some work / high;
4. **Remote practicality** — remote / remote after setup / local presence required;
5. **Stability** — stable / watch / degrading / conflicting / retired.

### Identity

- provider / route name;
- country/region;
- number type/prefix when useful;
- eSIM / physical SIM only when material.

### Actions

- **Full guide**;
- **Get / Buy**.

## 6. Data SIM / eSIM dashboard

Do not force OTP metrics onto data-only products.

Primary metrics:

1. **Data cost** — current package price and cost-per-GB when useful;
2. **Allowance / validity** — GB/unlimited + active days;
3. **Coverage** — country/region/network footprint;
4. **Setup** — install/KYC/local activation friction;
5. **Reusable?** — disposable / rechargeable / persistent account;
6. **Phone number included?** — yes / no / limited functionality;
7. **Current deal** — only when a materially better current promotion exists.

Actions:

- **Full guide**;
- **Get / Buy**.

Provider pages are useful here for current package price, allowance, promotion and checkout availability. User/community reports remain the source for actual speed, throttling, activation problems and roaming behavior.

## 7. Temporary SMS dashboard

Primary metrics:

1. **Recent SMS success signal**;
2. **Price** — current per-number/per-use cost;
3. **Country/service coverage**;
4. **Number type** — private rental / shared / reused / unknown;
5. **Reuse/privacy risk** — low / medium / high qualitative state;
6. **Availability** — current stock/route availability when observed.

Actions:

- **Full guide**;
- **Open platform**.

Temporary/shared numbers must be clearly separated from durable numbers. Do not imply they are suitable for important long-term account recovery.

## 8. Filters

Filters refine; they never gate access.

### Long-term SMS / OTP

- remote only;
- eSIM required;
- lowest yearly keep-alive;
- easier setup;
- more stable;
- country/region;
- specific service compatibility only where real outcome data exists.

### Data SIM / eSIM

- destination/coverage;
- trip length;
- data amount;
- eSIM only;
- cheapest per GB;
- reusable/rechargeable;
- number included.

### Temporary SMS

- destination/service;
- country;
- private number only;
- lowest current cost;
- stronger recent success.

No multi-step questionnaire before results appear.

## 9. Full guide — Long-term SMS / OTP

1. **What to buy** — exact route/product, current acquisition price, SIM/eSIM, purchase link.
2. **What you need** — actual prerequisites only.
3. **Open it** — short numbered steps.
4. **Test SMS / OTP** — confirm before attaching important accounts.
5. **Keep it alive** — cheapest current reproduced action, interval and yearly cost.
6. **Main current risk** — only what changes the decision.
7. **Recovery** — same-number reissue/replacement/port path when relevant.
8. **Useful tutorial** — one strong current guide, optionally one video/community thread.

## 10. Full guide — Data SIM / eSIM

1. package to buy;
2. current price/promotion;
3. supported destination/network;
4. install/activation steps;
5. APN/roaming steps if users actually need them;
6. current real-world speed/throttling issues;
7. recharge/reuse path;
8. whether a number is included and what it can actually do;
9. current tutorial/link.

## 11. Full guide — Temporary SMS

1. what the platform sells;
2. current price model;
3. countries/services commonly available;
4. how rental/reception works;
5. expiry/reuse/shared-number behavior;
6. main privacy/account-recovery risk;
7. what recent users report working/failing;
8. platform link.

Keep it concise. The goal is informed use, not a platform encyclopedia.

## 12. Metric rules

### SMS / OTP

No fake percentages until enough observations exist.

Use:

- **Strong**;
- **Good**;
- **Mixed**;
- **Weak**;
- **Not enough recent data**.

### Setup effort

Derive from real friction: KYC, support contact, local presence, payment restrictions, SIM/eSIM/device constraints and manual steps.

### Stability

Use:

- **Stable**;
- **Watch**;
- **Degrading**;
- **Conflicting**;
- **Retired**.

Do not invent a 0–100 Phone risk score yet.

## 13. Provider/operator page role

Provider/operator pages do not certify operational reality.

Use them by default for commercial metadata only:

- current listed price;
- current plan/package name;
- current promotion/new offer;
- current stock/availability when exposed;
- current purchase/checkout link;
- current top-up/advertised fee.

Use community/user evidence for OTP success, activation, roaming, recovery, support outcomes, recycling and route degradation.

## 14. Desktop visual model

The default view should feel like a compact data dashboard, not a marketing landing page.

Use three zones:

- identity;
- decision metrics;
- actions.

The decision metrics occupy most of the space. Several routes should remain visible at once. Avoid oversized cards, oversized buttons and long prose.

## 15. Mobile visual model

Mobile uses compact stacked cards, not a squeezed desktop table.

Each card shows:

1. route + country/type;
2. a 2-column metric block appropriate to the family;
3. one-line key caveat/practicality note;
4. two restrained actions: **Full guide** and **Get / Buy**.

The first real route should appear almost immediately after the family switch.

## 16. Closed-loop journeys

### Long-term SMS / OTP

`See shortlist → compare → open full guide → buy → activate → test SMS → keep alive → return when route status changes`

### Data SIM / eSIM

`See shortlist → compare package/value → open guide → buy → install → use → recharge/reuse if supported`

### Temporary SMS

`See options → compare price/success/privacy → open guide → use → discard; do not treat as long-term recovery number`

The next action must always be obvious.

## 17. Analytics

Track:

- family selected;
- route impression/view;
- filter/sort;
- full-guide open;
- purchase/platform outbound click;
- keep-alive/reminder action where relevant.

Do not collect phone numbers, OTPs, credentials or identity documents.

## 18. Acceptance criteria

Ready to ship only when:

1. real options appear without questions first;
2. the three families are immediately understandable;
3. each family uses metrics appropriate to its job;
4. the visual layer alone is enough for a quick decision;
5. the full guide provides exact execution steps when requested;
6. provider pages are used for price/deal/purchase metadata, not operational certification;
7. mobile exposes useful options quickly;
8. research complexity remains backstage;
9. the user always has an obvious next action;
10. the product reduces decision time instead of creating more reading.

## 19. Implementation boundary

Direction is accepted for implementation.

Implementation rules:

- keep the existing canonical URL;
- use a fresh implementation branch/worktree;
- remove questionnaire-first gating;
- implement the three-family visual dashboard + route-detail guide pattern;
- reuse useful existing data but do not expose old research-heavy fields;
- do not bulk-add every candidate provider in the same implementation PR;
- test desktop/mobile hierarchy and the full user journey before merge.
