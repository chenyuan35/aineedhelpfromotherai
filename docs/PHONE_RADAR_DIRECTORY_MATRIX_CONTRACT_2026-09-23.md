# Phone Radar — Carrier Directory / Comparison Matrix Contract

Date: 2026-09-23
Status: ACCEPTED PRODUCT CORRECTION / IMPLEMENTATION NEXT

## 1. Product job

Phone Radar is a visual phone-number intelligence directory for users who want a cheap, workable number or SIM/eSIM route without spending hours reading forum threads.

Its job is not to recommend a single universally “best” carrier and not to reproduce operator documentation. Its job is to flatten the information gap so the user can see the real trade-offs at a glance and make the decision themselves.

The primary product value is current forum/community intelligence converted into structured comparison data:

- actual acquisition route and real landed cost;
- current discounts/coupons and where they are obtained;
- yearly keep-alive cost and exact keep-alive action;
- real China/overseas activation and SMS behavior;
- service-specific verification outcomes such as ChatGPT, Telegram and WhatsApp;
- number recycling, suspension, closure, recovery and refund history;
- route stability/trend and freshness;
- an exact step-by-step guide when the user wants to execute the route.

Operator/provider pages remain secondary sources for provider-controlled commercial facts such as current list price, package name, stock and published fees.

## 2. Canonical and scope

Keep the existing canonical:

`/tools/phone-number-survival-guide/`

Do not create country/provider doorway pages for the directory.

Long-term real SMS/OTP numbers are the primary directory surface. Data SIM/eSIM and Temporary SMS remain separate families but should not dilute the long-term number comparison model.

## 3. Information hierarchy

The long-term directory must use this hierarchy:

1. **Country / market**
2. **Host network / carrier group** — the underlying mobile network or clearly identified parent network where relevant
3. **Brand / MVNO** — e.g. a network-owned sub-brand or independent MVNO using that network
4. **Concrete route / product / acquisition method** — the exact way the user obtains and maintains the number
5. **Observed events** — timestamped successes, failures, recycling/suspension incidents, recoveries, refunds, price changes and procedure changes

Do not flatten every brand into unrelated cards. The user must be able to understand that several brands/routes share a network while still having different acquisition, retention and operating behavior.

## 4. Default visual model

### Desktop

Use a compact grouped comparison matrix, not oversized marketing cards.

- Country/search controls at the top.
- Network groups are visually distinct and can expand/collapse.
- Each brand/route is one row.
- The left identity column remains visible while the comparison area can scroll horizontally.
- Several rows remain visible at once.
- Each row has a **Guide** action and an **Acquire / Open** action.
- Clicking a row or Guide opens the detailed execution layer without leaving the canonical.

Required visible comparison columns for long-term numbers:

1. Brand / route
2. Host network
3. Acquisition / landed cost
4. Approx. CNY landed cost
5. Keep / year
6. Keep-alive action + interval
7. Data / tariff when material
8. China / overseas activation
9. KYC / identity friction
10. Wi-Fi Calling / roaming SMS state
11. App compatibility summary
12. Recycling / suspension incidents
13. Refund / recovery outcome
14. Current trend
15. Evidence count / last checked
16. Guide / acquisition action

The matrix may hide lower-priority columns behind horizontal scroll on smaller desktop widths, but the cost, keep-alive, compatibility, continuity and freshness columns must remain easy to reach.

### Mobile

Do not squeeze the desktop matrix into an unreadable table.

Use compact grouped cards with:

- brand / host network;
- landed cost + yearly keep cost;
- app compatibility chips;
- current trend;
- incident count;
- last checked;
- Guide and Acquire actions.

A secondary horizontal detail strip or expandable section may expose the remaining fields.

## 5. Cost model

The directory must distinguish several costs instead of showing one provider list price.

For each route capture where applicable:

- official/list price;
- community acquisition price;
- coupon/referral/promotion discount;
- reseller/middleman cost;
- physical shipping to the user;
- eSIM adapter / 5ber / 9eSIM / programmable-card cost when actually required;
- mandatory initial top-up;
- taxes/fees when material;
- FX conversion rate and conversion timestamp;
- **real landed cost in original currency**;
- **approximate landed cost in CNY**;
- **minimum reproduced annual keep-alive cost**.

The user-facing figure should answer “what do I actually spend to get this working?” rather than “what does the operator advertise?”

Unknown shipping or intermediary cost must remain unknown rather than being silently treated as zero.

## 6. Discount / acquisition intelligence

Each route may have multiple acquisition paths:

