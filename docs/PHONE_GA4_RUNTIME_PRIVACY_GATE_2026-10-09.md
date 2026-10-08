# Phone Radar — GA4 runtime, collection and privacy verification gate (2026-10-09)

Status: **FACT AUDIT COMPLETE; LIVE COLLECTION UNVERIFIED; USER-VISIBLE TRACKING/CONSENT CHANGE ON HOLD**. Scope: Phone measurement integrity and privacy only. No analytics account, cookie, billing, production UI, data model or SEO changes in this round.

## 1. Correct the prior false negative

The 2026-10-09 audit in `docs/PHONE_RADAR_UX_AUDIENCE_AUDIT_2026-10-09.md` mistakenly inferred that production pages did not load GA4 because it checked the checked-in raw `frontend/index.html` and a **processed** extracted HTML representation, where script tags had been removed.

**Authoritative actual pipeline:** `frontend/bin/build.mjs` declares `GA4_ID = 'G-FYKKNKRE58'` and `GA4_TAG`; after generating the site, `injectGa4(dist)` walks all `.html` and inserts both `GA4_TAG` and sitewide `BEHAVIOR_TAG` before closing `</head>`. Therefore **source pages lacking a tag does not imply the built pages lack GA4**.

**Fresh live raw HTML independent verification (2026-10-09):**
- `https://aineedhelpfromotherai.com/`: HTTP 200, `rawHtml` contains the Google tag JS loader, `gtag('js',...)`, `gtag('config','G-FYKKNKRE58')`, and `site-behavior-analytics`.
- `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`: HTTP 200, same GA4 loader/config/behavior tag and the Phone-specific `trackPhone` event implementation.
- `https://aineedhelpfromotherai.com/privacy/`: HTTP 200, also contains the auto-injected GA4 tag.
- A processed extractor's `html` response omits the same scripts; only use unmodified `rawHtml` for this contract.

**Revised conclusion:** GA4 **is installed in the live HTML**. This confirms tag presence and the inline queue/config command, **NOT** the success of a browser's requests to GA4, the actual measurement stream/property mapping, collection volume, or readback.

## 2. First-party reader and secondary-check results

- Windsor.ai linked GA4 account: `553896884`, name `aineedhelpfromotherai`; Windsor live plan reported `Trial`.
- `get_data` queries for 2026-09-19 through 2026-10-09 requesting date/sessions/active_users/pageviews/event_count and language/sessions/active_users returned `[]`. A measurement_id/stream_id/stream_name query for 2026-09-01–10-09 also returned `[]`. This means no GA4 rows are readable **through this connector query**, **not** zero visitors.
- This reader cannot establish whether the live tag `G-FYKKNKRE58` is attached to the queried GA4 property `553896884`; the measurement ID is exposed as a possible dimension but the backend yielded no rows. **PROPERTY-STREAM MATCH UNKNOWN**.
- Vercel Web Analytics API `count_pageviews` returned `400 web_analytics_not_enabled` for the correct existing project/team, so it is **not an available fallback**, and was not enabled or purchased.
- Follow-up live gate on 2026-10-09: GSC Wizard read-only GA4 listing returned `payment_required` because the trial ended; the Vercel exact-head Preview deployment attempt returned `402 api-deployments-free-per-day` with a 24-hour retry hint. GitHub Eval Gate #1306 PASS does not override the failed Preview. The current PR cannot be merged under project release rules; no paid upgrade or production change was made.
- **No controlled live browser Network HAR / GA4 DebugView session was executed in this audit**. Consequently `g/collect` delivery remains unverified; do not invent a blocked-browser error, synthetic event, or successful DebugView result.
- GSC previously settled Phone-path 26 impressions / 0 clicks through 2026-10-05 measures **Google Search appearance**, not GA4 visits or language of those visitors.

## 3. Current code and disclosure risks

