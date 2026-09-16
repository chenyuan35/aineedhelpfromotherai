# Phone Lifecycle Official-Source Watch

Last updated: 2026-09-16

## Purpose

This watcher is a disposable evidence-change observer for the Phone Number Lifecycle product. It does not publish or rewrite user-facing rules automatically. A content change only creates a manual review signal.

## Host and schedule

- Host role: one-month disposable observer VPS; not production infrastructure.
- Script: `/usr/local/bin/aineedhelp-phone-source-watch`
- Service: `aineedhelp-phone-source-watch.service`
- Timer: `aineedhelp-phone-source-watch.timer`
- Schedule: 00:37, 06:37, 12:37 and 18:37 UTC with up to 20 minutes randomized delay.
- Memory limit: 48 MiB; CPU quota: 40%.

## Data behavior

The watcher checks 22 official-source URLs used by Draft PR #62 durable phone/eSIM routes. Temporary SMS-activation marketplaces are deliberately excluded.

For each target it:

- checks `robots.txt` before the target request;
- uses a named project user agent;
- performs sequential requests with a one-second delay;
- uses ETag and Last-Modified conditional requests when available;
- strips scripts/styles/markup and hashes normalized visible text;
- stores only bounded state, short evidence summaries, latest-run rows and bounded change/run logs;
- records provider blocking/fetch errors separately from content changes.

Runtime state lives under `/var/lib/aineedhelp-phone-source-watch/`. No unique production dependency or irreplaceable state may depend on this trial host.

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

## Source families

The deployed set covers official evidence for giffgaff, Lebara UK, Tello, Ultra Mobile PayGo, H2O Wireless, Mobal Japan, Mainland China government/telecom guidance and Airalo SMS/call capability guidance.

## Operating rule

Review `latest.tsv` and `events.tsv` only when a change or source-health question matters. Do not create automatic product edits from hashes. At trial-host expiry, retire the watcher or deliberately migrate it; do not let the product depend on the host surviving.