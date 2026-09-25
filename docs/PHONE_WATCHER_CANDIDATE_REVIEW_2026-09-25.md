# Phone Watcher v1.1 Candidate Review — 2026-09-25

Status: COMPLETE / NO PUBLICATION AUTHORIZED

## Scope

This review dispositioned the six records emitted by the first verified watcher v1.1 run at `2026-09-24T21:15:37Z`. Input came from the off-host Qwen backup of `candidates.tsv`; production pages were not changed.

Review rule: watcher output is discovery metadata, not carrier truth. Each record was checked against existing Phone research, classified by user value/source role, and opened or cross-checked against public sources only where needed. Direct NodeSeek/Reddit page fetches returned ordinary HTTP 403 from the available clients, so no anti-bot bypass was attempted.

## Disposition ledger

| # | Watcher candidate | Disposition | Reason |
|---|---|---|---|
| 1 | Reddit — `eSIM users I have a question regarding eSIM and IMEI` | **INSUFFICIENT / no promotion** | A device-behavior question about iPhone IMEI 1/2 assignment. No carrier/route acquisition path, no reproduced outcome, and no decision-critical route fact. Keep only as a possible future device-friction FAQ signal if it repeats. |
| 2 | Reddit — `Extremely disappointing experience with Saily eSIM` | **PROMOTE — data-eSIM incident packet** | A detailed current Switzerland failure/refund account, with a separate September 2026 Switzerland thread reporting similar unusable Saily data. Useful as a bounded Saily Switzerland data-route incident signal, not as evidence about Saily's US phone-number add-on or all Saily destinations. |
| 3 | NodeLoc — DMIT LAX VPS carpool | **REJECT — false positive** | VPS resale/carpool content; not a SIM, phone-number, roaming, OTP or data-eSIM route. Incidental service/commerce terms triggered the watcher. |
| 4 | NodeSeek — `售美国专属电话卡` | **DUPLICATE / restricted seller lead; no promotion** | The `$3/month` "purple card" maps to the already-researched Ultra Mobile PayGo route family. The post adds no independently reproduced user-owned activation/OTP outcome and offers third-party receipt of calls/SMS verification, which is outside the product's safe acquisition model. |
| 5 | NodeSeek — `hahasim官方保号充值链接【支持zfb,vx】` | **PROMOTE — retention conflict packet / HOLD** | Existing haha SIM research already has a low-cost annual-retention lead. The new signal is useful because current community material still reports a `HKD 10` online top-up path, while 3HK's current prepaid recharge page says expiry is extended for top-ups of `HKD 100 or above` and its English page states a `HKD 100` minimum per transaction. This conflict must be resolved before any current keep-cost claim is published. |
| 6 | V2EX — apple-vinegar retail complaint | **REJECT — false positive** | Consumer-goods pricing complaint with no Phone route relevance. |

Result: **2 promoted research packets, 4 non-promotions.** No candidate is left ambiguous merely because the watcher emitted it.

---

## Promoted packet A — Saily Switzerland data-eSIM incident cluster

Family: `data SIM/eSIM`

Route scope: Saily data eSIM used in Switzerland. This packet does **not** apply to Saily's US phone-number add-on.

Current evidence:

- 2026-09-24 Reddit first-hand complaint: user reports paying `EUR 63.99`, arriving in Switzerland with no usable data for basic tasks, a month without a support reply, a refund refusal, and an offer of `EUR 20` Saily credit. The same account cross-posted the complaint, so those copies count as one observation.
- 2026-09-04 r/eSIMs thread: a user reports a Saily unlimited Switzerland plan failing for basic use; later in the same thread another user reports the same problem in Zermatt despite low apparent usage. This is a separate current corroborating signal.
- 2026-08-26 Trustpilot review: reports a Switzerland unlimited plan being practically unusable and refund denied after the plan period; useful as another lead but independence from other reports is not proven, so do not count it as a clean third sample.
- Saily's current public refund policy says a partial or full refund may be considered for quality issues when most data could not be used, and also when an activated plan remains more than 99% unused. This establishes a policy/outcome conflict worth tracking; it does not prove the complainant qualified.

Disposition:

