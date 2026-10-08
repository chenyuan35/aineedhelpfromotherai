# Phone Radar — product-surface and audience-evidence audit (2026-10-09)

Status: RESEARCH / DECISION AUDIT ONLY. No UI, SEO, privacy, billing, deployment or database-schema change is authorized or made by this audit.

## Separate five status layers

1. **Canonical research database:** 160 route identities / 87 markets / 157 brands / 117 networks / 896 recorded sources, including HOLD and legacy reconciliation. This is a reviewed *known universe*, not a global carrier census, not verified active stock, and not 160 recommended offers.
2. **Data delivery:** build-generated `phone-route-summaries.json` and on-demand `phone-route-data/<id>.json`; all 160 IDs are nominally queryable in the three route families, including restricted/HOLD states. Being in deployed JSON is not a product usage or publication outcome.
3. **Actual visible product UI:** Fresh live page extraction returned HTTP 200 from `/tools/phone-number-survival-guide/`, English `lang=en`, "135 routes compared" headline, and the long-term-family finder showing **153 reviewed routes / 83 markets**. These are different populations, not contradictory DB counts. The main page exposes three task-family tabs, search, country selector, sort, summary/detail toggles, top decision shortcuts, country exploration, route guide and up to four side-by-side pinned comparisons.
4. **Public/SEO:** 135 historical deep-comparison entries / 3 explicit indexable individual Phone route pages / 31 site sitemap URLs. A canonical route is not an SEO landing page; indexation does not equal a visit.
5. **User outcome:** no verified task completion, bookmark return, search-to-compare rate, or real acquisition/conversion rate is established. A deployment READY and passing build tests do not prove UX or demand.

## First-party discovery and language evidence

- Preferred Windsor.ai Search Console settled read (2026-09-23–2026-10-07 request, settled rows currently through **2026-10-05**): **26 Phone-path impressions / 0 clicks**. It now satisfies both previously documented recheck triggers (>=20 settled Phone impressions, finalized rows through Oct 5). It does **not** satisfy a case for additional public pages or prove engagement.
- Query-dimension data for the same period disclosed only 3 Phone queries, **4 query-attributed impressions**: `survival number` (1), `how to recharge sosim` (2), `sosim mainland number` (1). These visible queries are English. Search Console anonymizes/omits some query data, so **4 visible-query impressions must not be equated with all 26 page impressions**.
- The Phone-only GSC country-dimension read surfaced 4 impressions across US, Dominican Republic, France, and Canada. Country is not language, and low-volume dimension data cannot establish audience composition.
- Windsor.ai connector discovery confirms GA4 property `553896884` exists; GA4 reads for `language, active_users, sessions`, `country`, and Phone `page_path` for 2026-09-23–10-08 all returned **zero result rows**, including broader 2026-09-01–10-08 date sanity check. This is **no usable GA4 audience dataset**, not proof of zero visitors.
- The currently reviewed `frontend/index.html`, Phone `index.html`, and fresh live homepage HTML show no visible Google Analytics tag loader/configuration. Phone's `trackPhone()` only dispatches when `globalThis.gtag` already exists and otherwise silently does nothing. Therefore event handlers existing in code do **not** prove events are arriving in GA4. Confirm whether any other injection exists before labeling the root cause; do not install tracking before privacy/consent review.
- Current Chinese-versus-English *visitor percentage is NOT KNOWABLE* from the available data. English-language queries are not a count of English-speaking site users. Google country data and Chinese-speaking forum activity are not interchangeable with visitor locale.

## Independent market and user-task evidence

