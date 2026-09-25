# Phone Radar Reviewed Source-Change Watch

Last updated: 2026-09-25

## Purpose

This watcher is the second bounded evidence observer for Phone Radar. Its role is to monitor **explicitly reviewed public official/commercial URLs** for provider-controlled changes such as current price, package, availability, purchase route and published retention/activation rules.

It does not decide operational truth, publish user-facing changes automatically, or crawl every seller/provider domain discovered by the community watcher. A content change creates a manual evidence-review signal.

## Host and schedule

- Host role: disposable observer VPS; not production infrastructure.
- Script: `/usr/local/bin/aineedhelp-phone-source-watch`
- Service: `aineedhelp-phone-source-watch.service`
- Timer: `aineedhelp-phone-source-watch.timer`
- Schedule: 00:37, 06:37, 12:37 and 18:37 UTC with up to 20 minutes randomized delay.
- Memory limit: 48 MiB; CPU quota: 40%.

## Data behavior

For every accepted target the watcher:

- checks `robots.txt` before the target request;
- uses a named project user agent;
- performs sequential requests with a one-second delay;
- uses ETag and Last-Modified conditional requests when available;
- strips scripts/styles/markup and hashes normalized visible text;
- stores only bounded state, short evidence summaries, latest-run rows and bounded change/run logs;
- records provider blocking/fetch errors separately from content changes.

Runtime state lives under `/var/lib/aineedhelp-phone-source-watch/`. No unique production dependency or irreplaceable state may depend on a disposable host.

## Target admission rule

The source list is curated, not discovered-and-crawled automatically.

A new URL may be added only when:

1. it is public and can be accessed without login/session circumvention;
2. robots/terms do not prohibit the intended bounded fetch pattern;
3. it supplies a decision-critical provider-controlled fact such as current price, package, stock, acquisition link, top-up, retention or published activation rule;
4. the source is specific enough that a text change can be meaningfully reviewed;
5. adding it does not turn the observer into a broad seller/forum crawler.

Externally linked domains discovered by `phone-demand-watch` are therefore **candidate sources only**. Review them first; do not automatically enqueue them.

Seller/reseller pages may be admitted when they are legitimate public commercial sources whose changing price/stock/acquisition information materially affects a Phone Radar route. Their presence does not certify reliability. Seller trust, non-delivery, invalid-number, refund and replacement outcomes remain community/operational evidence and must be tracked separately.

## Status semantics

- `ok`: source fetched and normalized successfully.
- `not-modified`: legitimate HTTP 304 from a previously baselined source.
- `robots-skip`: target is not fetched because robots access could not be safely confirmed or the path is disallowed.
- `fetch-error`: source request failed or was blocked; this is a provider/source condition, not evidence of a policy change.
- `content-change`: normalized visible-text hash changed; manual evidence verification is required before changing product data.

## Verified baseline

First clean systemd run on 2026-09-16:

- 22 total targets;
- 16 fetched successfully or returned legitimate 304;
- 2 Ultra Mobile targets skipped because that host returned HTTP 403 for `robots.txt`;
- 4 Tello targets recorded as provider-side HTTP 403;
- service exited 0 successfully;
- peak memory was 23.3 MiB;
- stored state was about 144 KiB after baseline runs.

The Ultra/Tello conditions are blockers for those source fetches only. They must not be treated as route-policy changes or as evidence that the underlying provider information disappeared.

## Sep 25 live health / change-review checkpoint

A live observer check at the 2026-09-25 06:54 UTC completed run verified:

- 22 total reviewed targets;
- 16 fetched successfully or returned legitimate 304;
- 2 Ultra Mobile targets remained `robots-skip`;
- 4 Tello targets remained provider-side HTTP 403 `fetch-error`;
- service exit status was 0 and the next timer was scheduled normally.

This is a healthy watcher with source-specific blockers, not a collection outage.

The same run emitted `content-change` signals for `mobal_pricing` and `mobal_id`. The `mobal_pricing` hash returned to a previously observed hash after changing on Sep 24, so it may represent a revert or page churn rather than a durable commercial change. `mobal_id` also changed. Hash events are review triggers only: the next bounded task is to compare current Mobal pricing and voice-product ID-requirement content with the existing accepted Phone facts before any product edit.

## Current source families

The checked-in set covers reviewed official evidence for giffgaff, Lebara UK, Tello, Ultra Mobile PayGo, H2O Wireless, Mobal Japan, Mainland China government/telecom guidance and Airalo SMS/call capability guidance.

This list is not a statement of Phone Radar route priority. It reflects the sources that had previously passed the observer admission review.

## Relationship to community intelligence

Use the two observers for different jobs:

- `phone-demand-watch`: discovers current user demand, route outcomes, app compatibility, acquisition paths, seller/platform incidents and candidate public domains.
- `phone-source-watch`: monitors a small reviewed list for provider-controlled commercial/rule changes.

A provider page cannot override repeated current operational evidence simply because the provider does not document the behavior. Likewise, a forum post does not establish a current list price when the seller's public checkout says otherwise. Preserve the source-role separation.

## Operating rule

Review `latest.tsv` and `events.tsv` only when a change or source-health question matters. Do not create automatic product edits from hashes. At disposable-host expiry, retire the watcher or deliberately migrate it; do not let the product depend on the host surviving.

Current runtime status must be verified on the actual observer host. Do not infer success/failure from `qwen-control`, `yuan`, `hermes` or an unidentified/offline Remote Desktop Commander device.
