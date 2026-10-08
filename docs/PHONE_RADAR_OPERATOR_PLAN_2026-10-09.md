# Phone Radar — Operating Decision, MVP and Growth Plan
Decision date: 2026-10-09. Owner: coordinating operator / product manager. Status: **APPROVED DIRECTION FOR PLANNING ONLY; NO MVP RELEASE IN THIS PR**.

## 1. Executive decision and source discipline

**Lead one product:** Phone Radar is an evidence-backed cross-border **real-number acquisition, retention and verification decision tool**, not a global carrier encyclopedia, pure data-eSIM directory, one-time SMS marketplace or indiscriminate "cheapest phone number" table.

**User outcome:** in a short mobile session, the visitor should identify a *feasible* candidate number/retain route or receive an explicit "not established / no verified match" explanation, understand acquisition versus ongoing commitment, know activation/KYC/payment limits and see what evidence actually supports SMS or service compatibility.

**Immediate priority:** optimize the existing /tools/phone-number-survival-guide/ URL. Do NOT launch country/keyword landing-page batches, convert HOLD into recommendations, start registrations/accounts, rebuild the backend, introduce paid APIs, auto-translate the entire site or turn GA4 repair into a blocker for non-tracking usability testing.

Main data checkpoint at decision: 160 canonical research routes / 87 markets / 896 sources; 135 historical deep comparisons; 3 explicit indexable route URLs; 31 sitemap URLs; 153 long-term finder routes across 83 markets. Research coverage does not imply all offers are current, purchasable, or verified for each app. First-party Phone page GSC settled baseline as of 2026-10-09: 26 impressions / 0 clicks through 2026-10-05; this is *search visibility*, not visitors or task completion.

**Measurement correction dependency:** docs-only PR #449 is open and blocked by Vercel free deployment quota. The build adds GA4 to final HTML even though source templates do not contain the loader. Property 553896884 linkage to the deployed G-FYKKNKRE58 measurement ID and genuine collection remain UNKNOWN; its existing privacy/consent gap needs separate review. Do not infer traffic, visitor language, or zero visitors from empty connector reads. This decision is independent of the GA4 fix, and later merges must reconcile PR #449 rather than silently overwriting its corrections.

## 2. Market: segment by job, not by presumed language share

- **P0 product-validation job:** a user physically in mainland China wants a **long-lived foreign/HK/Macau real mobile number**, might need Telegram/WhatsApp or ordinary inbound roaming SMS, and must be told if remote purchase, first activation, KYC, eSIM, payment and SMS compatibility are actually evidenced. This is a testable scenario, not a claim that Chinese users constitute a majority.
- **P1 adjacent validation job:** a US number owner now living abroad wants to **retain or port** the existing real number cheaply and keep bank short-code SMS / Wi-Fi Calling. This is materially different from buying a new number; do not show "buy this SIM" as an answer to "port my existing number" without portability/first-activation evidence.
- **P2 hold:** generic travel data eSIM, temporary/shared activation numbers and unspecified "verification success" remain separate route families and risk classes. Do not fold data-only into "real phone number" offers.
- **Language policy:** existing customer-facing site copy stays English under project rule. Recruit/inspect authentic Chinese and English community job examples, but do not create new /zh/ SEO routes or extrapolate language market percentages from a keyword volume or forum-post count. An explicit limited bilingual UI experiment would need a separate decision and measurement gate.

Evidence examples (competitive and audience signals, NOT representative population sizes):
- https://esim.ren/keep-number : independent Chinese keep-number comparison includes number origin, annual keep price, eSIM and mainland-SMS notes.
- https://haiwaibiaoju.com/compare/keep-number/ : independent Chinese table includes costs, SMS claims and route failure/continuity warnings.
- https://www.reddit.com/r/NoContract/comments/1w909vu/already_living_abroad_need_a_us_number_to_stay/ : Sep 2026 overseas US-number owner explicitly needs remote port/eSIM activation, US bank 2FA and lower monthly cost.
- https://www.reddit.com/r/NoContract/comments/1tpjbwu/advice_for_keeping_usa_number_active_while_abroad/ : May 2026 number-preservation cost and banking-use question.

**Defensibility test:** official carrier pricing alone and an ordinary cheap-SIM table are substitutable. The advantage, if proven, is reconciled **route × user location × setup feasibility × exact service/operation × continuity** evidence with visible source freshness, uncertainty and no-match explanations. Review this claim against strongest competitors after the pilot; stop investment if it proves materially substitutable.

## 3. MVP product contract — one existing URL, one task, no mandatory wizard

**MVP user job:** Acquire a real long-term number *for use outside the number country*. A separate "Keep my existing number" entry remains an honest guidance/constraint state until route-specific port/retention eligibility is evidenced; do not pretend the acquisition matcher also solves portability.

