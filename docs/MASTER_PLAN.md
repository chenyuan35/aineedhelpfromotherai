# Master Plan — Traffic Utility Site

Last updated: 2026-10-08

This is the project-wide progress board. `PROJECT_CONTEXT.md` answers what is true now; this file answers where the project is going and what comes next. `docs/OPERATING_WORKFLOW.md` defines execution.

## North-star goal

Build `aineedhelpfromotherai.com` into a low-cost utility site that earns small, stable AdSense revenue from organic traffic. The business floor is enough useful traffic/revenue to cover the annual domain cost; the first practical monetization target remains about RMB 100/month, then scale only what proves demand and defensible user value.

## Strategic correction — 2026-09-23

Product selection requires two substitution tests before search volume, SEO opportunity or implementation effort matter:

1. **Official-source gate:** why can the user not solve the job adequately from the provider's own page/account UI or one ordinary search?
2. **Independent-competitor gate:** why should the user use us instead of the strongest existing independent product already solving the same job?

A candidate advances only when the project can state a concrete durable advantage: information asymmetry, uncertainty reduction, aggregation, monitoring/freshness, meaningful computation, proprietary history, decision-cost reduction, or a narrower workflow solved materially better than incumbents.

Evidence and decisions: `docs/PRODUCT_VALUE_GATE.md` and `docs/PRODUCT_DIRECTION_RESET_2026-09-23.md`.

## Phone operating correction — 2026-09-24, architecture enforcement — 2026-09-28

The UK matrix was the first public baseline, and backstage evidence acquisition continues independently of Search Console. PR #261 separates broad database coverage from public/indexable page coverage; PR #263 makes legacy comparison-database admission explicit. Reviewed migrations through DB-C23 plus the bounded 2026-10-04 Saily, LuckySIM and China Telecom Macau residual admissions plus the bounded 2026-10-05 Red Pocket eBay product split now place canonical v1 at **160 routes / 87 markets / 157 brands / 117 networks / 754 sources**, and `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md` now measures this as **160/160 = 100% of the current known evidence-qualified relevant low-cost/long-term atomic route universe**. This percentage is not a census of every worldwide carrier SKU. PR #370 (`46ac86e04e97f67d7a6fb3f9e1cf700fa237197a`) established the generated lightweight-summary plus lazy-detail finder path; that path now carries all 160 canonical rows. The deeper historical comparison artifact remains 135 routes, explicit indexability remains 3 routes, and the sitemap remains 31 URLs. Database admission/user queryability/publication remain enforced as separate layers.

The active operating model is defined in `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md` and `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`:

- the existing Phone canonical remains the visual index/comparison surface;
- a lightweight community observer continuously finds current route outcomes, service-specific compatibility, acquisition channels, seller/platform incidents and candidate public domains;
- a separate reviewed-source observer monitors only explicitly accepted public official/commercial URLs for changing provider-controlled facts;
- observations are deduplicated/reconciled into normalized route events and snapshots before publication;
- separate route detail pages are allowed only when they have substantial route-specific execution value and evidence; country/provider keyword doorway families remain prohibited;
- production measurement hold means avoid public churn, not stop research.
- admitted normalized routes may power the comparison/search UI without receiving standalone URLs;
- route/market/keep-alive detail generation and sitemap inclusion require explicit publication state;
- the directory uses a deferred shallow comparison index rather than embedding the full route database in initial HTML.

## Product hierarchy

### 1. Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT

Canonical: `/tools/phone-number-survival-guide/`.

Core user job:

> See, in one visual directory, what a real number route actually costs to obtain and maintain, what services it currently works with, how stable the number is, and exactly how to get it—without reading fragmented forum threads first.

Defensible value comes from current independent community outcomes, cheap acquisition paths, discounts, true landed cost, keep-alive methods, app compatibility observations, seller/platform outcomes, route history and reconciliation across fragmented reports.

The UK pilot exposes Vodafone UK / VOXI / Lebara UK / O2 / Giffgaff groupings, dense comparison fields, evidence-gated service observations and detailed guide flow. Data SIM/eSIM and Temporary SMS remain separate top-level families.

Do not create country/provider doorway pages. Improve the index first; create an evidence-rich route detail page only when it solves a distinct execution job beyond the index row and passes the publication gate.

