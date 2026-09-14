# Relay risk source refresh

`runner.py` refreshes approved/public relay measurement sources for the Relay Exit Risk Checker.

Current ingested source:
- Sinan Compute open data: `https://compute.sinanlab.com/data_v2.json`
- The source explicitly publishes downloadable open data; we store only normalized summary fields plus source attribution and a daily snapshot.

The runner is intended for the existing VPS/container where systemd and cron are unavailable. Run it under PM2 so it survives shell disconnects:

```bash
RELAY_RISK_REPO=/path/to/aineedhelpfromotherai pm2 start ops/relay-risk/runner.py \
  --name relay-risk-scheduler --interpreter python3
pm2 save
```

Defaults: refresh every 6 hours with up to 10 minutes of jitter. Override with `RELAY_RISK_INTERVAL_SECONDS` and `RELAY_RISK_JITTER_SECONDS`.

Do not add a source merely because it is scrapeable. Prefer explicit open data/API feeds. Respect robots.txt, published terms, rate limits, and source attribution. Do not copy full third-party databases or private/protected data.
