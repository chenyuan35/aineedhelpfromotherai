import urllib.request, json, sys

token = sys.argv[1]
deploy_id = sys.argv[2]

req = urllib.request.Request(
    f'https://api.vercel.com/v13/deployments/{deploy_id}',
    headers={'Authorization': f'Bearer {token}'}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())

meta = data.get('meta', {})
for k, v in meta.items():
    if 'command' in k.lower() or 'build' in k.lower() or 'node' in k.lower() or 'error' in k.lower():
        print(f'{k}: {v}')

print('---')
builder = data.get('builder', {})
for k, v in builder.items():
    print(f'builder.{k}: {v}')

print('---')
print('Error code:', data.get('errorCode'))
print('Error msg:', (data.get('errorMessage') or '')[:300])
print('Ready state:', data.get('readyState'))
print('State:', data.get('state'))
