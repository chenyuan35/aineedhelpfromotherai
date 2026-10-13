# Giffgaff first-eSIM checkout, UK-only Wi-Fi Calling and recovery — staged 2026-10-13

Status: **LOCAL-ONLY REVIEWED P0 DATA/UI CORRECTION — NOT GITHUB MAIN OR PRODUCTION.** Parent is the same frozen QwenPaw isolated worktree/branch from Issue #487 at previous HEAD `44c65ce`. Release remains blocked on safe durable preservation and a normal free Vercel Preview; do not bypass, remote-push or split it into a new release.

## User problem and source decision

The main and existing local batch mixed **new eSIM first activation** with **physical SIM PAYG-credit activation** under the one legacy Giffgaff route. This pushed a fictitious **£10 credit-only eSIM initial cost / CNY 89.3** into canonical summaries, the 135-row global comparison, lazy guide and user cost sorting. The same legacy row suggested Wi-Fi Calling abroad despite a separate supported capability specifically saying it is unavailable abroad.

Current giffgaff primary sources reviewed 2026-10-13:
- [Getting started](https://help.giffgaff.com/en/articles/240912-getting-started-on-giffgaff): a new eSIM **must choose an initial paid plan**; option to purchase only credit instead is not offered to eSIM. A physical SIM / existing-account credit workflow is a different purchase stage; no foreign-card or postcode eligibility proof.
- [Wi-Fi Calling / VoLTE](https://help.giffgaff.com/en/articles/258841-understanding-wifi-calling-and-volte): Wi-Fi Calling requires UK location; VoLTE and cellular roaming SMS are separate. No China-specific app OTP guarantee.
- [Deleted eSIM recovery](https://help.giffgaff.com/en/articles/240403-what-to-do-if-you-delete-your-esim): old eSIM deletion removes access to direct email eSIM MFA; where account access remains, use **physical SIM swap, then another eSIM swap** separated by at least 24 hours; recovery is not assured offshore.

Do **not** replace the old £10 with an assumed £6/£10 starter plan price. Exact new-eSIM checkout total, foreign payment card/address, legal remote first cellular attach and named-app OTP remain unverified. The historical 2026-09-15 current-profile source snapshot is kept intact for provenance and superseded by one dated 2026-10-13 profile, not rewritten.

## Work staged locally (same product/URL, no SEO expansion)

- Added **two nonduplicated official primary sources** (first-eSIM plan checkout, deleted-eSIM recovery) to the existing route and one corrected `current-profile` snapshot. Existing Wi-Fi Calling provider source `src-7bc565362f29` is reused.
- Updated the current profile, UK pilot and **only the Giffgaff row** in historical global directory; explicitly preserved 134 unrelated comparison rows, including later CMHK/MTN reviews that a blind merge would overwrite.
- Changed first-eSIM acquisition/native and comparable CNY amount to **null/unknown**, kept UK physical-SIM credit purchase separate, kept the reported ~180-day retention economics as historic/scoped (not silently revised), and preserved prior mixed SMS/continuity observations.
- Aligned legacy desktop/mobile compare, step-by-step guide, 160-route summary, lazy detail, comparison index and source links. The stricter mainland foreign-first `No verified matches` gate remains unchanged.
- Registered `scripts/test-phone-giffgaff-new-esim-cross-view.mjs` in the normal `phone:data:check` suite. It tests new-vs-historical cohort, null start-price and CNY, UK-only Wi-Fi Calling, source IDs, view parity, no-match and publication boundaries.
- Regenerated canonical static artifacts, refreshed only derived 160-route identity/source audit, without adding a route, an app observation, an event, a new public page, backend or tracking.

## Exact local QA

- `npm run phone:data:build` **PASS**.
- `npm run phone:data:check` **PASS** after refreshing the derived identity audit to reflect the two source references. No change to the identity classification totals (68 required / 5 reported no-photo-ID / 76 unverified / 11 unknown).
- `npm run build --prefix frontend` **PASS** — 15 static pages, 135 comparison / 3 detail / 31 sitemap unchanged.
- `node scripts/test-phone-number-public-release.mjs` **PASS**, `git diff --check` **PASS**.
- Real ephemeral localhost Chromium CDP QA (GA/tracking endpoints blocked), at **320 / 375 / 390 / 1280 CSS px**: all four loaded Giffgaff canonical deep-link evidence with corrected required first plan, unknown initial cost, UK-only Wi-Fi warning, no old £10 start assertion and `No verified matches` UI presence; **document scroll width never exceeded viewport**. Local browser script is disposable and was not added as a CI dependency.
- Local staged totals before commit: **160 routes / 87 markets / 924 sources / 353 events / 41 app observations / 224 snapshots**, compared with previous frozen `44c65ce`: +2 official sources, +1 corrected profile, +0 routes/events/app reports. All are **unreleased**. Public boundaries remain 135 / 3 / 31.
- Two independent Giffgaff community discussion IDs `1ugw8k3` (first-purchase payment/voucher issue) and `1tc9fy9` (paid-plan UK-first/Paris travel use) are **not** in this local 924-source canonical array. Their detailed circumstances were separately recorded in the daily journal, but exact original-page recheck is still required before author-scoped normalized events. They are not added to source, event or success-rate counts here.

## Unified release / rollback gate

Inspect the updated isolated branch vs stacked PR #482 -> #486, verify the full original-source dedup and patch diff, preserve the batch on user-authorized safe durable storage, and confirm genuine free normal Vercel Preview capacity. Only then submit **one** consolidated reviewed CI/Eval/Preview candidate. On successful merge perform exact-main/production-SHA QA with apex/www, Giffgaff detail/legacy comparison, mobile widths, index/no-match and 135/3/31 URL boundaries. No independent release, quota workaround, pricing guarantee or mainland first-activation promotion. If a future shipped change regresses, revert this bounded correction through the normal PR rollback.

## Follow-on source visibility QA (same isolated batch)

The existing source-priority helper correctly favored original incident threads and showed the newest official deleted-eSIM recovery source, but did **not** include the equally dated **initial mandatory-plan** official page within the eight-source detail list. Because the purchase-cohort correction must be directly inspectable by users, a narrowly reusable `onboardingSourceUrl` property now links the exact HTTPS provider rule beside **What it costs** in both current lazy route detail and legacy comparison guide. The helper validates HTTPS URLs and HTML-escapes attributes; source sampling and service evidence grades are unchanged.

Re-run results: full `phone:data:check`, frontend 15-page build, public release audit and diff validation **PASS**. Actual temporary Chromium deep-link detail at 320/375/390/1280 CSS px displays the clickable initial-plan official rule, unknown initial price and UK-only Wi-Fi warning with no document overflow; GA endpoints blocked. Legacy view data and link-render function are regression-tested in source, but an independently operated live production/legacy Browser session is **not** claimed. Unreleased totals 160/924/353/41/224 and SEO 135/3/31 unchanged.
