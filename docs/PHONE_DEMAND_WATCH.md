# Phone Radar Community Intelligence Watch

Last updated: 2026-09-25

## Purpose

This is the discovery/intelligence observer for Phone Radar. It watches a small set of public community feeds for current questions, complaints, recommendations and first-hand experiences around phone numbers, SIM/eSIM, SMS verification, roaming, activation, KYC, retention, acquisition channels and seller/platform failures.

Community evidence is allowed to establish operational reality when it is specific, current and attributable. Provider/operator pages remain the source for provider-controlled commercial facts such as list price, package, stock and published fees. A community signal may become a route observation, a seller/platform risk lead or a research priority; it never auto-publishes to the production matrix.

## Deployment

- Host role: disposable observer VPS; not production infrastructure.
- Timer: `aineedhelp-phone-demand-watch.timer`.
- Cadence in repository v1.1: every 1 hour after the previous run, with up to 10 minutes randomized delay.
- Service: `aineedhelp-phone-demand-watch.service`.
- Script: `/usr/local/bin/aineedhelp-phone-demand-watch`.
- Parser: `/usr/local/lib/aineedhelp/phone-demand-parse.pl`.
- State/output: `/var/lib/aineedhelp-phone-demand-watch/`.
- Memory cap remains 48 MiB.
- No paid API, proxy, login automation, anti-bot bypass or hidden/private endpoint is used.

The hourly cadence is still deliberately light: each enabled feed is requested at most roughly 24 times per day, with inter-source sleeps and randomized timer delay. This is intended to reduce missed posts on shallow/high-turnover feeds without turning the observer into a crawler.

## Current public feeds

- Reddit combined feed: r/eSIMs + r/NoContract.
- NodeLoc latest RSS.
- NodeSeek RSS.
- V2EX Atom feed.

The watcher intentionally reads public feed endpoints rather than crawling whole forums. Sources that rate-limit or block the observer are recorded as source-health failures and are not bypassed.

## Stored data

The observer stores only bounded discovery metadata:

- source;
- lifecycle/decision category;
- inferred discussion intent (`question`, `complaint`, `recommendation`, `experience`);
- available thread activity count when exposed by the feed;
- published timestamp;
- title;
- canonical thread URL;
- short excerpt capped by the parser;
- service tags when mentioned, currently including OpenAI/ChatGPT/Codex, Claude, Telegram, WhatsApp, TikTok, Google, Reddit and Discord;
- commerce/risk flags such as marketplace, reseller, deal, delivery failure, refund issue and seller-trust complaint;
- up to six externally linked public hostnames found in the feed excerpt, for later manual review as possible seller/provider/tutorial sources.

It does not archive complete forum posts, user accounts, phone numbers, SMS codes or private messages.

Useful files:

- `latest.md` — human-readable current matching discussions, service/commerce tags and source health;
- `latest.tsv` — current feed matches with the v1.1 structured fields;
- `signals.tsv` — legacy-compatible deduplicated signal history;
- `candidates.tsv` — bounded v1.1 candidate history including service/commerce tags and mentioned public hosts;
- `sources.tsv` — source health for the latest run;
- `state/seen.txt` — bounded dedupe hashes.

## First verified live run

After parser compatibility fixes, the original real systemd run exited successfully with peak memory about 16.7 MiB. NodeLoc, NodeSeek and V2EX returned HTTP 200. Reddit returned HTTP 429 during repeated setup testing and was intentionally left to the normal low-frequency timer for retry.

The first valid signal was a V2EX question asking, in substance, which foreign card/number was best in September 2026 for registering commonly used accounts. This directly supports the Phone Radar acquisition/verification job rather than creating a new product surface.

## Sep 16 Chinese-filter follow-up

A live NodeSeek check exposed two separate coverage issues. First, the public NodeSeek RSS exposes only about 20 newest items, so a fast-moving thread could rotate out before the original four-hour observer run. That feed-depth limitation is the reason v1.1 moves the lightweight feed observer to hourly checks rather than authorizing whole-forum crawling or aggressive request rates.

