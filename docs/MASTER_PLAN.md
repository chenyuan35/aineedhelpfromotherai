# Master Plan — Traffic Utility Site

Last updated: 2026-09-29

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

The UK matrix was the first public baseline, and backstage evidence acquisition continues independently of Search Console. After the global data expansion, PR #261 separates broad database coverage from public/indexable page coverage so the database can grow without recreating programmatic SEO families. PR #263 separately makes legacy comparison-database admission explicit: wildcard batch discovery is gone, existing admitted legacy batches are named in a reviewed manifest, and unlisted delegated research stays outside comparison inputs. The Sep 28 compatibility audit found canonical v1 at 15 routes with only four route-ID overlaps; staged reviewed migrations plus backend coverage batches DB-C1 through DB-C3 have since raised canonical v1 to 89 routes / 51 markets / 86 brands / 67 networks / 293 sources with 78 route-ID overlaps. Fifty-seven comparison routes remain legacy-only; the 135-route comparison surface and 3-route explicit publication boundary remain unchanged.

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

1. **DONE — Product direction reset.** Search volume/ranking are no longer allowed to choose the product by themselves.
2. **DONE — Reset-family product-value audit.** Seven pages classified; no impulsive deletion/redirect.
3. **DONE — Competition gate added.** Mature independent competitors are a hard substitution test before implementation.
4. **DONE — Phone same-URL source-role correction.** PR #198 corrected homepage + existing Phone canonical framing and exposed more practical route evidence.
5. **DONE — Phone carrier-directory product correction.** `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` fixed the hierarchy, matrix fields, ranking/evidence rules, cost model and guide contract.
6. **DONE — UK pilot implementation/release.** PR #203 shipped the bounded UK matrix/mobile implementation on the existing canonical. Eval Gate #693 passed; Vercel Preview/production status succeeded; forced live production fetch returned HTTP 200 and confirmed the matrix, guide, and unchanged Data/Temporary families.
7. **DONE — Phone community watcher v1.1 repository upgrade.** PR #211 added hourly bounded structured intelligence, candidate history, regression coverage and source-role documentation; Eval Gate #709 passed; squash merge `3204ee0be13411c146e1031bbf13a094949f679f`.
8. **ONGOING BACKGROUND — Re-measure Phone without public churn.** Windsor.ai Search Console is the current reader. The first full finalized decision read (2026-09-16..2026-09-23) returned 3 page impressions, 0 clicks and weighted average position 12.0; only `survival number` is exposed at query level (1 impression / position 22). Decision is **KEEP** because the sample is too small for public churn.
9. **DONE — trial observer access recovery + v1.1 runtime deployment.** Qwen's existing dedicated key authenticates to the original host; read-only audit found intact watcher state, no OOM, and a 100%-full root filesystem causing false-success write errors. After off-host backup and deletion of one unused 196 MB Chrome ZIP, disk fell to 82%; main's v1.1 was deployed and a real run completed 4/4 sources HTTP 200, `matched=25`, `candidate_total=6`, 19.3 MiB peak, with the hourly timer active. RDC remains unenrolled because its persisted refresh token is invalid, but SSH control is restored.
10. **DONE — first watcher v1.1 six-candidate review.** `docs/PHONE_WATCHER_CANDIDATE_REVIEW_2026-09-25.md` dispositioned all six records. Two evidence packets were promoted backstage: a Saily Switzerland data-eSIM failure/refund cluster and a Fortress haha SIM retention-price conflict. Four records were non-promotions (false-positive, insufficient, duplicate or restricted seller evidence). No public route/page changed.
11. **DONE — Fortress haha SIM retention conflict resolved.** `docs/PHONE_HAHASIM_RETENTION_RESOLUTION_2026-09-25.md` records the current product-specific rule: Fortress says `HKD 10+` balance top-up extends haha SIM validity 365 days and directs current balance top-up to the haha TRAVEL App. The generic 3HK online-recharge `HKD 100` floor does not override the haha-specific rule.
12. **DONE — haha SIM activation/real-name/onboarding admission review.** `docs/PHONE_HAHASIM_ACTIVATION_REVIEW_2026-09-25.md` maps the current official activation and real-name workflow but keeps the route `HOLD / Watch`: no sufficiently current independent end-to-end new-card reproduction was found, while 2026 app top-up failure and new-card ICCID/number-mismatch reports remain active confidence-lowering evidence. Re-open only on the document's explicit evidence trigger; do not market the route as no-KYC.
13. **DONE — watcher batch 2 + live source-health review.** `docs/PHONE_WATCHER_CANDIDATE_REVIEW_BATCH2_2026-09-25.md` dispositioned all 55 records after the first six: 2 backstage promotions (Globe Philippines; Holafly Always On), 10 insufficient/demand-only, 1 duplicate/restricted seller lead and 42 false positives. Live runtime remained healthy; the review also found 24 excess V2EX reply-fragment emissions. No public route/page changed.
14. **DONE — Mobal Japan source-change reconciliation.** `docs/PHONE_MOBAL_SOURCE_RECONCILIATION_2026-09-25.md` reconciles `mobal_pricing` and `mobal_id`. The existing Voice+Data route remains current at JPY 4,950 list price and JPY 1,650/month for 1GB; a temporary 10% sale and separate Voice-Only product do not make that route stale. Current ID semantics match accepted project facts. No production Phone data changed.
15. **DONE — watcher precision repair.** PR #225 normalized V2EX `#replyN` variants to root-thread dedupe keys; live deployment exposed a one-time legacy-hash migration edge, fixed by PR #226 using bounded historical candidate compatibility. Eval Gates #740/#742 passed, final observer verification emitted no duplicate V2EX roots, and five verified upgrade-only duplicates were removed after off-host backup.
16. **DONE — Globe Philippines eligibility / overseas-SMS packet.** `docs/PHONE_GLOBE_PHILIPPINES_ELIGIBILITY_REVIEW_2026-09-25.md` keeps Globe ordinary Prepaid at **HOLD** for general Phone Radar admission. Tourist registration remains 30-day-limited unless an approved visa extension is presented; qualifying other-visa foreign nationals can register without that temporary cap. Current retention/roaming evidence supports low-cost keep-alive and free incoming SMS abroad, including China partner coverage, but no current qualifying-foreigner end-to-end mainland-China OTP reproduction was found.
17. **DONE — Holafly Always On packet.** PR #231 (`413e6c3`) promoted it backstage as Data-eSIM only; unresolved duration/device-transfer/coverage-consistency fields and fresh 2026 independent reproduction remain re-open triggers.
18. **DONE — first settled Search Console KEEP / ADJUST / NARROW decision.** Finalized 2026-09-16..2026-09-23 data produced 3 page impressions / 0 clicks / weighted average position 12.0; decision **KEEP** because the sample is too small to justify ADJUST/NARROW.
19. **DONE — PR #233 disposition review: REWORK / Draft.** The keep-alive deadline/reminder job retains computation/repeat-use value, but the current implementation conflicts with the KEEP instruction and publication/evidence rules: obsolete bulk-expansion doc contamination, unsourced 15% safety buffer, five-URL expansion with template-heavy brand pages, assumed-today input and drifting fixed recurrence. PR #233 is Draft and must be reworked before any later eligible release review.
20. **DONE — first Kimi/Qwen provenance-admission batch.** `docs/PHONE_FIVE_ROUTE_PROVENANCE_ADMISSION_REVIEW_2026-09-26.md` classifies Tello / ClubSIM / Hotlink Pantas as ADMIT-BACKSTAGE and Globe / povo 2.0 as HOLD. Tello `$0.06/year` and Hotlink `RM2/year` were rejected as stale/wrong economics; ClubSIM keeps a current channel-availability conflict rather than a guaranteed HKD 6/year claim.
21. **DONE — PR #253 normalized Phone data foundation release.** Correct Vercel scope access was restored and the repeated Preview failure was isolated to a redundant repo-level Phone database check executed from the frontend build. The call was removed while CI retains the data/staging gates; final head `0cde866` passed Eval Gate #804, CI #151 and Vercel Preview. PR #253 squash-merged as `640341d4a79a00a688eb36bffce7cf57e4d05e27`; production reached READY and the live Phone canonical returned HTTP 200.
22. **DONE — Phone publication-state reconciliation / PR #261.** Broad global data remains usable for comparison, but standalone route/market/keep-alive details and sitemap publication now obey an explicit policy. The directory defers a lightweight comparison index; the old all-route/all-market page-count tests were replaced with boundary tests. The unsourced default 15% keep-alive buffer, assumed-today input and fixed recurring calendar reminder were also removed.
23. **DONE — Qwen/Kimi legacy comparison admission hardening / PR #263.** Both legacy merge scripts now use a reviewed `batch-admission-manifest.json` rather than wildcard file discovery. Existing admitted batch coverage and the 135-route comparison surface were preserved; an unlisted synthetic delegated batch is rejected by regression coverage. Eval Gate #859 and Vercel Preview passed; squash merge `6623b01293c9dd558ac2a9b8a274a5891a5954ea` deployed successfully and live Phone canonical + Directory returned HTTP 200.
24. **DONE — canonical-to-comparison compatibility audit.** The result is STOP / not lossless yet: canonical v1 has 15 routes / 7 markets versus 135 comparison routes / 83 route markets; only four route IDs overlap, 131 comparison routes are not canonical, only four canonical routes have rich current-profile snapshots, and 192 legacy route-source IDs are missing from canonical sources. `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md` records the gap; no public/data cutover occurred.
25. **DONE — one-route canonical migration pilot / PR #266.** `cmhk-mysim-hk-2026` now exists in canonical v1 with market/network/brand identity, explicit official + community provenance and rich current-profile data. The generic adapter reproduces the current legacy comparison row by exact deep equality; 135 comparison routes and 3 explicit indexable routes are unchanged. Eval Gate #865, CI #153 and Vercel Preview passed; squash merge `0b10801a0cfac1afa75d21ad90c51383ca9e9294`.
26. **DONE — two-route canonical repeatability pilot / PR #268.** `kpn-prepaid-6mo-2026` and `telstra-prepaid-longexpiry-2026` migrated into canonical v1 through reviewed packets; the generic adapter deep-equals both legacy comparison rows. Canonical is now 18 routes / 10 markets / 17 brands / 5 networks / 65 sources with seven comparison overlaps; 135 comparison routes and 3 explicit indexable routes are unchanged. Eval Gate #869, CI #155, Vercel Preview and production passed; squash merge `c91cfc36b8a7c141ea4d1becfb5153aa7ab26da6`.
27. **DONE — Taiwan two-route canonical migration / PR #270.** `taiwan-mobile-prepaid-tw-2026` and `fareastone-prepaid-tw-2026` migrated through reviewed packets into canonical v1. FarEasTone current official terms resolved its stale retention hold to six-month validity with NT$100 minimum communication-credit recharge; the corrected row and Taiwan Mobile both retain exact canonical-adapter parity. Canonical is now 20 routes / 11 markets / 19 brands / 7 networks / 67 sources with nine comparison overlaps; 135 comparison routes and 3 explicit indexable routes are unchanged. Eval Gate #873, CI #157, Vercel Preview and production passed; squash merge `ff52777dcc01925c5a848258bc4f39a06c16aef0`.
28. **DONE — Germany/Malaysia three-route canonical migration / PR #272.** ALDI TALK, Vodafone CallYa and Hotlink Pantas migrated through reviewed packets into canonical v1 with exact post-review adapter parity. Target-only reconciliation corrected ALDI TALK starter pricing to €9.99, CallYa Classic acquisition to free with €20/year retained as the conservative quarterly-top-up model, and Hotlink retention wording to the RM30 365-day Active Period Pass. Canonical is now 23 routes / 13 markets / 22 brands / 10 networks / 71 sources with twelve comparison overlaps; 135 comparison routes and 3 explicit indexable routes remain unchanged. Eval Gate #877, CI #159, Vercel Preview and production passed; squash merge `2fb0d6517780e90b9e5b5da17f2938b29febb079`.
29. **DONE — Hong Kong three-route canonical migration / PR #274.** ClubSIM, SoSIM and 3HK DIY migrated through reviewed packets into canonical v1 with exact post-review adapter parity. Reconciliation preserved ClubSIM’s HK$6 web-vs-app channel conflict, updated SoSIM’s current official entry/validity ladder, and removed the wrong SIM World product rule from the 3HK DIY retention model; batch source metadata now preserves exact source URLs in the rebuilt comparison artifact. Canonical is now 26 routes / 13 markets / 25 brands / 12 networks / 82 sources with fifteen comparison overlaps; 135 comparison routes and 3 explicit indexable routes remain unchanged. Eval Gate #881, CI #161, Vercel Preview and production passed; squash merge `251528d3e279e8a99b075601bb8e2742d186ba5e`.
30. **DONE — Italy/Spain/Singapore three-route canonical migration / PR #276.** TIM, Movistar and Singtel migrated through reviewed packets with exact post-review parity; TIM and Movistar current lifecycle/economics were reconciled and Singtel remained passport-only HOLD negative knowledge. Canonical reached 29 routes / 16 markets / 28 brands / 15 networks / 89 sources; comparison stayed 135 and indexability stayed 3. Eval Gate #885, CI #163, Vercel and production checks passed; squash merge `952b6d13516bbb7756078c90d0c6d4e4880e4545`.
31. **DONE — UK MNO three-route canonical migration / PR #280.** Three UK, O2 Classic and EE migrated through reviewed packets with exact post-review parity. Three was corrected to 15p SMS/GBP5 minimum top-up, O2 Classic stayed legacy-only HOLD, and EE was corrected to 20p SMS/GBP5 minimum top-up/current acquisition/physical PAYG voice SIM while preserving its 160/180/90/270 lifecycle. Canonical is now 32 routes / 16 markets / 31 brands / 17 networks / 100 sources with 21 comparison overlaps; comparison stays 135 and indexability stays 3. CI #165, Eval Gate #896, Vercel Preview/production and live 200/404 verification passed; squash merge `39b9a620b300f218785e0a9b3ca85e45a9bc5168`.
32. **DONE — US batch-A identity/provenance reconciliation + migration / PR #282.** Ultra Mobile PayGo, Tello PAYG credit and H2O PayGo migrated backstage after current source/identity reconciliation with exact adapter parity. `tello-us` monthly-plan and `tello-paygo-credit-2026` PAYG are distinct products; Tello PAYG is corrected to USD20 minimum web order / 90-day order-based expiry, Ultra PayGo to PayGo-specific physical-SIM acquisition semantics, and H2O PAYG remains HOLD because current roaming eligibility excludes PAYG. Canonical is now 35 routes / 16 markets / 33 brands / 19 networks / 112 sources with 24 comparison overlaps and 111 legacy-only routes; comparison stays 135 and indexability stays 3. CI #167, Eval Gate #900, Vercel Preview/production and live 200/404 verification passed; squash merge `a72c05b58b708be8e0b22d8bbd3640c29637c1e3`.
33. **DONE — Japan batch-B current-fact reconciliation + bounded migration.** `povo20-zero-base-2026` and distinct Mobal Voice-Only `mobal-japan-voice-2026` migrated backstage after current-fact correction with exact generic-adapter parity. Povo remains HOLD; Mobal Voice-Only stays distinct from existing Voice+Data. Legacy `sakura-mobile-voice-2026` was corrected but not duplicated because canonical `sakura-japan-voice-data` is the same underlying product; current add-only importer + ID-preserving adapter leave that legacy-ID cutover explicitly blocked without broader alias/update semantics. Canonical is 37 routes / 16 markets / 34 brands / 20 networks / 119 sources with 26 comparison overlaps and 109 legacy-only routes; comparison stays 135 and indexability stays 3.
34. **DONE — NZ/Thailand batch-D current-fact reconciliation + bounded migration.** Skinny, 2degrees and AIS SIM2Fly migrated backstage as explicit HOLD routes after current first-party reconciliation with exact generic-adapter parity. Skinny now uses the direct NZ$5/12-month rule plus NZ-first activation; 2degrees uses the current NZ$10/365-day rule while overseas-first activation remains unproven; AIS removes the passport-free claim and preserves registration, >60-day continuous-roaming risk and unresolved minimum post-package retention cost. Canonical is 40 routes / 18 markets / 37 brands / 23 networks / 133 sources with 29 comparison overlaps and 106 legacy-only routes; comparison stays 135 and indexability stays 3.
35. **DONE — CA/FR/CH/MX/IN batch-I current-fact reconciliation + bounded migration.** SpeakOut, Telcel Amigo, Jio Prepaid, Orange Mobicarte and Sunrise Prepaid migrated backstage as HOLD routes with exact generic-adapter parity. Current-fact reconciliation replaced stale retention assumptions with the current plan/365-day/Automatic Number Retention/six-month/17-month rules respectively. Canonical is 45 routes / 23 markets / 42 brands / 28 networks / 156 sources with 34 comparison overlaps and 101 legacy-only routes; comparison stays 135 and indexability stays 3.
36. **DONE — PH/TR/AE/VN batch-J current-fact reconciliation + bounded migration.** Globe, Turkcell Tourist, du and Viettel VTVANG migrated backstage as HOLD routes with exact generic-adapter parity. Globe is corrected to the 30-day foreign-tourist registration cap; Turkcell explicitly records that the old fixed 90-day passport/YKN blocker was repealed in 2026 while current long-term retention remains unverified; du uses the current 90-day Tourist SIM + documented AED5 extension path without extrapolating indefinite retention; Viettel VTVANG uses current specialist-reported VND50,000/12-month economics with first-party product/foreigner eligibility still unresolved. Canonical is 49 routes / 27 markets / 46 brands / 32 networks / 167 sources with 38 comparison overlaps and 97 legacy-only routes; comparison stays 135 and indexability stays 3.
37. **DONE — IE/PL/PT/HR batch-K current-fact reconciliation + bounded migration.** Three IE, Orange PL, Vodafone Yorn and A1 HR migrated backstage as HOLD routes with exact generic-adapter parity after current-fact reconciliation. Three withdraws the old EUR0.30/year 80-day recommendation because current provider materials conflict; Orange uses the current PLN39/+365-day validity extension; Yorn preserves the weekly-cost / seven-day-unpaid incoming-call/SMS blocker; A1 preserves current EUR3 SIM / EUR5 minimum voucher / remote payment / passport-registration facts while leaving voucher validity duration unresolved. Canonical is 53 routes / 30 markets / 50 brands / 36 networks / 182 sources with 42 comparison overlaps and 93 legacy-only routes; comparison stays 135 and indexability stays 3. Named A–K batch migration is now dispositioned; only the known Sakura same-product legacy-ID blocker lacks a same-ID canonical row.
38. **DONE — post-A–K Phone checkpoint + bounded public move.** PR #291 shipped the existing Phone hub as a progressive global finder over the admitted 135-route comparison layer while preserving only 3 explicit indexable routes. Search Console remained too small to justify route-page expansion, so backend coverage and public publication were explicitly separated.
39. **DONE — backend database coverage DB-C1.** Twelve legacy-only candidates were independently dispositioned and normalized through reviewed packets, raising canonical coverage to 65 routes / 42 markets / 230 sources while keeping the 135-route comparison surface and 3-route publication boundary unchanged.
40. **DONE — backend database coverage DB-C2 / PR #303.** Twelve more legacy-only routes were researched, sample-audited and normalized; canonical coverage is now 77 routes / 47 markets / 74 brands / 59 networks / 264 sources, with 66 comparison↔canonical route-ID overlaps and 69 comparison routes still legacy-only. PR #303 squash-merged as `11177dd8d1e316e0069dcc5f78203d4af7da60dd`; Eval Gate #945 and Vercel Preview/production passed, and publication remains 135 comparison routes / 3 explicit indexable routes.
41. **DONE — backend database coverage DB-C3.** Twelve more legacy-only routes were independently reviewed and normalized: 7 ADMIT-BACKSTAGE / 5 HOLD / 0 REJECT. Canonical coverage is now 89 routes / 51 markets / 86 brands / 67 networks / 293 sources, with 78 comparison↔canonical route-ID overlaps and 57 comparison routes still legacy-only. Local Phone checks preserve 135 comparison routes / 3 explicit indexable routes.
42. **ACTIVE — backend database coverage DB-C4.** Continue the next reviewed low-cost/mechanically distinct legacy-only batch from `docs/CURRENT_EXECUTION_QUEUE.md`; preserve provenance, uncertainty and the independent publication gate.
42. **BACKLOG / separate review — second observer/source-change role.** `codex-vps` already has a Relay-history role; do not repurpose it merely to satisfy a two-host topology. The existing trial host already runs the reviewed phone-source timer, so a second machine needs a concrete reliability/value reason before assignment.
43. **ONGOING — Relay data accrual.** No search-led expansion without evidence.
44. **WAIT — TikTok review and authority batch 2.** Do not disturb external waits before their triggers.

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

Status: **SUBMITTED / WAITING**. Do not Recall or change submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested.

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
| UK Phone evidence packet | `docs/PHONE_UK_PILOT_SOURCE_PACKET_2026-09-23.md` |
| Normalized UK pilot data | `frontend/tools/phone-number-lifecycle-mvp/uk-directory-pilot.json` |
| Phone research method | `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` |
| Search performance evidence | `docs/GSC_MEASUREMENT_2026-09-22.md` + current Windsor.ai reads |
| Execution procedure | `docs/OPERATING_WORKFLOW.md` |
| Relay methodology | `docs/RELAY_RISK_METHODOLOGY.md` |
| Authority/referral | `docs/AUTHORITY_AND_AI_DISCOVERY.md` + original Gmail threads |
