# 5SIM temporary activation — Wave C reconciliation (2026-10-08)

Status: normalized data prepared on a dedicated branch; release gated on CI/Eval/Preview/production verification.

## Decision

Keep exactly one canonical route `5sim-temp` in the **temporary** family, with `numberClass=temporary-activation`, `evidenceState=hold`, and no promotion to an owned real-mobile or long-term phone number. Existing legacy catalog entry remains distinguishable from independent SMSPool and ActivateX marketplaces: those are different platforms, **not aliases** or duplicate 5SIM identities. Within 5SIM, one-time activation and hosting/rental are separate order classes (documented API endpoints), not evidence of new durable phone-number ownership. No new atomic route was admitted.

## First-party product and refund facts

- [5SIM live prices](https://5sim.net/prices) selects target **service → country → operator**, and quotes inventory and prices dynamically. Page-level "from" prices are not reproducible final checkout quotes for a specified order.
- [5SIM API docs](https://5sim.net/docs) separately expose activation and hosting purchases and a maximum 15-minute activation wait (five-minute no-SMS timeout in the API docs). Those are order lifetimes, not mobile-number retention validity.
- [Return policy](https://5sim.net/docs2/return.html) distinguishes unsuccessful/no-SMS cancellation with return to balance from completed SMS receipts, which are non-refundable. [Used-number/2FA help](https://5sim.net/faq/sms-verification-codes/%E6%9C%BA%E5%8F%B7%E7%A0%81%E5%B7%B2%E6%9C%89%E8%B4%A6%E5%8F%B7) requires evidence, including video for some Telegram 2FA disputes, and excludes API-purchased numbers from that particular refund path. Do not present refunds as guaranteed cash reversals.
- No buyer-specific wallet funding floor, payment-card acceptance, identity checks, exact country/operator signup price, or annual keep cost has been independently reproduced. Both normalized acquisition and retention amounts remain **null**; one-time orders have no annual keep action.

## Community / real-world evidence

- [Trustpilot first-person 2026 reviews](https://www.trustpilot.com/review/5sim.net) include successful code receipt after switching numbers and failures/reused or already-2FA-protected Telegram, WhatsApp, Instagram and Google numbers. This is a **self-selected platform-level review surface**, not a precise country/operator/service/operation cohort. It contributes one normalized evidence source and one scoped incident row; it is not counted as a fabricated set of independent exact-app observations.
- [r/NoContract first-person comparison, 2026-05-11](https://www.reddit.com/r/NoContract/comments/1ta4lc8/list_of_sms_verification_providers_that_still/) calls 5SIM relatively cheap but inconsistent. One author, no reproducible order parameters or sample denominator. Kept as one separate source and one qualitative event.
- No route + service + operation observations were admitted. **Success rate and OTP reliability remain unknown**; platform anecdotes never become a service success percentage.

## Data and publication boundary

Five reviewed source records and two scoped events were appended, with one new `current-profile` snapshot. The original 3 sources, four legacy snapshots and raw historical catalog remain preserved. Resulting route depth: **8 sources / 2 events / 1 current profile**. Full canonical expected counts: **160 routes / 87 markets / 157 brands / 117 networks / 896 sources / 321 events**.

No alias entry, no new standalone route URL, no sitemap/indexability change, no public frontend redesign. Existing `public-legacy` surface identity is retained for compatibility, but normalized evidence is **HOLD** and `guideEligible=false`; do not rank it as a durable-number recommendation. Historical comparison: **135**, explicit indexable: **3**, sitemap: **31**.

## Verification / follow-up

Regression assertions in `scripts/test-phone-database.mjs` cover null costs, HOLD state, one normalized profile, unique marketplace identity and generated lazy detail. `npm run phone:data:check`, frontend production build, public-release checks, CI, Eval and production release must all pass before marking this completed. Any missing detail in funding/identity/refund behavior remains unknown, not to be filled from generic marketing copy.

Next independent Wave C record after this release: `a1-croatia-prepaid-esim`, one route only.
