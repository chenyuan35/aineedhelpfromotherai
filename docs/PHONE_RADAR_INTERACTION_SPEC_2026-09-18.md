# Phone Radar — Interaction Specification

Date: 2026-09-18
Status: DRAFT FOR PRODUCT REVIEW / NO PRODUCTION IMPLEMENTATION YET

## 1. User job

A visitor comes to Phone Radar because they want a phone number, not a telecom research report.

The first screen must let them answer:

- Which real number routes exist right now?
- Which routes are good for SMS/OTP?
- What will each route cost me per year to keep alive?
- How hard is it to open?
- Can I do it from where I am?
- Is the route currently stable or getting worse?
- How do I open it?

Country is a filter/tag, not the primary navigation model. The default route list is global.

## 2. Page model

The existing canonical remains:

`/tools/phone-number-survival-guide/`

The page is organized into four visible layers:

1. **Find a number** — short title + one-sentence purpose.
2. **Optional filters** — lightweight refinement, never a gate.
3. **Global route list** — concrete routes immediately visible.
4. **Route detail drawer/page section** — concise operational tutorial for the selected route.

The user should not encounter research methodology, source classes or evidence reconciliation before seeing routes.

## 3. First-screen composition

### Header

Use a short utility-first heading, for example:

> **Find a number you can actually keep.**
>
> Compare real phone-number routes by OTP reliability, yearly cost, setup effort and current stability.

No long introductory explanation.

### Filter strip

Filters stay visually secondary to the route list.

Recommended filter groups:

- **Use:** SMS / OTP, calls, long-term number, specific service compatibility when evidence exists;
- **Setup:** remote only, eSIM, physical SIM okay, no support contact;
- **Cost:** lowest yearly keep-alive;
- **Location:** current user location / cannot travel;
- **Stability:** prefer currently stable routes;
- **Country:** optional country/region refinement.

Filters should be chips/selects with a clear reset action. The page always shows routes before any filter is chosen.

## 4. Route-card contract

Each route card/row must communicate the decision in seconds.

### Primary identity

- provider / route name;
- country flag/name and number prefix/type;
- physical SIM / eSIM badge only when material.

### Primary decision metrics

Show these together and with equal visual weight:

1. **SMS / OTP** — qualitative current signal;
2. **Yearly keep-alive** — real annual retention cost or best current reproduced range;
3. **Setup** — compact difficulty/effort state;
4. **Remote use** — remote / local step / travel required;
5. **Stability** — stable / watch / degrading / conflicting / retired.

The card may show a short freshness note such as `Recent success: Aug 2026` when it materially helps the decision.

### Actions

Every card has two clear actions:

- **How to open** — opens the operational detail;
- **Get / Buy** — direct acquisition path when one exists.

### What must not appear on the default card

- evidence-class labels;
- research methodology;
- long carrier-rule prose;
- bibliography/source walls;
- provider marketing copy;
- official-vs-community reconciliation notes;
- arbitrary 0–100 Phone risk scores;
- fake OTP percentages.

## 5. Metric presentation

### SMS / OTP

Until enough observations exist for a defensible percentage, use a qualitative state based on current outcomes.

Working labels:

- **Strong** — several recent independent successful outcomes and no material current failure pattern;
- **Good** — current success is common but the sample is smaller or there are limited caveats;
- **Mixed** — meaningful recent success and failure both exist;
- **Weak** — recent failure dominates or the route is service-limited;
- **Not enough recent data** — insufficient current user outcomes.

The label is user-facing; sample details stay backstage or behind an optional detail.

### Setup effort

Working labels:

- **Low effort** — ordinary online purchase/activation with few special steps;
- **Some work** — KYC, support contact, eSIM conversion or several manual steps;
- **High effort** — local presence, complex verification, repeated support work or difficult acquisition.

Always pair the label with one short reason, e.g. `Passport + video KYC` or `Must activate locally`.

### Remote practicality

Use action-oriented states:

- **Remote** — current route can be completed without travel;
- **Remote after setup** — one local/home-network step is required first;
- **Travel/local presence required**;
- **Route-dependent** — when current outcomes genuinely conflict.

### Stability

Use descriptive states only:

- **Stable**;
- **Watch**;
- **Degrading**;
- **Conflicting**;
- **Retired**.

A one-line reason may appear only when it changes the decision, e.g. `Recent number-recovery complaints`.

## 6. Detail / tutorial contract