### 2. AI Reset Radar — FROZEN / VALUE-REVIEWED PORTFOLIO

No new generic reset pages and no Cursor-first optimization.

Current classifications:

- Cursor Usage Reset — **DOWNGRADE**;
- Claude Code Limit Reset — **REPURPOSE**;
- GitHub Copilot Credits Reset — **KEEP / DIFFERENTIATE**;
- Manus Credits Reset — **DOWNGRADE**;
- Replit Usage Reset — **DOWNGRADE**;
- Bolt Tokens Reset — **REPURPOSE**;
- AI Credit Burn Rate Calculator — **KEEP / DIFFERENTIATE**.

Codex demand is real, but generic Codex reset tracking is already served by multiple mature independent trackers. Do not build a generic Codex reset radar/history/countdown clone. Future Codex work is research-only until a narrower non-duplicative user job is proven.

### 3. Relay Exit Risk — DATA-ACCRUAL EXPERIMENT

Preserve the accepted methodology and production surface. Continue legitimate historical snapshots/lifecycle accumulation. Direct search demand has not yet been demonstrated, so do not prioritize search-led feature expansion.

### Existing generic utilities — MAINTENANCE ONLY

Keep passing utilities stable. Do not expand merely because a calculator is cheap to build.

## Phase board

| Phase | Goal | Status | Exit gate |
|---|---|---|---|
| P0 Foundation | Stable static site, safe deploy flow, durable handoff | DONE | Completed |
| P1 Initial tool inventory | Establish first useful portfolio | DONE | Completed |
| P2 Discovery & indexing | Make current cohort discoverable/indexed | DONE | Completed |
| P3 First search signals | Obtain real page/query evidence | DONE | Completed |
| P4 Product-direction correction | Reject weak/commodity product jobs and choose a defensible growth surface | **DONE** | Product hierarchy and dual substitution gates accepted |
| P5 Phone canonical growth | Turn the existing Phone canonical into the accepted carrier/number directory and comparison matrix | **DONE — UK PILOT SHIPPED / PRODUCTION VERIFIED** | PR #203 merged; Eval #693 passed; Vercel production succeeded; live canonical verified HTTP 200 with grouped UK matrix + guide flow |
| P6 Phone evidence-gated depth | Continuously acquire evidence; deepen only routes/surfaces that survive value + competition gates | **ACTIVE — LAYERED PUBLICATION + EXPLICIT INTAKE GATES ENFORCED** | Broad maintained database + explicit admission/publication gates + measurable user/search value before further standalone URL expansion |
| P7 Distribution, authority & AI discovery | Earn relevant referral/link/citation visibility | ACTIVE PILOT | At least one repeatable relevant source plus measurable visibility |
| P8 Monetization | Turn useful traffic into stable AdSense/partner revenue without compromising trust | QUEUED | Cover annual domain cost, then first ~RMB 100/month target |

## Current sprint

Historical batch detail remains in Git history, PRs and `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`; this section tracks only the active project edge.

