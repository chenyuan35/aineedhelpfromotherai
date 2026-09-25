# Current Execution Queue

Last updated: 2026-09-25

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

## NEXT SESSION — one bounded task only

**Task:** resolve the current Fortress haha SIM keep-alive/recharge conflict.

**Why now:** the first watcher v1.1 candidate review is complete. The highest-value unresolved finding is a long-term SMS/OTP route where current community sources still report `HKD 10` online recharge for a one-year extension, while 3HK's current prepaid recharge page says validity is extended for `HKD 100+` top-ups and the English rendering states a `HKD 100` minimum. Publishing either value without resolving the conflict would violate the Phone evidence rules.

**Allowed sequence:**
1. read `docs/PHONE_WATCHER_CANDIDATE_REVIEW_2026-09-25.md` and the existing haha SIM section in `docs/USER_DIRECTED_CURSOR_PHONE_RESEARCH_2026-09-19.md`;
2. verify current first-party 3HK/Fortress/haha SIM recharge, expiry and registration material that is publicly accessible;
3. seek one or more fresh independent reproductions of the actual recharge amount, payment path and post-recharge expiry effect without bypassing login/anti-bot controls;
4. reconcile the route into one current state: resolved rule with provenance/freshness, or explicit unresolved conflict/HOLD.

**Done:** the current haha SIM recharge/validity rule is either resolved with attributable current evidence or explicitly remains HOLD because the conflict cannot be safely resolved; no guessed amount remains in the research state.

**Stop / do not substitute:** do not auto-publish the route, do not bypass 403/login/anti-bot controls, do not treat old tutorials as current truth when first-party material conflicts, and do not switch to another Phone route merely because this conflict is difficult.

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

## JUST COMPLETED — first watcher v1.1 six-candidate review

The six records from the first verified `candidate_total=6` run are fully dispositioned in `docs/PHONE_WATCHER_CANDIDATE_REVIEW_2026-09-25.md`.

- **Promoted backstage:** Saily Switzerland data-eSIM failure/refund incident cluster; Fortress haha SIM keep-alive price conflict.
- **Not promoted:** iPhone eSIM/IMEI question (insufficient/no route outcome); Ultra Mobile `$3` PayGo seller post (existing route + unsafe third-party SMS-code handling, no new independent outcome); DMIT VPS carpool and V2EX beverage complaint (false positives).
- Direct NodeSeek/Reddit page reads that returned ordinary HTTP 403 were not bypassed; public search/indexed copies and current official sources were used only where available.
- No public Phone page, route or score changed from watcher output alone.

The next bottleneck is resolving the haha SIM `HKD 10` community claim against current 3HK `HKD 100+` validity-extension language.

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

## VERIFIED RUNTIME — trial observer access and watcher v1.1

The Sep 25 bounded recovery/audit task is complete:

- Qwen's existing dedicated trial-backup key authenticates successfully to the original 128 MiB / 1 GiB Debian 13 observer; the live ED25519 host key matches the stored Sep 15 fingerprint.
- Read-only inspection found all four observer timers enabled, latest service results at exit 0, no OOM event in the inspected boot, and Phone watcher state intact.
- The root filesystem was 100% full. Phone-demand runs since Sep 24 07:33 logged repeated `No space left on device` while still returning exit 0, so systemd success alone had become a false-health signal.
- The dominant removable item was an unused 196 MB Puppeteer Chrome download ZIP inside a 450 MB cache. RDC is explicitly configured with `DC_SKIP_CHROME_DOWNLOAD=1`, no process referenced that cache, and only the redundant ZIP was deleted after backing up watcher state/scripts/units to Qwen. Root usage fell to 82%.
- `remote-desktop-commander.service` is not the recovered control path: its persisted refresh token is invalid (`Already Used`) and the unit had reached 148 restarts while waiting for new device authorization. No re-enrollment/reinstall was performed.
- GitHub `main` watcher v1.1 (`9c4fa5c`) was deployed with matching file checksums. The real verification run completed 4/4 sources HTTP 200, `matched=25`, `candidate_total=6`, exit 0, 19.3 MiB memory peak; the timer is enabled/active at 1 hour with up to 10 minutes jitter.
- Post-v1.1 observer state, including `candidates.tsv`, was copied back to Qwen so current evidence is not unique to the disposable host.

Current observer control is Qwen → key-only SSH. RDC repair is optional and should not displace Phone evidence work unless SSH becomes inadequate.

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