- [海外镖局](https://haiwaibiaoju.com/compare/keep-number/) already gives a Chinese comparison of real number acquisition/keep cost, SMS compatibility and operational warnings (current page reviewed 2026-10-09).
- [esim.ren 保号卡对比](https://esim.ren/keep-number) already provides Chinese price/number country/annual keep cost/eSIM/mainland-SMS/comparison fields.
- [Public Chinese SMS provider comparison](https://github.com/fingerprint-browser-guide/sms-verification-platforms) covers SMS marketplaces and dynamic-price caveats.
- [eSIMDB](https://esimdb.com/) is a substantial independent comparator for **data eSIM**, not an exact substitute for **durable phone-number / OTP survival**. Maintain this job distinction.
- These are examples of Chinese-language demand *and existing competition*, **not** audited traffic volumes or proof that Chinese users outnumber English users. Our defensible advantage must come from deduplicated independent app/roaming/activation/continuity events, current uncertainty, and faster decisions—not a copied cheap-card table or many SEO pages.

## Actual UX findings (source inspected and live HTML retrieved)

**Already implemented—do not misreport as missing:** three route-family tabs (real-number, data, one-time), country selector, free-text route/carrier search, sorting, a detail toggle, primary route guides, lazy canonical evidence, country navigation, cost timelines/bars, service-evidence badges, a **pin-based 2–4 route comparison overlay**, and HOLD/unknown labels.

**Product gaps / unvalidated job completion:**
1. No structured query form for combined user constraints: `country of residence / first-activation location`, `destination for receiving SMS (e.g. mainland China)`, `required app/service`, `real mobile vs VoIP`, `eSIM/physical`, `initial + yearly cap`, and `can buy without local ID/payment`. Free-text and one country filter do not reliably implement these intersecting constraints.
2. `state.pins = new Set()` is only page-session state. There is no saved-favorites / cross-reload shortlist or export/share of a comparison selection. Do not confuse **Pin for Compare** with the **Save for Later** user job.
3. A long country list, generic leaderboards and broad country tiles precede an evidence-qualified direct answer to "which number suits *my exact task*"; the "Top" subset is restricted to admitted, user-visible routes and can appear UK-heavy despite global canonical coverage. Unknown and HOLD data are correctly distinguished, but there is no quick "Why unavailable / what do I need to verify?" decision explanation on the shortlist.
4. End-user efficiency on mobile (time to first valid result, scroll/overflow, finding a suitable filter, reopen a pinned comparison, click to provider, return to search) has **not** been established by actual user testing or funnel data; passing layout regression is not a usability study.
5. Existing `phone_search`, `phone_filter_change`, `phone_compare_open`, `phone_guide_open`, `phone_outbound_click` event calls depend on an available `gtag`, whose presence is not established. No first-party funnel or locale segmentation currently supports a redesign winner claim.

## Recommended minimal next actions, in order (NOT auto-authorized production work)

**Next single bounded session: Phone instrumentation fact-and-privacy gate.** Establish whether GA4 is in fact loaded and sending from the current production Phone page. If absent, specify smallest consent/privacy-compliant, low-overhead event/locale capture with no phone numbers, account identifiers, raw search terms or OTP content; only use anonymous event type, route family, destination and route ID if permitted. Compare live reports/readback before requesting a production tracking change. Do not rely on speculative pageview counts, pay, or turn on identifiers by default. If the site's privacy policy/consent posture is incompatible, stop and propose anonymous aggregate alternatives.

**Then one existing-URL task-first UX pilot** (not a broad redesign): within `/tools/phone-number-survival-guide/`, make "Buy / Keep / Verify / Recover" actionable filters, first show 3–5 matching cards with known startup/keep costs, important eligibility and recent independent service incidents, and clearly expose **unknown / blocked**. Preserve existing 2–4-way compare, consider local-only `Saved for later` persistence after privacy review, and support one clear detail/next-action pathway. Add no new SEO page. Distinguish target country, number country and first-activation geography.

**Language decision:** Keep canonical English copy under current project rule until measured locale/query/referral and task-engagement evidence justifies an explicit bilingual experiment. Do not launch dozens of `/zh/` keyword pages or assume Mandarin majority from Chinese forums. Use an agreed measurable sample (e.g., consecutive weeks with meaningful identified Phone sessions plus by-locale use of search/compare/guide) before investing in translation; allow locale/category ambiguity and direct/referral vs Google organic segmentation.

## Gates / do-not-do

- The 20 settled-impression recheck trigger is now **met**, but 26 impressions and 0 clicks call for checking query/title/first-screen alignment, **not automatic publication**.
- Do not treat verified JSON, 160 routes, Vercel READY, sitemap or translated copy as product adoption.
- No new atomic route, generic thin SEO URL, blanket frontend rewrite, GA4 tracking insertion, cookies/PII collection or paid connector changes in this audit.
- Wave C Croatia A1 backend reconciliation stays as a bounded backlog item; it need not be deleted when the separate user-requested UX/measurement investigation is prioritized.