1. **DONE — product direction, publication architecture and Phone-first frontend identity.** The product/value gates, layered publication states, global finder, decision shortcuts and Phone-first homepage/hub are released.
2. **DONE — broad canonical database coverage.** DB-C21 through DB-C23 plus the bounded Saily, LuckySIM and China Telecom Macau residual admissions plus the bounded Red Pocket eBay split leave canonical at **160 routes / 87 markets / 157 brands / 117 networks / 754 sources** and **160/160 of the current known evidence-qualified relevant atomic route universe**. This is not a global carrier census; broad directory enumeration remains stopped.
3. **DONE — canonical backend ↔ user finder integration.** PR #370 established generated `phone-route-summaries.json` plus lazy `phone-route-data/<id>.json`; the same path now carries all 160 canonical rows, keeps HOLD/needs-reconciliation visibly uncertain and non-recommended, and preserves **135 comparison / 3 indexable / 31 sitemap**.
4. **DONE — evidence-gated Top decision layer.** PR #388 / `f171726bde05245bc41c284d718ab32a64298f40` derives low-cost/retention/app-evidence decision shortcuts from normalized Phone data on the existing canonical URL. HOLD/backstage rows cannot win; success percentages require >=5 deduplicated observations from >=5 distinct source records; no arbitrary safety score or new SEO URL was introduced.
5. **PARALLEL — evidence-density maintenance.** ClubSIM and Ultra now have threshold-qualified Telegram samples; H2O, Tello, KPN, Three UK, Telia Estonia and ALDI TALK have route-level lifecycle/continuity maintenance without invented percentages. Red Pocket now has a reviewed atomic split: website Essentials remains $80-first-year/$110-renewal, while the separate official eBay Starter Plan is $30/360 days and remains backstage-only. The Tello pass also corrects its lowest documented PAYG-only retention path to US$10 top-ups every 90 days after the initial purchase, while preserving the U.S.-first activation/roaming boundary. KPN now reflects €4.99 physical-SIM acquisition, €0.15/SMS, the 6-month use + 90-day rescue rule, and Netherlands-first activation. Three UK now reflects the current £10 minimum new-SIM/Data-Pack acquisition path, 15p/SMS, the 180-day chargeable-activity rule, PAYG eSIM support and UK-first roaming provisioning. Telia Estonia Super now reflects €1 starter acquisition, physical + eSIM Estonia-only activation, the single €3/180-day top-up rule, 30-day rescue window and roaming enablement boundary. ALDI TALK now preserves the regular €9.99 starter price separately from the temporary €2.99 promotion, confirms the 12-month initial / top-up-window / two-month rescue lifecycle, and records the provider eSIM-documentation conflict plus roaming/KYC boundaries. Hotlink Pantas now preserves the RM30/365-day keep pass only for eligible non-tourist lines, normalizes a conservative RM12 current setup path (RM10 starter baseline + RM2 plan change), records the hard 90-day tourist lifecycle exclusion, and downgrades foreign long-term guidance until tourist classification and roaming-SMS continuity are resolved. FarEasTone now reconfirms NT$300 acquisition, NT$100/180-day minimum recharge, Taiwan in-store activation, two-ID registration and prepaid eSIM support, while separating tourist products and withholding overseas-China OTP guidance until exact regular-prepaid applicability is established. TIM now reconfirms the 12-month full-service + month-13 receive-only lifecycle, the 11-month recovery window, current €5 Ricarica+ retention action, €10 SIM baseline and physical/eSIM support, while withholding offshore/non-resident and mainland-China OTP guidance where current consumer evidence is insufficient. Taiwan Mobile now records the NT$300 regular-prepaid baseline, NT$100/180-day recharge path, physical/eSIM support, foreign short-term-versus-regular eligibility boundary, and explicit China ordinary incoming-SMS entitlement without overstating bank/app OTP reliability. 1pMobile now separates its current £5 signup promotion from the durable £10 initial-credit baseline, models the post-1-August-2026 £10/90-day rule as a spend/use commitment rather than a forced manual top-up, and records provider-supported long-term non-EU eSIM/SMS/OTP continuity without manufacturing destination/app success rates. Mobal now reflects the current Voice Lite successor at ¥4,950 + ¥990/month, removes the obsolete Voice-Only ¥1,430/month profile and, critically, removes overseas-SMS/Wi-Fi-Calling assumptions because current Voice Lite is Japan-only. LABAS now separates current €1 direct eSIM entry from the €3/90-day retention top-up, reconfirms the 120-day hard number-loss boundary, records country-agnostic online biometric registration while preserving the foreign-activation restriction, and treats ordinary roaming SMS including China as provider capability rather than OTP proof. Wasel now reflects the current AED40-with-AED40-credit online entry, exact 90-day qualifying-activity lifecycle, AED10/90-day inactivity fallback, one-year post-suspension number-retention window, Emirates-ID/Visitor-Line eligibility boundary, UAE-presence eSIM activation requirement, and free incoming roaming SMS while withholding any mainland-China bank/app success rate. CMHK 4G MySIM now reflects the HK$38 current retail baseline, HK$50/180-day documented retention path with an explicit current-rule/standing-ladder distinction, physical-to-eSIM conversion support, the June-2026 Mainland-China first-activation block, current RNR/passport boundary and thin/adjacent roaming-SMS evidence without an invented OTP rate. MTN Nigeria Keep My Number now preserves the current NGN3,500/5,000/7,500 retention ladder, the 2026 NCC six-month RGE + line-parking framework alongside MTN's separate 365-day term, store-gated eSIM activation, visitor passport/visa registration, China roaming capability without an OTP guarantee, and a 2026 independent reassignment incident as continuity risk. Continue one-route-at-a-time evidence maintenance and separate Data-eSIM intake; re-open a DB batch only for a genuinely new evidence-qualified atomic route.
6. **WAIT — Phone Search Console publication decision.** Do not launch another public page wave until settled Phone impressions reach 20 or finalized data reaches 2026-10-05, whichever comes first.
7. **ONGOING — Relay data accrual.** No search-led expansion without evidence.
8. **WAIT — TikTok advanced Direct Post review.** Do not resubmit unless TikTok rejects or requests new evidence. Authority batch 2 remains waiting.

