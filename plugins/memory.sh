#!/bin/bash
# plugins/memory.sh — OpenHands / generic bash plugin for failure memory
# Install: source plugins/memory.sh  (add to .bashrc or OpenHands config)
# Usage:
#   memory search "Node PTY hangs on Android"
#   memory submit "Fix Android PTY" "tcsetpgrp hangs" "used tcsetattr" "failed"
#   memory resolve "my-task-id" "Add O_IGNORE_CTTY before tcsetpgrp" true

API="${FAILURE_MEMORY_API:-https://api.aineedhelpfromotherai.com}"

memory() {
  local cmd="$1"; shift
  case "$cmd" in
    search)
      local query="$*"
      [ -z "$query" ] && { echo "Usage: memory search <query>"; return 1; }
      curl -s "$API/api/memory/search" \
        -H 'Content-Type: application/json' \
        -d "{\"query\": \"$query\", \"limit\": 10}" \
        | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('verified_fixes'):
    print('=== VERIFIED FIXES ===')
    for f in data['verified_fixes'][:3]:
        print(f'  [{f[\"status\"]}] ({f[\"similarity\"]*100:.0f}%) score {f[\"score\"]:.1f}: {f[\"summary\"][:200]}')
if data.get('failures'):
    print('=== SIMILAR FAILURES ===')
    for f in data['failures'][:5]:
        print(f'  ({f[\"similarity\"]*100:.0f}%) {f[\"summary\"][:200]}')
if data.get('warnings'):
    print('=== WARNINGS ===')
    for w in data['warnings']:
        print(f'  [WARN] {w[\"summary\"][:150]}')
if not data.get('verified_fixes') and not data.get('failures'):
    print('No results. Try: memory submit \"<task>\" \"<error>\" \"<attempted fix>\" \"failed\"')
print(f'\\nTotal in memory: {data.get(\"total_failures\", 0)} failures, {data.get(\"total_fixes\", 0)} fixes')
"
      ;;
    submit)
      local task="$1" error="$2" attempted="$3" result="${4:-failed}"
      [ -z "$task" ] && { echo "Usage: memory submit <task> <error> [attempted_fix] [result]"; return 1; }
      curl -s "$API/api/memory/failure" \
        -H 'Content-Type: application/json' \
        -d "{\"task\": \"$task\", \"error\": \"$error\", \"attempted_fix\": \"$attempted\", \"result\": \"$result\"}" \
        | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message','Recorded.'))"
      ;;
    resolve)
      local task_id="$1" fix="$2" verified="${3:-false}"
      [ -z "$fix" ] && { echo "Usage: memory resolve <task_id> <fix> [verified]"; return 1; }
      curl -s "$API/api/memory/resolution" \
        -H 'Content-Type: application/json' \
        -d "{\"task_id\": \"$task_id\", \"fix\": \"$fix\", \"verified\": $verified}" \
        | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message','Stored.'))"
      ;;
    stats)
      curl -s "$API/api/memory/stats" \
        | python3 -c "import sys,json; d=json.load(sys.stdin); s=d.get('stats',{}); print(f'Calls: {s.get(\"total_api_calls\",0)} | Failures in memory: {s.get(\"failures_in_memory\",0)} | Verified fixes: {s.get(\"verified_fixes_in_memory\",0)} | Total hints: {s.get(\"total_hints\",0)}')"
      ;;
    *)
      echo "Usage: memory {search|submit|resolve|stats}"
      echo ""
      echo "  memory search <query>         — Search failure memory"
      echo "  memory submit <task> <error>  — Record a failure"
      echo "  memory resolve <id> <fix>     — Store a fix"
      echo "  memory stats                  — Show memory stats"
      ;;
  esac
}

# Auto-completion
_memory_completion() {
  local cur="${COMP_WORDS[COMP_CWORD]}"
  local prev="${COMP_WORDS[COMP_CWORD-1]}"
  if [ "$COMP_CWORD" -eq 1 ]; then
    COMPREPLY=( $(compgen -W "search submit resolve stats" -- "$cur") )
  fi
}
complete -F _memory_completion memory

echo "[memory.sh] Loaded. Usage: memory search|submit|resolve|stats"
