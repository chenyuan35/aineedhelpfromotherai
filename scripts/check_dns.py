import json, sys
with open(sys.argv[1]) as f:
    d = json.load(f)
if d.get('success'):
    for rec in d['result']:
        print(f"{rec['type']} {rec['name']} -> {rec['content']}  (id={rec['id']}, proxied={rec['proxied']})")
else:
    print('Error:', d.get('errors'))
