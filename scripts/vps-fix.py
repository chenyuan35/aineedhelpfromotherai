import os
import paramiko, sys, time, urllib.request, json

HOST = "108.61.220.98"
USER = "root"
PASSWORD = os.environ.get("VPS_PASSWORD")
REPO_DIR = "/opt/aineedhelpfromotherai"

if not PASSWORD:
    raise SystemExit("Set VPS_PASSWORD in the environment before running this script.")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=10)

def run(cmd, timeout=30):
    stdin, stdout, stderr = client.exec_command(f"cd {REPO_DIR} && {cmd}", timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    code = stdout.channel.recv_exit_status()
    return out, err, code

# 1. Check current state
print("=== Current git state ===")
out, _, _ = run("git log --oneline -2")
print(out)

# 2. Pull latest (fixed seed-hard-problems.js)
print("\n=== Git pull ===")
run("git fetch origin main")
out, _, _ = run("git reset --hard origin/main")
print(out[:200])

# 3. Re-run hard problem seed (fixes attempt field name)
print("\n=== Re-seed failure patterns ===")
out, err, code = run("export $(grep -v '^#' .env | xargs) 2>/dev/null; node scripts/seed-hard-problems.js")
print(f"Exit: {code}")
print(out[:500])
if err:
    print(f"Stderr: {err[:200]}")

# 4. Restart PM2
print("\n=== PM2 restart ===")
run("pm2 restart aineedhelp --update-env")
time.sleep(2)

# 5. Verify fix
print("\n=== Verification ===")
for fid in ['FAIL_HP_K8S_RBAC', 'FAIL_HP_NODE_MEMLEAK']:
    try:
        r = urllib.request.urlopen(f'https://api.aineedhelpfromotherai.com/api/reasoning/{fid}', timeout=10)
        d = json.loads(r.read().decode()).get('data', {})
        att = d.get('attempts', [])
        print(f'{fid}: {len(att)} attempts (expect 1)')
        if att:
            print(f'  type: {att[0].get("failure_type", "?")}')
    except Exception as e:
        print(f'{fid}: ERROR {e}')

# Check failures endpoint
try:
    r = urllib.request.urlopen('https://api.aineedhelpfromotherai.com/api/reasoning/failures?type=wrong_assumption', timeout=10)
    d = json.loads(r.read().decode())
    results = d.get('data', {}).get('results', [])
    fail_ids = [r.get('id') for r in results[:5]]
    print(f'Failures endpoint: {len(results)} results (expect 33+)')
    print(f'Sample: {fail_ids}')
except Exception as e:
    print(f'Failures endpoint: ERROR {e}')

# Check reasoning total
try:
    r = urllib.request.urlopen('https://api.aineedhelpfromotherai.com/api/reasoning/stats', timeout=10)
    s = json.loads(r.read().decode()).get('data', {})
    print(f'Total reasoning objects: {s.get("total", "?")}')
except Exception as e:
    print(f'Stats: ERROR {e}')

# Check failure-check
try:
    r = urllib.request.urlopen('https://api.aineedhelpfromotherai.com/api/reasoning/failure-check',
        data=json.dumps({"problem_statement": "Kubernetes RBAC not working", "approach": "test with kubectl"}).encode(),
        timeout=10)
    fc = json.loads(r.read().decode())
    warnings = fc.get('warnings', fc.get('data', {}).get('warnings', []))
    print(f'Failure-check warnings: {len(warnings)}')
    if warnings:
        print(f'  First: {warnings[0].get("failure_type", "?")}')
except Exception as e:
    print(f'Failure-check: ERROR {e}')

client.close()
print("\n=== DONE ===")
