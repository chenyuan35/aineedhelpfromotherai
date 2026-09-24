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

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT / UK PILOT LIVE / BACKSTAGE EVIDENCE ACQUISITION ACTIVE / PUBLIC EXPANSION MEASUREMENT-GATED.**
2. **AI Reset Radar — FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.**
3. **Relay Exit Risk — DATA-ACCRUAL EXPERIMENT.**

Phone public production should not churn from tiny search samples, but the Phone research/data pipeline must continue running. A measurement hold is not a research hold.

## Active Search Console measurement path

- **Use Windsor.ai `searchconsole` for current Search Console reads.** The connected account is `sc-domain:aineedhelpfromotherai.com`.
- **Do not use GSC Wizard for new reads.** Its free/trial quota is exhausted and the project marks it deprecated.
- If Windsor.ai access/quota later fails, classify that as a provider/access blocker and fall back to Google's official Search Console API/export; do not rotate trial accounts or change billing without authorization.
- Historical GSC Wizard evidence remains valid for the dates when it was collected.

Latest Phone signal from Windsor.ai on 2026-09-24 using fresh data for 2026-09-20 through 2026-09-24:

- query: `survival number`;
- date: 2026-09-23;
- impressions: 1;
- clicks: 0;
- average position: 22.

One impression is not enough evidence for a public product change.

## JUST COMPLETED — Phone community intelligence watcher v1.1

PR #211 upgraded the existing bounded community watcher without turning it into a broad crawler:

1. hourly timer with up to 10 minutes jitter, replacing the four-hour cadence that could miss shallow/high-turnover NodeSeek RSS items;
2. structured service tags for OpenAI/ChatGPT/Codex, Claude, Telegram, WhatsApp, TikTok, Google, Reddit and Discord;
3. commerce/risk flags for marketplace/reseller/deal/non-delivery/refund/seller-trust signals;
4. bounded extraction of externally linked public hostnames for later manual source review;
5. new bounded `candidates.tsv` while preserving legacy `signals.tsv` compatibility;
6. regression test covering parser syntax, watcher syntax, timer cadence and the new structured fields;
7. Eval Gate integration so future changes cannot silently break the watcher contract.

Verification:

- PR #211: **MERGED**;
- Eval Gate #709: **PASS**, including the new watcher audit and existing Phone build/eval checks;
- squash merge: `3204ee0be13411c146e1031bbf13a094949f679f`;
- no production Phone page or new public URL changed.

Safety/collection boundary remains strict: public feeds only, no login automation, no anti-bot/403/429 bypass, no whole-forum crawling, no full-post archive, no collection of phone numbers/SMS codes, and no reproduction or operationalization of moderation-evasion code words.

## NEXT / BLOCKER — deploy on the actual observer host

Runtime deployment is not currently verifiable from available control paths:

- `qwenpaw-sbs-prod-h2grp` / `qwen-control` is online but **is not the Phone systemd observer host**. A 2026-09-24 cleanup removed stale headless Chromium, old test HTTP servers and a stuck Vercel CLI process; available RAM improved from about 313 MiB to about 2.5 GiB. The host still has no swap. Freed memory does not change the host role automatically.
- `codex-vps` is visible on the Tailscale network, but `tailscale ssh` currently requires a fresh authorization check and ordinary SSH to the Tailscale address timed out.
- two unnamed Remote Desktop Commander devices are offline; their identity must not be guessed from old chat state.
- `yuan` is the personal workstation and must not host project watchers.
- `hermes` is forbidden for this project.

Next runtime trigger: when the actual disposable observer host becomes reachable/identifiable, deploy main's v1.1 files and verify a real systemd run, source health, peak memory and next timer. Do not claim watcher health before that evidence exists.

## SECOND OBSERVER — reviewed source-change watch

`phone-source-watch` remains the separate role for explicitly reviewed public official/commercial URLs. It should monitor changing provider-controlled facts such as price, package, availability and published rules with robots checks, sequential low-rate requests and conditional requests.

Externally linked seller/provider/tutorial domains found by the community watcher are candidates only. Add one to the source watcher only after source value, robots/terms and decision relevance are reviewed. Never auto-crawl every linked domain.

## Phone publication queue

Current public Phone surface remains the UK index/matrix. Evidence acquired backstage can lead to either:

- an evidence-backed improvement/row on the existing index; or
- an evidence-rich route detail page when it solves a distinct execution job and passes the publication gate in `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`.

Do not create country/provider pages for coverage. A separate route page requires unambiguous route identity/acquisition, current commercial facts, meaningful independent operational evidence, substantial unique execution content, visible freshness/conflicts and both product-value gates.

## Search Console 404 notice

The 2026-09-20 Google Search Console validation notice still refers to some URLs returning 404. Existing project evidence confirms former public product paths such as `/cases/`, `/learn/`, `/stats/`, old `.well-known` files, old OpenAPI/feed/failure-index assets and `/mcp/` are intentionally real 404s and absent from the current production discovery surface. Do not revive or redirect them merely to make validation green. Re-open only if a currently intended URL is shown among affected examples.

## External waits

- **TikTok App Review — WAITING.** Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested.
- **AIR-4 Authority batch 2 — WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. No third target or follow-up before 2026-09-29 or later.

## Do not do next

- do not stop Phone research merely because the public page is in a measurement window;
- do not immediately bulk-add another market/provider/ranking model to production;
- do not bulk-add weak global Phone rows;
- do not invent compatibility percentages or a Phone risk score;
- do not create country/provider doorway pages or a temporary-SMS backend;
- do not scrape login-gated marketplaces or teach moderation evasion;
- do not reopen Reset/Codex generic tracker work;
- do not reopen Relay methodology;
- do not migrate production to Astro as part of Phone work;
- do not rotate trial accounts or upgrade/pay to bypass tool quotas;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
