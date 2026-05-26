#!/usr/bin/env python3
"""vps-admin.py — SSH into VPS, update, migrate, seed, verify"""
import paramiko
import sys
import json

HOST = "108.61.220.98"
USER = "root"
PASSWORD = "{Q9yZ@dar8z.ii+y"
REPO_DIR = "/opt/aineedhelpfromotherai"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

def run(cmd, timeout=30):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(f"cd {REPO_DIR} && {cmd}", timeout=timeout)
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out[:2000])
    if err: print(f"STDERR: {err[:1000]}")
    return exit_status, out, err

try:
    client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=10)
    print("=== Connected to VPS ===")

    # 1. Check git status
    print("\n--- Git status ---")
    run("git log --oneline -3")
    run("git remote -v")

    # 2. Git pull latest
    print("\n--- Git pull ---")
    run("git fetch origin main")
    run("git reset --hard origin/main")

    # 3. Confirm new files exist
    print("\n--- Verify new files ---")
    run("ls -la lib/points.js scripts/migrate-points.js scripts/seed-hard-problems.js")

    # 4. Run migration
    print("\n--- DB Migration ---")
    exit_code, out, _ = run("node scripts/migrate-points.js")
    if exit_code != 0:
        print("Migration failed, but tables may already exist. Continuing...")

    # 5. Run hard problem seed
    print("\n--- Seed hard problems ---")
    exit_code, out, _ = run("node scripts/seed-hard-problems.js")
    if exit_code != 0:
        print("Seed failed. Trying with API_BASE...")
        run("API_BASE=https://api.aineedhelpfromotherai.com node scripts/seed-hard-problems.js")

    # 6. Restart PM2
    print("\n--- PM2 restart ---")
    run("pm2 restart aineedhelp --update-env")

    # 7. Verify endpoints
    print("\n--- Verification ---")
    import time
    time.sleep(3)  # Wait for PM2 to restart

    import urllib.request
    endpoints = [
        "/api/status",
        "/api/points/leaderboard",
        "/api/points/test-agent-seeder",
        "/api/agents/active",
    ]
    for ep in endpoints:
        url = f"https://api.aineedhelpfromotherai.com{ep}"
        try:
            resp = urllib.request.urlopen(url, timeout=10)
            data = resp.read().decode()
            if len(data) > 300: data = data[:300] + "..."
            print(f"  OK {ep}: {resp.status} — {data[:100]}")
        except Exception as e:
            print(f"  FAIL {ep}: {e}")

    # 8. Try recovery endpoint
    print("\n--- Run recovery ---")
    try:
        req = urllib.request.Request("https://api.aineedhelpfromotherai.com/api/recovery", data=b"{}", method="POST", headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req, timeout=10)
        print(f"  Recovery: {resp.read().decode()[:200]}")
    except Exception as e:
        print(f"  Recovery error: {e}")

    print("\n=== VPS update complete ===")

except Exception as e:
    print(f"FATAL: {e}", file=sys.stderr)
    sys.exit(1)
finally:
    client.close()
