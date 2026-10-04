# China Telecom Macau Easy PASS backstage admission closeout — 2026-10-04

Status: **RELEASED / PRODUCTION VERIFIED**

PR #384 (`data/ct-macau-easy-pass-20261004`) squash-merged to `main` as `c6ea4d45a8924d731f1dc60bd91e31261380b560`.

## Accepted result

- Canonical route: `china-telecom-macau-easy-pass-2026`.
- Classification: `long-term` / `real-mobile` / `backstage-only` / `hold` in Macau on China Telecom (Macau).
- Current first-party lifecycle: 180 days from activation; a recharge resets/extends validity to 180 days from the recharge date; more than 90 days continuously suspended causes automatic cancellation.
- Current provider evidence confirms mandatory real-name registration, ordinary incoming SMS free in Macau/mainland China/Hong Kong, and current prepaid eSIM / physical-to-eSIM support.
- MOP50 / 180-day retention remains explicitly community-observed rather than a provider-published minimum.
- Bank/app-specific OTP reliability remains insufficient for recommendation status.
- Canonical totals: **159 routes / 87 markets / 156 brands / 117 networks / 616 sources**.
- Current known evidence-qualified atomic coverage: **159/159**. This is not a worldwide carrier census.
- Finder family totals: **152 long-term / 5 temporary / 2 data**.
- Public boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.

## Verification

Before merge:

- `npm run phone:data:check` — PASS.
- `node frontend/bin/build.mjs` — PASS.
- `node scripts/test-phone-number-public-release.mjs` — PASS.
- `git diff --check` — PASS.
- CI #252 — PASS.
- Eval Gate #1148 — PASS.
- Vercel Preview — SUCCESS.

After merge:

- Vercel status for merge SHA `c6ea4d45a8924d731f1dc60bd91e31261380b560` reached SUCCESS.
- Live Phone hub returned HTTP 200.
- Live `/tools/phone-number-survival-guide/phone-route-summaries.json` returned HTTP 200 with **159 routes = 152 long-term / 5 temporary / 2 data** and included the Macau route.
- Live `/tools/phone-number-survival-guide/phone-route-data/china-telecom-macau-easy-pass-2026.json` returned HTTP 200 with `real-mobile` / `backstage-only` / `hold`.
- Standalone Macau route URL returned HTTP 404.
- Live sitemap returned HTTP 200 with **31 URLs** and no Macau route entry.

## Database phase consequence

No currently known evidence-qualified distinct atomic residual remains outside canonical. Broad enumeration remains stopped. Re-open database expansion only when genuinely new evidence-qualified atomic routes appear; continue evidence maintenance and measurement without manufacturing SEO pages.
