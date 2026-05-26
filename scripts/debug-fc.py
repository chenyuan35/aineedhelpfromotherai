import urllib.request, json
B = 'https://api.aineedhelpfromotherai.com'

# Try failure-check with different formats
bodies = [
    {"problem_statement": "Kubernetes RBAC not working", "approach": "test with kubectl"},
    {"problem_statement": "test"},
    {"query": "Kubernetes RBAC"},
    {"problem_statement": "Kubernetes RBAC not working", "approach_description": "test with kubectl"},
]

for body in bodies:
    try:
        data = json.dumps(body).encode()
        r = urllib.request.urlopen(B + '/api/reasoning/failure-check', data=data, timeout=10)
        resp = json.loads(r.read().decode())
        print(f"OK {body}: {json.dumps(resp)[:200]}")
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} {body}: {e.read().decode()[:200]}")
    except Exception as e:
        print(f"ERR {body}: {e}")
