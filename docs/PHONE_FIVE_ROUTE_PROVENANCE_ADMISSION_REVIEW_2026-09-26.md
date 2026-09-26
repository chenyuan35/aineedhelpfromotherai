# Phone Radar — first Kimi/Qwen provenance-admission review

Date: 2026-09-26  
Scope: Tello PAYG / ClubSIM / Hotlink Pantas / Globe Prepaid / povo 2.0  
Public production change: **none**

## Decision summary

| Route | Disposition | Canonical backstage interpretation |
|---|---|---|
| Tello PAYG / low-cost Tello line | **ADMIT-BACKSTAGE** | Real US-number route with multiple independent community reports and current first-party pricing/roaming support. The frozen `$0.06/year` claim is rejected. Current PAYG credit starts at USD 20 and is valid 90 days; current low-end monthly-plan use is materially more expensive than the old claim. Keep risk-control/account-closure reports visible. |
| ClubSIM HK | **ADMIT-BACKSTAGE** | Strong independent retention/use evidence plus current first-party 365-day number-retention rule and current HKD 6 SMS pack surface. Do not present HKD 6 as an unconditional guaranteed annual price: July 2026 users reported the pack temporarily absent in-app, while the current web surface still lists it. App/OTP behavior is service/network-context dependent. |
| Hotlink Pantas | **ADMIT-BACKSTAGE** | Current first-party material directly confirms RM30 for the 365-day Active Period Pass. The old RM2/year keep-alive claim is rejected: RM2 is a 1GB/365-day internet pass and does not keep an inactive SIM active. Multiple independent community reports support the RM30/year retention workflow. |
| Globe Prepaid | **HOLD** | Existing canonical HOLD remains correct. Retention and overseas incoming-SMS mechanics are useful, but the lawful qualifying-foreigner → own-name registration → long-term mainland-China OTP chain is still not reproduced. Seller/already-registered cards and tourist misclassification do not satisfy the gate. |
| povo 2.0 | **HOLD** | The 180-day paid-topping lifecycle is current and useful, but the SMS-capable voice+data route requires Japanese identity/residency documents. The no-ID data-only path is a different product and does not provide the SMS/voice-number job. |

No route in this batch is `DROP`: all five describe real products/jobs. The distinction is whether the route is ready for the reviewed backstage knowledge layer for the target user, not whether the operator exists.

## Method

Admission required a community/user discovery trail first, then first-party verification of provider-controlled facts. Cross-posts and repeated retellings were not counted as independent observations. Missing or conflicted facts remain explicit; an operator page by itself does not create admission.

`ADMIT-BACKSTAGE` means the route may enter the reviewed research/data layer. It does **not** authorize a public recommendation, public ranking, new public URL, or app-success percentage.

## 1. Tello — ADMIT-BACKSTAGE

### Independent discovery / operational evidence

- NodeLoc, 2025-12-26 — https://www.nodeloc.com/t/topic/72344 — current-user discussion around the USD 5/month plan, Wi-Fi Calling, China roaming and PAYG economics.
- NodeLoc, 2026-09-20 — https://www.nodeloc.com/t/topic/110176 — fresh activation/China-use discussion.
- NodeSeek — https://www.nodeseek.com/post-534061-1 — detailed acquisition/activation tutorial and low-cost-number use case.
- V2EX, 2025-12-11 — https://www.v2ex.com/t/1178389 — independent user demand/comparison for a low-cost overseas number, including Tello.
- NodeSeek, 2026-06-19 — https://www.nodeseek.com/post-783926-1 — longer-term first-hand comparison that includes a Tello account/risk-control failure and abandonment.
- HowardForums / Nth Circle older policy threads remain background corroboration only; they are not treated as fresh 2026 operational samples.

### First-party verification

- https://tello.com/buy/pay_as_you_go — PAYG credit currently starts at USD 20 and is available for 90 days; it can be used for international roaming.
- Current Tello plan surfaces and community reproduction support a low-end monthly-plan route, but the old frozen-PR `$0.06/year` number is not supportable.

