#!/usr/bin/env bash
set -euo pipefail

# tiny-signals — daily telemetry report from ~/.s
# Usage: bash telemetry/tiny-signals.sh [--json]
# Install cron: 0 9 * * * bash /path/to/tiny-signals.sh

TELEMETRY_FILE="${HOME}/.s/telemetry.jsonl"
SIGNALS_DIR="${HOME}/.s/signals"
mkdir -p "${SIGNALS_DIR}"

if [ ! -f "${TELEMETRY_FILE}" ]; then
  echo "s: no telemetry yet"
  exit 0
fi

REPORT_DATE=$(date -u +"%Y-%m-%d")
REPORT_FILE="${SIGNALS_DIR}/report-${REPORT_DATE}.md"

python3 << PYEOF
import json, collections, sys, os, statistics
from datetime import datetime, timezone

entries = []
try:
  with open(os.path.expanduser('${TELEMETRY_FILE}')) as f:
    for line in f:
      line = line.strip()
      if line:
        try:
          entries.append(json.loads(line))
        except:
          pass
except FileNotFoundError:
  print("No telemetry file")
  sys.exit(0)

if not entries:
  print("No entries")
  sys.exit(0)

total = len(entries)
fails = [e for e in entries if e.get('exit_code', 0) != 0 and e.get('exit_code', -1) != -1]
aborted = [e for e in entries if e.get('aborted')]
today = [e for e in entries if e.get('timestamp', '').startswith('${REPORT_DATE}')]

by_tool = collections.Counter(e.get('tool_sub','unknown') for e in entries)

lines = []
lines.append(f"# s Telemetry Report — {${REPORT_DATE}}")
lines.append(f"")
lines.append(f"**Total ops**: {total}  |  **Failed**: {len(fails)} ({len(fails)*100//total if total else 0}%)  |  **Aborted**: {len(aborted)}")
lines.append(f"**Today**: {len(today)} ops")
lines.append(f"")
lines.append(f"## By Tool")
lines.append(f"")
lines.append(f"| Tool | Ops | Fails | Rate |")
lines.append(f"|------|----:|------:|-----:|")

for tool, cnt in by_tool.most_common():
    tool_fails = len([e for e in entries if e.get('tool_sub')==tool and e.get('exit_code',0)!=0 and e.get('exit_code',-1)!=-1])
    rate = tool_fails*100//cnt if cnt else 0
    lines.append(f"| {tool} | {cnt} | {tool_fails} | {rate}% |")

hesitations = [e for e in entries if e.get('hesitation_ms', 0) > 0]
if hesitations:
    avg_h = sum(e['hesitation_ms'] for e in hesitations) // len(hesitations)
    max_h = max(e['hesitation_ms'] for e in hesitations)
    lines.append(f"")
    lines.append(f"## Hesitation")
    lines.append(f"")
    lines.append(f"**Avg**: {avg_h}ms  |  **Max**: {max_h}ms  |  **Ops with hesitation**: {len(hesitations)}")

agents = collections.Counter(e.get('agent','unknown') for e in entries)
if agents:
    lines.append(f"")
    lines.append(f"## Agents")
    lines.append(f"")
    for agent, cnt in agents.most_common(5):
        lines.append(f"- {agent}: {cnt} ops")

signal = "🟢"
fail_rate = len(fails)*100//total if total else 0
if fail_rate >= 50:
    signal = "🔴 HIGH FAILURE RATE"
elif fail_rate >= 20:
    signal = "🟡 ELEVATED FAILURE RATE"

lines.insert(1, f"**Signal**: {signal}")
lines.insert(1, f"")

report = "\n".join(lines)

with open('${REPORT_FILE}', 'w') as f:
    f.write(report)

print(report)
print(f"\nReport saved: ${REPORT_FILE}")
PYEOF
