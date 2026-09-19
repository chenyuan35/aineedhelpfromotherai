# User-directed Cursor + Phone research — 2026-09-19

Status: active backstage research queue. No production change is authorized by this document.

## Task A — Phone Radar source expansion from SIM Panda

Goal: treat SIM Panda as a lead/source inventory, not as an authority. For every current product, build a verified route record covering what the user needs to choose and operate the route.

Required fields per product:
- exact product/SKU and current stock/price;
- route family: long-term SMS/OTP, data SIM/eSIM, or non-route service;
- number country/operator and physical SIM/eSIM;
- prerequisites/KYC/real-name requirements;
- activation steps;
- roaming setup and supported regions;
- incoming SMS/call/data behavior;
- current keep-alive/renewal rule and minimum realistic annual cost;
- recovery/reissue/expiry behavior;
- current purchase/top-up path;
- realistic use cases and explicit non-use cases;
- recent independent community evidence for operational claims;
- official/operator source for commercial/rule claims where available;
- confidence/freshness status.

Current SIM Panda inventory discovered on 2026-09-19:

| Item | Seller state observed | Initial classification | Research disposition |
|---|---|---|---|
| Giffgaff SIM | CNY 16, in stock | Long-term SMS/OTP | Existing Phone route; reconcile seller tutorial with official/current community evidence rather than create a duplicate route. |
| Haha SIM | CNY 65, low stock | Long-term SMS/OTP + regional data | **HOLD / Watch lead.** Operator provenance and low-cost retention have supporting evidence, but current real-name behavior is inconsistent across sources and a 2026 app review reports a new-card ICCID/number mismatch. See research pass 2. |
| Ultra Mobile $3 Purple SIM | CNY 233, in stock | Long-term SMS/OTP | Existing Phone route family; verify current $3 plan, activation availability, Wi-Fi Calling and roaming costs before changing existing route data. |
| Rakuten Mobile Japan | CNY 298, eSIM/physical variants | Long-term SMS/OTP + data | Candidate. Seller says 070 number, receive-SMS only, no voice/outgoing SMS, annual renewal; all require independent verification. |
| One NZ physical SIM | CNY 99, in stock | Long-term SMS/OTP | **VALIDATED / admission-ready as Watch after current Phone closure.** Official rule is NZD 10 online/app top-up every 360 days, not a generic 12-month rule. See research pass 3. |
| Skinny New Zealand physical SIM | CNY 99, sold out | Long-term SMS/OTP | **HOLD / supply blocker.** Core 12-month retention and recovery behavior are supported, but seller stock is currently zero and recent China-specific first-hand evidence remains thinner than One NZ. See research pass 4. |
| Giffgaff GBP 10 top-up voucher | CNY 103.80, in stock | Service/accessory | Not a separate route. May become a purchase/top-up option inside the existing Giffgaff guide if independently useful. |
| Luky2 SIM | CNY 150, in stock | Data SIM/eSIM | **HOLD.** Seller copy conflicts with current official LuckySIM plans and real-name rules. See research pass 1. |
| Hong Kong address receipt service | CNY 50, in stock | Non-route logistics service | Out of Phone Radar route scope unless later evidence shows it materially solves SIM acquisition logistics without creating a separate product surface. |

Seller tutorial inventory discovered:
- `/blog/giffgaff` — detailed activation, PAYG, retention, eSIM and troubleshooting guide.
- `/blog/gapa` — Giffgaff low-data retention helper; treat its exact traffic/cost claims as unverified until reproduced and checked against current giffgaff rules.
- `/blog/haha` — Haha SIM activation/APN/data-package/real-name notes.
- `/blog/EK` — seller/about page; provenance only, not route evidence.

Important exclusions:
- Do not copy instructions whose purpose is to bypass platform risk controls, device/location checks, KYC, identity verification or account restrictions.
- Do not publish "works for X app/bank" as a guarantee based only on seller copy.
- Do not convert seller claims into OTP success percentages.
- Do not add all products to production. Research first, then admit only distinct routes that improve the current three-family decision set.

### Research pass 1 — Luky2 / LuckySIM

Status: **HOLD / seller copy not safe to publish as-is.**

