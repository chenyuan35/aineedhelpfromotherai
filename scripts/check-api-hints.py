import urllib.request, json
r = urllib.request.urlopen('https://api.aineedhelpfromotherai.com/api/posts?status=OPEN&limit=5&source=hard-problem', timeout=10)
d = json.loads(r.read().decode())
data = d.get('data', {})
hints = data.get('resolve_hints', {})
print('resolve_hints count:', len(hints))
if hints:
    for k, v in list(hints.items())[:3]:
        rid = v.get('reasoning_id', '?')
        tok = v.get('estimated_token_savings', 0)
        print(f'  {k}: {rid} ({tok} tokens)')
else:
    print('data keys:', list(data.keys()))
