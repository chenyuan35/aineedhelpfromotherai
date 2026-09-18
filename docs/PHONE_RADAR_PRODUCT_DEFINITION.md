# Phone Radar — Product Definition

Last updated: 2026-09-18

## Product identity

Phone Number Lifecycle is operated as **Phone Radar**.

It is not a carrier encyclopedia, documentation mirror, marketplace or research report.

Its core job is:

> **Help a user quickly find, compare and execute the right phone route using current real-user operating information.**

The product moat is turning scattered community experience into a fast decision and an actionable guide.

## Three route families

Phone Radar has three fixed user-facing families.

### 1. Long-term SMS / OTP numbers

Real mobile-number routes intended to be kept.

Primary questions:

- does SMS/OTP work in current real use;
- what does it cost per year to keep;
- how hard is setup;
- can it be opened/used remotely;
- how stable is it;
- can the same number be recovered/reissued.

### 2. Data SIM / eSIM

Travel or longer-term connectivity routes.

Primary questions:

- package/data cost;
- allowance and validity;
- coverage/network;
- actual activation/setup friction;
- whether it can be recharged/reused;
- whether a real phone number is included and what it can do;
- whether a current promotion materially improves value.

### 3. Temporary SMS platforms

Short-lived/rented SMS reception services.

Primary questions:

- current price;
- recent success signal;
- country/service availability;
- private/shared/reused-number state;
- privacy/reuse/account-recovery risk;
- current stock/availability.

Temporary SMS must be clearly separated from a number suitable for long-term account recovery.

## Two experience layers

### Visual dashboard — default

Users should be able to make a quick decision without reading an article.

The default page shows:

- one of the three route families;
- a small current shortlist;
- family-appropriate metrics;
- one-line caveats only when material;
- clear actions to open the full guide or acquire/use the route.

### Full guide — on demand

Users who want to execute a route can open a concise guide containing:

- what to buy/use;
- current price;
- prerequisites;
- exact steps;
- how to receive SMS/OTP or use data;
- keep/recharge/renew path;
- main current pitfall;
- recovery/reissue path when relevant;
- one or a few useful current tutorial/video/community links;
- acquisition/platform link.

Research methodology is never required reading.

## Decision-cost rule

Phone Radar should reduce the user's work.

- No questionnaire before seeing options.
- No dozens of equal-weight choices by default.
- No evidence/source wall on the decision screen.
- No forcing one metric model onto all three families.
- Filters refine results; they do not gate them.
- The user may stop after the visual dashboard.
- The detailed guide exists only for users who want to act.

## Long-term SMS / OTP decision model

### SMS/OTP reliability

Primary user metric. Do not invent a percentage without enough route-specific observations.

Until a defensible rate exists, use qualitative states derived from recent independent success/failure reports, recency and conflict level:

- Strong;
- Good;
- Mixed;
- Weak;
- Not enough recent data.

### Yearly keep-alive cost

Track acquisition cost, required top-up, recurring cost, keep-alive action/interval and material replacement fees. Emphasize the real yearly cost on the dashboard.

### Setup effort

Derive from real friction: KYC, local presence, support contact, app/account steps, payment restrictions, SIM/eSIM/device requirements and reissue complexity.

### Remote practicality

Show whether the route is remote, remote after initial setup, local-presence required or genuinely route-dependent.

### Continuity

Track same-number replacement/reissue, recovery, suspension windows, number recycling and practical exit/port paths.

### Stability

Do not invent a 0–100 Phone risk score.

Use descriptive states such as:

- Stable;
- Watch;
- Degrading;
- Conflicting;
- Retired.

## Data SIM / eSIM decision model

Track:

- acquisition/package price;
- cost per GB when useful;
- allowance/unlimited semantics;
- validity;
- destination/network coverage;
- activation/KYC/device friction;
- real speed/throttling reports;
- recharge/reuse state;
- number/SMS/voice capability when included;
- current promotion only when it changes value.

## Temporary SMS decision model

Track:

- current price model;
- recent success/failure reports;
- supported country/service combinations;
- private/shared/reused-number behavior;
- expiry/rental window;
- privacy/recovery risk;
- current availability.

Do not present a temporary/shared number as a safe foundation for important long-term recovery.

## Source roles

### Community/user evidence — operational reality

Primary inputs:

- first-hand forum/community reports;
- current tutorials;
- detailed comments;
- user-shared support interactions;
- setup success/failure;
- SMS/OTP success/failure;
- keep-alive results;
- real data speed/throttling/coverage behavior;
- number recovery/loss;
- refunds/restorations;
- complaints and later resolution;
- current procedure changes.

### Operator/provider pages — commercial metadata

Use by default for:

- current listed price;
- package name;
- current promotion/new offer;
- stock/availability when exposed;
- purchase/checkout link;
- advertised top-up/fee.

Provider pages are not an operational verification gate and do not override current real-user outcomes.

## Global route pool

Country is an attribute/filter, not the research sequence.

The radar should continuously discover useful routes across regions. Multiple routes from one country are fine when they solve different jobs; zero routes from another country are also fine when nothing useful is found.

Do not create country/provider doorway pages to simulate coverage.

## Ranking principle

There is no universal best route across all users and all three families.

The dashboard should present a small shortlist and make tradeoffs obvious using the family’s decision metrics. A route must never be favored merely because it is easier to document.

## Closed-loop journeys

### Long-term number

`shortlist → compare → full guide → buy → activate → test SMS → keep alive → recover/replace if needed`

### Data SIM/eSIM

`shortlist → compare value/coverage → full guide → buy → install → use → recharge/reuse if supported`

### Temporary SMS

`shortlist → compare price/success/privacy → full guide → use → discard`

## Success condition

Phone Radar succeeds when a first-time visitor can quickly answer:

> Which type of phone route do I need, which current options fit, what are the important tradeoffs, and what exact next step do I take?

The user should not need to learn how Phone Radar performs its research in order to get that answer.