Second, the minimal Perl runtime was reading feed files as raw UTF-8 bytes while the parser used Unicode source-string semantics. The parser matches the UTF-8 feed bytes consistently, includes Chinese lifecycle terms such as `流量卡`, and truncates excerpts only at a valid UTF-8 boundary.

## Sep 17 manual AIS Thailand signal

A user-shared NodeSeek thread, `泰国AIS保号卡国内折腾记录` (`https://www.nodeseek.com/post-932925-1`), was a strong manual discovery signal because one discussion spanned nearly the full Phone Radar journey instead of only asking for a cheap SIM. It covered purchase channel, passport/KYC, international roaming, overseas SMS reception, conversion to long-term personal use, eSIM re-issue, Wi-Fi Calling, top-up, validity extension and recovery-oriented ownership questions.

The discussion generated concrete product fields rather than a new product surface: exact acquisition route, SIM/eSIM form, activation deadline, number continuity after eSIM replacement, support-assisted validity extension, overseas Wi-Fi Calling and OTP behavior.

## Sep 24 intelligence upgrade

Current public research demonstrates why the observer must capture more than generic `eSIM`/`OTP` mentions. A recent LINUX DO walkthrough about ESIM.gg reported a complete purchase/configuration path and explicitly tested WhatsApp and GPT SMS reception, while another recent community thread discussed low-cost US eSIM options, programmable eSIM cards and service-specific registration outcomes. A long-running r/eSIMs thread also shows routes changing over time: options disappear, activation rules change, and users repeatedly ask for numbers that work for verification abroad.

Repository v1.1 therefore adds three discovery dimensions without turning the watcher into an auto-publisher:

1. **service tags** — identify which apps/services a report actually concerns;
2. **commerce/risk flags** — identify reseller/marketplace/deal/non-delivery/refund/trust reports;
3. **mentioned public hosts** — retain only hostnames of externally linked public resources so a later research pass can decide whether a seller/provider/tutorial domain deserves review.

Marketplace-evasion language may be flagged only as a restricted-marketplace mention. The watcher must not collect, reproduce or operationalize code words intended to bypass marketplace moderation, and it must not automate access behind login/anti-bot controls.

## Sep 25 runtime deployment and recovery

The original trial observer was recovered through Qwen using the already-present dedicated backup key after verifying that the live ED25519 host key still matched the Sep 15 fingerprint. Before any deployment, read-only audit found the watcher state intact but the 1 GiB root filesystem at 100%. Phone-demand runs had been logging `No space left on device` while still exiting 0, so service exit status alone was not sufficient health evidence.

Watcher state, scripts and units were copied off-host to Qwen first. The largest safe removable artifact was an unused 196 MB Puppeteer Chrome download ZIP; RDC is configured with `DC_SKIP_CHROME_DOWNLOAD=1` and no process referenced the cache. Removing only that ZIP reduced root usage to 82%. No project data was deleted.

The v1.1 files from GitHub `main` at `9c4fa5c` were then deployed and checksum-verified. The real systemd run completed with all four public feed sources HTTP 200, `matched=25`, `candidate_total=6`, exit 0 and 19.3 MiB peak memory. The timer is enabled/active at one hour with up to ten minutes randomized delay. Post-v1.1 state, including `candidates.tsv`, was copied back to Qwen.

RDC itself remains unenrolled because its persisted refresh token is invalid (`Already Used`); the observer is currently controlled through Qwen key-only SSH. This does not justify reinstalling the host or moving the watcher elsewhere.

## Sep 25 first v1.1 candidate review

The first verified v1.1 run produced six candidate records. All six have now been manually dispositioned in `docs/PHONE_WATCHER_CANDIDATE_REVIEW_2026-09-25.md`.

Two were useful enough to promote into durable backstage research packets: a Saily Switzerland data-eSIM failure/refund incident cluster and a Fortress haha SIM retention-price conflict. The other four were correctly stopped at review: one device-only iPhone IMEI question with no route outcome, one already-known Ultra Mobile `$3` PayGo seller lead that added no safe independent operational evidence, and two obvious non-Phone false positives (a VPS carpool post and a retail beverage complaint).

