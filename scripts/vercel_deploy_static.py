import urllib.request, json, os, hashlib, sys

token = sys.argv[1]
dist = sys.argv[2]

# Read files from dist
files = {}
for root, dirs, fnames in os.walk(dist):
    for fn in fnames:
        fp = os.path.join(root, fn)
        rel = os.path.relpath(fp, dist).replace('\\', '/')
        with open(fp, 'rb') as f:
            content = f.read()
        files[rel] = content

# File hashes first
file_map = {}
for path, content in files.items():
    sha = hashlib.sha256(content).hexdigest()
    file_map[path] = {'sha': sha, 'size': len(content)}

# Create files first
for path, content in files.items():
    try:
        data_json = json.dumps({
            'sha': file_map[path]['sha'],
            'size': file_map[path]['size'],
            'content': content.hex()
        }).encode()
        req = urllib.request.Request(
            'https://api.vercel.com/v2/now/files',
            data=data_json, method='POST',
            headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
        )
        urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        if e.code != 409:  # duplicate file is ok
            print(f'File upload error {e.code}:', e.read().decode()[:200])

print(f'{len(files)} files uploaded')

# Create deployment
body = json.dumps({
    'name': 'aineedhelpfromotherai',
    'project': 'aineedhelpfromotherai',
    'files': file_map,
    'version': 2,
    'target': 'production'
}).encode()

req = urllib.request.Request(
    'https://api.vercel.com/v13/deployments',
    data=body, method='POST',
    headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
)
try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    uid = result.get('uid','')[:12]
    state = result.get('state','')
    url = result.get('url','')
    print(f'Deploy: {uid} state={state}')
    print(f'URL: https://{url}')
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f'Error {e.code}:', body[:500])
