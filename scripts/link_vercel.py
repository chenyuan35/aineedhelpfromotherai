import urllib.request, json, sys

token = sys.argv[1]
project_id = 'aineedhelpfromotherai'

# Connect GitHub repo to project
body = json.dumps({
    "link": {
        "type": "github",
        "repo": "chenyuan35/aineedhelpfromotherai",
        "repoId": None,
        "gitBranch": "main",
        "productionBranch": "main"
    },
    "rootDirectory": "frontend",
    "framework": "vite",
    "buildCommand": "npm install && npm run build",
    "outputDirectory": "dist",
    "installCommand": "npm install"
}).encode()

req = urllib.request.Request(
    f'https://api.vercel.com/v9/projects/{project_id}/link',
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
    print('Linked:', data.get('link',{}).get('type'))
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f'Error {e.code}:', body[:300])
