import urllib.request, json, sys

token = sys.argv[1]

# Try to clear rootDirectory by explicitly setting it to empty
body = json.dumps({
    "rootDirectory": ""
}).encode()

req = urllib.request.Request(
    'https://api.vercel.com/v9/projects/aineedhelpfromotherai',
    data=body, method='PATCH',
    headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
)
try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    rd = data.get('rootDirectory', '(empty)')
    print(f'rootDirectory: {rd}')
except urllib.error.HTTPError as e:
    body_txt = e.read().decode()
    print(f'Error {e.code}:', body_txt[:400])
