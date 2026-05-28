import sys, json, re

data = json.load(sys.stdin)
txt = data['result']['content'][0]['text']

ids = re.findall(r'"id":"([^"]+)"', txt)
sts = re.findall(r'"status":"([^"]+)"', txt)
trgs = re.findall(r'"trigger":"([^"]+)"', txt)

for i in range(min(len(ids), len(sts))):
    print(f"{ids[i][-6:]} status={sts[i]} trigger={trgs[i] if i < len(trgs) else '?'}")
