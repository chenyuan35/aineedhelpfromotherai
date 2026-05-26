#!/usr/bin/env python3
"""Quick VPS migration helper"""
import paramiko, sys

HOST = "108.61.220.98"
USER = "root"
PASSWORD = "{Q9yZ@dar8z.ii+y"
REPO_DIR = "/opt/aineedhelpfromotherai"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=10)

def run(cmd, timeout=15):
    stdin, stdout, stderr = client.exec_command(f"cd {REPO_DIR} && {cmd}", timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    code = stdout.channel.recv_exit_status()
    return out, err, code

# 1. Check .env
out, err, _ = run("head -3 .env")
print("env:", out[:100] if out else "NOT FOUND")

# 2. Run migration with DB URL
out, err, code = run("export $(grep -v '^#' .env | xargs) 2>/dev/null; node scripts/migrate-points.js")
print(f"migration (code={code}):")
if out: print("  out:", out[:200])
if err: print("  err:", err[:200])

# 3. Verify tables
check_sql = "node -e \"const {Pool}=require('pg');new Pool({connectionString:process.env.DATABASE_URL}).query('SELECT count(*) FROM agent_points').then(r=>console.log('agent_points:',r.rows[0].count)).catch(e=>console.log('FAIL:',e.message))\""
out, err, code = run("export $(grep -v '^#' .env | xargs) 2>/dev/null; " + check_sql)
print("verify tables:", out[:200] if out else err[:200])

# 4. Check points endpoint error
import urllib.request
try:
    resp = urllib.request.urlopen("https://api.aineedhelpfromotherai.com/api/points/test-agent", timeout=10)
    print("points endpoint:", resp.read().decode()[:200])
except Exception as e:
    print("points endpoint error:", e)

client.close()
