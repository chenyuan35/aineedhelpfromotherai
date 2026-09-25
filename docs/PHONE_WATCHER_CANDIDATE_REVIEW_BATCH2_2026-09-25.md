# Phone Watcher Candidate Review — Batch 2 — 2026-09-25

Status: **COMPLETE / NO PUBLICATION AUTHORIZED**

## Scope

This review covers every `candidates.tsv` record emitted after the first six v1.1 candidates already dispositioned in `docs/PHONE_WATCHER_CANDIDATE_REVIEW_2026-09-25.md`.

The live observer had 61 candidate records plus the header at the review checkpoint, so this pass covers **55 new records** (rows 8–62), representing **31 distinct root threads** after collapsing URL fragments such as V2EX `#replyN` anchors.

Watcher output remains discovery metadata only. No candidate is a publication instruction or carrier truth.

## Runtime/source health at review time

The original disposable observer was reached through the already-verified Qwen key-only SSH path. Read-only checks showed:

- root filesystem still at **82%** used, with about 187 MiB free;
- `aineedhelp-phone-demand-watch` latest completed run: `2026-09-25T09:08Z`, exit 0;
- next demand-watch timer: scheduled normally;
- all four community feeds returned **HTTP 200** in the latest run: Reddit, NodeLoc, NodeSeek and V2EX;
- `candidates.tsv`: 61 candidate records, current through the 09:08Z run;
- `aineedhelp-phone-source-watch` latest completed run: `2026-09-25T06:54Z`, exit 0;
- source-watch run state: **22 total / 16 ok-or-304 / 2 robots-skip / 4 fetch-error**;
- the two Ultra Mobile URLs remained legitimate `robots-skip` states;
- the four Tello URLs remained explicit provider-side HTTP 403 fetch blockers;
- `mobal_pricing` and `mobal_id` emitted current `content-change` signals requiring manual reconciliation. The pricing hash returned to a previously observed hash, so the change must not be assumed to be a durable price change without inspecting the page content.

Conclusion: the observers are healthy enough to distinguish a real candidate stream from collection failure. Tello/Ultra states remain source-specific blockers, not watcher failure.

## Disposition summary

| Result | Candidate records | Root threads | Meaning |
|---|---:|---:|---|
| **PROMOTE backstage research packet** | 2 | 2 | Globe Philippines long-term/roaming lead; Holafly Always On emergency-data lead |
| **INSUFFICIENT / demand-only** | 10 | 6 | Phone-adjacent question or anecdote without route-grade operational evidence |
| **DUPLICATE / restricted seller lead** | 1 | 1 | UK SIM/PAC seller post adds no independent route outcome |
| **REJECT / false positive** | 42 | 22 | AI reselling, cloud/KYC, software, jobs, unrelated consumer goods, or other non-Phone material |
| **Total** | **55** | **31** | Every row 8–62 dispositioned |

The 55 records also contain **24 excess duplicate emissions** caused by repeat V2EX reply-fragment URLs for the same root thread and essentially the same excerpt/title. This is a confirmed precision/triage-cost issue, not a source-health failure. A later bounded watcher-quality task should normalize fragment-only duplicates without hiding genuinely new evidence.

## Promoted packet A — Globe Philippines Prepaid retention / overseas SMS

Watcher row: **48** — NodeLoc `Globe卡问题`.

The candidate itself is only a one-person question about a Globe physical SIM losing signal, expiry, acquisition and real-name registration. It becomes useful only after current first-party and independent evidence reconciliation.

Current first-party facts:

- Globe requires SIM registration before activation for locals and foreigners.
- A foreign national registered as a **tourist** receives only **30 days** of SIM validity and the SIM automatically deactivates after that period.
- Globe Prepaid expires after one year without a regular top-up, or after 120 days with zero balance and no load/promo activity; an expired prepaid SIM cannot be reactivated.
- Globe Prepaid roaming automatically connects to supported partner networks abroad; no separate roaming activation is required for network registration.
- The Traveler eSIM is explicitly a 30-day tourist product and is not a long-term number-retention route.

Current independent 2026 evidence:

- April 2026 users living abroad report keeping ordinary Globe Prepaid active with small annual reloads and receiving OTP/SMS abroad; another user reports different app/top-up behavior on a foreigner-registered SIM versus a Filipino-registered SIM.
- July/August 2026 discussions reproduce roaming SMS/OTP use but also contain no-signal/expiry cases and number-loss consequences.

Decision:

- **PROMOTE backstage research packet; do not publish route.**
- The key unresolved product question is eligibility, not merely price: **what lawful non-tourist registration path, if any, lets the target non-Philippine user hold an ordinary Globe number beyond 30 days?**
- If a suitable registration class exists, then verify mainland-China roaming SMS/OTP, exact receiving charges, smallest legitimate regular reload, expiry/recovery behavior and acquisition path.
- Do not tell ordinary tourists that a normal Globe number can be kept for years; current first-party tourist rules contradict that.

Primary/current sources:

- https://www.globe.com.ph/help/sim-registration-act
- https://www.globe.com.ph/help/troubleshooting
- https://www.globe.com.ph/help/international/prepaid-roaming
- https://www.globe.com.ph/help/international/prepaid-traveler-esim
- https://www.globe.com.ph/prepaid/local-esim-terms

Independent 2026 leads:

- https://www.reddit.com/r/phmigrate/comments/1sa5uhm/how_to_keep_globe_prepaid_sim_active_abroad/
- https://www.reddit.com/r/PinoyTraveller/comments/1uzt4ur/how_to_activate_globe_roaming/
- https://www.reddit.com/r/FilipinoAmericans/comments/1vsplr2/how_to_maintain_a_philippine_phone_number_while/

