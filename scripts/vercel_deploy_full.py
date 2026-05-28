import urllib.request, json, sys

token = sys.argv[1]
deploy_id = sys.argv[2]

req = urllib.request.Request(
    f'https://api.vercel.com/v13/deployments/{deploy_id}',
    headers={'Authorization': f'Bearer {token}'}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())

# Print EVERYTHING
def print_obj(o, indent=0):
    prefix = '  ' * indent
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(v, (dict, list)):
                print(f'{prefix}{k}:')
                print_obj(v, indent+1)
            else:
                print(f'{prefix}{k}: {v}')
    elif isinstance(o, list):
        for i, v in enumerate(o):
            if isinstance(v, (dict, list)):
                print(f'{prefix}[{i}]:')
                print_obj(v, indent+1)
            else:
                print(f'{prefix}[{i}]: {v}')

print_obj(data)
