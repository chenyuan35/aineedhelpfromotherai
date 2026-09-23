# Current Execution Queue

Last updated: 2026-09-24

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is the short atomic execution queue.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT / UK PILOT SHIPPED / TECHNICAL DEFECT FIX NEXT.**
2. **AI Reset Radar — FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.**
3. **Relay Exit Risk — DATA-ACCRUAL EXPERIMENT.**

Mandatory product-value and competition gates remain unchanged. A confirmed production defect may be repaired without treating that repair as speculative product expansion.

## NEXT — repair confirmed Phone broken-JavaScript reference

Status: **CONFIRMED FROM 2026-09-23 AHREFS CRAWL + GITHUB MAIN SOURCE INSPECTION**.

Mailbox review on 2026-09-24 found the latest Ahrefs Site Audit crawl (2026-09-23 18:09 UTC) dropped Health Score from 100 to 90 and reported exactly three errors:

- `Orphan page (has no incoming internal links)` — 1 URL;
- `Page has broken JavaScript` — 1 URL;
- `JavaScript broken` — 1 URL.

The two JavaScript errors have a concrete source match: `frontend/tools/phone-number-lifecycle-mvp/index.html` references `/theme-toggle.js`, while `frontend/theme-toggle.js` does not exist on GitHub `main`.

Next bounded implementation task:

1. determine whether the redundant `/theme-toggle.js` reference should be removed or replaced by an existing real asset;
2. repair only that defect in a fresh branch/worktree;
3. add a regression check so generated/public Phone output cannot reference a missing local script;
4. run Phone tests + build + Eval Gate + Vercel Preview;
5. merge only after green checks and verify the public Phone canonical no longer requests the missing script.

Do not use this defect as justification for another market, ranking model, feature, or redesign.

## SECONDARY AUDIT ITEM — exact orphan URL

The Ahrefs email confirms one current orphan page but does not include its URL. The Ahrefs API path currently returns `Insufficient plan`, and the browser connector was not connected during the mailbox audit. Identify the exact URL from an authorized Ahrefs crawl-result view before changing internal links, sitemap membership, indexability, or redirects. Do not guess which page it is.

## Search Console 404 notice — historical / no automatic redirect

Google Search Console emailed on 2026-09-20 that some URLs in the prior `404` validation remain affected. Existing project evidence already confirms former public product paths such as `/cases/`, `/learn/`, `/stats/`, old `.well-known` files, old OpenAPI/feed/failure-index assets and `/mcp/` are intentionally real 404s and absent from the current sitemap. Do not revive or redirect them merely to make the validation green. Re-open this only if a currently intended URL is shown among the affected examples.

## AFTER DEFECT CLOSURE — measurement hold, then re-measure Phone

After the broken-script defect is production-verified:

1. allow Search Console + meaningful interaction evidence to accrue;
2. re-measure the existing Phone canonical;
3. keep Google organic separate from referral/social/direct and AI referral;
4. if impressions appear without clicks, diagnose query/SERP fit before changing the product;
5. if clicks appear but use is weak, improve the existing canonical from interaction evidence;
6. expand to another market/network only when evidence quality and product-value gates pass.

## External waits

- **TikTok App Review — WAITING.** Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested.
- **AIR-4 Authority batch 2 — WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. No third target or follow-up before 2026-09-29 or later.

## Other mailbox notices reviewed

- Vercel domain-ownership-change notice is dated 2026-09-12; later project evidence has repeatedly production-verified the apex on Vercel, so do not treat that old email alone as a current outage.
- Render deploy-failed notice is dated 2026-09-13 and belongs to the retired automatic Render deployment path; it is not the current static production deployment path.
- Semrush's 2026-09-23 weekly report still surfaces historical `/cases/fc-002.html` ranking data; do not revive that historical product path from third-party lagging rank data.
- Ahrefs `Changed pages not submitted to IndexNow`, title/meta/H1/word-count changes and similar change detections are not equivalent to the three crawl errors above.

## Do not do next

- do not immediately add another Phone market/provider/ranking model;
- do not bulk-add weak global Phone rows;
- do not invent compatibility percentages or a Phone risk score;
- do not create country/provider doorway pages or a temporary-SMS backend;
- do not reopen Reset/Codex generic tracker work;
- do not reopen Relay methodology;
- do not migrate production to Astro as part of this repair;
- do not rotate trial accounts or upgrade/pay to bypass tool quotas;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.

## Session rule

The mailbox/site-alert audit is complete when this evidence is persisted. The next independent session task is the bounded missing-script repair above.