## Phone directory implementation contract

Status: **SHIPPED 2026-09-23 via PR #203 (`084de00f`)**.

Source of truth: `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md`.

Implemented MVP rules:

- preserved `/tools/phone-number-survival-guide/`;
- preserved the three top-level families;
- Long-term SMS/OTP now renders a grouped UK country/network/brand/route matrix;
- desktop uses a compact comparison matrix with horizontal access to dense metrics;
- mobile uses compact grouped cards from the same normalized data;
- shows landed acquisition cost, approximate CNY cost when supported, yearly keep cost/action, activation/KYC/Wi-Fi Calling/roaming state, service-specific evidence, continuity events, refund/recovery state, trend, sample count and freshness;
- provides detailed in-page guides;
- uses a small UK pilot first rather than weak global bulk-fill;
- no arbitrary 0–100 Phone risk score;
- observed success percentages require visible sample size/date and at least five reasonably independent recent route+service+operation observations;
- missing data remains missing and cannot improve rank;
- community/forum evidence drives operational claims; provider pages provide commercial metadata.

The current UK packet does not meet the `n >= 5` threshold for displayed app route+service+operation percentages, so the release shows counts/qualitative states rather than fabricated percentages.

## Phone evidence pipeline

The durable flow is:

`public community feeds / reviewed public sources → candidate observations → dedupe + provenance review → normalized route events/snapshots → index aggregates → optional evidence-rich route detail page`

Community watcher v1.1 captures bounded discovery metadata rather than full posts, including service tags, acquisition/seller/refund risk flags and externally linked public hostnames. Those hostnames are candidates for later review, not permission for automatic crawling.

The reviewed-source watcher checks only explicitly accepted public URLs with robots checks, sequential low-rate requests, conditional requests where available and separate source-health/error classification.

Observer workloads are not production infrastructure. The verified trial host and any future second observer are disposable by default; valuable normalized evidence must not remain uniquely on either host.

## Route detail page gate

A separate route URL may be created only when all of the following are true:

- route identity and acquisition path are unambiguous;
- current provider-controlled commercial facts have a current source;
- at least two useful independent operational evidence items exist, or one unusually detailed first-hand reproduction plus an independent corroborating signal;
- the page solves a real acquisition/activation/compatibility/retention/recovery job beyond the index row;
- freshness and unresolved conflicts are visible;
- the page survives the official-source and independent-competitor substitution gates.

No country/provider keyword page is created merely for coverage or SEO.

## Measurement rules

- Search Console is a distribution signal after a product passes value/competition gates; it is not the product selector.
- Backstage evidence acquisition continues even when public production is held for measurement.
- A known product-model defect should be corrected before waiting for GSC to validate the wrong interface.
- High impressions with weak/no clicks may indicate weak SERP fit, weak user job, or both; diagnose before snippet-only rewrites.
- Clicks with weak tool usage should lead to existing-canonical UX/value improvements based on interaction evidence.
- Google organic, social/referral, AI referral and direct/repeat behavior remain separate.
- Windsor.ai `searchconsole` is the current Search Console path; GSC Wizard is deprecated/exhausted. Fall back to official Search Console API/export if Windsor becomes unavailable.
- Monetization work waits for meaningful traffic, but the business floor is eventual coverage of annual domain cost.

## Decision rules

