# Phone Community Demand Radar

Last updated: 2026-09-16

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

## Interpretation rules

- Repeated questions can prioritize product copy, decision paths and evidence gaps.
- Complaints can reveal failure modes that need official verification.
- Recommendations can identify providers/routes worth researching, not routes to auto-add.
- One post is not demand proof by itself.
- Forum claims never override current official carrier/provider documentation.
- Rate limits, 403/429 responses and feed outages are provider/source states, not evidence that demand disappeared.

## Retirement / migration

The host is disposable. Before the trial VPS expires, either retire this observer or deliberately move only the small watcher/state needed to a reviewed host. Do not make production depend on this node and do not leave unique valuable history only on the trial machine.