## Promoted packet B — Holafly Always On emergency-data eSIM

Watcher row: **57** — NodeSeek giveaway/seller post describing a short Holafly-style eSIM plus one year of monthly 1 GB emergency data. The title spells the product `Holify`, while the excerpt says `Holafly`; the seller route itself therefore is not trusted as product identity or price evidence.

Current first-party facts nevertheless validate the underlying product feature:

- Holafly's current Singapore page says its eSIM products include **Always On**, providing **1 GB of backup data each month** after the main plan ends.
- The Singapore eSIM is data-only and provides **no local phone number for calls or SMS**.
- Current Always On terms say the eSIM must remain installed on the original device, unused data does not roll over, and access is valid for **12 months**; deleting the eSIM removes the benefit.

Fresh independent evidence:

- April 2026: a user reports a one-day Holafly pass continuing to provide data after expiry; the behavior was identified as Always On.
- August 2026: another user reports a trip eSIM still providing data months after the paid trip period because it remained installed.
- Separate 2026 complaints show activation/speed/refund failures, so the feature must not be converted into a reliability guarantee.

Decision:

- **PROMOTE backstage Data eSIM research packet; do not publish the seller offer.**
- This is a potentially useful "emergency data between trips" job, not a long-term SMS/OTP-number route.
- Next research should verify the cheapest legitimate **direct** Holafly purchase that currently activates Always On, current supported-country coverage (especially China/Hong Kong/Singapore), device-transfer limits, real monthly refresh behavior and current independent reliability.
- Do not publish the NodeSeek seller's price, QR delivery or "no warranty" acquisition path as the recommended route.

Primary/current sources:

- https://esim.holafly.com/esim-singapore/
- https://esim.holafly.com/faq/about-esims/stay-online-with-always-on/

Independent 2026 leads:

- https://www.reddit.com/r/eSIMs/comments/1su65ee/esim_still_working_past_expiration/
- https://www.reddit.com/r/eSIMs/comments/1vcf26u/holafly_data_still_works_even_after_vacation/

## Phone-adjacent but insufficient records

| Rows | Root signal | Disposition |
|---|---|---|
| 11 | Google Voice account purchase/helper question | **INSUFFICIENT / duplicate demand signal.** No owned-number route outcome; project already tracks Google Voice/VoIP limitations for verification use. |
| 14 | Visible+ annual-plan replacement question | **INSUFFICIENT.** Generic US plan shopping, no overseas-number/OTP retention outcome. |
| 15, 26, 34, 55, 60 | Claude thread reporting phone binding sometimes disappeared | **INSUFFICIENT / duplicate service-rule signal.** Useful only as a changing service requirement lead; it does not validate any phone route. |
| 30 | Request for renewable Orange Travel alternative with unlimited Europe calls | **INSUFFICIENT / demand-only.** Clear user job but no concrete route reproduction or resolved recommendation. |
| 43 | `求hk esim` | **INSUFFICIENT.** Title-only demand signal. |
| 44 | China Unicom user reports intermittent foreign-site connectivity restored by airplane mode/restart | **INSUFFICIENT incident.** One underspecified account with no exact plan, location/device or carrier-side diagnosis. |

## Duplicate / restricted seller record

| Row | Signal | Disposition |
|---|---|---|
| 56 | Individual seller offering an existing UK number with PAC transfer, formerly used for Telegram | **DUPLICATE / restricted seller lead.** It overlaps the existing UK/giffgaff continuity space, adds no independently reproduced route outcome, and is not a safe default acquisition path. |

## Rejected false-positive root threads

The following rows are all explicitly closed as non-Phone candidates:

- 8,17,22,28,36,42 — beverage/retail complaint duplicates;
- 9,23,29 — Apple Watch health-feature regional activation;
- 10 — AI subscription reseller promotion;
- 12 — VPS merchant complaint;
- 13,16,27,35,41 — AI subscription reseller duplicates;
- 18 — failed third-party GPT/Claude relay vendor;
- 19 — Alibaba International KYC request;
- 20 — Alibaba Cloud Hong Kong real-name discussion;
- 21 and 61 — Microsoft E3 reactivation;
- 24,32,40,59 — AI-image-service anti-abuse/verification discussion;
- 25,33 — crypto/U-card directory;
- 31 — GPT image API relay request;
- 37,47,54 — English-learning Chrome extension;
- 38 — GPT/Claude account recharge seller;
- 39 — domestic-app adaptation discussion;
- 45 — AI API aggregator;
- 46,53,58,62 — Meta Muse registration tutorial duplicates;
- 49 — Meta Muse/AWS promotion;
- 50 — VPS review;
- 51 — Meta Muse remote-browser registration;
- 52 — creator-growth job posting.

## Confirmed watcher-quality issue

V2EX feed candidates are currently deduped on the full link. When the same root post reappears with `#replyN`, the watcher can emit the same title/excerpt repeatedly. In this batch, **24 of 55 records were excess fragment variants** across repeated root threads.

This does not invalidate current evidence, but it increases review cost and lowers candidate precision. A future watcher-quality task should normalize fragment-only URLs for dedupe while preserving truly new post content; do not broadly suppress V2EX or other sources.

## Next bounded task

The source watcher reported two current Mobal Japan `content-change` signals (`mobal_pricing` and `mobal_id`) on an already-known route family. Because those provider-controlled changes may affect existing Phone facts, the next independent task should reconcile the current Mobal pricing and ID-requirement pages before starting a new route build.

Globe and Holafly remain promoted backstage research packets after that maintenance check. No public Phone route changed in this batch.
