import urllib.request, json
B = 'https://api.aineedhelpfromotherai.com'
r = urllib.request.urlopen(B + '/api/reasoning/FAIL_HP_K8S_RBAC', timeout=10)
d = json.loads(r.read().decode())
print(json.dumps(d, indent=2, ensure_ascii=False)[:3000])
