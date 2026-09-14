#!/usr/bin/env python3
"""Small scheduler for containers without systemd/cron."""
from __future__ import annotations

import datetime as dt
import os
import random
import subprocess
import time
from pathlib import Path

REPO = Path(os.environ.get("RELAY_RISK_REPO", Path(__file__).resolve().parents[2]))
SCRIPT = REPO / "scripts" / "update-relay-risk-data.js"
INTERVAL_SECONDS = int(os.environ.get("RELAY_RISK_INTERVAL_SECONDS", str(6 * 60 * 60)))
JITTER_SECONDS = int(os.environ.get("RELAY_RISK_JITTER_SECONDS", "600"))


def run_once() -> None:
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    print(f"[{now}] refreshing relay-risk open data", flush=True)
    result = subprocess.run(["/usr/bin/node", str(SCRIPT)], cwd=str(REPO), check=False)
    print(f"relay-risk refresh exit={result.returncode}", flush=True)


def main() -> int:
    if not SCRIPT.exists():
        raise SystemExit(f"missing updater: {SCRIPT}")
    run_once()
    while True:
        delay = max(300, INTERVAL_SECONDS + random.randint(0, max(0, JITTER_SECONDS)))
        wake = dt.datetime.now(dt.timezone.utc) + dt.timedelta(seconds=delay)
        print(f"next relay-risk refresh around {wake.isoformat()} ({delay}s)", flush=True)
        time.sleep(delay)
        run_once()


if __name__ == "__main__":
    raise SystemExit(main())
