# Phone Radar — Product Definition

Last updated: 2026-09-17

## Product identity

Phone Number Lifecycle is operated as a **Phone Radar** for AI-power users and other people who need a durable overseas/mobile number.

The product is not a carrier-plan directory and not a cleaner copy of carrier websites.

Its core job is:

> Continuously discover non-obvious low-cost phone-number routes, verify how real users actually obtain and keep them working, expose the true setup difficulty and failure conditions, and let a user quickly filter to the routes that fit their own constraints.

This is analogous to the project's reset-radar model: the value comes from continuously collecting weakly advertised, changing and operationally important information, then turning it into a fast decision tool.

## What the radar must discover

Priority discoveries include:

- hidden or poorly advertised low-cost plans;
- support-assisted retention/validity packages;
- carrier app/account-only options;
- marketplace or travel-SIM routes that can become durable personal numbers;
- unusually cheap keep-alive actions;
- overseas activation paths that current users are successfully reproducing;
- Wi-Fi Calling / VoWiFi and roaming-SMS paths that matter for OTP/account recovery;
- same-number eSIM replacement, transfer and recovery procedures;
- current support channels that actually process the request;
- recent price increases, package removals, refusal patterns, bans and route failures.

Public carrier marketing visibility is not a discovery or admission requirement. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` governs evidence handling.

## User decision model

A user should be able to filter routes by practical constraints instead of reading long carrier descriptions.

Every route should eventually expose these decision fields:

### Cost

- acquisition cost;
- required first top-up;
- recurring cost if any;
- cheapest currently reproduced keep-alive cost;
- expected yearly retention cost;
- hidden fees such as SIM/eSIM replacement, SMS, support-assisted conversion or mandatory package cost.

### Setup difficulty

Do not reduce difficulty to a vague `Easy / Hard` label. Track what makes the route difficult:

- passport required;
- KYC required;
- residency/address requirement;
- local physical presence required;
- local carrier-network attachment required;
- customer-service contact required;
- manual email/chat process required;
- app-only step required;
- payment-card restrictions;
- initial recharge required;
- physical SIM required;
- eSIM-capable device required;
- device/eSIM transfer limitations;
- typical support back-and-forth;
- most recent successful setup date known to us.

The UI may derive a compact difficulty label from these facts, but the underlying reasons must remain visible.

### China / overseas usability

For the intended audience, explicitly track:

- can purchase from mainland China;
- can activate from mainland China;
- can receive SMS while in mainland China;
- incoming roaming SMS cost;
- Wi-Fi Calling / SMS over Wi-Fi behavior reported by current users;
- whether first activation must happen in the home country;
- whether long-term overseas use has recent termination/enforcement reports;
- data roaming availability when relevant.

### Number continuity

- same number preserved after SIM/eSIM replacement;
- online vs store-only replacement;
- number-porting options;
- recovery/grace window after suspension;
- number recycling risk;
- known recycled-number reputation problems;
- practical migration path when the route starts failing.

### Evidence freshness

- last successful reproduction known to us;
- last failure/refusal report;
- support-confirmed vs replicated-community vs emerging/conflicting/stale state;
- material differences between current reports;
- whether a price or procedure appears account-specific or agent-dependent.

## Fast-filter experience

The first useful interaction should let users eliminate incompatible routes quickly.

Examples of high-value filters:

- `I have a passport / I do not have a passport`;
- `I am in mainland China and cannot travel`;
- `I need eSIM`;
- `I only need SMS / OTP`;
- `I need Wi-Fi Calling`;
- `I want the lowest yearly keep-alive cost`;
- `I do not want to contact customer service`;
- `I need easy device replacement`;
- `I need a route with recent successful reproductions`;
- `I care more about stability than absolute minimum cost`.

The output should explain **why** each surviving route fits, what the user must prepare, the real current cost, the exact difficult step, and the main failure risk.

## Ranking principle

Do not rank carriers by marketing price alone.

A useful route is a combination of:

- real total cost;
- setup friction;
- user prerequisites;
- current reproducibility;
- overseas SMS/Wi-Fi Calling continuity;
- keep-alive cost and effort;
- number replacement/recovery quality;
- recent failure/enforcement risk;
- evidence freshness.

There is no single universal best route. The product should identify the best-fitting routes for the user's constraints and explain the trade-offs.

## Research priority

During the current audit, research effort should be ordered as follows:

1. Correct existing production routes where recent community reality differs materially from current product guidance.
2. Deepen high-signal hidden routes such as support-assisted retention packages and unusually low-cost reproducible keep-alive paths.
3. Capture the exact setup prerequisites and failure modes needed for filtering.
4. Admit at most one or two genuinely strong new routes after current reproducibility is established.
5. Do not expand into a large carrier catalog merely because many routes can be found.

## Success condition

Phone Radar succeeds when a user can arrive with a constraint such as:

> "I am in China, have a passport, only need SMS/OTP, want eSIM, can tolerate emailing support, and want to spend as little as possible each year."

and quickly receive a small set of current, reproducible routes with:

- what to buy;
- what it really costs;
- what documents/devices are required;
- how difficult setup is and why;
- whether it currently works overseas;
- how to keep the number alive;
- how recently someone successfully reproduced the route;
- what can go wrong and how to exit without losing the number.

That decision advantage — not reproducing carrier documentation — is the product moat.