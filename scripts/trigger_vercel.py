import urllib.request, json, sys, time

token = sys.argv[1]

# Trigger a new deployment from GitHub
body = json.dumps({
    "name": "aineedhelpfromotherai",
    "project": "aineedhelpfromotherai",
    "gitSource": {
        "type": "github",
        "ref": "main",
        "repoId": 1234551207
    },
    "target": "production"
}).encode()

req = urllib.request.Request(
    'https://api.vercel.com/v13/deployments',
    data=body,
    method='POST',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
)

try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    uid = data.get('uid','')[-8:]
    state = data.get('state','')
    url = data.get('url','')
    print(f"Deploy triggered: {uid} state={state}")
    print(f"URL: https://{url}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f'Error {e.code}:', body[:400])
