import urllib.request, json, sys

token = sys.argv[1]
req = urllib.request.Request('https://api.vercel.com/v9/projects', headers={'Authorization': f'Bearer {token}'})
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())

projects = data.get('projects', [])
if projects:
    for p in projects:
        name = p['name']
        url = ''
        if p.get('latestDeployments'):
            url = p['latestDeployments'][0].get('url', '')
        print(f"{name} -> https://{url}" if url else f"{name} -> no deploy")
else:
    print('No projects')