Opening `How to open` must show a short playbook, not a research report.

### Section A — What to buy

- exact route/product;
- approximate acquisition cost;
- physical SIM/eSIM;
- purchase link.

### Section B — What you need

Only actual prerequisites:

- passport/KYC if encountered;
- local address/residency if required in practice;
- supported device;
- local presence if needed;
- payment/support requirement.

### Section C — Open it

Numbered operational steps. Keep each step short and action-oriented.

Example shape:

1. Buy the eSIM from the current acquisition path.
2. Install the profile.
3. Complete identity verification.
4. Attach to the required network / enable roaming or Wi-Fi Calling when the route needs it.
5. Confirm you can receive a test SMS before tying important accounts to the number.

The actual steps are route-specific.

### Section D — Keep it alive

Show:

- cheapest current reproduced keep-alive action;
- interval;
- yearly cost;
- reminder suggestion when useful.

### Section E — OTP / SMS reality

A short current note:

- what recent users report working;
- material service-specific failures if known;
- whether roaming/Wi-Fi Calling/device choice matters.

No literature review.

### Section F — Main risk and recovery

Only the main practical failure mode and what the user can do:

- number loss/recycling;
- eSIM/device replacement;
- support refusal;
- overseas enforcement;
- port/reissue/recovery path.

### Section G — Useful current tutorial

Show at most a small number of current practical links:

- one strong step-by-step tutorial;
- optionally one current video;
- optionally one current community thread with meaningful recent outcomes.

Do not turn this into a bibliography.

## 7. Desktop visual model

The desktop experience should behave more like a comparison instrument than a collection of oversized marketing cards.

Use a calm route list with three visual zones:

- **Identity zone** — provider, country, number type;
- **Decision zone** — OTP, annual cost, setup, remote practicality, stability;
- **Action zone** — tutorial and acquisition actions.

The decision zone should occupy most of the horizontal space. Identity and actions should remain visually quieter.

Route rows/cards should have enough separation to scan, but several routes should remain visible without excessive scrolling. Avoid giant hero cards and oversized buttons.

Sorting should be available for:

- OTP reliability;
- yearly keep-alive cost;
- setup effort;
- current stability.

## 8. Mobile visual model

Mobile is not a squeezed desktop table.

Each route becomes a compact stacked card:

1. route + country + SIM type;
2. a small 2-column metric area for OTP / yearly cost / setup / stability;
3. one line for remote practicality / key blocker;
4. two restrained actions: `How to open` and `Get / Buy`.

Keep the filter control collapsible or horizontally compact so it does not push the route list below several screens of UI.

The user should see a real route almost immediately after the page heading.

## 9. Global route-pool behavior

The page must support a global route pool rather than a fixed country sequence.

Default behavior:

- show high-value routes across countries;
- let the user filter by country when they care;
- let cost/reliability/setup/stability dominate ranking;
- allow multiple routes from one country when they solve different jobs;
- do not manufacture a route just to give every country coverage.

A route can enter the candidate pool from any country when current community evidence reveals a useful path.

See `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md` for the first breadth sample.

## 10. Analytics contract

The redesigned page should distinguish these actions:

- route impression/view;
- filter applied/cleared;
- sort changed;
- tutorial opened;
- purchase/get clicked;
- keep-alive/reminder action if retained;
- service-compatibility detail opened.

Do not collect phone numbers, account credentials, OTPs or sensitive identity data.

## 11. Implementation boundary

This document is the product interaction specification only.

No production implementation should begin until this concept is reviewed and accepted.

When implementation is authorized:

- keep the existing canonical URL;
- use a fresh branch/worktree;
- remove questionnaire-first gating;
- reuse useful existing route data but reclassify old research-heavy fields;
- do not bulk-add providers in the same implementation PR;
- test desktop and mobile hierarchy before merge.

## 12. Product acceptance questions

The concept is ready for implementation only if the answer to all of these is yes:

1. Can a visitor see actual phone-number routes without answering questions first?
2. Can they compare OTP reliability, yearly cost, setup effort and stability in seconds?
3. Is country secondary to route usefulness?
4. Can they open a practical tutorial without reading research methodology?
5. Are the cards neither oversized marketing blocks nor cramped data dumps?
6. Does mobile expose routes quickly?
7. Can the same UI support Hong Kong, Taiwan, Korea, Singapore, Europe, North America and new countries without redesigning the page?
8. Is the research complexity kept backstage?