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

Audit status: **BOUNDED REVIEW COMPLETE 2026-09-18 — HOLD FROM PRODUCTION**

Signal quality by component:

- **49B / 365-day retention primitive: HIGH.** A Sep 17 NodeSeek user reproduced direct AIS support wording recommending the `49B Validity 365 Days` package for a prepaid number used mainly for SMS/OTP or overseas. A separate current community thread says it is again time for the yearly AIS renewal for numbers opened the previous year and uses the same email-support enrollment. Older 2025 community evidence also describes year-two and year-three support renewal.
- **Current Trip acquisition product: HIGH for the product itself.** Trip product ID `44775420` is live in Sep 2026 at roughly HKD 33, provides an AIS local +66 number, calls/SMS, passport-based eKYC and current 7/10-day packages. The Sep 17 NodeSeek route matches the current price/product shape; older community evidence explicitly links product ID 44775420 and identifies the reseller as BillionConnect.
- **Trip -> long-term support conversion: MEDIUM.** The Sep 17 user reports support enabling international roaming, converting the line for personal/long-term use, issuing a replacement eSIM QR and enabling Wi-Fi Calling. This is a real current reproduction, but there is not yet a persistent public AIS eligibility specification for the conversion step.
- **Repeat annual 49B renewal: MEDIUM-HIGH.** Current independent community evidence explicitly describes renewing lines opened the previous year; older evidence describes contacting support again in later years. AIS public prepaid terms independently cap accumulated validity at 365 days, consistent with an annual renewal model rather than permanent validity.
- **Support consistency: MEDIUM.** The Sep 17 user reports successful email handling. A Nov 2025 community thread shows Wi-Fi Calling provisioning could initially be refused or redirected to an AIS shop, with another user succeeding only after repeating the email request. No current sampled source showed a 49B-package refusal, but absence of a refusal report is not proof of universal eligibility.

Current end-to-end fields:

| Field | Current finding |
|---|---|
| Acquisition | Current Trip product ID `44775420`; AIS native eSIM, +66 local number, voice/SMS, roughly HKD 33, 7/10-day packages. |
| KYC | Passport + facial/eKYC. AIS currently documents passport registration for foreign nationals; Trip states one passport can authenticate up to three of these eSIMs during the relevant binding period. |
| Local-presence / first attachment | **CONFLICT / unresolved for the long-term route.** Current Trip product says eKYC may be completed abroad but the traveler package must be used in Thailand within 7 days after authentication or the package becomes invalid. The Sep 17 community route reports overseas support-assisted conversion without describing a Thailand visit. Do not claim a fully remote China-only acquisition path until this boundary is independently reproduced/clarified. |
| Initial cost | Roughly HKD 33 current Trip product plus a small top-up; Sep 17 user reports about THB 10 top-up during support re-verification. |
| Retention | Standard small top-ups extend validity; support-assisted THB 49 / 365-day package has current replicated evidence. It is one year, not permanent. |
| Repeatability | Current annual-renewal community evidence + older year-two/year-three reports support repeatability, but exact persistent eligibility is not publicly specified by AIS. |
| International roaming / SMS | AIS officially supports roaming SMS and says receiving SMS while abroad is free. China is among current AIS roaming destinations. Sep 17 user reports support enabling roaming from abroad. |
| Mainland-China SMS practicality | **Promising / support-assisted.** Current community reports show the line registering on Chinese networks after roaming is enabled; official AIS roaming documentation supports China and free incoming SMS. Do not promise a particular Chinese partner network without current route-specific verification. |
| Wi-Fi Calling abroad | AIS officially supports Wi-Fi Calling/SMS abroad in general, but its current page explicitly notes country/legal exceptions such as China. Community users report China success, while older users also report provisioning refusals. **Do not promise mainland-China Wi-Fi Calling or provide bypass instructions.** |
| eSIM replacement / same number | Sep 17 user reports a support-issued replacement eSIM QR with the old profile invalidated and the same phone number retained. AIS also documents standard eSIM conversion/transfer, but foreign-passport self-service/reissue scope remains less clear than the support-assisted case. |
| Payment | Sep 17 user successfully topped up about THB 10 in myAIS with a non-Thai Visa; UnionPay was displayed but not personally tested. Treat payment-method breadth as operational, not guaranteed. |
| Alternative retention | AIS now has a THB 3 / 30-day automatic number-retention mechanism for up to six cycles after expiry, but the official announcement explicitly excludes Tourist SIM cards. Do not assume it applies to this Trip-origin route unless the post-conversion account class is verified. |

