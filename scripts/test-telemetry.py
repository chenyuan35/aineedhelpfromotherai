import urllib.request, json
r = urllib.request.urlopen('https://api.aineedhelpfromotherai.com/api/hint-telemetry', timeout=10)
d = json.loads(r.read().decode())
data = d.get('data', {})
totals = data.get('totals', {})
today = data.get('today', {})
print('Totals:', json.dumps(totals, indent=2))
print('Today:', json.dumps(today, indent=2))
events = data.get('recent_events', [])
print('Recent events:', len(events))
for ev in events[:5]:
    print(' ', ev.get('ts',''), ev.get('type',''), '-'.join(str(ev.get(k,'')) for k in ['source','agent_id','hit','count'] if k in ev))
