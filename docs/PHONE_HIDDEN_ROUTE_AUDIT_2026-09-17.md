# Phone Hidden-Route / Failure-Mode Audit — 2026-09-17

Status: ACTIVE

Last updated: 2026-09-18

Method: `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`

This audit exists because public carrier documentation alone can miss legitimate support-assisted routes and recent real-user failures. Community/current-user operations discover candidates; reproduction and direct support/app/account evidence establish operational reality; public carrier/regulator material checks hard constraints/conflicts.

No production change is authorized by this document alone. Fix materially misleading current routes first, then consider at most one or two genuinely strong hidden routes.

## 1. Existing production-route discrepancies

### giffgaff UK — real 2026 enforcement with conflicting later restoration evidence

Current production already:

- documents inactivity/keep-alive and PAC rescue;
- warns that keep-alive does not equal permission for permanent overseas use;
- penalizes `restricted-long-term` use when a user intends to keep the line abroad;
- shows the contextual `Keep-alive is not the whole story` warning.

Fresh evidence:

- late July 2026 NodeSeek/NodeLoc reports documented termination notices for extended/permanent use outside the UK;
- ISPreview reported on Aug 1 that giffgaff confirmed a proportion of PAYG SIMs associated with extended/permanent overseas use had been disconnected;
- an Aug 18 NodeLoc report said at least some affected accounts were restored and shared wording attributed to giffgaff describing an earlier action as an operational error.

Sources:

- https://www.nodeseek.com/post-848635-1
- https://www.nodeloc.com/t/topic/101536
- https://www.nodeloc.com/t/topic/101167
- https://www.ispreview.co.uk/index.php/2026/08/giffgaff-disconnect-some-prepaid-mobile-users-for-extended-roaming-outside-uk.html
- https://www.nodeloc.com/t/topic/104211

Decision: **KEEP CURRENT RESTRICTION/RANKING PENALTY.** Real enforcement occurred, but later restoration reports mean the correct state is elevated/conflicting long-term-overseas risk, not deterministic shutdown. No immediate production logic change.

### Tello US — US-first attachment enforcement confirmed

Current production already:

- blocks first activation/port-in outside the United States;
- treats overseas Wi-Fi Calling/Text separately from first activation;
- allows international roaming only after the home-activation prerequisite.

Fresh evidence:

- current Tello support requires first activation/port-in while physically in the US and connected to US cellular towers;
- May–July 2026 reports document stronger enforcement and international roaming being disabled for some lines that never attached to a US tower;
- established lines can still retain Wi-Fi Calling/Text and receive OTPs in some overseas cases.

Sources:

- https://tello.com/help_center/international-calls/can-i-activate-tello-while-i-m-abroad
- https://tello.com/help_center/roaming/how-can-i-use-my-device-overseas
- https://www.reddit.com/r/Tello/comments/1tpla4v/recent_change_to_international_activation/
- https://www.reddit.com/r/Tello/comments/1vb9c1j/psa_international_roaming_being_turned_off_if_you/
- https://www.reddit.com/r/Tello/comments/1u971w7/tello_esim_in_china_will_sms_2fa_codes_still_work/
- https://www.reddit.com/r/Tello/comments/1vgwzsa/tello_outside_us/

Decision: **KEEP THE HARD BLOCK.** Do not recommend an overseas-first Tello route. Existing production already preserves the useful distinction between initial US attachment and later Wi-Fi Calling/Text continuity. No immediate production hotfix.

### Lebara UK — UK activation supported; overseas Wi-Fi/SMS reliability remains mixed

Current production already:

- blocks initial SIM/eSIM activation outside the UK;
- treats international roaming SMS as supported after UK activation;
- leaves dependable overseas Wi-Fi Calling/SMS as `unknown`.

Fresh evidence:

- current Lebara eSIM guidance says service must be activated in the UK before travel;
- 2026 users report mixed eSIM provisioning, Wi-Fi Calling and international authentication-SMS behavior, including delayed/missed SMS and post-migration Wi-Fi Calling failures alongside successful cases.

Sources:

- https://www.reddit.com/r/LebaraUK/comments/1vrpc18/activate_a_top_up_sim_outside_the_uk/
- https://www.reddit.com/r/LebaraUK/comments/1q5y6ox/sms_delivery_over_wifi_when_abroad/
- https://www.reddit.com/r/LebaraUK/comments/1qxuh3h/wifi_calling_not_working_after_switching_to/