Verified on 2026-09-19:
- SIM Panda lists `Luky2 SIM` at CNY 150 and describes a 365-day roaming data product.
- The seller page contradicts itself: the opening text says 30GB high-speed roaming data, while a later specification table says 40GB.
- LuckySIM's official shop currently lists a `365 days | 42 countries roaming data 30GB` plan for HKD 220 and a separate `365 days | 17 countries roaming data 30GB` plan for HKD 180. The official shop also lists a distinct `3 years | 17 countries roaming data 40GB` plan. Therefore the seller's 40GB/365-day claim is not currently supported by the official catalog.
- LuckySIM's official site states prepaid SIM real-name registration must be completed before use, and verification may take up to two working days. This conflicts with any seller wording that implies real-name registration is only needed in selected places.
- Official roaming bundles include China, Japan, South Korea, Taiwan and Macau among wider country sets, but the exact SIM Panda SKU-to-official-plan mapping is still unverified.
- Recent 2026 community reports reproduce low-cost long-term LuckySIM use and eSIM availability, but also report intermittent network/SMS reliability and inconsistent usage displays in some cases. One recent China user report describes occasions when manual network selection was needed; another overseas-user discussion treats bank-SMS reliability as uncertain rather than guaranteed. This supports a `Watch/Hold` posture rather than a reliability claim.

Open verification items before any Phone admission:
- exact LuckySIM plan/SKU sold by SIM Panda;
- whether SIM Panda's CNY 150 item maps to the official 17-country or 42-country 30GB plan, or another wholesale product;
- whether Hong Kong local data is actually included in the exact SKU;
- FUP behavior after included data is exhausted;
- eSIM/physical-SIM fulfillment details;
- current first-hand user reports for mainland-China performance and egress;
- whether the route is meaningfully better than the already validated CMLink/other Data options.

### Research pass 2 — Fortress haha SIM

Status: **HOLD / Watch lead, not admission-ready yet.**

Verified on 2026-09-19:
- Hong Kong OFCA lists `Fortress haha SIM` under A.S. Watson Retail (HK) Limited and provides the Fortress haha SIM/app path for prepaid-SIM real-name registration. This establishes the product/operator provenance and means public copy must not say the product is categorically "no real-name".
- The current `haha TRAVEL by Fortress` app identifies A.S. Watson Retail (HK) Limited as developer and states the data network is powered by 3HK plus overseas telecom partners. The Google Play listing was updated on 2026-06-15 and describes the same SIM as reusable across trips.
- SIM Panda's APN guidance (`mobile.lte.three.com.hk`) matches Fortress's published haha SIM FAQ, which also documents automatic/manual roaming-network selection and 128 kbps post-FUP throttling on applicable products.
- Independent community material from 2024–2025 repeatedly reports an approximately HKD 10/year retention path and practical use outside Hong Kong. A 2025 first-hand travel/account-opening report describes buying the card at Fortress, HKD 50 starting balance, a one-year active period and low-cost annual retention.
- Real-name behavior is not clean enough for publication as a simple rule. Seller/secondary material says overseas use may work without Hong Kong local registration in some cases, while OFCA explicitly treats Fortress haha SIM as a prepaid-SIM registration product and a 2025 first-hand report says activation required real-name registration. The route must therefore present registration as a current setup variable, not promise "no KYC".
- Recent negative evidence exists. An Aug 21, 2026 Google Play review reports a new SIM returning an ICCID/number mismatch. A March 2025 App Store review reports activation in Hong Kong succeeded but Japan data performance was extremely poor. These are not enough to retire the route, but they lower confidence.

Decision:
- Keep `Haha SIM` as a **Watch/Hold** candidate.
- Do not publish guaranteed OTP compatibility, guaranteed no-KYC use, or guaranteed HKD 10/year retention until the current activation/renewal path is reproduced by newer independent users.
- The strongest differentiator remains low-cost Hong Kong-number retention plus regional roaming, but current onboarding reliability is below the admission bar.

Key sources:
- OFCA prepaid-SIM registration directory: `https://www.ofca.gov.hk/en/consumer_focus/guide/hot_topics/sim_registration/reference_guide/index.html`
- Current app listing: `https://play.google.com/store/apps/details?id=com.fortress.sim`
- Current iOS listing/reviews: `https://apps.apple.com/hk/app/haha-travel-by-fortress/id1482719988`
- Fortress haha SIM FAQ: `https://image.fortress.com.hk/www_media/promo/hahaSIM_FAQ_TC_0228.pdf`
- Community retention discussion: `https://www.uscardforum.com/t/topic/237164`
- First-hand 2025 travel/account report: `https://www.gaorkang.cn/2025/06/24/%E9%A6%99%E6%B8%AF%E3%80%81%E6%BE%B3%E9%97%A8%E6%97%85%E8%A1%8C%E5%8F%8A%E5%BC%80%E6%88%B7%E8%AE%B0%E5%BD%95/`