Important sources:

- Current Sep 17 reproduction/support artifact: https://www.nodeseek.com/post-932925-1
- Current continuation/eSIM continuity details: https://www.nodeseek.com/post-932925-2
- Current independent annual 49B renewal signal: https://shuzijumin.com/thread-10222-1-1.html
- Older exact Trip product + later-year renewal corroboration: https://forum.naixi.net/thread-7513-1-1.html
- Older support-consistency failure mode: https://forum.naixi.net/thread-6762-1-1.html
- Current Trip product ID 44775420: https://hk.trip.com/things-to-do/detail/44775420/
- AIS SIM registration/KYC: https://www.ais.th/en/consumers/help-and-support/network-technologies/update-sim-registration
- AIS international roaming/how-to: https://www.ais.th/en/consumers/package/international/roaming/how-to
- AIS Wi-Fi Calling: https://www.ais.th/consumers/package/postpaid/services/vowifi
- AIS prepaid number-retention announcement: https://www.ais.th/en/about-us/pr-news/important-announcement-from-the-nbtc-regarding-the-retention-of-phone-numbers-for-prepaid-customers-ais-1-2-call-effective

Decision: **HOLD THE END-TO-END AIS ROUTE FROM PRODUCTION.** The 49B/365-day retention mechanism itself is now high-confidence and should remain a priority signal. The blocker is not lack of a public marketing page; it is the unresolved acquisition/account-class boundary: the current Trip traveler product says Thailand use is required shortly after eKYC, while the support-assisted long-term conversion is documented mainly by current user/support artifacts rather than a stable AIS eligibility page. Mainland-China Wi-Fi Calling is also conflicting and must not be promised. Revisit when the Trip-origin line's conversion/account class and Thailand-presence requirement are independently reproduced or directly clarified.

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

Current classification: **replicated community candidate; NEXT Q-013 CANDIDATE.** Audit seller/channel + current total cost + first activation/geography + overseas SMS/Wi-Fi Calling + eSIM replacement + number-history risk before any production consideration.

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

1. **RedPocket** — audit the current annual-route seller/channel, real total cost, activation/geography, overseas SMS/Wi-Fi Calling, eSIM replacement and recycled-number history. AIS is now a bounded HOLD, not permission to keep polishing it without new evidence.
2. **ClubSIM / HK-mobi** — recheck current annual keep-alive and eSIM replacement mechanics.
3. **O2 Germany / Simyo NL / One NZ** — obtain independent replication before any production expansion.
4. **AIS revisit trigger** — only reopen the Trip-origin end-to-end route when independent/direct evidence resolves its post-KYC Thailand-presence/account-class conversion boundary or a new current failure materially changes the retention conclusion.

Completed current-route review on 2026-09-18:

- **giffgaff:** keep current overseas-risk penalty/contextual warning; no hotfix.
- **Tello:** keep US-first activation/port-in hard block; no hotfix.
- **Lebara UK:** keep UK-first block and dependable overseas Wi-Fi/SMS unknown; no hotfix.
- **Sakura:** corrected overseas calls/SMS evidence via PR #108 and live-verified production.
- **Ultra PayGo:** keep Wi-Fi Calling abroad unknown pending PayGo-specific reproduction.
- **H2O PayGo:** keep current no-roaming-on-PayGo caution.

Completed hidden-route bounded review on 2026-09-18:

- **AIS Thailand:** 49B/365-day retention primitive = high confidence; full Trip-origin end-to-end route = HOLD because current travel-product activation/account-class boundary and mainland-China Wi-Fi Calling remain unresolved/conflicting. No production addition.

## 5. Production rule during this audit

Do not add a batch of new carriers just because community research produced many interesting routes.

Keep `/tools/phone-number-survival-guide/` as the single canonical. No provider/country doorway pages. First correct materially misleading current-route data; then admit at most one or two hidden routes whose value is genuinely different and whose current reproducibility is strong enough to maintain.

The desired product is not the largest SIM database. It is a small Phone Radar where the site knows the non-obvious route, real current cost, required documents and steps, overseas behavior, retention/recovery, failure modes and freshness.
