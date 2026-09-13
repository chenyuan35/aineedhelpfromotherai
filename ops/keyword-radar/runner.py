#!/usr/bin/env python3
"""Tiny scheduler for containers where systemd/cron is unavailable."""
from __future__ import annotations

import datetime as dt
import os
import random
import subprocess
import time
from pathlib import Path

APP = Path("/opt/aineedhelp-keyword-radar")
DATA = Path("/var/lib/aineedhelp-radar")
RADAR = APP / "radar.py"
SEEDS = APP / "seeds.txt"
HOUR_UTC = int(os.environ.get("RADAR_HOUR_UTC", "3"))
MINUTE_UTC = int(os.environ.get("RADAR_MINUTE_UTC", "20"))
JITTER_SECONDS = int(os.environ.get("RADAR_JITTER_SECONDS", "1200"))


def run_once() -> None:
    cmd = ["/usr/bin/python3", str(RADAR), "--seeds", str(SEEDS), "--data-dir", str(DATA)]
    print(f"[{dt.datetime.now(dt.timezone.utc).isoformat()}] running keyword radar", flush=True)
    result = subprocess.run(cmd, check=False)
    print(f"keyword radar exit={result.returncode}", flush=True)


def seconds_until_next_run() -> int:
    now = dt.datetime.now(dt.timezone.utc)
    target = now.replace(hour=HOUR_UTC, minute=MINUTE_UTC, second=0, microsecond=0)
    if target <= now:
        target += dt.timedelta(days=1)
    if JITTER_SECONDS > 0:
        target += dt.timedelta(seconds=random.randint(0, JITTER_SECONDS))
    return max(60, int((target - now).total_seconds()))


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    run_once()
    while True:
        delay = seconds_until_next_run()
        wake = dt.datetime.now(dt.timezone.utc) + dt.timedelta(seconds=delay)
        print(f"next run around {wake.isoformat()} ({delay}s)", flush=True)
        time.sleep(delay)
        run_once()


if __name__ == "__main__":
    raise SystemExit(main())