### Research pass 3 — One NZ Prepay

Status: **VALIDATED / admission-ready as `Watch` after current Phone visual closure.**

Verified on 2026-09-19:
- SIM Panda currently lists the physical SIM at CNY 99 and describes it as a zero-monthly-fee prepaid number-retention route.
- One NZ's current Mobile Terms say online/My One NZ app top-up minimum is **NZD 10**; other top-up channels may require NZD 20. Prepay credit expires **360 days** after the last top-up. If no top-up is made within that period, the service becomes inactive and the allocated number can be lost. This corrects the seller's looser "12 months" wording.
- One NZ's current Prepay Roaming terms explicitly say **receiving TXTs while roaming is free**.
- One NZ officially supports Wi-Fi Calling and SMS over Wi-Fi while overseas. For Prepay users without an active bundle, standard Prepay rates apply to chargeable calls/TXTs, but receiving/using the number over Wi-Fi is a supported operating mode on compatible devices.
- Current official activation instructions require the SIM to be inserted and able to receive a confirmation TXT; plan selection and top-up happen after that confirmation. Therefore remote activation should not be presented as universally frictionless.
- A June 2026 first-hand Chinese forum report reproduces One NZ use from China, including Wi-Fi Calling behavior and the NZD 10 top-up floor. A July 2026 community thread separately reports that current retention requires a balance top-up rather than mere activity and that overseas activation can depend on obtaining a usable network/Wi-Fi Calling path.
- Recent failure evidence matters: One NZ's own terms say inactive-number recovery is not guaranteed. A 2024 Geekzone case eventually recovered a lapsed number only after multiple support calls and in-person help; a One NZ representative confirmed the 360-day rule and described the recovery as an exception. A 2025 case similarly shows One NZ enforcing the 360-day top-up rule.
- One NZ shut down its own 2G/3G network in New Zealand in March 2026. Overseas roaming increasingly depends on 4G/VoLTE compatibility where partner 2G/3G networks are gone. Device compatibility must therefore be visible in the guide.

Decision data:
- family: long-term SMS/OTP;
- number: native New Zealand mobile number;
- physical SIM: yes; eSIM availability exists in One NZ generally, but the exact SIM Panda item is physical;
- monthly fee: none required on Pay & Go style usage;
- retention: top up at least NZD 10 through website/app before 360 days elapse;
- annual keep-alive estimate: NZD 10/year equivalent if using the cheapest verified online/app top-up cadence;
- incoming roaming SMS: free per current One NZ Prepay Roaming terms;
- remote usability: supported roaming plus Wi-Fi Calling/SMS over Wi-Fi, device dependent;
- main pitfall: missing the 360-day top-up can cost the number; recovery is not a product promise;
- stability: `Watch`, because overseas activation/device compatibility and post-expiry recovery create real friction.

Key sources:
- Mobile Terms: `https://one.nz/legal/terms-conditions/mobile/`
- Prepay roaming terms: `https://one.nz/legal/terms-conditions/prepay-roaming/`
- Prepay activation: `https://one.nz/faq/prepay-activate-a-prepay-sim-using-your-handset`
- Wi-Fi Calling: `https://one.nz/our-networks/wifi-calling/`
- Current top-up help: `https://one.nz/help/bill-payment/prepay-topup/`
- 2026 China community report: `https://forum.naixi.net/thread-10577-1-1.html`
- 2026 China retention discussion: `https://linux.do/t/topic/2577429`
- lapse/recovery case: `https://www.geekzone.co.nz/forums.asp?forumid=40&page_no=2&topicid=314920`

### Research pass 4 — Skinny NZ Prepaid

Status: **HOLD / technically credible, currently supply-blocked at SIM Panda.**

Verified on 2026-09-19:
- SIM Panda currently shows the physical Skinny SIM as **sold out** at CNY 99. That alone blocks production admission as a purchase route today.
- Skinny's current terms require adding credit at least once every **12 months** or the prepaid account is deactivated/expired.
- Skinny's current inactive-SIM help page documents a useful recovery window: after 12 months without top-up the number becomes inactive, but a user can reactivate within **one month** by topping up at least NZD 5 using a recharge voucher. After more than one month inactive, the number is permanently deleted from Skinny's database.
- Independent New Zealand community reports repeatedly describe NZD 5 annual top-ups as a practical keep-number method, including users who kept Skinny numbers active while overseas. Older community reports also describe credit-transfer methods, but those should not be published as the default retention path without a current 2026 reproduction.
- Skinny's current roaming terms include China, Hong Kong, Japan, South Korea, Taiwan and other destinations. The terms confirm roaming supports sending/receiving texts subject to partner-network/device availability. Community reports state incoming SMS is not billed while roaming, but the current public pricing page does not make that free-receive rule as explicit as One NZ does, so the Phone guide should not overstate it until refreshed.
- A 2024 Geekzone roaming incident shows SMS continued to work in Singapore while data was unreliable. This supports separating "receive OTP/text" from "reliable roaming data" rather than treating roaming as one reliability signal.
- A 2024/2025 Chinese eSIM write-up reports successful China SMS reception and a 12-month expiry date after top-up, but it is not current enough by itself to establish 2026 China reliability.

