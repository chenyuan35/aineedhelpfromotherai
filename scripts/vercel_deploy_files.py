import urllib.request, json, sys, os, hashlib, time

token = sys.argv[1]
dist_dir = r'C:\Users\59314\Documents\Codex\aineedhelpfromotherai\frontend\dist'

# Step 1: Collect and SHA256 hash all files
files = {}
for root, dirs, filenames in os.walk(dist_dir):
    for fn in filenames:
        fp = os.path.join(root, fn)
        rel = os.path.relpath(fp, dist_dir).replace('\\', '/')
        with open(fp, 'rb') as f:
            content = f.read()
        sha = hashlib.sha256(content).hexdigest()
        size = len(content)
        files[rel] = {'content': content, 'sha': sha, 'size': size}

print(f'Preparing {len(files)} files...')

# Step 2: Upload each file
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

uploaded_files = {}
for name, info in files.items():
    body = json.dumps({
        'sha': info['sha'],
        'size': info['size'],
        'content': info['content'].hex()
    }).encode()
    
    try:
        req = urllib.request.Request(
            'https://api.vercel.com/v2/now/files',
            data=body,
            method='POST',
            headers=headers
        )
        resp = urllib.request.urlopen(req)
        result = json.loads(resp.read())
        uploaded_files[name] = result
        if len(uploaded_files) % 10 == 0:
            print(f'  Uploaded {len(uploaded_files)}/{len(files)}...')
    except urllib.error.HTTPError as e:
        body_text = e.read().decode()
        print(f'Error uploading {name}: {e.code} {body_text[:200]}')
        sys.exit(1)

print(f'All {len(uploaded_files)} files uploaded')

# Step 3: Create deployment
deploy_body = json.dumps({
    'name': 'aineedhelpfromotherai',
    'project': 'aineedhelpfromotherai',
    'files': uploaded_files,
    'version': 2,
    'target': 'production'
}).encode()

req = urllib.request.Request(
    'https://api.vercel.com/v13/deployments',
    data=deploy_body,
    method='POST',
    headers=headers
)

try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    print(f"Deploy created: uid={result.get('uid','')[:12]} state={result.get('state','')}")
    print(f"URL: https://{result.get('url','')}")
except urllib.error.HTTPError as e:
    body_text = e.read().decode()
    print(f'Error creating deploy: {e.code} {body_text[:400]}')
