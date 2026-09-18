# Phone Data Route Validation — Stellar China 100GB / 60 days

Date: 2026-09-18

Status: **HOLD — do not admit to production yet**

This note records the bounded Q-013D2 validation of one Data-family route. It follows `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` and does not broaden into a provider-wide audit.

## Candidate

Provider: StellarSecurity / Stellar eSIM

Destination: Mainland China

Target product: 100GB total / 60 days

## Current official commercial metadata

Verified from Stellar's live China catalogue and the two current 100GB / 60-day product pages on 2026-09-18.

Two different products are currently sold at the same visible price of **€13.20**:

### JC091 route

- Product: `China 100GB 60Days + Free Stellar VPN`
- Package code in product URL: `JC091`
- Data: 100GB total
- Validity: 60 days
- Advertised mainland network: China Mobile 5G
- Advertised traffic egress: Hong Kong
- Hotspot/tethering: supported
- Top-up: supported while the plan is valid
- Number/SMS: none; data-only
- Activation: validity starts on first supported-network connection
- Setup: install by QR code or app, enable the eSIM line and data roaming

Official product page:
`https://stellarsecurity.com/stellar-esim/china-esim/100gb-60-days-jc091`

### PS30ZAQ7S / nonhkip route

- Product: `China 100GB 60Days (nonhkip) + Free Stellar VPN`
- Package code in product URL: `PS30ZAQ7S`
- Data: 100GB total
- Validity: 60 days
- Advertised mainland networks: China Unicom 5G and China Telecom 4G
- Advertised traffic egress: Singapore
- Hotspot/tethering: supported
- Top-up: supported while the plan is valid
- Number/SMS: none; data-only
- Activation: validity starts on first supported-network connection
- Setup: install by QR code or app, enable the eSIM line and data roaming

Official product page:
`https://stellarsecurity.com/stellar-esim/china-esim/100gb-60-days-ps30zaq7s`

Catalogue:
`https://stellarsecurity.com/stellar-esim/china-esim`

## First-hand operational evidence

### Fresh NodeSeek report

Source:
`https://www.nodeseek.com/post-932285-1`

The author explicitly frames the post as personal purchase/use experience. For StellarSecurity, the author reports:

- roughly 100GB for "11-point-something euros" from memory;
- Hong Kong IP with some Singapore routing/split behavior;
- in mainland China the phone appeared to use China Mobile;
- speed felt close to a local SIM;
- 5G did not connect in the author's use.

This is useful current operational evidence, but it does not identify the exact delivered package code and its remembered price is not authoritative commercial metadata.

### Exact-product contradiction / fulfillment mismatch

A separate first-hand review dated 2026-09-09 reports purchasing the current `China 100GB 60Days (nonhkip)` product while the provider advertised China Unicom / China Telecom and Singapore egress.

The review reports that the delivery email instead specified:

- APN: `cmlink`
- package code: `JC091`
- observed connection: China Mobile

The reviewer reports about 3 MB/s on this purchase versus above 10 MB/s on a previous Stellar purchase. Support said the order was fulfilled as the nonhkip product and escalated the configuration discrepancy, but the mismatch was unresolved in the review at that time.

Source:
`https://www.trustpilot.com/reviews/6aa12b4e41814ccbe0753754`

## Decision

**HOLD. Do not add Stellar China 100GB / 60 days to the production Phone Radar yet.**

The route is cheap, current, executable on paper, and has fresh positive China usage evidence. However, the most important user-facing distinction — which mainland networks and egress route the buyer will actually receive — is not currently reproducible enough for admission. A recent buyer reports ordering the nonhkip / Singapore / Unicom+Telecom route and receiving identifiers associated with the separate JC091 / Hong Kong / China Mobile route.

This is not a provider-wide rejection. It is a route-identity and fulfillment-consistency hold.

## Revisit trigger

Re-evaluate only when at least one of the following becomes available:

1. a fresh independent mainland-China first-hand report that names the ordered product/package and confirms the delivered package, registered network and egress match; or
2. provider-side clarification that resolves the current JC091 versus PS30ZAQ7S fulfillment mapping, followed by a fresh first-hand confirmation.

Until then, do not publish a stable `Get/Buy` recommendation for this exact route and do not substitute a generic Stellar provider card for route-level evidence.