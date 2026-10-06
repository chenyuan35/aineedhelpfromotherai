# FarEasTone prepaid maintenance — 2026-10-06

Route: `fareastone-prepaid-tw-2026`

## Decision

Keep the route canonical as `real-mobile`, `admitted`, `backstage-only`, but set the current profile `guideEligible=false`. Do not publish a new route page and do not create an app/OTP success percentage.

## Current first-party facts

- Regular 易付卡 starters remain available from NT$300.
- The number is valid for 180 days from activation and can be retained by recharging during validity. Current communication-credit denominations include NT$100, making the lowest documented keep path one NT$100 recharge every 180 days, about NT$200/year.
- Current regular-prepaid application material requires an in-person FarEasTone/ARCOA store visit, two identity documents; current FarEasTone guidance supports both physical SIM and prepaid eSIM; activation follows customer-data registration and can take up to 24 hours.
- FarEasTone maintains tourist prepaid separately. Tourist product behavior must not be used to infer the regular long-term route.
- FarEasTone's August 2026 VoLTE guidance broadly states that users on supported devices and roaming partner networks can receive SMS abroad free without a roaming-data package, and FarEasTone maintains a prepaid-roaming portal. The reviewed material does not explicitly bind the broad OTP claim to this exact regular-prepaid route in mainland China.

## Independent evidence

- A July 2026 long-term FarEasTone PAYG user reports repeated passport/ARC immigration-record mismatches and outgoing-calling suspension until records were updated. This is retained as a bounded foreign-user continuity risk, not a universal failure rate.

## Data treatment

- Source depth: 1 → 10.
- Acquisition metric remains NT$300.
- Keep metric remains NT$100 / 180 days, approximately NT$200/year.
- No `observations` rows and no `successRatePct` are created.
- Public boundary remains 135 comparison routes / 3 indexable routes / 31 sitemap URLs.

## Re-open triggers

Re-open when FarEasTone publishes exact regular-prepaid international VoLTE/SMS entitlement for mainland China, current foreigner identity-document rules, or enough exact route + service + operation observations exist to meet the service-evidence threshold.