This confirms the manual review gate is necessary. Watcher candidate emission is a recall mechanism, not a publication or truth signal. The haha SIM conflict is the next bounded research task; no public route was added from this batch.

## Sep 25 watcher batch 2 review

By the 2026-09-25 09:08 UTC live run, `candidates.tsv` had grown to 61 candidate records. The 55 records after the first six were all dispositioned in `docs/PHONE_WATCHER_CANDIDATE_REVIEW_BATCH2_2026-09-25.md`.

- 2 were promoted to backstage research packets: Globe Philippines long-term/roaming eligibility and Holafly Always On emergency data;
- 10 were insufficient or demand-only;
- 1 was a duplicate/restricted seller lead;
- 42 were false positives;
- no public route/page changed.

The same live checkpoint verified all four community feed sources at HTTP 200 and normal hourly scheduling. It also exposed a precision defect: 24 of the 55 records were excess V2EX `#replyN` fragment variants for already-seen root threads. This increases manual review cost but is not a source-health failure. A later bounded repair should normalize fragment-only URLs for dedupe while preserving genuinely new evidence; do not remove or broadly suppress V2EX.

## Sep 25 V2EX fragment-dedupe repair

The batch-2 precision defect is closed. PR #225 changed V2EX dedupe identity from the full `#replyN` URL to the root-thread URL while preserving the original observed URL in stored metadata and leaving all other source dedupe behavior unchanged. Regression coverage proves multiple reply fragments share one V2EX root key while distinct roots remain distinct. Eval Gate #740 and Vercel passed.

The first live deployment then exposed a migration-only edge: legacy `state/seen.txt` entries had been hashed from the old fragment-bearing URLs. PR #226 added a bounded compatibility check against historical `candidates.tsv`; when a V2EX root already exists there, the watcher seeds the new normalized hash and does not re-emit the old thread. Unseen roots still flow normally. Eval Gate #742 and Vercel passed.

Before cleanup, observer state was copied to Qwen. Five rows from the 2026-09-25 14:32:38 UTC migration run were individually verified to have older same-root V2EX records, then removed from `candidates.tsv` and `signals.tsv`; unrelated rows were preserved. The final real run at 14:42:17 UTC exited 0 with the timer active, stayed below the 48 MiB memory cap, returned HTTP 200 for all four community feeds, matched four V2EX items, and emitted no V2EX candidate. The only new candidate from that run was a new NodeSeek thread, confirming that new evidence remained observable.

## Interpretation rules

- Repeated questions can prioritize product copy, decision paths and evidence gaps.
- Detailed current first-hand operational reports can become route observations after provenance/deduplication review.
- Complaints can reveal failure modes, seller/platform risk and recovery/refund outcomes.
- Recommendations identify routes/providers/sellers worth researching, not routes to auto-add.
- One post is not demand proof by itself.
- Provider/operator pages validate provider-controlled commercial facts; they do not override current independent operational outcomes simply because a behavior is undocumented.
- A direct carrier/support reply reproduced in a community thread is a first-party support artifact with a provenance/retrievability limitation; do not collapse it into ordinary hearsay.
- Rate limits, 403/429 responses and feed outages are provider/source states, not evidence that demand disappeared.
- Externally linked seller/provider domains are candidate sources only. Do not automatically crawl them; review robots/terms/source value first.

## Two-observer operating model

Phone evidence acquisition should run as two bounded roles when the disposable observer hosts are available:

- **Community intelligence observer** — this watcher; finds user demand, route outcomes, app compatibility, acquisition paths, seller/platform incidents and candidate linked domains.
- **Reviewed source-change observer** — `PHONE_SOURCE_WATCH.md`; checks only explicitly reviewed public official/commercial URLs for price/package/availability/rule changes with robots checks and bounded storage.

Neither host is production infrastructure. Valuable candidate summaries must be moved off disposable nodes before expiry; raw observer state is replaceable.

## Retirement / migration

Observer hosts are disposable. Before a trial VPS expires, either retire the observer or deliberately move only the small watcher/state needed to a reviewed host. Do not make production depend on these nodes and do not leave unique valuable history only on a trial machine.
