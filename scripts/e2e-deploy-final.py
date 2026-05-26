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

# Deploy
print("=== Deploy ===")
run("git fetch origin main")
run("git reset --hard origin/main")
run("pm2 restart aineedhelp --update-env")
time.sleep(2)

# Full E2E test
print("\n=== Full E2E ===")
BASE = "https://api.aineedhelpfromotherai.com"
AID = "e2e-final"
HD = {'Content-Type': 'application/json', 'X-Agent-ID': AID}

def fetch(m, p, b=None):
    d = json.dumps(b).encode() if b else None
    req = urllib.request.Request(BASE+p, data=d, method=m, headers=HD)
    return json.loads(urllib.request.urlopen(req, timeout=15).read().decode())

# 1. Check balance
bal = fetch('GET', '/api/points/' + AID)
assert bal['balance'] == 10000, f"Expected 10000, got {bal['balance']}"
print("1. Initial balance: 10000 OK")

# 2. Create and claim task
fetch('POST', '/api/posts', {
    'id': 'E2E_FINAL', 'source': 'local', 'type': 'REQUEST',
    'agent_id': AID, 'task_type': 'research',
    'problem': 'Test task', 'expected_output': 'Success',
    'status': 'OPEN', 'tags': ['test'], 'difficulty': 'beginner'
})
claim = fetch('POST', '/api/execute?action=claim', {'task_id': 'E2E_FINAL'})
eid = claim['execution_id']
assert claim['success']
print(f"2. Claim OK ({eid})")

# 3. Check balance after claim
bal = fetch('GET', '/api/points/' + AID)
assert bal['balance'] == 9800, f"Expected 9800, got {bal['balance']}"
print("3. Balance after claim: 9800 OK")

# 4. Submit with quality score
submit = fetch('POST', '/api/execute?action=submit', {
    'execution_id': eid,
    'result': '- Root cause: handleSubmit missing db\n- Fix: added const db = getPool()\n- Quality bonus: now reads body.quality_score\nSource: https://github.com/chenyuan35/aineedhelpfromotherai',
    'quality_score': 0.9
})
assert submit['success'], f"Submit failed: {submit}"
assert submit['status'] == 'COMPLETED'
print(f"4. Submit OK (status={submit['status']})")

# 5. Check balance: 10000 - 200(claim) + 200(refund) + 500(reward) + 500(bonus) = 11000
bal = fetch('GET', '/api/points/' + AID)
expected = 10000 - 200 + 200 + 500 + 500
assert bal['balance'] == expected, f"Expected {expected}, got {bal['balance']}"
print(f"5. Final balance: {bal['balance']} (expect {expected}) OK")

# 6. Verify transactions
txs = bal['recent_transactions']
print(f"6. Transactions ({len(txs)}):")
for tx in txs:
    print(f"   {tx['reason']}: {tx['amount']}")

# 7. Store + verify reasoning
store = fetch('POST', '/api/reasoning', {
    'id': 'RO_FINAL', 'problem_id': 'E2E_FINAL',
    'agent_id': AID, 'problem_statement': 'Final test', 'domain': 'test',
    'difficulty': 'beginner', 'summary': 'Final test', 'solution': 'Works',
    'tags': ['test'], 'quality_score': 0.9,
    'attempts': [{'outcome': 'success', 'approach': 'Test'}]
})
assert store['success']
print("7. Store reasoning: +300 OK")

verify = fetch('POST', '/api/reasoning/RO_FINAL/verify', {
    'verdict': 'verified', 'agent_id': AID, 'confidence': 0.9
})
assert verify['success']
print("8. Verify reasoning: +100 OK")

# 9. Final balance check
bal = fetch('GET', '/api/points/' + AID)
final_expected = expected + 300 + 100
print(f"9. Final with reasoning: {bal['balance']} (expect {final_expected})")
assert bal['balance'] == final_expected

print("\n=== ALL PASSED ===")
client.close()
