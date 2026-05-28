import sys, json, re

d = json.load(sys.stdin)
txt = d['result']['content'][0]['text']
data = json.loads(txt)
logs = data.get('logs', [])

for log in logs:
    msg = log.get('message', '')
    msg = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', msg).strip()
    ts = log.get('timestamp', '')[11:19]
    lbls = {l['name']: l['value'] for l in log.get('labels', []) if l.get('name') in ('level', 'type')}
    print(f"[{ts}][{lbls.get('level','?')}] {msg[:250]}")
