import paramiko, time, urllib.request, json

HOST = "108.61.220.98"
USER = "root"
PASSWORD = "{Q9yZ@dar8z.ii+y"
REPO_DIR = "/opt/aineedhelpfromotherai"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=10)

def run(cmd):
    stdin, stdout, stderr = client.exec_command(f"cd {REPO_DIR} && {cmd}", timeout=15)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    code = stdout.channel.recv_exit_status()
    return out, err, code

# Git pull
print("=== Git pull ===")
run("git fetch origin main")
out, _, _ = run("git reset --hard origin/main")
print(out[:200])

# PM2 restart  
print("\n=== PM2 restart ===")
out, _, _ = run("pm2 restart aineedhelp --update-env")
print(out[:200])
time.sleep(2)

# Verify
print("\n=== Submit test ===")
BASE = "https://api.aineedhelpfromotherai.com"
AID = "e2e-v4"
HD = {'Content-Type': 'application/json', 'X-Agent-ID': AID}

def fetch(method, path, body=None):
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(BASE+path, data=data, method=method, headers=HD)
    return json.loads(urllib.request.urlopen(req, timeout=15).read().decode())

# Create task
fetch('POST', '/api/posts', {
    'id': 'E2E_V4_TASK', 'source': 'local', 'type': 'REQUEST',
    'agent_id': AID, 'task_type': 'research',
    'problem': 'Verify submit fix', 'expected_output': 'Success',
    'status': 'OPEN', 'tags': ['test'], 'difficulty': 'beginner'
})

# Claim
claim = fetch('POST', '/api/execute?action=claim', {'task_id': 'E2E_V4_TASK'})
eid = claim.get('execution_id')
print(f"Claim: {claim.get('success')} exec={eid}")

# Submit
submit = fetch('POST', '/api/execute?action=submit', {
    'execution_id': eid, 'result': 'Submit works after fix!',
    'quality_score': 0.9
})
print(f"Submit: {submit.get('success')} status={submit.get('status')}")
if not submit.get('success'):
    print(f"Error: {json.dumps(submit, indent=2)[:300]}")

# Balance
bal = fetch('GET', f'/api/points/{AID}')
print(f"Balance: {bal.get('balance')} (expect 10500 = 10000-200+200+500)")
print(f"Transactions: {len(bal.get('recent_transactions', []))}")
for tx in bal['recent_transactions']:
    print(f"  {tx.get('reason')}: {tx.get('amount')}")

# Verify task status
task = urllib.request.urlopen(BASE + '/api/posts?id=E2E_V4_TASK', timeout=10)
task_data = json.loads(task.read().decode())
posts = task_data.get('data', {}).get('posts', task_data.get('posts', []))
if posts:
    print(f"Task status: {posts[0].get('status')} (expect COMPLETED)")

client.close()
print("\n=== Done ===")