- state: `Watch`;
- useful signal: destination-specific reliability + support/refund outcome;
- do not generalize to Saily globally;
- do not use this packet to claim anything about Saily's US phone-number/OTP behavior;
- before any public Data eSIM comparison change, verify the exact Switzerland plan, local network/APN/FUP context and whether the reports are materially independent.

Sources:

- https://www.reddit.com/r/NoContract/comments/1wpbw9c/extremely_disappointing_experience_with_saily_esim/
- https://www.reddit.com/r/saily/comments/1wpbs2v/extremely_disappointing_experience_with_saily_esim/
- https://www.reddit.com/r/eSIMs/comments/1w6zwdl/dont_buy_saily_esim_for_switzerland/
- https://support.saily.com/hc/en-us/articles/16420576170652-What-is-Saily-s-refund-policy
- https://ch.trustpilot.com/review/saily.com?page=3

---

## Promoted packet B — Fortress haha SIM retention-price conflict

Family: `long-term SMS/OTP`

Route: Fortress haha SIM / 3HK-backed prepaid route.

Existing state before this watcher candidate: `HOLD / Watch lead` in `docs/USER_DIRECTED_CURSOR_PHONE_RESEARCH_2026-09-19.md`, because product provenance is supported but current registration/onboarding behavior and renewal confidence were not clean enough for admission.

Current evidence:

- The watcher caught a 2026-09-24 NodeSeek title explicitly advertising an "official keep-number recharge link" with Alipay/WeChat support. Its feed excerpt was empty and the direct page returned ordinary HTTP 403, so the title alone is not treated as proof.
- A July-August 2026 Naixi discussion points to the same 3HK prepaid online-recharge path and reports `HKD 10` as a one-year keep-number recharge amount.
- Older independent tutorials also describe `HKD 10` via the 3HK online-recharge page and one-year extension, with mainland WeChat/Alipay support. These are useful historical corroboration but are not enough to override a current official conflict.
- 3HK's current prepaid online-recharge page states that top-ups of `HKD 100 or above` extend card validity from the recharge date; the English rendering states a minimum top-up of `HKD 100` per transaction.
- 3HK's current payment-method page lists Alipay and WeChat Pay among supported online payment methods, but that alone does not establish that a `HKD 10` prepaid recharge currently extends haha SIM validity.

Decision-critical conflict:

`community/current-route reports: HKD 10 → +365 days` **vs.** `current 3HK prepaid page: >= HKD 100 required for validity extension`.

Disposition:

- keep route state: `HOLD / conflicting`;
- do not publish `HKD 10/year` as a current guaranteed keep cost;
- do not replace the missing certainty with a neutral estimate;
- next research pass should resolve the current recharge amount/action/expiry effect from current first-party material and at least one fresh independent reproduction if available.

Sources:

- watcher lead: https://www.nodeseek.com/post-947541-1
- current 3HK prepaid recharge: https://www.three.com.hk/3Care/chi/prepay/payonline1.jsp
- current 3HK payment methods: https://www.three.com.hk/3Care/chi/info/infoPayOnline.jsp
- 2026 community discussion: https://forum.naixi.net/forum.php?action=printable&mod=viewthread&tid=12930
- historical walkthrough: https://blog.tsinbei.com/archives/1462/comment-page-2
- historical walkthrough: https://www.chjina.com/archives/197/comment-page-1?replyTo=37

## Non-promoted Ultra Mobile note

The `$3/month` PayGo fact itself remains current: Ultra Mobile's official PayGo page currently lists 100 minutes, 100 texts and 100MB per 30-day cycle for `$3`, international roaming support for voice/SMS/MMS through wallet balance, and cancellation after nonpayment according to the current suspension/extension rules. That route was already present in project research before this watcher run. The NodeSeek seller post does not add safe operational evidence, so this review does not create a duplicate route packet.

Official source: https://www.ultramobile.com/paygo/

## Next research task

Resolve the **haha SIM current retention rule conflict** before any public Phone change. The question is narrow: what current recharge amount/payment path actually extends the number, for how long, and under what current activation/registration state? If the conflict cannot be resolved without bypassing access controls or relying on stale/circular reports, keep the route on HOLD and record the unresolved state.
