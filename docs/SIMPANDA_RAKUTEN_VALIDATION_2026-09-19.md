# SIM Panda lead validation — Rakuten 070 annual SIM

Date: 2026-09-19

Status: **HOLD / distinct and interesting, but not admission-ready.**

## Exact lead

SIM Panda currently lists `Rakuten Mobile Japan` at CNY 298 with physical-SIM and eSIM variants. Seller copy describes a Japanese `070` number, annual prepaid service, monthly Japan data plus overseas roaming data, SMS reception while abroad, no outgoing SMS/voice, and reseller-managed renewal.

This is materially different from a normal self-managed consumer Rakuten Mobile contract. Treat it as a managed/wholesale annual-SIM route until the underlying contract and renewal ownership are independently verified.

## What is supported

- Rakuten Mobile's current official documentation supports overseas roaming and international SMS on eligible Rakuten lines. Current official SMS pricing states overseas SMS reception is free for eligible lines.
- The seller's APN `rakuten.jp`, 070 numbering, Japan/overseas data structure and roaming-country claims are broadly consistent with Rakuten's network/service family.
- An independent 2023 hands-on test reproduced the same unusual annual-card behavior: a 070 Japanese number, mainland-China/Hong-Kong roaming, incoming SMS, Japan-origin IP, monthly high-speed allowance and post-cap throttling, with no outgoing SMS or voice.
- A 2024 Hong Kong forum discussion refers to this Rakuten annual-card route as a prepaid product and reports that users could not link the 070 number into the normal `my Rakuten Mobile` app.
- Multiple active 2026 Hong Kong listings currently advertise the same 36GB/12GB-global annual product and same-number renewal, showing that the commercial route still exists in the market. These listings are seller evidence, not independent operational verification.

## What is not verified

- The exact underlying Japanese contract/SKU behind SIM Panda's CNY 298 product.
- The identity and current status of the intermediary referenced by sellers as telecommunications registration `A-06-21741`; search results currently reproduce the claim mainly through seller listings rather than an authoritative registry record.
- Whether SIM Panda's eSIM and physical-SIM variants use the same underlying account type and renewal process.
- A current 2026 independent user completing first activation, mainland-China SMS reception and a full annual renewal while keeping the same number.
- Same-number recovery if the reseller disappears, misses renewal, or the SIM is lost.
- Direct portability/account ownership by the end user. Current evidence instead suggests the normal `my Rakuten Mobile` account may not be available for this prepaid annual card.

## Risk/decision implications

The route solves a real job: a Japanese mobile number that can receive SMS abroad with predictable annual cost and some roaming data. It may be cheaper and simpler than a full Japanese voice plan.

However, long-term continuity appears to depend on an intermediary for renewal and replacement. That is a major weakness for a Phone Radar route whose purpose is durable account recovery. A number that cannot be directly controlled, renewed or ported by the end user should not be presented beside self-managed long-term numbers as equally durable.

The seller also advertises broad app/OTP compatibility. Do not copy those claims as guarantees; service-specific OTP acceptance is platform-controlled and can change independently of SMS transport.

## Disposition

Keep as **HOLD / Watch**.

Admission requires at minimum:

1. a current independent 2026 user reproducing mainland-China or Hong-Kong SMS reception on the exact annual-card family;
2. a current independent same-number renewal report;
3. clear disclosure of who controls the line/account and what happens if the reseller or intermediary becomes unavailable;
4. confirmation of loss/reissue behavior and whether the number can be recovered without the original seller;
5. exact current SIM Panda SKU mapping and price/renewal cost.

If those checks succeed, it could enter Phone Radar as a distinct **Japan receive-SMS + data / reseller-managed** route with an explicit continuity warning. It should not replace self-managed Japan routes.

## Sources

Official Rakuten Mobile:
- `https://network.mobile.rakuten.co.jp/guide/international-sms/overseas/`
- `https://network.mobile.rakuten.co.jp/service/international-sms/`
- `https://network.mobile.rakuten.co.jp/service/global/overseas/`

Independent/community:
- 2023 hands-on annual-card test: `https://xunihao.net/7591.html`
- 2024 Hong Kong forum discussion: `https://www.hkepc.com/forum/viewthread.php?fid=44&page=1&tid=2736072`
- 2024 Japan-SIM discussion mentioning inability to link the prepaid 070 card to normal Rakuten account tooling: `https://lihkg.com/thread/3536985/page/28`

Current seller-market evidence only:
- `https://www.carousell.com.hk/rakuten/q/`
- `https://www.carousell.com.hk/rakuten-mobile/q/`
