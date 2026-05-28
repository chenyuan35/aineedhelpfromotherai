import urllib.request, json, sys, os, hashlib

token = sys.argv[1]
project_id = 'aineedhelpfromotherai'

# List the latest 3 deployments
req = urllib.request.Request(
    f'https://api.vercel.com/v6/deployments?projectId={project_id}&limit=3',
    headers={'Authorization': f'Bearer {token}'}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())

deployments = data.get('deployments', [])
for d in deployments:
    uid = d['uid'][-8:]
    name = d.get('name','')
    state = d.get('state','')
    created = d.get('createdAt',0)
    url = d.get('url','')
    meta = d.get('meta',{})
    commit = meta.get('commitMessage','')[:40]
    print(f"{uid} state={state} commit={commit} url={url}")
