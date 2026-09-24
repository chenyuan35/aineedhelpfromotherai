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

## NEXT / BLOCKER — recover authenticated access to the verified trial observer

The primary observer host is now identified from Qwen-local evidence; runtime deployment is blocked by authentication/control-channel access rather than host discovery:

- `qwenpaw-sbs-prod-h2grp` / `qwen-control` is the verified control/jump path and **is not the Phone systemd observer host**. Do not move the watcher onto Qwen merely because Qwen is reachable.
- Qwen SSH history identifies the original one-month Debian 13 trial observer as the 128 MiB RAM / 1 GiB root NAT host administered on Sep 15. The same NAT SSH endpoint is reachable on Sep 24 and its ED25519 host key matches the Sep 15 known-host entry, so this is still the original VPS rather than a replacement/reinstall.
- Sep 15 logs show password SSH management first, then successful Remote Desktop Commander enrollment on that same trial host. One formerly unnamed/offline RDC identity can therefore be safely mapped to this observer. The RDC control channel itself is not currently online.
- Qwen has a dedicated `aineedhelp_trial_backup_ed25519` key created Sep 15, but the execution record contains no successful step proving that public key was installed on the trial host. Current non-interactive/default SSH is rejected, so do not claim key-based access exists.
- `codex-vps` is the other verified downstream machine managed from Qwen via Tailscale/SSH. It remains visible, but fresh Tailscale SSH authorization is required and it already has a Relay-history role; do not automatically repurpose it as the second Phone observer.
- The trial VPS provider/vendor is **not** recorded in canonical project facts. Do not infer it from IP ownership, kernel naming or matching low-end specs.
- one other unnamed/offline RDC device may still exist and remains unverified; do not guess its identity.
- `yuan` is the personal workstation and must not host project watchers; `hermes` is forbidden for this project.

Next runtime trigger: recover authorized access to the identified 128 MiB trial observer through the existing Qwen SSH/control chain, then inspect `remote-desktop-commander.service`, watcher timers/journals, boot/OOM history and stored evidence **before** restarting or reinstalling anything. Only after that inspection should main's v1.1 be deployed and a real systemd run/source-health/memory/next-timer check be recorded.

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
