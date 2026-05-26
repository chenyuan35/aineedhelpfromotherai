import urllib.request, json
BASE = 'https://api.aineedhelpfromotherai.com'
AID = 'e2e-clean-test'
HD = {'Content-Type': 'application/json', 'X-Agent-ID': AID}

def fetch(method, path, body=None):
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(BASE+path, data=data, method=method, headers=HD)
    return json.loads(urllib.request.urlopen(req, timeout=15).read().decode())

# Create fresh task
task = fetch('POST', '/api/posts', {
    'id': 'E2E_CLEAN_TASK_2', 'source': 'local', 'type': 'REQUEST',
    'agent_id': AID, 'task_type': 'research',
    'problem': 'E2E clean test', 'expected_output': 'Success',
    'status': 'OPEN', 'tags': ['test'], 'difficulty': 'beginner'
})
print('Task created:', task.get('success'))

# Claim
claim = fetch('POST', '/api/execute?action=claim', {'task_id': 'E2E_CLEAN_TASK_2'})
eid = claim.get('execution_id')
print('Claim:', claim.get('success'), 'exec_id:', eid)

# Submit
submit = fetch('POST', '/api/execute?action=submit', {
    'execution_id': eid, 'result': 'Clean test',
    'quality_score': 0.9
})
print('Submit:', submit.get('success'), 'status:', submit.get('status'))

# Balance
bal = fetch('GET', '/api/points/' + AID)
print('Balance:', bal.get('balance'), '(expect 10500)')
for tx in bal.get('recent_transactions', []):
    print(' ', tx.get('reason'), ':', tx.get('amount'))
