# Current Execution Queue

Last updated: 2026-09-24

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is the short atomic execution queue.

## Execution rule

Execute all eligible work continuously. When a new issue is discovered during an active task, automatically add it to the current work round and continue through diagnosis → smallest safe fix → tests → PR → CI/Eval/Preview → merge → production verification when all of the following are true:

- the defect is confirmed by evidence;
- the fix is reversible and bounded;
- it does not change product direction, billing, DNS, account-critical settings, privacy/security posture or other high-impact boundaries;
- no documented wait gate or provider blocker prevents execution.

Do not stop merely to narrate progress or ask the user to approve routine low-risk repairs. Stop only for a real authorization boundary, irreversible/high-impact choice, contradictory facts, or a documented blocker/wait condition.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT / UK PILOT SHIPPED / TECHNICAL ALERTS CLOSED / MEASUREMENT NEXT.**
2. **AI Reset Radar — FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.**
3. **Relay Exit Risk — DATA-ACCRUAL EXPERIMENT.**

Mandatory product-value and competition gates remain unchanged. Confirmed production defects may be repaired without treating those repairs as speculative product expansion.

## JUST COMPLETED — mailbox/site-alert defect closure

### Phone broken JavaScript

PR #207 removed the obsolete `/theme-toggle.js` request through the existing theme build step and added a public Phone release regression assertion requiring the built Phone page to contain the real inline `theme-runtime` and no `/theme-toggle.js` reference.

Verification:

- PR #207 diff remained limited to the theme build step + Phone public-release regression test;
- Eval Gate #701: **PASS**;
- Vercel Preview: **SUCCESS**;
- squash merge: `6e61a7aa9e95a15be4053d16ad91742a84ffe601`;
- Vercel production status for the merge commit: **SUCCESS**.

### Orphaned AI Credit discovery entry

The latest Ahrefs crawl reported exactly one orphan page. Ahrefs API detail access was blocked by the connected plan, so no URL was guessed from the alert alone. Repository inspection then found one concrete discovery inconsistency: `/tools/ai-credit-burn-rate-calculator/` remained sitemap-promoted after Reset primary/internal links were removed. No checked-in current HTML contains an incoming `href` to that URL.

PR #208 added `ai-credit-burn-rate-calculator` to the existing Reset primary-surface removal set. The direct URL remains preserved; build output no longer promotes it through the sitemap.

Verification:

- PR #208: one-line bounded change;
- Eval Gate #703: **PASS**;
- Vercel Preview: **SUCCESS**;
- squash merge: `4b444f029ee10a03d1116e8b097a8a31c2238a12`;
- Vercel production status for the merge commit: **SUCCESS**.

If a future authorized Ahrefs crawl identifies a different exact orphan URL, treat that as a new evidence-backed defect. Do not reopen this item from the old alert without an exact current URL.

## NEXT — measurement hold, then re-measure Phone

1. allow Search Console + meaningful interaction evidence to accrue;
2. re-measure the existing Phone canonical;
3. keep Google organic separate from referral/social/direct and AI referral;
4. if impressions appear without clicks, diagnose query/SERP fit before changing the product;
5. if clicks appear but use is weak, improve the existing canonical from interaction evidence;
6. expand to another market/network only when evidence quality and product-value gates pass.

## Search Console 404 notice

The 2026-09-20 Google Search Console validation notice still refers to some URLs returning 404. Existing project evidence confirms former public product paths such as `/cases/`, `/learn/`, `/stats/`, old `.well-known` files, old OpenAPI/feed/failure-index assets and `/mcp/` are intentionally real 404s and absent from the current production discovery surface. Do not revive or redirect them merely to make validation green. Re-open only if a currently intended URL is shown among affected examples.

## External waits

- **TikTok App Review — WAITING.** Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested.
- **AIR-4 Authority batch 2 — WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. No third target or follow-up before 2026-09-29 or later.

## Do not do next

- do not immediately add another Phone market/provider/ranking model;
- do not bulk-add weak global Phone rows;
- do not invent compatibility percentages or a Phone risk score;
- do not create country/provider doorway pages or a temporary-SMS backend;
- do not reopen Reset/Codex generic tracker work;
- do not reopen Relay methodology;
- do not migrate production to Astro as part of Phone work;
- do not rotate trial accounts or upgrade/pay to bypass tool quotas;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