**At first screen (no forced questionnaire):**
1. Display 3–5 evidence-eligible starting options or an honest zero-result state immediately; expose three plainly explained intent shortcuts: **Buy new / Keep existing / Verify an account**.
2. Allow optional compact filters to refine those cards: **number origin/market**, **real-mobile only**, **eSIM preference**, **known acquisition and annual keep cost**, and **target app/service evidence** with exact operation. "Using/activating from mainland China" is a separate feasibility dimension, **not** interchangeable with number origin or ability to roam for data.
3. Output each candidate's number origin and number class, quoted first payment/annual keep action and intervals where normalized, last review date, KYC/foreign payment requirements, and specific observed app SMS results or **Unverified**. Avoid an invented universal reliability score/guarantee.
4. Label each rule distinctly: **Confirmed fit / Conditional fit / Insufficient evidence / Not eligible**. Conditional fit needs a short blocking requirement; unknown is never silently interpreted as yes. When no candidate can meet mandatory constraints, show **No verified matches** and which requirements are unverified rather than expanding to HOLD.
5. Preserve the existing 2–4 item pin-to-compare view, route evidence/guide, mobile responsive behavior, and research browse access. Later "Save for later" may use device-local route IDs only, reversible and privacy-reviewed. Not needed to block the first MVP.

**No-go scope:** no login/signup, personal SMS/OTP entry or collection, third-party OTP test automation, phone-number resale, stock/activation guarantees, one-time SMS platform upsell as a durable number, user-submitted personal data, generic chat bot, new paid API/server/database tables, bulk SEO routes or sitewide UI rewrite.

## 4. Data truth and implementation boundaries (read before coding)

Actual canonical summary fields from scripts/build-phone-database.mjs include: id/displayName/marketName/countryCode/family/numberClass/form/surfaceState/evidenceState/lastVerifiedAt; metrics acquisitionCostOriginal, acquisitionCostCny, keepYearCostOriginal, keepYearCostCny, keepIntervalDays, currency; decisionFacts sourceCount, kycState, keepAction, roamingSms (TEXT), holdReason, continuityRiskSignalCount/lastContinuityRiskSignalAt; serviceEvidence serviceId/serviceName, **operation**, grade, sampleSize, independentSourceCount, success/failure/mixed and lastObservedAt.

**Hard-filterable today:** family, numberClass, form/eSIM (after checking actual enumeration), market/country, evidenceState/surfaceState, known numeric cost ceilings, and service+operation existence/grade (do NOT equate existence with guaranteed success).

**Not proven as normalized booleans:** mainland-China first-activation, exact user location feasibility, foreign buyer address/payment acceptance, bank-specific short-code delivery, phone-number port-in/port-out, current stock. These are currently partly free-text/research snapshots. Do NOT parse arbitrary narrative into "compatible=true" via keywords or approximate them from ordinary roaming SMS. Mark unknown and link the evidence details. If a useful small reviewed mapping is needed, it must be deterministic, dated, source-linked and fail-closed, and scoped to the first test cohort—not a speculative global schema expansion.

Recommendation gate: family=long-term + numberClass=real-mobile + evidenceState=admitted + surfaceState eligible for user-visible recommendation. HOLD, needs-reconciliation, database/backstage-only and temporary/VoIP/data-only must never appear as recommended winners. Backstage/HOLD may remain separately inspectable research with unmissable status. Missing price must not be ranked as free or cheapest.

**Cost accounting:** first payment, recurring subscription, recharge/top-up spending, periodic action and true first-year cost are different. Never add an acquisition fee and required top-up twice; calculate first-year total only when schedule and amounts are documented. Use comparable source-modeled CNY solely where currently available, maintain original currency and date.

**Technical boundaries:** reuse canonical generated phone-route-summaries.json, lazy phone-route-data/<id>.json, the existing HTML/JS route rendering, and existing publication checks. Frontend first; no new backend/persistence if static client-side filtering suffices. Review page cost, speed and accessible mobile layout. Route ID-only local bookmark may be evaluated separately; never store submitted SMS/app account information. Keep existing GA4 code unchanged pending consent/privacy approval.

## 5. Next three execution gates (each a separate bounded PR/session)

**S1 — data readiness and deterministic filter contract (NEXT):**
- Inspect real published/generated route field domains, existing eligible shortlist and 10 scenario fixtures (at least 5 P0, 3 P1 "must refuse to overclaim porting", 2 negative/unknown); do not invent "10 ready-to-buy numbers."
- Produce an executable filter/spec contract and regression assertions showing which constraints are supported, unsupported, and subject to user-visible "Unverified".
- Result: one narrow contract/test PR; if fewer than three genuinely eligible options exist for the P0 task, narrow the UI pilot to "evidence-guided shortlist" with honest no-match rather than creating fake winners. No new site page.

**S2 — frontend task-first pilot (conditional on S1, separate PR):**
- A small optional filter bar and task shortcuts on the existing URL; show a few candidates, eligibility explanation, known costs, latest independent incident and action/guide.
- Respect original Browse/Compare controls and user state. No new SEO page, database schema, auth, server, or GA4 behavior changes.
- Test unit/property invariants, hold/backstage isolation, zero/unknown path, XSS escaping, responsive 375/390px and keyboard interactions, performance budget (no new network dependency; keep first-load payload bounded).