- Existing build inserts sitewide `gtag('config')` immediately. No `gtag('consent','default', ...)` command or explicit consent UI is present in the inspected build/injection code. There may be undiscovered external consent tooling, but **the current reviewed code offers no demonstrated consent gate**. Do not claim the current implementation conforms to every geography's requirements.
- Current `frontend/privacy/index.html` covers browser-based tools, infrastructure logs and **AdSense cookie use** but has **no specific GA4 website analytics/behavior events disclosure** or clear analytics choice. The actual live privacy page receives GA4 injection too. An explicit privacy-policy/consent assessment is a **user-visible and privacy contract change**, not a casual background analytics toggle.
- Sitewide generic `BEHAVIOR_TAG` emits `tool_action` with `action_id` taken from `button.id || button.textContent` (truncated), which might capture dynamic button text. Audit against sensitive/user-generated UI before retaining it; prefer fixed allowlisted event identifiers. Phone `phone_search` currently sends **query length**, not raw query, but fires on **every input event** (no debounce), risking useless/noisy telemetry.
- Current `phone_compare_open` includes a list of internal route IDs; constrain parameters to reviewed short codes and no identifiers, phone numbers, email addresses, OTPs, or raw search strings.
- `document.documentElement.lang=en` is site content language, not the language of visitors. Country, the source language of community posts and user language cannot be equated.

Official guidance consulted:
- Google tag consent defaults must be set **before** measurement config/events; basic consent mode keeps tags unloaded until choice: https://developers.google.com/tag-platform/security/guides/consent
- Google Analytics requires appropriate notice/consent or opt-out as applicable: https://developers.google.com/analytics/devguides/collection/protocol/ga4/policy
- Do not send email/mobile number/other PII or raw PII entered into forms/search to Analytics: https://support.google.com/analytics/answer/6366371
- Validate actual arrival using browser network `g/collect`, Tag Assistant and GA4 Realtime/DebugView: https://developers.google.com/analytics/devguides/collection/ga4/troubleshoot

This is an engineering and privacy risk finding, not a jurisdiction-specific legal determination.

## 4. Minimal executable next gate — one later session

**A. Verification without new collection:**
1. Independently verify in the GA4 Admin Data Streams page or a connected **read-only Admin API** that the website stream's measurement ID is **exactly** `G-FYKKNKRE58` for linked property **553896884**. Do not guess by matching project names; if no Admin access, record blocked rather than changing a property or creating a new stream.
2. In an authorized browser/privacy test context, check Tag Assistant and Network for the actual GA4 `g/collect` destination and payload, and verify consent state, blocking behavior and no PII. Use a clearly labeled debug session and non-sensitive synthetic interactions, never assume a tag's presence proves delivery. Do not inflate production GA4 numbers; debug-mode evidence is distinguished.
3. Compare GA4 Realtime/DebugView with the exact queried property, and then Windsor reads, allowing normal processing delay. Classify: a) mismatched measurement ID, b) tag or network/CSP/consent blocked, c) data captured but connector inaccessible/quota, d) legitimate very small traffic. Do not assert which without evidence.

**B. Privacy-safe proposed implementation, approval required before modifying production:**
1. Design a **basic/explicit opt-in consent mode** or appropriate approved CMP flow; block Google Analytics JS collection before user choice where necessary. Expose reject and change-preference choices, do not bundle analytics with AdSense/ads consent. Review geo/consent implications and update the real Privacy Policy transparently. No silent consent/storage/billing modification.
2. If approved, minimize and allowlist Phone events: `phone_family_select`, `phone_filter_change`, `phone_search_submit`/**debounced** query-length category only, `phone_compare_open` (count not user strings), `phone_guide_open`, `phone_outbound_click` (internal route code/category; whitelist destinations), `phone_favorite_save` (if feature exists in a future phase). Keep pageview path sanitized of user text; disable generic arbitrary `action_id` recording.
3. Protect data: no IP user-level storage by us, no phone number, exact OTP, email, precise GPS, signup identity, raw query/referrer URL text, or third-party cross-linking. No backend/server persistence or new paid dependency solely for telemetry.
4. Tests: generated `dist/index.html`, Phone `index.html`, privacy `index.html` have expected approved consent-first build output; before consent no GA network sends under basic mode, reject still off, accept sends only whitelisted payload; approved browser E2E confirms GA4 debug readback and cannot transmit raw search or number.
5. After successful release and real aggregate samples, compare English vs Chinese **browser locales** (not ethnic identity), with channel segmentation (Google organic, social/referral, AI referral, direct/repeat); if segments are too thin, continue reporting UNKNOWN.

**Stop/rollback:** No production tracking/consent change without explicit approval for the user-visible privacy/consent contract. If ID mapping or actual collection cannot be validated under connected account permissions, do not invent language percentages; hold and continue non-tracking Phone UX research separately. A small, reversible PR/CI/preview/live verification is mandatory for any later code change.
