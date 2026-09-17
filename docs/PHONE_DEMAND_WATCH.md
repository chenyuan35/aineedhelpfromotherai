# Phone Community Demand Radar

Last updated: 2026-09-17

## Purpose

This is a discovery observer for the Phone Number Lifecycle product. It watches a small set of public community feeds for current questions, complaints, recommendations and user experiences around phone numbers, SIM/eSIM, SMS verification, roaming, activation, KYC and retention.

Community content is not an authoritative carrier rule. A forum signal may prioritize research or expose a failure mode, but production route facts still require current official evidence.

## Deployment

- Host: disposable one-month observer VPS.
- Timer: `aineedhelp-phone-demand-watch.timer`.
- Cadence: every 4 hours after the previous run, with up to 15 minutes randomized delay.
- Service: `aineedhelp-phone-demand-watch.service`.
- Script: `/usr/local/bin/aineedhelp-phone-demand-watch`.
- Parser: `/usr/local/lib/aineedhelp/phone-demand-parse.pl`.
- State/output: `/var/lib/aineedhelp-phone-demand-watch/`.
- No paid API, proxy or bypass service is used.

## Current public feeds

- Reddit combined feed: r/eSIMs + r/NoContract.
- NodeLoc latest RSS.
- NodeSeek RSS.
- V2EX Atom feed.

The watcher intentionally reads feed endpoints rather than crawling whole forums. Sources that rate-limit or block the observer are recorded as source-health failures and are not bypassed.

## Stored data

The observer stores only bounded discovery metadata:

- source;
- lifecycle category;
- inferred discussion intent (`question`, `complaint`, `recommendation`, `experience`);
- available thread activity count when exposed by the feed;
- published timestamp;
- title;
- canonical thread URL;
- short excerpt capped by the parser.

It does not archive complete forum posts.

Useful files:

- `latest.md` — human-readable current matching discussions and source health;
- `latest.tsv` — current feed matches;
- `signals.tsv` — deduplicated newly observed signals, bounded locally;
- `sources.tsv` — source health for the latest run;
- `state/seen.txt` — bounded dedupe hashes.

## First verified live run

After parser compatibility fixes, the real systemd run exited successfully with peak memory about 16.7 MiB. NodeLoc, NodeSeek and V2EX returned HTTP 200. Reddit returned HTTP 429 during repeated setup testing and is intentionally left to the normal low-frequency timer for retry.

The first valid signal was a current V2EX question asking, in substance, which foreign card/number is best in September 2026 for registering commonly used accounts. This directly supports the existing Phone Number Lifecycle acquisition/verification job rather than creating a new product surface.

## Sep 16 Chinese-filter follow-up

A live NodeSeek check exposed two separate coverage issues. First, the public NodeSeek RSS currently exposes only about 20 newest items, so a fast-moving thread can rotate out before the four-hour observer run. This is a known feed-depth limitation, not permission to crawl the forum or raise request frequency aggressively on the resource-tight observer. User-shared threads that have already rotated out may still be evaluated manually as discovery evidence.

Second, the minimal Perl runtime was reading feed files as raw UTF-8 bytes while the parser used Unicode source-string semantics. That made Chinese-only lifecycle terms unreliable. The parser now matches the UTF-8 feed bytes consistently, adds `流量卡` as a discovery term, and truncates excerpts only at a valid UTF-8 boundary. A real current NodeSeek sample changed from one match to two and correctly surfaced the Chinese-only title `大佬们，有没有流量卡推荐`.

## Sep 17 manual AIS Thailand signal

A user-shared NodeSeek thread, `泰国AIS保号卡国内折腾记录` (`https://www.nodeseek.com/post-932925-1`), is a strong manual discovery signal because one discussion spans nearly the full Phone Number Lifecycle journey instead of only asking for a cheap SIM. The thread covers purchase channel, passport/KYC, international roaming, overseas SMS reception, conversion to long-term personal use, eSIM re-issue, Wi-Fi Calling, top-up, validity extension and recovery-oriented ownership questions.

The discussion also generated concrete follow-up questions that map directly to product fields rather than a new product surface:

- whether the Trip-purchased AIS offer is eSIM or physical SIM;
- whether a 5/7/10-day travel package creates a deadline for completing conversion/ownership steps;
- whether a replacement eSIM invalidates the old profile while retaining the same phone number;
- whether the reported THB 49 validity package is permanent or one year;
- whether the long-validity package is requested through customer service;
- whether overseas Wi-Fi Calling and SMS/OTP reception require additional setup.

Current first-party AIS pages reviewed on 2026-09-17 resolve several of those questions. AIS officially sells SIM2Fly in both eSIM and physical-SIM form, so a Trip purchase cannot be classified without the exact listing. SIM2Fly package durations such as 5/7/10 days are data-package validity windows tied to activation/first connection in an eligible destination, not evidence that the whole ownership-conversion flow must be completed inside that many days. Separately, AIS states that foreign TOURIST SIM users who continue beyond 60 days must reconfirm identity, and that a number registered to an individual must be activated within 60 days of registration or require identity verification again.

AIS also documents standard eSIM conversion/transfer. The process deactivates the previous SIM/eSIM and installs the transferred line on the new eSIM; AIS describes and displays it as transferring the existing phone number, so standard conversion/transfer preserves number continuity rather than issuing a different number. AIS also publishes international roaming activation/use guidance and Wi-Fi Calling use abroad.

The remaining material evidence gap is the forum-reported `THB 49 / 365 days` validity package. That exact offer was not found in the public indexed AIS pages checked in this work round. A second current community source independently discussed the same 49-baht/365-day offer, which raises research priority but does not upgrade the claim to production evidence.

Decision: record AIS Thailand as a high-value candidate route/evidence gap for the existing Phone canonical, but do not add it to the production catalog yet. Before any route addition, obtain a current first-party AIS source or another directly verifiable AIS artifact for the exact validity package and confirm the exact Trip listing/channel assumptions. This signal does not justify a Thailand-specific page.

## Interpretation rules

- Repeated questions can prioritize product copy, decision paths and evidence gaps.
- Complaints can reveal failure modes that need official verification.
- Recommendations can identify providers/routes worth researching, not routes to auto-add.
- One post is not demand proof by itself.
- Forum claims never override current official carrier/provider documentation.
- Rate limits, 403/429 responses and feed outages are provider/source states, not evidence that demand disappeared.

## Retirement / migration

The host is disposable. Before the trial VPS expires, either retire this observer or deliberately move only the small watcher/state needed to a reviewed host. Do not make production depend on this node and do not leave unique valuable history only on the trial machine.