Decision:
- Keep Skinny as a **Watch/Hold** route.
- Supply is the immediate blocker; do not publish a seller purchase action while SIM Panda is sold out.
- If supply returns, refresh 2026 China first-hand SMS evidence and verify the cheapest normal top-up path before admission.
- Skinny has a useful differentiator versus One NZ: a documented one-month inactive recovery window. One NZ has the stronger current official evidence for free incoming roaming TXT and overseas Wi-Fi Calling/SMS, so One NZ is the better New Zealand admission candidate today.

Key sources:
- Skinny terms: `https://www.skinny.co.nz/mobileappskinny-terms/`
- Inactive SIM/recovery: `https://www.spark.co.nz/help/mobile-help/phone-sim-number/sim/inactive-sim`
- Current roaming: `https://www.skinny.co.nz/pricing/overseas-roaming`
- Community long-term retention: `https://www.geekzone.co.nz/forums.asp?forumid=42&topicid=288226`
- Roaming SMS discussion: `https://www.geekzone.co.nz/forums.asp?topicid=304685`
- Roaming incident: `https://www.geekzone.co.nz/forums.asp?forumid=39&topicid=317304`

### Sendwave/Maya lead supplied by user

Keep as a separate lead, not a Phone Radar route. It is a remittance/payment workflow, not a phone-number product.

Safe facts to verify if later needed for a relevant acquisition/payment guide:
- Germany is a supported Sendwave sending country and the Philippines is a supported destination.
- Maya can receive remittances through supported partners.
- Sendwave referral rewards are governed by current in-app eligibility and official terms.

Do not operationalize or publish repeated-account/KYC reuse, account recreation for repeated referral rewards, identity-rule evasion, or similar abuse. Sendwave currently states one account per person and requires identity verification.

## Task B — Cursor Usage Pool / Quota Explainer

Goal: deepen the existing `/tools/cursor-usage-reset/` URL rather than create a new product surface.

User job: explain why Cursor usage can reach 100% despite apparently lower token use, identify which included pool is being consumed, estimate remaining usable capacity, and project depletion before the billing-cycle reset.

MVP inputs:
- plan;
- model or Auto/Router;
- current pool percentage(s);
- account reset timestamp;
- optional observed spend/cost;
- optional input/cache/output token breakdown when the user has it.

MVP outputs:
- active/likely pool;
- estimated remaining included value;
- model-cost-aware burn estimate;
- projected depletion date at current pace;
- days/hours until reset;
- explicit uncertainty when Auto/Router or incomplete account data prevents exact attribution.

Rules:
- never infer remaining quota directly from raw token count alone;
- use Cursor's current official usage-limit/model-pricing documentation as the rule source;
- user/account dashboard values remain the source of truth for account-specific percentages and reset time;
- avoid a new URL unless GSC later proves a distinct search intent that the existing Cursor canonical cannot serve cleanly.

Execution gate: the existing Cursor CTR pilot is still measuring. Do not change production until the current measurement window is evaluated or a concrete factual defect requires correction.

## Execution order

1. Continue verified SIM Panda research backstage. The next unresolved distinct candidate is Rakuten Mobile Japan; existing Giffgaff/Ultra should be reconciled only after distinct candidates are covered.
2. After Phone visual closure and the applicable measurement/release gates, decide which verified routes deserve admission to the existing Phone canonical. One NZ is currently the strongest newly validated long-term candidate; Skinny/Haha/LuckySIM remain held.
3. Evaluate the Cursor CTR pilot; if the existing URL remains the correct canonical, implement the Usage Pool/Quota Explainer as a bounded deepening of that page.

Definition of done for this research document: both user-directed tasks are durably captured, the SIM Panda inventory is enumerated, unsafe/out-of-scope claims are separated from publishable research, each researched route has an explicit admit/watch/hold disposition, and neither task silently changes production priorities or current release gates.