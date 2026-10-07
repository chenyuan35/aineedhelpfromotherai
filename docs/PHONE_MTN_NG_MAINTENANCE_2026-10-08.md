# MTN Nigeria Keep My Number maintenance — 2026-10-08

Route: `mtn-ng-keepmynumber-2026`

## Decision

Keep the route `admitted` + `backstage-only`. Do not promote it to a standalone/indexable route and do not publish an app/OTP success percentage.

The route remains useful because MTN offers an explicit prepaid number-retention product, but current evidence does not support treating Keep My Number as an absolute continuity guarantee.

## Current economics and subscription flow

MTN's current Keep My Number page still lists:

- NGN3,500 / 1 year;
- NGN5,000 / 2 years;
- NGN7,500 / 3 years.

The 3-year option annualizes to NGN2,500/year. Subscription is funded from airtime and uses `*365#` or the matching SMS keyword. The current FAQ requires the subscriber to choose either auto-renew or one-off; leaving that selection without choosing means the purchase is not completed.

## Lifecycle reconciliation

The current evidence has two different lifecycle statements and they must remain separate:

1. MTN's current prepaid terms state that a line with no revenue-generating event for 365 days can be disconnected and recycled.
2. NCC Quality of Service Business Rules 2026 state that a prepaid line may be deactivated after six months without a Revenue Generating Event and may lose the number after another six months. The same rules:
   - count parked numbers as an RGE;
   - count incoming/outgoing calls and SMS, USSD, mobile data and qualifying subscriptions as RGE;
   - exclude recharge by itself when it is not followed by a qualifying activity;
   - require alternative-means subscriber notification at least 14 days before churn.

Keep My Number is therefore modeled as the provider's explicit retention/line-parking mechanism, not as a replacement for the regulator's ordinary inactivity framework.

## Activation, SIM form and KYC

Current MTN material supports physical SIM and eSIM. eSIM setup currently requires an MTN-store visit for device eligibility and QR-code provisioning, so a remote China-first eSIM activation path is not established.

A NIN is normally required for SIM purchase/registration. MTN's current prepaid terms explicitly exempt visitors staying less than 24 months from the NIN purchase requirement when they provide a valid visa plus international passport/travel document. Registration remains Nigeria-side.

## Payment

Keep My Number requires sufficient airtime. MTN currently exposes online/card/bank-transfer airtime purchase channels, including Xtrabuy. Reliable use of foreign-issued cards from abroad is not established by the reviewed evidence.

## Roaming and SMS/OTP

MTN currently offers roaming to prepaid customers and lists China among TravelPass destinations with SMS capability. The reviewed first-party material does not establish free incoming SMS or bank/app OTP delivery for this exact route, so no service-specific reliability percentage is created.

## Independent continuity incident

A 2026-08-31 Nairaland report says an MTN Nigeria number was reassigned despite the user reporting an active Keep My Number subscription and ongoing recharge. This is retained as a single-user continuity incident. It is not generalized into a universal KMN failure rate, but it prevents the route from being presented as guaranteed retention.

## Sources added in this maintenance pass

- https://www.mtn.ng/sim/keep-my-number/
- https://www.mtn.ng/legal/prepaid/
- https://www.mtn.ng/sim/esim/
- https://www.mtn.ng/personal/roaming/
- https://www.mtn.ng/personal/xtrabuy/
- https://www.ncc.gov.ng/sites/default/files/2026-08/Quality-of-Service-Business-Rules-2026.pdf
- https://www.nairaland.com/8738633/what-happens-bank-account-when

## Database impact

- route identity unchanged;
- source depth: 2 -> 9;
- total Phone sources: 747 -> 754;
- canonical remains 160 routes / 87 markets / 157 brands / 117 networks;
- publication remains 135 historical comparison routes / 3 explicit indexable routes / 31 sitemap URLs;
- no service observation or success percentage added.

## Next bounded route

`mts-sokhranyayu-nomer-2026`.
