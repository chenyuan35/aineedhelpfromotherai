# ASDA Mobile UK PAYG retention, payment and roaming audit — 2026-10-08

Canonical route: `asda-mobile-uk-2026`. Classification: real mobile / long-term / **HOLD, backstage-only**. No new public page or OTP service reliability percentage.

## Resolve three separate time/cost concepts

The previous route packet warned that `£5/180 days = £10/year` was overconfident, and correctly kept a HOLD. The present official evidence supports the **funding need** but not a fixed annual fee or SMS-only retention shortcut:

1. **Credit/top-up rule:** ASDA's [Topping up help](https://mobile.asda.com/support/topping-up) says top up or buy a plan within 180 days from activation or previous top-up/plan. At 180 days without a qualifying payment, outgoing calls/text/data are restricted, though inbound calls/texts are documented to remain possible. After **a further 90 days**, without support contact and top-up/plan purchase the account expires; number and remaining credit become unrecoverable.
2. **Chargeable activity rule:** In the same provider's "emergencies/reactivation" answer, a **chargeable call or SMS every 180 days** is separately required to maintain full active service; its advice about expiry at 270 days is phrased as "not used" instead of "not topped up". These are **two conflicting provider-facing descriptions**, not proof that the activity resets the recharge-credit deadline. Conservatively satisfy both triggers pending operator confirmation.
3. **Cash outlay vs spent credit:** ASDA's published PAYG terms set a **£5 minimum top-up** and up to £50 per transaction. Two £5 actions = **£10 in funded credit over 360 days**; some funds remain spendable and outgoing texts/calls subtract from credit. This is **not necessarily £10 of non-refundable annual service charges** and not a proven exact 365-day plan. The historical £46.5 converted landed estimate was dropped as obsolete FX; known UK free physical SIM plus £5 minimum first top-up yields a documented **£5 initial PAYG balance purchase**, subject to UK logistics/payment.

The [September 2025 official PAYG pricebook](https://mobile.asda.com/pdf/Asda-Mobile-Retail-Price-Book-PAYG-Sept-25.pdf) lists 15p/min UK calls, 10p/SMS and 10p/MB. The separate advertised **£5/month 3GB plan** is a 1-month bundle and must not be substituted for traditional PAYG credit or counted as mandatory.

## Activation/eSIM, foreign payment and roaming

[Activation support](https://mobile.asda.com/activate-sim) says a physical SIM becomes active after supported network detection/first use and links My Account through a received SMS code. A standard physical SIM can be ordered for free UK delivery; international SIM delivery is not proven. Current ASDA FAQs advertise a **physical-to-eSIM conversion**, but a new-number PAYG eSIM sold/activated entirely abroad has not been established. The physical PAYG terms are tied to the Vodafone network, while newer commercial pages mention Vodafone and Three coverage; the existing Vodafone canonical network ID is retained without guessing a provisioning change.

The [top-up help](https://mobile.asda.com/support/topping-up) explicitly limits online card payments to **UK-address-registered Visa or Mastercard**, so an ordinary foreign billing address is not an available proven payment route. Offline top-up via ASDA-linked cards/stores may require presence in the UK. No general mandatory identity-document check is explicitly described in the ordinary physical PAYG activation steps; do not claim a universal KYC exemption or unrestricted nonresident onboarding.

The September 2025 PAYG pricebook lists **China under World Group 1**, with 20p per outgoing text to the UK, but does **not explicitly specify the fee for receiving SMS abroad** or establish mainland-China partner attachment/OTP success. The UK-free incoming SMS statement from other ASDA terms must not be extended to overseas use without a current specific rule. The 180-day restricted-credit wording's promise of *inbound calls/texts* is not proof of foreign-roaming continuity. Avoid any China bank/WhatsApp/Telegram service-success claims.

## Independent user signals, not guarantees

- [2026-03-22 UK discussion](https://www.reddit.com/r/AskUK/comments/1s0j3xe/what_caused_the_decline_and_death_of_pay_as_you/): a claimed current ASDA user sets a reminder to send a chargeable text at about 5.5 months. This does not disprove ASDA's separate top-up-credit rule.
- [2025-06-08 UKFrugal comparison](https://www.reddit.com/r/UKFrugal/comments/1l6jyuv): independent low-usage PAYG shopper recognizes a minimum £5 top-up and 180-day activity / 90-day support window. This is a single dated recommendation, not a test of an account's 360-day retention.
- [2022-06 AskUK first-person report](https://www.reddit.com/r/AskUK/comments/v6dtlo): subscriber reported passing roughly 180 days without a restriction SMS or service shutdown. Old limited observation, not an entitlement or safe grace period.

Current 2026 first-person evidence proving that a £0.10 text alone indefinitely preserves remaining credit or a Chinese bank OTP on ASDA is **not present**. One route-only audit, **11 new sources and seven new events**; canonical 160 routes / 87 markets / 157 brands / 117 networks / **802 sources**. Route source depth **2 → 13**, eight total route events, zero application observations. Public boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.

## Release and observed production verification

PR #428 squash-merged as `811a056f937e3b395b9431bb52cb31f2f0654b6c`; CI #322 / run #37729998478 **PASS**; Eval Gate #1255 / run #37729998454 **PASS**; Vercel Preview `dpl_BJ62bfRcTRvokfW6GRvw4VUsSGqW` **READY**. GitHub auto-release did **not** immediately produce a main production deployment, so the coordinator triggered the existing Git-linked Vercel project production build explicitly at this exact merged main SHA. Production `dpl_5FUc8YupzsvaTKGtpcdvfHLN5ziN` is **READY**, with `aineedhelpfromotherai.com` alias and `aliasError=null`. Independent direct HTTP response inspection of the live lazy JSON or sitemap was unavailable; do not claim direct HTTP 200 / fresh counts measured.

## Engineering and release contract

The updated `scripts/test-phone-asda-uk-maintenance.mjs` checks the dual clock, £5 funding unit and £10/360 days, UK-registered-card exclusion, China roaming qualification, explicit unknown KYC/OTP, HOLD and 160/135/3 boundaries. It is included in `phone:data:check`. The historical Claro source-count regression was made monotonic for future evidence waves. The whole Phone search index, route summaries, route detail and database bundle were regenerated; CI / Eval Gate / Vercel Preview and merged production gates passed as documented above; the direct public JSON HTTP content gap remains explicit.

Next eligible bounded Wave B route: `free-mobile-fr-2026`.
