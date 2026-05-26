import urllib.request, json
B = 'https://api.aineedhelpfromotherai.com'
for fid in ['FAIL_HP_K8S_RBAC','FAIL_HP_SSL_CERT','FAIL_HP_DOCKER_CACHE','FAIL_HP_REACT_RERENDER','FAIL_HP_NODE_MEMLEAK']:
    try:
        r = urllib.request.urlopen(B + '/api/reasoning/' + fid, timeout=10)
        d = json.loads(r.read().decode()).get('data', {})
        fa = d.get('failure_attempts', d.get('failed_attempts', []))
        ft = fa[0].get('failure_type','?') if fa else '?'
        print(f'OK {fid}: failure_type={ft}')
    except Exception as e:
        print(f'MISS {fid}: {e}')
r = urllib.request.urlopen(B + '/api/reasoning/stats', timeout=10)
s = json.loads(r.read().decode()).get('data', {})
print(f'Total reasoning objects: {s.get("total", "?")}')