### Correction and admission boundary

The `$0.06/year` field is **REFUTED** and must never enter canonical metrics. PAYG economics are bounded by a USD 20 minimum 90-day credit purchase; the practical monthly-plan floor is orders of magnitude above the frozen claim. The route still has value because users repeatedly compare Tello for a real US number, Wi-Fi Calling/roaming and overseas use, and there is independent failure/risk-control evidence that an operator page does not provide.

Backstage record must retain the risk-control/account-closure incident rather than ranking Tello as a low-cost winner.

## 2. ClubSIM HK — ADMIT-BACKSTAGE

### Independent discovery / operational evidence

- V2EX, 2023-03-27 — https://www.v2ex.com/t/927504 — 365-day retention discussion and low-cost service-pack method.
- V2EX, 2024-07-02 — https://www.v2ex.com/t/1054323 — mainland receive-SMS/KYC discussion and later re-verification friction.
- NodeSeek, 2025-10-16 — https://www.nodeseek.com/post-479688-1 — activation/eSIM/real-name/retention walkthrough.
- NodeLoc, 2025-10-16 — https://www.nodeloc.com/t/topic/64554 — **same-author cross-post of the NodeSeek item; count once, not as independent corroboration**.
- V2EX, 2024-01-28 — https://www.v2ex.com/t/1012236 — negative account/SMS experience.
- V2EX, 2026-09-18 — https://www.v2ex.com/t/1243080 — fresh mainland roaming verification behavior: Telegram/WhatsApp outcomes changed with network/data context while Google/Apple worked.
- 奶昔论坛, 2026-07-01 — https://forum.naixi.net/forum.php?mod=viewthread&tid=12930 — fresh report that the HKD 6 option disappeared in-app for some users; replies report HKD 15 alternatives.

### First-party verification

- https://clubsim.com.hk/en/go/clubSim-tnc — current general terms: if no Service Pack is purchased within 365 days from the last Service Pack purchase, the SIM/service may be permanently terminated and the number reallocated.
- https://www.clubsim.com.hk/zh/smspack/tnc — current web surface lists the SMS Pack at **HKD 6**, valid 30 days, while the number-retention clock is a separate 365-day lifecycle rule.

### Conflict handling

The route is sufficiently evidenced for backstage admission, but `HKD 6/year guaranteed` is too strong. July 2026 app-availability reports conflict with the current first-party web surface. Store this as a channel/availability conflict and re-check at each price refresh. Do not convert isolated Telegram/WhatsApp reports into a route-wide success percentage.

## 3. Hotlink Pantas — ADMIT-BACKSTAGE

### Independent discovery / operational evidence

- NodeLoc, 2025-11-16 — https://www.nodeloc.com/t/topic/67257 — RM30/year retention, passport/acquisition and China roaming/SMS discussion.
- NodeLoc, 2026-06-08 — https://www.nodeloc.com/t/topic/87761 — fresh RM30/year retention and overseas-use discussion.
- NodeSeek, 2025-11-18 — https://www.nodeseek.com/post-509402-1 — acquisition/availability demand.
- Lowyat, 2025-10-26 — https://forum.lowyat.net/topic/4186655/+360 — community confirmation/discussion of Pantas 365-day validity pricing.
- Lowyat, 2026-03-19 — https://forum.lowyat.net/topic/3803865/+1300 — fresh comparison citing RM30 one-year SIM validity.

### First-party verification

- https://www.hotlink.com.my/en/faq/products/prepaid-pantas/passes/ — current Hotlink FAQ explicitly separates:
  - 365-day internet passes, including a 1GB/RM2 data pass; and
  - the **365-day Active Period Pass at RM30**, which keeps the account/SIM active for 365 days.

### Correction and admission boundary

