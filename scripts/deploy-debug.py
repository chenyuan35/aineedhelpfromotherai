import paramiko, time, urllib.request, json
HOST = "108.61.220.98"; USER = "root"; PASSWORD = "{Q9yZ@dar8z.ii+y"
REPO_DIR = "/opt/aineedhelpfromotherai"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=10)
def run(cmd):
    stdin, stdout, stderr = client.exec_command(f"cd {REPO_DIR} && {cmd}", timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    return out, err

# Deploy
print("=== Deploy ===")
run("git fetch origin main")
run("git reset --hard origin/main")
run("pm2 restart aineedhelp --update-env")
time.sleep(2)

# Run watchdog again
print("\n=== Watchdog ===")
run("export $(grep -v '^#' .env | xargs) 2>/dev/null; node scripts/resolve-watchdog.js")
time.sleep(1)

# Test API
print("\n=== Test API ===")
r = urllib.request.urlopen("https://api.aineedhelpfromotherai.com/api/posts?status=OPEN&limit=10&source=hard-problem", timeout=15)
d = json.loads(r.read().decode())
data = d.get('data', {})
hints = data.get('resolve_hints', {})
print(f"resolve_hints in response: {len(hints)}")
if hints:
    for k, v in list(hints.items())[:3]:
        print(f"  {k}: {v.get('reasoning_id')} ({v.get('estimated_token_savings')} tokens)")
else:
    print(f"data keys: {list(data.keys())}")
    # Check the first post's ID and compare with cache
    posts = data.get('posts', [])
    if posts:
        print(f"First post id: {posts[0].get('id')}")
        # Check cache directly from node
        out, _ = run('node -e "const c=require(\\'./lib/resolve-cache\\');const h=c.getHint(\\'HP_K8S_RBAC\\');console.log(JSON.stringify(h))"')
        print(f"Cache for HP_K8S_RBAC: {out[:100]}")

# Check PM2 logs for hints errors
out, _ = run("pm2 logs aineedhelp --lines 20 --nostream 2>&1 | grep -i 'resolve-hints\\|resolve' | tail -5")
if out: print(f"\nLogs: {out}")

client.close()