Decision: **KEEP UK-FIRST ACTIVATION; KEEP DEPENDABLE OVERSEAS WI-FI SMS `unknown`.** Generic feature availability is not enough to claim current reliability. No production hotfix.

### Sakura Mobile Japan Voice+Data — correction completed

Previous production state:

- post-departure roaming SMS was `unknown`;
- ongoing copy said overseas roaming/OTP behavior was not verified strongly enough to promise.

Current first-party evidence:

- Sakura Mobile's current Monthly support article states Voice+Data SIM/eSIM supports calls and SMS outside Japan while cellular data/Internet is unavailable;
- destination-specific roaming rates apply;
- this applies to Monthly Voice+Data, not Sakura's Travel data-only SIM/eSIM.

Source:

- https://support.sakuramobile.jp/hc/en-us/articles/360020533651-Can-I-use-the-Monthly-service-outside-of-Japan

Decision: **CORRECTED VIA PR #108.** `sakura-japan-voice-data.roamingSms` is now `supported-after-activation`; the route explicitly says calls/SMS work abroad while cellular data does not. Wi-Fi Calling abroad remains `unknown`. Vercel + Eval Gate passed, and production canonical JSON was live-verified HTTP 200 with the corrected field on 2026-09-18.

### Ultra Mobile PayGo — generic Wi-Fi Calling support is not enough for a reliability claim

Current production state:

- PayGo roaming SMS is supported;
- Wi-Fi Calling abroad remains `unknown`.

Current evidence:

- Ultra currently says `Free Wi-Fi Calling on All Ultra Plans` and describes calling/texting over Wi-Fi while abroad;
- current PayGo material separately documents the PayGo product and roaming wallet behavior;
- PayGo-specific current reproduction/provisioning is still thin, while user reports show device/IMS/provisioning failures can prevent Wi-Fi Calling from working as expected abroad.

Decision: **KEEP `unknown` FOR PAYGO WI-FI CALLING ABROAD.** Do not automatically inherit a dependable-overseas claim from generic `all plans` wording. Revisit only after current PayGo-specific reproduction/support evidence is strong enough.

### H2O Wireless Pay As You Go — current caution remains supported

Current production state:

- overseas roaming is not treated as supported for the PayGo route.

Current evidence:

- H2O's PayGo page remains a US-focused prepaid route;
- current H2O international roaming material applies roaming to Unlimited monthly and 12-Month plans, not PayGo.

Decision: **KEEP CURRENT CAUTION.** No production change.

## 2. Hidden-route candidates discovered from community evidence

These are research candidates, not production recommendations.

### AIS Thailand — THB 49 / 365-day support-assisted validity

Signal quality: **high**

Why it matters:

- direct AIS customer-service wording was reproduced by a current user;
- multiple current community reports describe the same support-assisted `49B Validity 365 Days` path;
- current AIS public material independently supports a 365-day prepaid-validity mechanism;
- the route may combine low annual retention cost with passport KYC, roaming, SMS, Wi-Fi Calling, eSIM reissue and long-term number continuity.

Current classification: **support-confirmed hidden-route candidate; NEXT Q-013 TASK; NOT IN PRODUCTION.**

Required before admission:

- exact starting product/account states eligible for the 49B offer;
- whether the offer can be repeated/renewed under current policy;
- current support channel consistency and refusal cases;
- separate Trip/Redtea/traveler-SIM starting products and conversion paths instead of merging them;
- real acquisition + top-up + recurring/keep-alive cost;
- passport/KYC/local-presence/first-network-attachment requirements;
- payment restrictions;
- SIM/eSIM/device transfer/reissue mechanics;
- mainland-China purchase/activation/SMS/Wi-Fi Calling practicality;
- same-number replacement/recovery/recycling behavior;
- last successful reproduction and last refusal/failure date.

### RedPocket US annual route — community-reproduced acquisition + support-assisted eSIM reissue

Signal quality: **medium-high**

Recent evidence:

- 2026 NodeSeek users report successful purchase/activation of the annual RedPocket route through the known marketplace channel;
- at least one current report documents support reissuing a manual eSIM QR after the default flow did not deliver one;
- another long-form retention review treats RedPocket as one of the more reliable US-number routes after using alternatives.

Important negatives:

- marketplace-account/payment friction;
- recycled-number history, including reports of a newly issued number already blocked by WhatsApp;
- device/eSIM-adapter compatibility and carrier anti-fraud behavior.

Sources:

- https://www.nodeseek.com/post-612584-1
- https://www.nodeseek.com/post-783926-1

