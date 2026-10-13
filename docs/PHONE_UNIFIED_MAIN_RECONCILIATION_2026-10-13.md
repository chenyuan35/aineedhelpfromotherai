# Phone: unified local release candidate on verified latest GitHub main — 2026-10-13

**Status: local-only candidate, no remote push/PR/Preview/production.**

## Baseline and overlap guard

GitHub main verified as `d4b3ed823686e4aca22154b185f4670d790c8587`, which already includes squash-merged PRs #482 and #486 and exact-main production closeout (#488). The prior #487 comments about PR #482/#486 being OPEN and the #479 quota hold are historical/stale and **not current**. Main canonical data is 160 routes / 87 markets / 904 sources / 330 events / 38 named-app observations with 135 historical comparison / 3 explicit route pages / 31 sitemap.

The previously frozen QwenPaw working branch `phone-freeze-batch-local-only-20261010` continued safely through `4afb1cae845d0806766a9d41243812afa60ee018`. Its review patch is anchored after original #486 head `809fb5d42a2b363674981a1f0972dc60de60b521`. **Exact Git-tree comparison found main vs that PR head differed in only three administrative fact sources**: `PROJECT_CONTEXT.md`, `docs/CURRENT_EXECUTION_QUEUE.md` and `docs/MASTER_PLAN.md`; no code/canonical data collision. Instead of rebasing the shallow original worktree or risk overwriting new production state, create a fresh clean worktree/branch from `d4b3ed8`, apply only the old branch's changed tracked paths since `809fb5d`, and **exclude all three newer GitHub main fact documents**. This carries one combined reviewed batch without reapplying #482/#486 content. QwenPaw old branch remains untouched, no production dirty worktree was touched.

## Main-to-candidate scope: reviewed new value, not inflated coverage

- New local canonical: **160 routes / 927 sources / 358 events / 41 app-specific reports / 224 snapshots**. Relative to production/main: **+23 distinct source IDs, +28 author/event records, +3 app-specific operation records, +4 dated snapshots, +0 new routes**. ID-set comparison: all 904 main source IDs and all 38 main app observations preserved; the only existing-event metadata corrections are two Tello unspecified-cohort clarifications. No source deletions. Giffgaff five new operational author events come from **three different directly inspected original Reddit URLs**, not five independent studies or bank/WhatsApp OTP success tests. See `docs/PHONE_GIFFGAFF_FIRSTHAND_CONTRAST_2026-10-13.md`.
- Giffgaff P0 first eSIM credit-vs-plan mismatch and overseas Wi-Fi Calling claim corrected in a new dated profile, UK pilot, 135 comparison row, search summaries and lazy detail, with direct official activation source beside What it costs. First-eSIM exact checkout price is NULL/unknown, not invented £6/£10; physical PAYG credit acquisition remains a separate cohort; US/China/foreign-first proof stays unverified. Earlier record retained as history.
- Separate reviewed source scopes: Tello monthly vs PAYG/cross-SKU, 1pMobile Amex and inbound-message behavior, Ultra PayGo activation/account loss, Lebara new eSIM outside-UK Wi-Fi, Optus foreign document/port refund and dated published pricing, cautious passport/ID classification. Original source independence and contradicting evidence retained. No extra user-facing route or tracking backend.
- HOLD/backstage still cannot be marketed as ready-to-buy. No rate from multiple commenters in one original. Public and SEO boundaries **135 comparison / 3 explicit indexable route detail / 31 sitemap URLs** remain fixed.

## Local QA executed on the new main-based worktree

- `npm run phone:data:check`: **PASS** including current profile parity, source-original provenance, identity classification, app grade, Giffgaff original author contrast, Giffgaff checkout/abroad Wi-Fi and legacy/new-view agreement, and freshly reproducible gap and ID coverage audits.
- `npm run build --prefix frontend`: **PASS**, 15 compiled Astro pages; 135 comparison / 3 route details / 31 sitemap.
- `node scripts/test-phone-number-public-release.mjs`: **PASS**; `git diff --check` PASS.
- Temporary **real Chromium CDP browser** localhost (blocking analytics calls) at **320, 375, 390, 1280 CSS px**: Giffgaff deep-link details render, required paid initial plan, unknown start price, UK-only Wi-Fi warning and direct official evidence link appear, no old £10 credit-only claim, No verified matches text present, document no horizontal overflow. This is localhost QA **NOT production**, and visual provider/SEO assertions remain separately gated after deployment.

## Release/rollback and next checks

- The old batch was hosted on a disposable node; a local git bundle on that same node is **NOT durable off-host preservation**. This new fresh local worktree is also **not a second safe host backup**. Before changing anything remote, comply with the existing safety/durable-storage gate and confirm *current ordinary free Vercel Preview* capacity rather than infer it from the recently completed unrelated deployment. Do not use quota-bypass, ad/billing, DNS, production worktree, yuan or hermes.
- One **single unified** PR from this exact main-based branch, one reviewed CI/Eval/free Preview cycle, merge under the normal check gates, then independent prod exact-SHA/apex/www/Phone HTML/JSON/route details/mobile/No verified matches/SEO HTTP QA. Closeout updated in main only after real production verification; revert bounded commit if regression. No fake source coverage percentage or paid checkout assurance.
