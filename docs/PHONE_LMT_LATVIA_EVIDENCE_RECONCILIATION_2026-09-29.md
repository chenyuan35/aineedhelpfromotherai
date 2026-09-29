# Phone Radar — LMT Latvia evidence reconciliation — 2026-09-29

Status: **ADMIT-BACKSTAGE EVIDENCE UPDATE / NO PUBLICATION CHANGE**

Route: `lmt-karte-60-60d-2026`

This is a bounded evidence reconciliation for the existing legacy comparison route. It does not authorize a new canonical migration cohort, standalone URL, sitemap entry, or ranking change.

## Decision

Keep LMT Karte as a valid backstage/comparison candidate, but correct four fields before any future canonical migration:

1. the current starter is EUR 1.50 and the public product page describes a 60-day advance-validity period plus 60 days for receiving calls/texts;
2. the existing ~EUR 18/year keep-cost estimate is not the cheapest currently documented route because LMT now exposes `Time Limit+` at EUR 0.30 for a 30-day extension of both balance-expiry and use-by dates;
3. ordinary LMT Karte use does not require prior customer registration — LMT says the card can be used immediately after purchase; registration is optional for additional account-service benefits;
4. remote/foreign activation and overseas SMS need explicit caution: LMT currently asks users to activate in Latvia, says activation options may be limited abroad, and disables sending SMS while abroad by default until the restriction is removed after identity verification.

Verdict: **ADMIT-BACKSTAGE** for the evidence database; **comparison visibility unchanged**; **not detail-eligible/indexable from this review**. Canonical migration remains deferred because the current project bottleneck is measurement/value, not route-overlap count.

## Current first-party facts

### Acquisition

- Current LMT Karte new-number page lists the base new number at **EUR 1.50**.
- The same page offers both physical SIM and eSIM acquisition.
- The base offer lists 50 MB in Latvia, EUR 0.19/min calls in Latvia/EEA+ and a `120-day active number` label.
- The explanatory text on the same page says that if the account is not topped up, the advance-validity period is **60 days + 60 days for receiving calls and text messages**.

Source: https://www.lmt.lv/en/lmt-karte/new-number

### Keep-alive / expiry

- LMT exposes `Time Limit+` to all LMT Karte customers for **EUR 0.30**, extending both the balance-expiry date and use-by date by **30 days** via SMS command `T+` to `29202010`.
- This proves a materially cheaper current extension mechanism than the legacy top-up-only estimate of ~EUR 18/year.
- It does **not** by itself prove an exact minimum yearly total: the reviewed public page does not establish a bounded yearly repeat limit, nor does this review reconstruct every denomination-specific renewal-card expiry interaction.
- Therefore do not publish `EUR 3.60/year` as a guaranteed minimum. Preserve the exact annual minimum as unresolved until a current end-to-end reproduction or complete first-party denomination/extension rule set is available.

Sources:
- https://www.lmt.lv/en/lmt-karte/services/time-limit-plus
- https://www.lmt.lv/en/helpdesk/lmt-karte/lmt-karte-time-limits/use-by-date
- https://www.lmt.lv/en/helpdesk/agreements-and-terms-and-conditions/legal-information/refilling-lmt-karte-with-payment-card

### Registration / identity

- LMT says a user can start using an LMT Karte immediately after purchase and that no further action is needed.
- Becoming a registered LMT Karte customer is optional and provides service/recovery conveniences; registration at a customer centre requires the original PIN1 code and ID.
- The legacy field `LV prepaid registration required` is therefore too broad and should not survive a future canonical migration unchanged.

Source: https://www.lmt.lv/en/helpdesk/lmt-karte/lmt-karte-options/registered-customer-lmt-karte

### Foreign activation and roaming-SMS caveat

The current new-number page contains two important operational warnings:

- `Please activate the LMT Karte in Latvia. Activation options may be limited in foreign countries.`
- Sending text messages while abroad is disabled by default as an anti-fraud restriction; the user can request removal by calling LMT and identifying the connection.

This conflicts with older independent reports that successfully activated an LMT prepaid eSIM abroad. Treat remote activation as **conflicting / not currently guaranteed**, not as a supported universal path.

Source: https://www.lmt.lv/en/lmt-karte/new-number

### Expiry recovery / number-loss risk

If the use-by date is missed, LMT says the number can be reactivated free of charge within **6 months** after expiry. The user must provide the original PIN1 code and refill within 3 days after reactivation. After that six-month window the number may be assigned to another user and remaining balance is not refunded.

Source: https://www.lmt.lv/en/helpdesk/lmt-karte/lmt-karte-time-limits/is-not-refilled

## Independent operational evidence

Fresh independent evidence supports current ordinary LMT Karte availability/use, but not yet the long-term overseas-number job:

- 2026-06-23 r/latvia: current users discuss LMT Karte prepaid use and topping up for weekly service, confirming the product remains actively used.
- 2025-04-06 r/latvia: users recommend LMT prepaid/eSIM for visitors and describe it as convenient.
- 2024-04-25 r/latvia: one user reports ordering a prepaid LMT eSIM and activating it in the UK before travel. This is useful historical operational evidence, but it is older than the current LMT warning to activate in Latvia and therefore cannot override the current conflict.

Independent sources:
- https://www.reddit.com/r/latvia/comments/1ud9wy4/prepaid_sim_price_need_20gb_or_30gb_monthly/
- https://www.reddit.com/r/latvia/comments/1jt2xcp/prepaid_sim_unlimited_data/
- https://www.reddit.com/r/latvia/comments/1cczmo4/dont_get_lmts_tariffs/

## Corrected route interpretation

Use these values in any future normalized migration/reconciliation:

- acquisition price: `EUR 1.50` current official base new number;
- SIM: physical + eSIM;
- base validity: preserve the official 60-day advance + 60-day receive-only wording and note the same page's `120-day active number` marketing label rather than silently collapsing the distinction;
- keep mechanism: `Time Limit+` EUR 0.30 / +30 days is current official evidence; exact minimum yearly total remains unresolved;
- registration: not required for ordinary initial use; optional registered-customer process exists for extra account/recovery services;
- remote activation: current official warning says activate in Latvia / foreign activation may be limited; older independent abroad-success evidence is conflict evidence only;
- abroad SMS: outgoing SMS is disabled by default while abroad until LMT removes the restriction after connection identification; do not infer non-EEA OTP reliability from EEA receive-only language;
- expiry recovery: free reactivation possible within 6 months after use-by expiry with original PIN1, followed by refill within 3 days;
- ChatGPT / Telegram / WhatsApp OTP: **unverified for the current route/prefix/operation**;
- China/non-EEA long-term use: **unverified**.

## Re-open triggers

Re-open this route for canonical migration or deeper public treatment only when at least one of the following appears:

1. a current independent end-to-end report reproduces purchase + activation + retention outside Latvia;
2. current evidence resolves whether repeated `Time Limit+` can be used as the durable minimum-cost retention path and establishes the true annual minimum;
3. current route-specific non-EEA incoming-SMS/OTP evidence appears;
4. first-party product/search usage identifies LMT/Latvia as a concrete next user job.

Until then: no new URL, no sitemap change, no generic `EUR 3.60/year` claim, and no guaranteed remote-activation claim.