- official checkout;
- current promotion;
- coupon code;
- referral;
- forum-discovered purchase route;
- reseller;
- port-in route;
- physical SIM route;
- eSIM route.

Every non-official acquisition path must carry:

- source;
- last verified date;
- current state: active / expired / uncertain;
- any important failure mode;
- whether the route introduces extra cost or dependency.

Do not present expired or unverified coupons as live discounts.

## 7. App compatibility matrix

Compatibility is service-specific and operation-specific. Track at least:

- ChatGPT / OpenAI verification;
- Telegram;
- WhatsApp;
- Google when evidence exists;
- other high-demand services only when real route-specific observations exist.

For each service distinguish when possible:

- initial registration;
- login / recurring OTP / 2FA;
- recovery / number-change flow.

### Percentage rule

Never invent a universal success probability.

Store independent dated observations as success/failure events. Deduplicate copied/circular reports.

- If there are at least **5 reasonably independent recent observations** for the same route + service + operation in the active evidence window, the UI may show an **observed rate**, e.g. `9/10 · 90% observed`.
- Always show the denominator and evidence window/date.
- If `n < 5`, show the raw count and a qualitative state, e.g. `2 reports · insufficient sample`.
- Conflicting reports remain visible; do not erase failures to improve the rate.
- A rate is an observed sample summary, not a promised probability for the next user.

## 8. Continuity / risk history

Do not create an arbitrary 0–100 Phone risk score.

Track concrete events instead:

- number recycled / reallocated;
- line suspended / blocked / closed;
- mass enforcement or unusual closure wave;
- unexpected plan termination;
- failed reissue / replacement;
- successful same-number recovery;
- successful port-out;
- refund granted / denied / unresolved;
- support restoration;
- price/retention-rule change.

The matrix can show:

- `Recycling/loss incidents: N observed`
- `Recoveries: X/Y observed`
- `Refund: confirmed / denied / mixed / no evidence`
- `Trend: Stable / Watch / Degrading / Conflicting / Retired`

Incident counts must state the tracked evidence window or lifetime coverage. They are counts from observed evidence, not population incidence rates.

## 9. Ranking and sorting

Phone Radar may show ranks, but the rank must be transparent and use-case-specific.

Do not claim one universal best number.

Default long-term SMS/OTP view may show a **Practical rank** only among routes that meet the selected user job and have sufficient evidence. Ranking inputs are ordered, not hidden weighted magic:

1. currently reproduced ability to receive the selected service/OTP;
2. evidence adequacy/freshness;
3. lower annual keep-alive cost;
4. lower real landed acquisition cost;
5. fewer unresolved continuity incidents;
6. lower execution friction for the selected user context.

Users must also be able to sort directly by:

- lowest landed cost;
- lowest yearly keep cost;
- strongest app evidence;
- newest verification;
- continuity/trend;
- easiest remote setup.

Missing data must not improve rank.

## 10. Detailed guide contract

Every concrete route can open a concise detailed guide containing:

1. What route/product this is
2. Current cheapest reproduced acquisition path
3. Real landed-cost breakdown
4. Requirements: device, eSIM/physical SIM, payment, KYC/local-presence constraints
5. Exact acquisition steps
6. Exact activation steps
7. How to test incoming SMS before binding important accounts
8. App-specific current outcomes
9. Cheapest reproduced keep-alive method + interval
10. Data/tariff information when material
11. Current failure modes / continuity events
12. Refund/recovery/reissue/port-out information
13. Current coupon/deal if still live
14. Last checked date
15. A small set of strongest current community/tutorial sources

The guide is execution help, not a research report.

## 11. Research / data model

The durable backstage model should separate entities and observations:

- `markets`
- `networks`
- `brands`
- `routes`
- `acquisition_paths`
- `cost_snapshots`
- `service_observations`
- `continuity_events`
- `guides`
- `sources`

A route is not permanently labelled “works” or “does not work”. Its current UI state is derived from timestamped evidence.

Useful route fields include:

- `market_id`
- `network_id`
- `brand_id`
- `route_id`
- `number_type`
- `sim_type`
- `acquisition_cost_original`
- `shipping_cost_original`
- `intermediary_cost_original`
- `required_topup_original`
- `landed_cost_original`
- `landed_cost_cny`
- `fx_rate`
- `fx_checked_at`
- `keep_cost_year_original`
- `keep_cost_year_cny`
- `keep_action`
- `keep_interval_days`
- `data_allowance`
- `tariff_summary`
- `china_activation_state`
- `kyc_state`
- `wifi_calling_state`
- `roaming_sms_state`
- `refund_state`
- `trend_state`
- `last_verified_at`