Current classification: **replicated community candidate; needs seller/channel + number-history risk audit**.

### ClubSIM Hong Kong — community freshness caught a keep-alive price change

Signal quality: **high for change detection**

Earlier tutorials described HKD 6/year keep-alive. A June/July 2026 long-term user reported the HKD 6 package was removed on July 3 and annual keep-alive moved to HKD 15, with additional online eSIM replacement limits.

Sources:

- https://www.nodeseek.com/post-479688-1
- https://www.nodeseek.com/post-783926-1

Current classification: **strong candidate only after current keep-alive price and replacement limits are rechecked**.

### HK-mobi / CSL Hong Kong — low-cost annual-retention candidate

Signal quality: **medium**

A 2026 community report describes online eSIM availability, effective opening cost around HKD 10 after included balance, HKD 28 / 365-day keep-alive, and mainland roaming SMS as a central use case.

Source:

- https://www.nodeseek.com/post-739650-1

Current classification: **emerging candidate; needs independent replication and KYC/roaming/number-reissue audit**.

### Germany O2 prepaid eSIM — extremely low-cost transfer-based retention claim

Signal quality: **medium / high upside**

A detailed Aug 2026 first-hand NodeSeek report claims legitimate passport identity verification, Wi-Fi Calling and overseas SMS, account-side eSIM regeneration, 180-day validity extension after account recharge, and bank-transfer top-ups as low as EUR 0.01.

Source:

- https://www.nodeseek.com/post-851904-1

Current classification: **high-priority replication candidate, not production evidence**.

Safety boundary: only legitimate passport/KYC/carrier flow is in scope. Do not preserve or recommend proxy/location spoofing or other methods intended to defeat carrier geographic/security checks.

### Netherlands Simyo prepaid eSIM — current long-life balance route

Signal quality: **medium-high**

An Aug 2026 first-hand report documents successful eSIM opening, 180-day activity/balance requirement, SMS as keep-alive, a long runway from starting balance, plus failed-order/refund friction and support recovery.

Source:

- https://www.nodeseek.com/post-884095-1

Current classification: **replicated research candidate; needs second independent user and exact carrier validity wording**.

### One NZ prepaid — long initial-validity candidate

Signal quality: **medium**

Community reports describe a low-cost eSIM route with a long initial validity window and later annual top-up retention. It also appears in a June 2026 personal multi-SIM retention review as a trusted route.

Current classification: **candidate; verify current new-line validity, international/Wi-Fi SMS behavior and eSIM-transfer limits**.

## 3. Community evidence that must not become product instructions

Community posts relying on false residency, forged/unrelated documents, deceptive support stories, stolen identities, unauthorized access, location/GPS spoofing, proxy/IP manipulation to defeat explicit eligibility, or other security bypasses are out of scope.

Such posts may still be useful as failure/risk signals. If a legitimate carrier-supported path exists underneath them, research that legitimate path separately.

## 4. Immediate audit priority

1. **AIS Thailand** — complete the full hidden-route record for the support-assisted `49B / 365-day` route and conversion variants.
2. **RedPocket** — audit annual-route seller/channel, number-history, activation/reissue and overseas behavior.
3. **ClubSIM / HK-mobi** — recheck current annual keep-alive and eSIM replacement mechanics.
4. **O2 Germany / Simyo NL / One NZ** — obtain independent replication before any production expansion.

Completed current-route review on 2026-09-18:

- **giffgaff:** keep current overseas-risk penalty/contextual warning; no hotfix.
- **Tello:** keep US-first activation/port-in hard block; no hotfix.
- **Lebara UK:** keep UK-first block and dependable overseas Wi-Fi/SMS unknown; no hotfix.
- **Sakura:** corrected overseas calls/SMS evidence via PR #108 and live-verified production.
- **Ultra PayGo:** keep Wi-Fi Calling abroad unknown pending PayGo-specific reproduction.
- **H2O PayGo:** keep current no-roaming-on-PayGo caution.

## 5. Production rule during this audit

Do not add a batch of new carriers just because community research produced many interesting routes.

Keep `/tools/phone-number-survival-guide/` as the single canonical. No provider/country doorway pages. First correct materially misleading current-route data; then admit at most one or two hidden routes whose value is genuinely different and whose current reproducibility is strong enough to maintain.

The desired product is not the largest SIM database. It is a small Phone Radar where the site knows the non-obvious route, real current cost, required documents and steps, overseas behavior, retention/recovery, failure modes and freshness.