- Every new product, expansion and winner-optimization task must pass `docs/PRODUCT_VALUE_GATE.md`.
- Do not build a wrapper around official documentation.
- Do not build a clone of a mature independent product without a specific user-visible advantage.
- Search volume cannot rescue a weak or commoditized user job.
- Existing pages are not grandfathered in because development effort has already been spent.
- Phone operational reality comes from current independent user/community outcomes and route history.
- Operator/provider pages serve commercial metadata by default, not operational certification.
- One clear user task per page; avoid thin/near-duplicate/keyword doorway pages.
- Missing data lowers confidence; do not fabricate certainty.
- No fake OTP percentages, arbitrary Phone risk scores, Relay shutdown probabilities or fake calibration claims.
- Public seller/marketplace evidence can establish price/acquisition/failure/refund signals, but do not bypass access controls or teach moderation evasion.
- Keep AI discovery non-adversarial and provider blockers explicit.

## External waits

### TikTok App Review

Status: **BASE APP LIVE / DIRECT POST ADVANCED REQUEST RESUBMITTED — WAITING**. On 2026-10-02 the repaired production `SELF_ONLY` flow completed a real post, the creator profile showed the media, and the Content Posting API reapplication was submitted with a 28-second real-flow demo. The portal states review may take approximately 2–4 weeks. Do not claim approval and do not submit again unless TikTok rejects or requests new evidence.

### Authority batch 2

Status: **SENT / WAITING**. Learn Cursor + explainx.ai were sent 2026-09-22. Do not add a third target or follow up before 2026-09-29 or later. Verify original Gmail threads and public links before any follow-up.

## Tool/provider blockers

- Ubersuggest: Sep 23 live evidence collected, then daily report quota exhausted; do not rotate accounts or upgrade without authorization.
- Ahrefs: current API access returned `Insufficient plan`.
- Semrush: current connector returned `no_api_units`.
- Phone observer access is restored through Qwen's existing dedicated trial-backup key after live host-key verification. The Sep 25 audit/deploy closed the authentication blocker and verified watcher v1.1 runtime. RDC's persisted session is independently invalid and remains unenrolled; this is not a current Phone watcher blocker while key-only SSH remains healthy. `codex-vps` retains its Relay-history role. The trial provider/vendor remains unverified in canonical facts.

Treat provider/access limits as blockers, not evidence failures.

## Source-of-truth map

| Need | Source |
|---|---|
| Current factual state | `PROJECT_CONTEXT.md` |
| Whole-project stage / priorities | `docs/MASTER_PLAN.md` |
| Atomic next actions | `docs/CURRENT_EXECUTION_QUEUE.md` |
| Product/competition gates | `docs/PRODUCT_VALUE_GATE.md` |
| Active Phone growth/evidence operating plan | `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md` |
| Current Phone directory/matrix contract | `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` |
| Community intelligence watcher | `docs/PHONE_DEMAND_WATCH.md` + `ops/phone-demand-watch/` |
| First watcher candidate review | `docs/PHONE_WATCHER_CANDIDATE_REVIEW_2026-09-25.md` |
| Second watcher candidate review | `docs/PHONE_WATCHER_CANDIDATE_REVIEW_BATCH2_2026-09-25.md` |
| haha SIM retention resolution | `docs/PHONE_HAHASIM_RETENTION_RESOLUTION_2026-09-25.md` |
| haha SIM activation/registration review | `docs/PHONE_HAHASIM_ACTIVATION_REVIEW_2026-09-25.md` |
| Mobal source-change reconciliation | `docs/PHONE_MOBAL_SOURCE_RECONCILIATION_2026-09-25.md` |
| Reviewed source-change watcher | `docs/PHONE_SOURCE_WATCH.md` + `ops/phone-source-watch/` |
| Canonical/comparison compatibility audit | `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md` |
| Database coverage execution | `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md` |
| Post-legacy coverage-gap audit | `docs/PHONE_POST_LEGACY_COVERAGE_GAP_AUDIT_2026-10-03.md` |
| UK Phone evidence packet | `docs/PHONE_UK_PILOT_SOURCE_PACKET_2026-09-23.md` |
| Normalized UK pilot data | `frontend/tools/phone-number-lifecycle-mvp/uk-directory-pilot.json` |
| Phone research method | `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` |
| Search performance evidence | `docs/GSC_MEASUREMENT_2026-09-22.md` + current Windsor.ai reads |
| Execution procedure | `docs/OPERATING_WORKFLOW.md` |
| Relay methodology | `docs/RELAY_RISK_METHODOLOGY.md` |
| Authority/referral | `docs/AUTHORITY_AND_AI_DISCOVERY.md` + original Gmail threads |
