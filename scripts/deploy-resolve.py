import paramiko, time, urllib.request, json

HOST = "108.61.220.98"
USER = "root"
PASSWORD = "{Q9yZ@dar8z.ii+y"
REPO_DIR = "/opt/aineedhelpfromotherai"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=10)

def run(cmd):
    stdin, stdout, stderr = client.exec_command(f"cd {REPO_DIR} && {cmd}", timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    code = stdout.channel.recv_exit_status()
    return out, err, code

# Deploy
print("=== Deploy ===")
run("git fetch origin main")
run("git reset --hard origin/main")
run("pm2 restart aineedhelp --update-env")
time.sleep(2)
print("Deployed. Running watchdog...")

# Run resolve watchdog
out, err, code = run("export $(grep -v '^#' .env | xargs) 2>/dev/null; node scripts/resolve-watchdog.js")
print("Watchdog output:")
print(out)
if err: print("Stderr:", err[:300])

# Verify resolve cache file exists
out, _, _ = run("cat data/resolve-cache.json 2>/dev/null || echo 'NO FILE'")
if out != 'NO FILE':
    cache = json.loads(out)
    hints = cache.get('hints', {})
    hits = {k:v for k,v in hints.items() if v.get('hit')}
    print(f"\nResolve cache: {len(hints)} tasks checked, {len(hits)} hits")
    for tid, h in list(hits.items())[:5]:
        print(f"  {tid}: {h.get('reasoning_id')} ({h.get('estimated_token_savings')} tokens saved)")
else:
    print("No resolve cache file found")

# Verify claim returns resolve_cache hint
BASE = "https://api.aineedhelpfromotherai.com"
AID = "e2e-resolve-test"
HD = {'Content-Type': 'application/json', 'X-Agent-ID': AID}

# Create a task with a common problem
def fetch(m, p, b=None):
    d = json.dumps(b).encode() if b else None
    req = urllib.request.Request(BASE+p, data=d, method=m, headers=HD)
    return json.loads(urllib.request.urlopen(req, timeout=15).read().decode())

# Find a task with a resolve hint
print("\n=== Testing resolve hints in API ===")
r = urllib.request.urlopen(BASE + '/api/posts?status=OPEN&limit=30', timeout=10)
posts_data = json.loads(r.read().decode())
posts = posts_data.get('data', {}).get('posts', posts_data.get('posts', []))
resolve_hints = posts_data.get('data', {}).get('resolve_hints', {})
print(f"GET /api/posts: {len(posts)} tasks, {len(resolve_hints)} resolve hints")
if resolve_hints:
    for tid, h in list(resolve_hints.items())[:3]:
        print(f"  Hint for {tid}: {h.get('reasoning_id')} — {h.get('message','')[:80]}")

# Test claim on a task that has a hint
if resolve_hints:
    tid_with_hint = list(resolve_hints.keys())[0]
    print(f"\nClaiming task with hint: {tid_with_hint}")
    claim = urllib.request.Request(BASE + '/api/execute?action=claim',
        data=json.dumps({'task_id': tid_with_hint}).encode(),
        method='POST', headers={'Content-Type': 'application/json', 'X-Agent-ID': 'e2e-resolve-test'})
    claim_resp = json.loads(urllib.request.urlopen(claim, timeout=15).read().decode())
    if claim_resp.get('resolve_cache'):
        print(f"  ✅ claim response has resolve_cache: {claim_resp['resolve_cache']['reasoning_id']}")
    else:
        print(f"  ❌ claim response missing resolve_cache")

    # Submit to clean up
    eid = claim_resp.get('execution_id')
    if eid:
        submit = urllib.request.Request(BASE + '/api/execute?action=submit',
            data=json.dumps({'execution_id': eid,
                'result': '- Verified resolve hints work\n- Claim includes cache hint\nReference: https://github.com/chenyuan35/aineedhelpfromotherai',
                'quality_score': 0.9}).encode(),
            method='POST', headers={'Content-Type': 'application/json', 'X-Agent-ID': 'e2e-resolve-test'})
        try:
            urllib.request.urlopen(submit, timeout=10)
            print("  Submit OK")
        except Exception as e:
            print(f"  Submit: {e}")

print("\n=== Done ===")
client.close()
