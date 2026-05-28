import urllib.request, json, sys

token = sys.argv[1]

# Update project config
body = json.dumps({
    "rootDirectory": ".",
    "framework": None,
    "buildCommand": "cd frontend && npm install && npm run build",
    "outputDirectory": "frontend/dist",
    "installCommand": "",
    "gitComments": { "onCommit": True, "onPullRequest": True },
    "nodeVersion": "22.x"
}).encode()

req = urllib.request.Request(
    'https://api.vercel.com/v9/projects/aineedhelpfromotherai',
    data=body,
    method='PATCH',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
)

try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    print(f"Framework: {data.get('framework')}")
    print(f"Root Dir: {data.get('rootDirectory')}")
    print(f"Build: {data.get('buildCommand')}")
    print(f"Auto-deploy: {data.get('gitComments',{}).get('onCommit')}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f'Error {e.code}:', body[:400])
