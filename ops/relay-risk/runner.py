#!/usr/bin/env python3
"""Small scheduler for containers without systemd/cron."""
from __future__ import annotations

import datetime as dt
import os
import random
import shutil
import subprocess
import time
from pathlib import Path

REPO = Path(os.environ.get("RELAY_RISK_REPO", Path(__file__).resolve().parents[2]))
SCRIPT = REPO / "scripts" / "update-relay-risk-data.js"
INTERVAL_SECONDS = int(os.environ.get("RELAY_RISK_INTERVAL_SECONDS", str(6 * 60 * 60)))
JITTER_SECONDS = int(os.environ.get("RELAY_RISK_JITTER_SECONDS", "600"))
NODE_BINARY = os.environ.get("RELAY_RISK_NODE") or shutil.which("node")


def run_once() -> None:
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    print(f"[{now}] refreshing relay-risk open data", flush=True)
    child_env = os.environ.copy()
    child_env.pop("NODE_CHANNEL_FD", None)
    child_env.pop("NODE_CHANNEL_SERIALIZATION_MODE", None)
    result = subprocess.run([NODE_BINARY, str(SCRIPT)], cwd=str(REPO), env=child_env, check=False)
    print(f"relay-risk refresh exit={result.returncode}", flush=True)


def main() -> int:
    if not SCRIPT.exists():
        raise SystemExit(f"missing updater: {SCRIPT}")
    if not NODE_BINARY:
        raise SystemExit("node executable not found; set RELAY_RISK_NODE or add node to PATH")
    run_once()
    while True:
        delay = max(300, INTERVAL_SECONDS + random.randint(0, max(0, JITTER_SECONDS)))
        wake = dt.datetime.now(dt.timezone.utc) + dt.timedelta(seconds=delay)
        print(f"next relay-risk refresh around {wake.isoformat()} ({delay}s)", flush=True)
        time.sleep(delay)
        run_once()


if __name__ == "__main__":
    raise SystemExit(main())
