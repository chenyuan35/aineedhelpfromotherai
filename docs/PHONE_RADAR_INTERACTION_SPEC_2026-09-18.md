# Phone Radar — Interaction Specification

Date: 2026-09-18
Status: ACCEPTED DIRECTION / READY FOR IMPLEMENTATION

## 1. Core product model

Phone Radar serves users who want an answer quickly, not users who want to study telecom research.

The product therefore has **three fixed route families** and **two experience layers**.

### Three route families

1. **Long-term SMS / OTP numbers**
   - real mobile numbers intended to be kept;
   - optimized for OTP/SMS reception, yearly keep-alive cost, setup effort, overseas practicality and continuity.

2. **Data SIM / eSIM routes**
   - travel or long-term data products;
   - optimized for data price, coverage, validity, speed/traffic allowance, whether a real number is included, and whether the route can be reused or retained.

3. **Temporary SMS platforms**
   - short-lived/rented SMS reception services;
   - optimized for country/service availability, current price, recent success signal, reuse/privacy risk and whether the number is disposable or shared.

These are three distinct user jobs. They share one Phone Radar product, but their comparison metrics are not forced into one identical template.

## 2. Two-layer experience

### Layer A — Visual dashboard

This is the default experience.

A user should be able to open the page, choose one of the three route families and understand the best current options without reading an article.

The dashboard answers:

- what routes exist now;
- which ones are cheaper;
- which ones are easier;
- which ones are more reliable for the selected job;
- which ones require travel/local setup;
- which ones are stable or currently problematic.

The dashboard is a decision instrument, not a research report.

### Layer B — Detailed guide

A user who wants to act can open a route detail.

The detail answers:

- what to buy;
- where to buy;
- what it costs now;
- what to prepare;
- exact opening/setup steps;
- how to receive SMS/OTP or use data;
- how to keep/recharge/renew it;
- the main current failure mode;
- recovery/reissue path when relevant;
- useful current tutorial/video/community link.

No user is required to read the detail before using the dashboard.

## 3. One canonical, not three new SEO products

Keep the existing canonical:

`/tools/phone-number-survival-guide/`

The three route families are top-level views/tabs inside the same Phone Radar product.

Do not create provider/country doorway pages merely to expand URL count.

A route detail may open as an in-page detail panel/drawer/anchored state so the user feels they have "entered" the full guide without requiring a second canonical family.

## 4. Default first screen

### Header

Use a short utility-first heading, for example:

> **Find the right phone route fast.**
>
> Compare long-term numbers, data eSIMs and temporary SMS options without reading a telecom manual.

No research-method explanation in the hero.

### Family switch

Immediately below the heading, show three compact choices:

- **Long-term SMS / OTP**
- **Data SIM / eSIM**
- **Temporary SMS**

Default to the most broadly useful family: **Long-term SMS / OTP**.

Switching family changes the dashboard metrics, not the entire product shell.

## 5. Visual dashboard — Long-term SMS / OTP

### Primary metrics

Show these prominently:

1. **SMS / OTP** — qualitative recent reliability signal;
2. **Yearly keep-alive** — real annual retention cost/range;
3. **Setup effort** — low / some work / high;
4. **Remote practicality** — remote / remote after setup / local presence required;
5. **Stability** — stable / watch / degrading / conflicting / retired.

### Route identity

- provider / route name;
- country/region;
- number type/prefix when useful;
- eSIM / physical SIM only when material.

### Actions

- **Full guide** — opens the detailed operational guide;
- **Get / Buy** — current acquisition path.

## 6. Visual dashboard — Data SIM / eSIM

Do not force OTP metrics onto data-only products.

Primary metrics:

1. **Data cost** — current package price and cost-per-GB where useful;
2. **Allowance / validity** — GB/unlimited + active days;
3. **Coverage** — country/region/network footprint;
4. **Setup** — install/KYC/local activation friction;
5. **Reusable?** — one-trip disposable / rechargeable / persistent account;
6. **Phone number included?** — yes / no / limited functionality;
7. **Current deal** — only when a materially better current promotion exists.

Actions:

- **Full guide**;
- **Get / Buy**.

Provider pages are useful here mainly for current package price, allowance, promotion and checkout availability. User/community reports remain the important source for actual speed, throttling, activation failures and roaming behavior.

## 7. Visual dashboard — Temporary SMS platforms

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

The product must clearly distinguish temporary SMS from a number the user can safely keep for important long-term accounts.

Do not imply that temporary/shared numbers are suitable for critical account recovery.

## 8. Decision-cost principle

The product is responsible for reducing decision work.

Do not show dozens of equal-weight choices by default.

For each family:

- show a small current shortlist first;
- let the user sort/filter only when needed;
- make tradeoffs visible without opening details;
- show one-line reasons for meaningful caveats;
- keep research uncertainty backstage;
- do not make the user read sources to understand the recommendation state.

The user should be able to stop after the visual dashboard if they only need a quick answer.

## 9. Filters

Filters refine; they never gate access.

### Long-term SMS / OTP

Possible filters:

- remote only;
- eSIM required;
- lowest yearly keep-alive;
- easier setup;
- more stable;
- country/region;
- specific service compatibility only where real outcome data exists.

### Data SIM / eSIM

Possible filters:

- destination/coverage;
- trip length;
- data amount;
- eSIM only;
- cheapest per GB;
- reusable/rechargeable;
- number included.

### Temporary SMS

Possible filters:

- destination/service;
- country;
- private number only;
- lowest current cost;
- stronger recent success.

Avoid a multi-step questionnaire before results appear.

## 10. Detail guide contract — Long-term SMS / OTP

The detail should read like a practical setup guide, not an evidence review.

1. **What to buy** — exact route/product, current acquisition price, SIM/eSIM, purchase link.
2. **What you need** — actual prerequisites only.
3. **Open it** — short numbered steps.
4. **Test SMS / OTP** — confirm the route before attaching important accounts.
5. **Keep it alive** — cheapest current reproduced action, interval and yearly cost.
6. **Main current risk** — only the issue that changes the decision.
7. **Recovery** — same-number reissue/replacement/port path when relevant.
8. **Useful tutorial** — one strong current guide, optionally one video/community thread.

## 11. Detail guide contract — Data SIM / eSIM

1. package to buy;
2. current price/promotion;
3. supported destination/network;
4. install/activation steps;
5. APN/roaming steps if users actually need them;
6. expected real-world speed/throttling issues from current reports;
7. recharge/reuse path;
8. whether a number is included and what it can actually do;
9. current tutorial/link.

## 12. Detail guide contract — Temporary SMS

1. what the platform sells;
2. current price model;
3. countries/services commonly available;
4. how rental/reception works;
5. expiry/reuse/shared-number behavior;
6. main privacy/account-recovery risk;
7. what recent users report working/failing;
8. platform link.

Keep this concise. The goal is informed use, not a platform encyclopedia.

## 13. Metric rules

### SMS / OTP

No fake percentages until enough observations exist.

Use qualitative labels:

- **Strong**;
- **Good**;
- **Mixed**;
- **Weak**;
- **Not enough recent data**.

### Setup effort

Derive from real friction:

- KYC;
- support contact;
- local presence;
- payment restrictions;
- SIM/eSIM/device constraints;
- manual steps.

### Stability

Use:

- **Stable**;
- **Watch**;
- **Degrading**;
- **Conflicting**;
- **Retired**.

Do not invent a 0–100 Phone risk score yet.

## 14. Provider/operator page role

Provider/operator pages are not used to certify operational reality.

Use them by default for commercial metadata only:

- current listed price;
- current plan/package name;
- current promotion/new offer;
- current stock/availability when exposed;
- current purchase/checkout link;
- current top-up/advertised fee.

Use community/user evidence for real operation: OTP success, activation, roaming, recovery, support outcomes, number recycling and route degradation.

## 15. Desktop visual model

The default view should feel like a compact data dashboard, not a marketing landing page.

Use three zones:

- identity;
- decision metrics;
- actions.

The decision metrics occupy most of the space.

Several routes should remain visible at once. Avoid oversized cards, oversized buttons and long prose.

## 16. Mobile visual model

Mobile uses compact stacked cards, not a squeezed desktop table.

Each card shows:

1. route + country/type;
2. 2-column metric block appropriate to the current family;
3. one-line key caveat/practicality note;
4. two restrained actions: **Full guide** and **Get / Buy**.

The first real route should appear almost immediately after the family switch.

## 17. Closed-loop user journey

### Long-term SMS / OTP

`See shortlist → compare → open full guide → buy → activate → test SMS → keep alive → return when route status changes`

### Data SIM / eSIM

`See shortlist → compare package/value → open guide → buy → install → use → recharge/reuse if supported`

### Temporary SMS

`See current options → compare price/success/privacy → open guide → use → discard; do not treat as long-term recovery number`

The page should always make the next action obvious.

## 18. Analytics

Track:

- family selected;
- route impression/view;
- filter/sort;
- full-guide open;
- purchase/platform outbound click;
- keep-alive/reminder action where relevant.

Do not collect phone numbers, OTPs, credentials or identity documents.

## 19. Acceptance criteria

Ready to ship only when:

1. a visitor sees real options without answering questions;
2. the three route families are immediately understandable;
3. each family uses metrics appropriate to its job;
4. the visual layer alone is enough for a quick decision;
5. the full guide provides exact execution steps when requested;
6. operator pages are used for price/deal/purchase metadata, not operational certification;
7. mobile exposes useful options quickly;
8. research complexity remains backstage;
9. the user always has an obvious next action;
10. the product reduces decision time instead of creating more reading.

## 20. Implementation boundary

This direction is accepted for implementation based on the user’s instruction to continue autonomously and close the loop.

Implementation rules:

- keep the existing canonical URL;
- use a fresh implementation branch/worktree;
- remove questionnaire-first gating;
- implement the three-family visual dashboard + route detail guide pattern;
- reuse useful existing data but do not expose old research-heavy fields;
- do not bulk-add every candidate provider in the same implementation PR;
- test desktop/mobile hierarchy and the full user journey before merge.
