# Telstra Australia Pre-Paid Casual retention / roaming maintenance — 2026-10-08

Route: `telstra-prepaid-longexpiry-2026`. Decision: **retain HOLD and backstage-only**, no new route/indexable URL, no service/OTP success percentage and no new canonical route identity.

## Correct exact-product economics

The previous snapshot treated the mainstream data-heavy **Telstra Pre-Paid Mobile AUD395/12 months** (or AUD200/6 months) as the cheapest long-validity pathway. That was incorrect for a user retaining an Australian mobile number rather than domestic data. Telstra's current **Pre-Paid Mobile Casual** family is separately offered and the **AUD74/12-month recharge** is explicitly recommended by Telstra to travellers leaving Australia who want to keep their number. The other Casual option is **AUD44/6 months** (AUD88 for two six-month recharges). Current checkout offers an eSIM or physical SIM with **AUD2 physical kit plus chosen recharge**; the normalized AUD74 acquisition assumes direct eligible eSIM activation and therefore excludes a separate physical kit. There is no new currency conversion asserted.

The identity `telstra-prepaid-longexpiry-2026` was intentionally retained as the existing Telstra number-retention route; the mainstream data-rich family remains a separately priced alternative within the narrative, not a fictitious extension of Casual inclusions. Do not inflate route coverage by treating the prior generic comparison as a second reviewed canonical identity.

## Number lifecycle and recovery

Telstra currently documents a **6-month recharge-only rescue period after the last recharge expires**, then service deactivation and mobile-number loss if not recharged. Its support states **incoming calls** remain available during the rescue window, but this wording does not explicitly prove incoming SMS delivery during that period. Maintain the number by recharging the **AUD74 Casual 12-month tier before expiry**. The cost is a purchased recharge with domestic-use inclusions, not an additional separate line-rental fee. Telstra's prepaid Casual terms limit normal included service to Australia.

## Identity, eSIM, payments, foreign activation

Telstra's current new-prepaid checkout lists **Australian passport, driver's licence, Medicare, international passport or Immicard** as available ID verification paths. Physical SIM and eSIM are supported. Passport appearing in the form does not prove every foreign-national application passes digital verification, and no reliable **first activation from mainland China or abroad** was established. Recharge via My Telstra app/browser is supported, but foreign-issued card/PayPal acceptance and obtaining an international roaming pack after offshore departure are not confirmed for all cases. One historical independent 365-day prepaid user specifically reported inability to purchase a roaming pack after leaving.

## Overseas SMS and independent evidence

Telstra currently offers Pre-Paid roaming packs **AUD10/3 days, AUD15/7 days and AUD25/14 days** for selected destinations; the prepaid roaming FAQ lists both sent and received SMS under messaging allowances. September and May 2026 independent user discussions report successful ordinary inbound prepaid SMS without a roaming pack, including reported bank codes, but conditions/plan identities vary and are not equivalent to verified exact **Pre-Paid Casual + mainland China + named bank/app** observations. A February 2025 pack-purchase failure report is a single continuity incident, not a general failure probability. Keep `guideEligible=false` and zero exact service observations.

## Sources

- Current 2026-05-05 Telstra Critical Information Summary (Mobile + Casual): https://www.telstra.com.au/help/critical-information-summaries/personal/pre-paid/prepaid-mobile/telstra-pre-paid-mobile-offers-from-may-5-2026
- Telstra live offers / eSIM / identity: https://www.telstra.com.au/mobile-phones/prepaid-mobiles/offers-and-rates/index
- Telstra traveller support recommending Casual AUD74: https://www.telstra.com.au/mobile-phones/prepaid-mobiles/traveller-sim
- Telstra prepaid expiry and recharge-only period: https://www.telstra.com.au/support/pre-paid/recharge-my-pre-paid-service
- Telstra prepaid roaming packs / FAQ: https://www.telstra.com.au/mobile-phones/prepaid-mobiles/international-roaming
- 2026-09-23 independent prepaid roaming discussion: https://www.reddit.com/r/TelstraAustralia/comments/1wntvdh/receive_both_sms_and_phone_calls_on_her/
- 2026-05-05 independent bank-inbound-SMS discussion: https://www.reddit.com/r/AusFinance/comments/1t4ell5/whats_the_cheapest_way_to_keep_my_aussie_number/
- 2025-02-03 365-day roaming-pack activation incident (reply): https://www.reddit.com/r/TelstraAustralia/comments/1hls0t2

Retained original source plus **8 new source records** and **5 route-level events**; **0 exact service observations**, `HOLD/backstage-only`. Canonical: **160 routes / 87 markets / 157 brands / 117 networks / 779 sources**. Public boundary remains **135 historical comparison / 3 indexable routes / 31 sitemap URLs**.

## Verification / release gate

Bounded regression `scripts/test-phone-telstra-casual-maintenance.mjs` is included in `npm run phone:data:check`; its acceptance conditions cover AUD74, 12 months, six-month rescue, source/event provenance, HOLD state, empty service observations, 160-route and 135/3 public boundary. Generated canonical search, summary, metric, detail and database bundle artifacts are committed together. Mark release complete only after CI/Eval Gate/Preview pass, merge and production check.

Next independent Wave B HOLD route: `claro-pre-br-90d-2026`.
