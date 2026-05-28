import urllib.request, json, sys

token = sys.argv[1]
deploy_id = sys.argv[2]

req = urllib.request.Request(
    f'https://api.vercel.com/v13/deployments/{deploy_id}',
    headers={'Authorization': f'Bearer {token}'}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())

print('State:', data.get('state'))
print('Error:', data.get('errorCode'))
print('Error Msg:', (data.get('errorMessage') or '')[:300])
print('Ready State:', data.get('readyState'))
print('Builder:', json.dumps(data.get('builder', {}), indent=2)[:200])

# Check building process
for b in data.get('buildingAt', []):
    pass
print()

# Check metadata
meta = data.get('meta', {})
for k, v in meta.items():
    if 'commit' in k.lower() or 'branch' in k.lower() or 'github' in k.lower():
        print(f'{k}: {v}')
