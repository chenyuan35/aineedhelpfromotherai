import urllib.request, json, sys

token = sys.argv[1]
req = urllib.request.Request(
    'https://api.vercel.com/v6/deployments?projectId=aineedhelpfromotherai&limit=3',
    headers={'Authorization': f'Bearer {token}'}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())

for d in data['deployments']:
    uid = d['uid']
    state = d.get('state', '?')
    url = d.get('url', '?')
    err = d.get('errorCode', 'none')
    msg = (d.get('errorMessage') or '')[:100]
    print(f'{uid} state={state} err={err} url={url}')
    if msg:
        print(f'  msg: {msg}')
