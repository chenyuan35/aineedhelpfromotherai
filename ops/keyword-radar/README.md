# Keyword Radar

Low-cost daily discovery for new utility-page ideas. It uses public Google and Bing autocomplete endpoints, requires no paid API key, stores only keyword suggestions, and never bypasses login/paywall/quota controls.

The radar deliberately does not pretend autocomplete equals search volume. Its score ranks discovery signals: source diversity, repeated seed matches, strong tool intent, reset/repeat intent, and whether a phrase is newly observed.

## Outputs

Default VPS data directory: `/var/lib/aineedhelp-radar/`

- `latest.md` — human-readable top shortlist
- `latest.json` — structured result plus request warnings
- `seen.json` — first/last-seen state used to identify new phrases
- `reports/*.json` — timestamped run history

## Install on the VPS

```sh
sudo sh ops/keyword-radar/install.sh
```

The installer uses a systemd timer when PID 1 is systemd. In the current QwenPaw container, PID 1 is supervisord, so it installs a tiny Python scheduler, starts it immediately without restarting QwenPaw, and appends a supervisord program entry for future container restarts. The default daily run is around 03:20 UTC with up to 20 minutes of jitter.

## Local test

```sh
python3 radar.py --data-dir /tmp/aineedhelp-radar-test --max-queries 6 --sleep 0
```

## Selection rule

Use the radar for discovery, then validate promising pages with Ubersuggest/other metrics when available, official documentation for changing product rules, public user discussions, and eventually the site's own Search Console impressions.
