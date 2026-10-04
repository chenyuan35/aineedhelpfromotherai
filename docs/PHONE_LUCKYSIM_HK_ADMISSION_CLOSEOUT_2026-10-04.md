# LuckySIM Hong Kong backstage admission closeout — 2026-10-04

Status: **RELEASED / PRODUCTION VERIFIED**

PR #382 (`data/luckysim-hk-20261004`) squash-merged to `main` as `d8158f9d86e62cf917b6a54409a65091c8b98040`.

## Accepted result

- Canonical route: `luckysim-hk-prepaid-2026`.
- Classification: `long-term` / `real-mobile` / `backstage-only` / `hold` on `csl-hk`.
- Current official acquisition baseline: HK$138 / 1,095 days with a retained Hong Kong mobile number.
- Current official retention ladder: HK$50 / 180 days, HK$100 / 365 days, HK$200 / 540 days; normalized ongoing keep action is HK$100 / 365 days.
- Independent evidence supports ordinary incoming SMS in the UK and mainland China, but bank/third-party OTP reliability remains insufficient for recommendation status.
- Canonical totals: **158 routes / 86 markets / 155 brands / 116 networks / 611 sources**.
- Audited known evidence-qualified coverage: **158/159 = 99.4%**.
- Finder family totals: **151 long-term / 5 temporary / 2 data**.
- Public boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.

## Verification

Before merge:

- `npm run phone:data:check` — PASS.
- `node frontend/bin/build.mjs` — PASS.
- `node scripts/test-phone-number-public-release.mjs` — PASS.
- `git diff --check` — PASS.
- CI #250 — PASS.
- Eval Gate #1144 — PASS.
- Vercel Preview — SUCCESS.

After merge:

- Vercel production deployment `dpl_4d3wkNJqVfVMzHXW8FFSX1ARagHg` reached `READY` for merge SHA `d8158f9d86e62cf917b6a54409a65091c8b98040`.
- Live Phone hub returned HTTP 200.
- Live `phone-route-summaries.json` returned HTTP 200 with 158 routes = 151 long-term / 5 temporary / 2 data and included LuckySIM as `real-mobile` / `backstage-only` / `hold`.
- Live `phone-route-data/luckysim-hk-prepaid-2026.json` returned HTTP 200 with the canonical route, HK$138 acquisition metrics and HK$100 / 365-day keep metrics.
- Standalone LuckySIM route URL returned HTTP 404.
- Live sitemap returned HTTP 200 with 31 URLs and no LuckySIM URL.

## Remaining residual

The only known evidence-qualified residual route still outside canonical is China Telecom Macau / Macau blue-card. Its lifecycle/renewal rule must be reconciled before admission; do not infer the missing rule.
