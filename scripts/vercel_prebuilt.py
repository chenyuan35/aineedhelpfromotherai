import urllib.request, json, sys, os

token = sys.argv[1]

# Deploy pre-built dist/ files as static
dist_dir = r'C:\Users\59314\Documents\Codex\aineedhelpfromotherai\frontend\dist'

# Read all files from dist/
files = {}
for root, dirs, filenames in os.walk(dist_dir):
    for fn in filenames:
        fp = os.path.join(root, fn)
        rel = os.path.relpath(fp, dist_dir).replace('\\', '/')
        with open(fp, 'rb') as f:
            content = f.read()
        files[rel] = content

print(f"Found {len(files)} files in dist/")

# Create deployment body
body_data = json.dumps({
    "name": "aineedhelpfromotherai",
    "project": "aineedhelpfromotherai",
    "files": {},
    "version": 2,
    "public": True,
    "target": "production"
}).encode()

# First request to get the file upload URLs
# Actually, Vercel's API for uploading files requires multiple steps
# Let's just use the simpler approach: check gitSource auto-deploy

# Check the latest deployment by commit
req = urllib.request.Request(
    'https://api.vercel.com/v6/deployments?projectId=aineedhelpfromotherai&limit=5',
    headers={'Authorization': f'Bearer {token}'}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())

for d in data['deployments']:
    uid = d['uid'][:8]
    state = d.get('state', '?')
    meta = d.get('meta', {})
    commitMsg = meta.get('commitMessage', '')[:50]
    commitRef = meta.get('githubCommitRef', '') or meta.get('githubPRBranch', '') or ''
    print(f'{uid} state={state} ref={commitRef} msg={commitMsg}')
