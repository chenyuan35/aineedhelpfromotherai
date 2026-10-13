# Phone Radar — quota-freeze staging review (2026-10-10)

**Scope:** LOCAL, non-production review branch based on #486 head 809fb5d, itself stacked on #482. No PR/push, main merge, production deployment, free-quota bypass, or paid change. Durable release decision and next triggers: issue #487.

## Source-led database work

- Existing 1pMobile UK PAYG route, backstage-only and admitted: 2 independently distinct Reddit original discussion URLs; two non-service lifecycle incidents and one same-thread named American Express SMS verification failure reported by one commenter. Other SMS codes worked for that commenter; another OP's generic SMS/call failure does not become Amex failure. No China-first checkout, KYC, device or app-signup proof; no price change, product route admission or verified success percentage.
- All original-source URLs/author-specific cases are test-asserted; one original discussion is one source even if many authors/replies.
- Staged normalized inventory expected 160 routes / 906 sources / 332 events / 39 named-service observations; public indexability unchanged at 135 comparison / 3 indexable / 31 sitemap. A single C-grade Amex failure aggregate from one firsthand original is **not a statistical success rate**.

## Frontend and data-contract findings

1. Existing route-detail rendering truncated the first 8 sources in canonical insertion order, hiding **all** community-source evidence on 11 routes despite links in the DB. Fixed a browser-only prioritizer showing original community reports plus at least one first-party rule; no source is deleted; list max 8, stable URLs, deduped. Regression test checks every route.
2. US number-abroad guide drew a historical global-directory Tello PAYG yearly cost of USD80 while current canonical normalized summary models conditional SMS $10/90d path USD40/yr, versus ordinary web top-ups $20/90d USD80/yr. Guide also conflated a distinct $5/month plan, implied worldwide SMS reliability and omitted US-first activation. Fixed to read current canonical metric, describe both *different* methods and eligibility, and explicitly require US physical first activation before abroad use. No claim of general bank success or China new-buyer readiness.
3. Historical multiple dated current-profile snapshots are legitimate dated versions; the bug was publishing a stale parallel legacy packet without reconciliation, not automatically deleting historical records.
4. A reproducible cross-stream audit of 61 matching comparable annual costs found **15 discrepancies** between the older public global-directory packet and newer normalized route summaries; 6 were in legacy guide-eligible routes. This is a review queue, **not** 15 proven tariff mistakes. See `docs/PHONE_RADAR_LEGACY_COST_DRIFT_2026-10-10.md` and `scripts/audit-phone-legacy-price-parity.mjs`. No blind cost overrides or broad SEO rewrites.

## Gates

Run `npm run phone:data:build`, full `npm run phone:data:check`, `npm run build --prefix frontend`, `node scripts/test-phone-number-public-release.mjs`, `git diff --check`, and at least 375px/390px local browser QA. Inspect generated US guide for correct conditional prices and ensure original evidence is reachable on cards. Stop on any failing gate. GitHub issue and daily journal hold the durable interim record; host /tmp is disposable, so do not treat unpushed work as GitHub main.

## Later release

One coordinated batch and one free normal CI/Eval/Preview gate when provider limits recover; reconcile its exact source SHA against #482/#486 and upstream main first. Deploy once to production and independently confirm apex/www, sources/operations, static assets, links, responsive layout, 135/3/31 and no-match semantics. Marketing must follow independently verified shipped functionality; avoid synthetic links and unverified referrals.

## Second-stage legacy comparison presentation safety

The older market comparison used annual keep-cost numbers from its historical packet even when the newer canonical route summary differed. This made low-cost sorting and SVG bars inaccurate for the 15 cross-stream disagreements. A staged client-only guard now labels the competing historical/normalized amounts explicitly as **COST REVIEW**, excludes affected prices from the low-cost sort and SVG cost comparison, and requires the user to inspect supporting terms; no route is promoted based on the smaller amount. Tested against existing Tello and Optus discrepancies; rerun the browser build/public tests before release.

## Legacy named-app sample and source QA (third stage)

The legacy market app badges previously computed a success percentage from >=5 old deduplicated report entries **without proving independent original threads or separating operations**. Although the current packet has no active >=5 all-success/failure group triggering that branch, it is a future unsafe evidence path. The staged client now uses canonical service/operation aggregates and their established independent-source gating; multi-operation samples remain distinct, while any unsupported old-only samples are labeled ungraded rather than given a rate or success badge. The legacy market detail also uses the same balanced firsthand/official source selector rather than truncating the first 6 provider rows. See the strengthened legacy UI regression.
