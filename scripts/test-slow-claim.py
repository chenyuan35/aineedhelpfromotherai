import urllib.request, json, time
BASE = 'https://api.aineedhelpfromotherai.com'
AID = 'e2e-slow-test'
HD = {'Content-Type': 'application/json', 'X-Agent-ID': AID}

def fetch(method, path, body=None):
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(BASE+path, data=data, method=method, headers=HD)
    return json.loads(urllib.request.urlopen(req, timeout=15).read().decode())

# Create task
task = fetch('POST', '/api/posts', {
    'id': 'E2E_SLOW_TASK', 'source': 'local', 'type': 'REQUEST',
    'agent_id': AID, 'task_type': 'research',
    'problem': 'Slow test', 'expected_output': 'Success',
    'status': 'OPEN', 'tags': ['test'], 'difficulty': 'beginner'
})
print('Task:', task.get('success'))

# Claim
claim = fetch('POST', '/api/execute?action=claim', {'task_id': 'E2E_SLOW_TASK'})
eid = claim.get('execution_id')
print('Claim:', claim.get('success'), eid)

# Wait 2 seconds for DB to settle
print('Waiting 2s...')
time.sleep(2)

# Submit
submit = fetch('POST', '/api/execute?action=submit', {
    'execution_id': eid, 'result': 'Slow test after delay',
    'quality_score': 0.9
})
print('Submit:', submit.get('success'), submit.get('status'))
if not submit.get('success'):
    print('Error:', json.dumps(submit, indent=2)[:300])
    # Retry with a bigger delay
    print('Retrying after 5s...')
    time.sleep(5)
    submit2 = fetch('POST', '/api/execute?action=submit', {
        'execution_id': eid, 'result': 'Slow test after 5s delay',
        'quality_score': 0.9
    })
    print('Submit2:', submit2.get('success'), submit2.get('status'))

# Balance
bal = fetch('GET', '/api/points/' + AID)
print('Balance:', bal.get('balance'))
for tx in bal.get('recent_transactions', [])[:3]:
    print(' ', tx.get('reason'), ':', tx.get('amount'))