The frozen `RM2/year keep-alive` claim is **REFUTED**. RM2 buys a 365-day data allowance; Hotlink explicitly says an inactive SIM cannot use remaining quota. The actual current keep-alive product is the RM30 Active Period Pass. This route has enough independent operational evidence plus current first-party lifecycle verification for backstage admission.

## 4. Globe Prepaid — HOLD

This review does not override `docs/PHONE_GLOBE_PHILIPPINES_ELIGIBILITY_REVIEW_2026-09-25.md`.

Community evidence continues to support the underlying need and overseas retention/roaming use, including NodeLoc/V2EX/linux.do/NodeSeek discussions. First-party material supports long-lived prepaid retention and roaming/incoming SMS. The unresolved issue is **eligibility**, not the price mechanic.

Ordinary tourist registration remains time-limited unless the user has an approved visa extension. A longer-lived foreign-national registration path exists only for qualifying non-tourist visa/document classes. Current evidence still does not reproduce the complete lawful target-user chain:

`qualifying foreign national → own-name registration → leave Philippines → stay active long-term → mainland-China roaming → repeated bank/app OTP → remote reload`

### Re-open trigger

Re-open only on fresh 2026+ evidence of that complete lawful chain from a qualifying non-tourist foreign national, ideally from mainland China; or one detailed firsthand reproduction plus independent corroboration; or materially clearer Globe registration workflow evidence plus independent long-term use. Seller/already-registered SIMs, borrowed identities, or tourist-class misclassification do not satisfy the trigger.

## 5. povo 2.0 — HOLD

### Independent evidence

- V2EX, 2024-01-12 — https://www.v2ex.com/t/1008212 — acquisition barrier for a real Japanese SMS-capable line without local residency.
- V2EX, 2024-07-25 — https://www.v2ex.com/t/1060026 — related Japanese-number/KYC experience.
- linux.do, 2026-06-02 — https://linux.do/t/topic/2291771/9 — current Japanese-number/KYC discussion.
- August 2026 Japanese media reports are useful for interpreting the 180-day wording change, but they are not treated as user-operational evidence.

### First-party verification

- https://faq.povo.jp/faq/show/858?site_domain=default — no paid topping for 180 days can trigger suspension; current exceptions/clock rules are explicit.
- https://faq.povo.jp/faq/show/2689?site_domain=default — any paid topping amount can break the 180-day no-purchase condition.
- https://povo.jp/spec/detail/ — voice+data and data-only are distinct products; the data-only path is not a substitute for the SMS/OTP-number job.
- https://povo.jp/en/procedure/identification/ — voice+data identity verification accepts Japanese My Number, driver licence, or residence card; residence-card validity conditions apply.

### Re-open trigger

Keep HOLD for the general overseas SMS/OTP audience until there is a lawful, repeatable target-user acquisition path for an SMS-capable povo line without relying on Japanese-resident identity eligibility, or until the provider changes that eligibility. A data-only/no-ID route may be researched separately under the Data-eSIM family, but it must not be used to clear this SMS/OTP route.

## Dedupe / contradiction ledger

- ClubSIM NodeSeek `post-479688-1` and NodeLoc `topic/64554` are the same-author cross-post and count as one observation.
- Tello `$0.06/year` is rejected; do not preserve it as an active numeric metric.
- Hotlink `RM2/year` is rejected as SIM retention; RM2 is a 1GB/365-day internet pass, while RM30 is the current 365-day Active Period Pass.
- Globe raw Kimi `PROMOTE` recommendation does not supersede the existing canonical eligibility HOLD.
- povo media coverage corroborates policy interpretation but is not a substitute for first-hand acquisition/OTP evidence.

## Resulting backstage set

This batch adds three reviewed backstage candidates: **Tello, ClubSIM and Hotlink Pantas**. It preserves **Globe Prepaid** and **povo 2.0** as HOLD. None of these decisions changes the public UK Phone surface, creates a new public URL, or authorizes a ranking claim.
