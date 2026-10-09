# Phone Radar — S3 independent job-acceptance and competitor audit

Date: **2026-10-09**. Scope: **read-only S3 product-value / task-outcome validation** of the existing live Phone canonical. This is not new user recruitment or an MVP release. **Audit COMPLETE; product S3 acceptance NOT MET.**

## Definition, method and evidence boundary

- GitHub main starting baseline: `1bf5597a4b73009d6ff4e4516539f36e92f635b4`, deployed Phone S1/S2 (PR #451). The live apex Phone raw HTML responded HTTP 200 and exposed the task controls and client-side matching logic. Live `phone-route-summaries.json` was HTTP 200 and contained **160 rows (153 long-term / 5 temporary / 2 data)**; lazy Giffgaff and Lebara detail endpoints returned current indexed evidence.
- Method: inspect the **actual deployed** `taskEligible`, `taskCandidates`, `taskServiceEvidence` and `renderTaskFinder` client source in fresh raw HTML; replay ten explicit choice sets independently against the **live canonical JSON** by matching those exact rules, then compare the output/summary wording with original, dated user/community job evidence. This is a *source- and live-data-grounded logic replay*, not ten end-to-end real browser clicks or ten recruited users.
- Strong gate: a request whose necessary condition is **mainland-China first activation + named-app SMS** cannot be counted as correctly solved by a purchasable card if that exact geography/operation is unverified. A visible conditional candidate with an unknown activation step is **PARTIAL**, even if the global disclaimer says `NOT established`. A safe, explicit no-match does count for an unprovable task. One source repeated twice is not two independent sources.
- Target: >=8/10 correct evidence-backed answers or explicit correct no-match, **zero false guarantees**, no HOLD/backstage winner. No invented measured time-to-result or actual conversion.

## 10 dated, externally grounded job scenarios

Live matcher gate: `long-term + real-mobile + admitted + (public-legacy | public-pilot)`; exact service option requires only `successCount > 0`. Existing-number `keep` and `service=bank` always return no-match. Location is **warning-only**, not hard-filtered.

| ID | Public user job and evidence | Replayed controls | Live matched result | S3 verdict |
|---|---|---|---|---|
| P0-1 | Mainland user wants UK eSIM Telegram OTP after seeing [Lebara first-hand China activation/use report, 2026-08-12](https://linux.do/t/topic/2745784) | verify / China / UK / eSIM / Telegram | Giffgaff, Lebara; warns China setup **NOT established** | **PARTIAL:** no source-reviewed first-activation guarantee attached to the match |
| P0-2 | Mainland user seeks a low-cost foreign number for ChatGPT/TG, [2026-09-25 inquiry](https://linux.do/t/topic/2951479) | verify / China / UK / any / OpenAI | Giffgaff, 1 observed success / 1 independent source, `insufficient` | **PARTIAL:** insufficient route+service evidence and China setup unverified |
| P0-3 | Hong Kong ClubSIM Telegram SMS failure, [2025-05-29 independent report](https://linux.do/t/topic/686357) | verify / China / Hong Kong / any / Telegram | No evidence-eligible matches | **PASS:** does not promote backstage/HOLD ClubSIM |
| P0-4 | Croatia A1 eSIM cannot place/receive SMS at one China location, [2026-05-17 onward multi-user thread](https://linux.do/t/topic/1884171) | buy / China / Croatia / eSIM / any | No evidence-eligible matches | **PASS:** does not infer Croatia-China SMS eligibility |
| P0-5 | Lebara China WhatsApp registration SMS, same independent [2026-08-12 service-specific report](https://linux.do/t/topic/2745784) (different operation from P0-1, **not** a new person/source) | verify / China / UK / any / WhatsApp | Giffgaff, Lebara; China setup **NOT established** | **PARTIAL:** app observation != guaranteed first activation/delivery |
| P1-6 | Existing AT&T number, owner in Turkey, remotely port/activate eSIM and use US banks, [2026-09-06](https://www.reddit.com/r/NoContract/comments/1w909vu/already_living_abroad_need_a_us_number_to_stay/) | keep / abroad / US / eSIM / bank | Explicit no verified port-in recommendation | **PASS** |
| P1-7 | AT&T user moving to Germany for a year wants cheaper number retention, [2026-05-27](https://www.reddit.com/r/NoContract/comments/1tpjbwu/advice_for_keeping_usa_number_active_while_abroad/) | keep / abroad / US / any | Explicit no verified port-in recommendation | **PASS** |
| P1-8 | US number holder moves to Asia, needs bank 2FA and considers Tello, [2026-01-14](https://www.reddit.com/r/expats/comments/1qcoarp/maintaining_a_us_phone_number_for_banking_purposes/) | keep / abroad / US / bank | Explicit no verified port-in recommendation | **PASS** |
| NEG-9 | A **new** real US number may not satisfy bank/government identity tenure/history, [2026-08-20 user report](https://www.reddit.com/r/expats/comments/1vtcfbf/retiring_or_moving_abroad_give_your_us_phone/) | buy / China / US / eSIM / bank | Explicit no verified bank-SMS match | **PASS** |
| NEG-10 | Marketplace compares Saily data/VoIP and US number claims, [independent 2026-10-07 competitor table](https://haiwaibiaoju.com/compare/keep-number/) (a published negative edge case, **not** a unique user) | buy / China / US / eSIM / any | No eligible real-mobile US result | **PASS:** VoIP/data does not leak into real-mobile recommendation |

**Result: 7/10 PASS; 3/10 PARTIAL; 0 explicit false activation, bank-OTP or port-in guarantees detected in the inspected matcher/summary; 0 HOLD/backstage winners.** The **>=8/10 S3 acceptance threshold is NOT reached**. In particular **0/5 P0 scenarios yield a complete, currently route-evidenced mainland first-activation + named-app fit**. This is a product-outcome metric for these controlled scenarios, **not** a population or product conversion rate. Existing CI's ten assertions passing cannot replace this independent decision check.

## Actual recommendation cohort and evidence quality

The only three eligible canonical summaries are:

| Route | Last route verification | First payment (modeled) | Yearly keep action (modeled) | Sample/evidence caveat |
|---|---|---|---|---|
| Giffgaff | 2026-09-15 | GBP 10 | GBP 0.60 | 13 linked sources; 2 continuity warnings; OpenAI 1 success / 1 source; Telegram 1 success / 2 distinct sources (grade C); WhatsApp 1 / 1 |
| Lebara UK | 2026-09-12 | GBP 6.50 | GBP 1.96 | 6 linked sources; both Telegram and WhatsApp have **two observations but only ONE independent source each** (shown `B` labels). Explicit mainland eSIM activation from one person is useful **case evidence**, not universal first-activation eligibility or proven foreign payment support |
| VOXI | 2026-09-26 | GBP 10 | GBP 0.16 | 5 linked sources; no sampled named-app success; low keep cost alone is not a China-first compatibility claim |

Amounts are existing normalized original-currency fields, **not** current quoted checkout prices or complete first-year landed totals. The Giffgaff row was last route-verified before the competitor's **2026-10-07** incident/refund/number-porting updates; current user-visible cards surface only warning counts, not dates/source-linked contradiction context. Do not silently change price/retention/rank or service grades from third-party summaries.

Notable source evidence: live Lebara lazy JSON contains the original [Aug 12 mainland activation and Telegram/WhatsApp report](https://linux.do/t/topic/2745784) counted across multiple observations from **one** source. Live Giffgaff lazy JSON contains dated June–September sources, provider policy, and route continuity events, but a separate independent [Oct 7 refreshed comparator](https://haiwaibiaoju.com/compare/keep-number/) now references additional Giffgaff long-roaming cancellation/refund issues. A further [2026-08-15 first-hand China-based discussion](https://www.reddit.com/r/chinalife/comments/1vpchp1/how_are_you_guys_contacting_banks_in_the_uk_and/) reports both working Giffgaff bank SMS and recent closures in replies. These are **candidate refresh/contradiction evidence**, not an automatic claim of broad route failure.

## Independent competition / substitutability

Checked live on **2026-10-09**, public HTTP 200:

- [esim.ren/keep-number](https://esim.ren/keep-number): seven easy-to-scan long-term number products across HK/Macau/CH/US, origin, stated annual keeping cost, eSIM, mainland SMS and intended use; includes a side-by-side table, generic long-roaming caveat and provider outbound links. Already covers the **static cheapest/HK number** use case much more directly than our present three UK-only frontstage candidates.
- [haiwaibiaoju.com/compare/keep-number/](https://haiwaibiaoju.com/compare/keep-number/): dated **2026-10-07** comparison of 11 distinct entries with costs, whether SMS works and provider-/product-specific incidents (Giffgaff closure/recovery/refunds, CMHK China-first activation exclusion, Saily number class/KYC, etc.). Also collects lightweight source feedback. Already covers a meaningful share of the **recent continuity warnings** differentiation claim.

**Decision:** static cost table and ordinary provider summaries are not defensible gaps. A possible retained advantage is *evidence-linked route × user's real activation geography × exact app operation × continuity/recovery* with visible unknowns and dated contradictions, but the present first screen does **not** yet outperform these peers on the China-first task. No new SEO pages, brand/country rollouts or backend investment on this evidence.

## Mobile and behavior boundary

Fresh mobile screenshot capture requests succeeded for widths **375** and **390**. The capture media could not be inspected directly in this tool environment; **no screenshot-based visual/no-overflow PASS is claimed**. The live compiled CSS was independently checked: at `<=720px`, filters become **two columns**, while at `<=375px`, filters abruptly switch to **one column**. With seven select fields, the 375px first result can be materially farther down the scroll than the 390px result. This is a **measured CSS breakpoint difference**, not measured time-to-answer or proof of actual user failure. No real volunteer was recruited in this audit; five participant sessions and 30-second success target remain **NOT TESTED**.

## Decision / next bounded task

**S3 audit COMPLETE but acceptance FAILED (7/10).** Do not promote it to a product-success claim. Keep the released site stable; stop additional route count, new SEO URLs, paid dependencies, wholesale translation and GA4 work inside Phone S3.

**NEXT SINGLE ATOMIC TASK — S4 feasibility/label repair on the existing Phone URL**:
1. Treat `location=china` / `abroad` as an explicit mandatory-feasibility condition when the user asks for an **actionable ready-to-activate** route: unknown remote first activation must produce **No verified matches**, with a separate expandable **Research candidates — eligibility unverified** view rather than being rendered as fit cards.
2. Show actual *route-specific independent observed* operation + geography + distinct-source counts, without turning one report into guarantee; distinguish one-source `B` labels from replicated evidence; source-link current Giffgaff long-roaming incident status after separate review.
3. Keep the free Browse / 2–4 Compare / saved-ID list and all 160 research rows intact. Do not change source canonicalization or promote HOLD/VoIP/data. No new URL, signup, database schema, tracking, paid API or ranking claims.
4. Require test cases: all ten S3 tasks including mandatory-China/no-match, positive research-only provenance, narrow 375/390 responsive QA, CI + Eval + Vercel Preview + exact-merge production verification. If independent route evidence cannot support an eligible China-first option, show zero rather than manufacturing one.

S4 is an evidence/UX repair, **not** a new growth product. Journal and main queue must record the acceptance failure; preserve GA4/consent and PR #449/#450 as separate.