**S3 — real user-task validation (after verifiable preview/live release):**
- At least 10 dated publicly evidenced task scenarios; independently review expected result/unknown reasons. Acceptance target **>=8/10 correctly answered or explicitly unresolvable without false promise, 0 false app/remote-activation/portability guarantees**, no HOLD/backstage winner.
- When feasible, run 5 explicitly voluntary untracked usability sessions spanning P0/P1. Measure task success and time to a defensible shortlist; **30-second first useful result is a design target, not a pre-claimed observed metric**. Record methods and failures without personal account information.
- If testers cannot find a legitimate route in the verified corpus, refine evidence/feasibility model or stop the pilot; do not manufacture a recommendation.

Release protocol: fresh branch → local build + phone:data:check + Phone public-release audit + tests → PR → exact-head GitHub Eval/CI + Vercel READY Preview → merge → exact-merge production READY + independent live HTTP/mobile verification → update GitHub checkpoint/queue/journal. **Existing Vercel free deployment-day rate limit is a release blocker. Do not pay/upgrade or bypass gates; a successful GitHub CI alone is not a product release.**

## 6. Operating cadence and accountability

Operator/decision owner (this assistant with GitHub fact verification): select one highest-leverage task per session; enforce user-outcome and cost gates; reconcile the work with main, review evidence, control PR/SEO/release, and publish truthful weekly decision records. Cannot claim future unscheduled background work or real-world user feedback unless collected.

Research lane: only an already-authorized observer/Qwen/Kimi worker with verified availability may gather bounded dated forum outcomes, provenance, contradictory reports and provider policy changes. Output is RESEARCH CANDIDATE until reviewed; there is **no newly launched parallel agent** by this document. No unique data on trial VPS.

Product lane: one PR per bounded change; preserve existing canonical/route IDs/aliases and the no-index boundary. Re-run smallest relevant automated regression. Fix "unknown" pathways before adding options.

Growth lane: each review first look at official GSC settled **Phone URL and queries**, distinguishing branded/nonbranded and intent mismatch; separately log genuine community referral/direct/AI referral if measurement becomes available. Do not call a forum view a Google organic click. Ethical forum participation only when genuinely answering the user's question; no bulk promotion, synthetic backlinks, hidden keywords or invented testimonials.

Maintenance lane: prioritize live dangerous errors (expired price, wrong first activation, false OTP/continuity assertion, broken guide) before new route admissions. Refresh high-intent/high-risk claims on a date/incident signal; not a mandatory daily manual sweep of 160 records.

## 7. Decision dashboard, thresholds and stop rules

**Leading quality indicators (available without surveillance):** scenario answer quality, no-match clarity, route evidence freshness, number of correct conditional warnings, eligible candidate count and mobile task success. Maintain baseline and post-change observations with dates; no invented percentages.

**Organic metrics (once settled data exists):** Phone impressions/clicks/CTR/query/position, by URL; compare matched intent and SERP snippet/first-screen message. 26 settled impressions / 0 clicks is too thin for broad SEO or a language-share conclusion. Organic, community/referral, AI referral, direct/repeat and paid must be kept separate.

**Behavior measurement:** currently GA4 is present in build but property/collection/consent are unresolved. Do not assume any interaction numbers. Privacy-compliant consent/analytics changes require a separate gate. Use qualitative tests first.

**Success to advance:** no unsupported hard-match claims, >=8/10 fixture answers or appropriate refusal, usable mobile workflow, distinct advantage versus two strongest comparison alternatives, stable existing URL and public SEO boundaries. Only then invest more engineering in a second real task.

**Failure/stop:** meaningful peer comparator already matches the narrow user job at equal/better quality; insufficient evidence for legitimate recommendations; task users cannot identify a useful answer even after usability iteration; repeated false positives; or new tracking/backend/paid cost needed just to render static comparisons. In these cases keep site stable, repair evidence/focus, or downgrade product; do not mass-produce pages to simulate growth.

**Monetization:** AdSense is downstream of trusted organic utility. No insertion of ads into the decision critical path, no paid provider purchase/billing modification, no revenue projections from unverified traffic. New marginal operating costs for the initial MVP target **zero** beyond current build infrastructure.

## 8. Release dependencies and explicit first move

- **PR #449:** contains factual correction to previous GA4 absence claim, but is not merged due Vercel quota. It is a separate documentation release dependency; avoid replacing it with misleading stale claims and reconcile overlapping files on merge.
- **This operator plan PR:** documentation-only decision, does not modify the Phone frontend or database, and has no production acceptance until its own CI/Preview/merge gates pass.
- **First eligible task after adopting this plan:** S1 — validate the first-use-case eligible route cohort and supported filter dimensions against the actual canonical export, write executable contract tests and a no-match/unknown example. Do not begin S2 without S1.
