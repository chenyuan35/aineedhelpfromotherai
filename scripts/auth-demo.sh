#!/usr/bin/env bash
set -euo pipefail
AGENT=${1:-demo-agent}
HOST=${2:-http://localhost:3000}

if [ -f .env ]; then
  # Export non-commented lines in .env
  export $(grep -v '^#' .env | xargs)
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH" >&2
  exit 1
fi

TMP=$(node scripts/generate-agent-signature-json.js "$AGENT" 2>/dev/null || true)
if [ -z "$TMP" ]; then
  echo "Failed to generate signature JSON" >&2
  exit 1
fi

# Use node to parse JSON so we don't require jq/python
SIG=$(printf '%s' "$TMP" | node -e "const fs=require('fs'); const s=JSON.parse(fs.readFileSync(0,'utf8')); console.log(s.signature)")
TS=$(printf '%s' "$TMP" | node -e "const fs=require('fs'); const s=JSON.parse(fs.readFileSync(0,'utf8')); console.log(s.timestamp)")

echo "Signature: $SIG"
echo "Timestamp: $TS"
echo
echo "Example curl:"
echo "curl -i -X GET '$HOST/mcp' -H \"X-Agent-Signature: $SIG\" -H \"X-Agent-Id: $AGENT\" -H \"X-Agent-Timestamp: $TS\""
echo
curl -i -X GET "$HOST/mcp" -H "X-Agent-Signature: $SIG" -H "X-Agent-Id: $AGENT" -H "X-Agent-Timestamp: $TS"