Service observations should carry at least route, service, operation, success/failure, date, source, geography/context and deduplication identity.

Continuity events should carry type, date, outcome, recovery/refund result and source.

## 12. UK pilot evidence validating the model

This contract is grounded in current forum evidence rather than hypothetical fields.

### Vodafone UK direct / zero-cost acquisition episode

Current forum reports in June 2026 described a £0 Vodafone UK acquisition path. Users immediately asked about long-term retention, reported setup/activation irregularities, and discussed using the route as a temporary acquisition path before porting elsewhere. This demonstrates why `acquisition path`, `temporary deal state`, `long-term continuity` and `port-out route` must be separate fields.

Sources:
- https://linux.do/t/topic/2401952
- https://linux.do/t/topic/2404421
- https://linux.do/t/topic/2417339

### VOXI on Vodafone UK

Forum reports show materially different behavior from Vodafone direct: current users discuss £5/£10 balance, 180-day balance-change retention, Wi-Fi Calling setup, inability to send SMS before full activation, and alternative tiny roaming-data consumption as a keep-alive action. This demonstrates that host network does not determine route behavior by itself.

Sources:
- https://linux.do/t/topic/2188975
- https://www.nodeloc.com/t/topic/102713

### Lebara UK on Vodafone UK

An August 2026 mainland-China user reported successful inbound WhatsApp and Telegram verification SMS after installing the eSIM outside the UK, while outgoing SMS and voice were initially abnormal. The same user documented a billed £0.49 SMS as a chargeable activity and support confirmed a restarted 90-day inactivity window for that account. Other replies showed both similar and conflicting follow-up outcomes. This demonstrates the need for operation-specific app evidence, activation context, keep-alive evidence and conflict tracking.

Source:
- https://linux.do/t/topic/2745784

### Giffgaff on O2

June-August 2026 forum reports show cheap keep-alive behavior, strong use for some overseas verification tasks, but mixed Telegram behavior, WhatsApp/IP friction, recycled-number anecdotes and a later suspension/closure wave with some recoveries. This demonstrates why a single permanent “OTP works” label is insufficient.

Sources:
- https://linux.do/t/topic/2466918
- https://linux.do/t/topic/2322268
- https://linux.do/t/topic/2316489
- https://linux.do/t/topic/2669341
- https://linux.do/t/topic/2790241

## 13. MVP implementation boundary

The first production implementation should change the existing canonical only.

MVP scope:

- preserve the three top-level families;
- make Long-term SMS/OTP open into the carrier directory/matrix;
- implement country/network grouping and horizontal comparison;
- add explicit landed cost, keep/year, app compatibility, continuity incidents, refund/recovery, trend and freshness fields;
- add expandable detailed guides;
- populate only a small UK pilot set whose evidence can be verified cleanly;
- keep existing Data SIM/eSIM and Temporary SMS behavior stable unless required for the shared shell.

Do not do in this MVP:

- no new country/provider SEO URLs;
- no global bulk-fill of weak data;
- no fabricated compatibility percentages;
- no arbitrary 0–100 Phone risk score;
- no backend marketplace or SMS inventory system;
- no automatic claim that all brands on one host network behave the same;
- no unsafe instructions for forged KYC, fake identities, deceptive support stories or prohibited-use bypasses.

## 14. Technical plan

Prefer the existing static/client-side architecture.

- Extend or replace the current `radar-view.json` frontstage schema with normalized directory entities or a build-time-normalized equivalent.
- Keep raw research/evidence backstage; publish only decision-critical aggregates and source links.
- Render the desktop grouped matrix client-side on the existing canonical.
- Render compact mobile cards from the same normalized data.
- Keep guides in existing in-page detail panels/drawers.
- No new database is required for the first MVP if the pilot data is stored as versioned JSON.
- Future automation may write snapshots into versioned data, but the UI must not depend on a paid live API.

## 15. Acceptance criteria

The corrected Phone Radar is acceptable when a first-time user can:

1. choose a country/market;
2. understand the major host networks and brands beneath them;
3. compare several concrete number routes in one view;
4. see real acquisition cost and yearly keep cost without calculating it themselves;
5. see whether ChatGPT/Telegram/WhatsApp evidence exists and how many observations support it;
6. see continuity incidents, refund/recovery evidence and current trend;
7. open an exact acquisition/activation/keep-alive guide;
8. distinguish cheap-but-risky from expensive-but-stable without Phone Radar making the final decision for them;
9. understand when data is missing, old or conflicting;
10. complete all of the above without reading forum threads first.
