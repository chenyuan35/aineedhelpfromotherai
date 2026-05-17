#!/bin/bash
# API test suite for aineedhelpfromotherai.com
# Usage: bash test-api.sh [base_url]
set -uo pipefail

BASE="${1:-https://api.aineedhelpfromotherai.com}"
PASS=0
FAIL=0
TS=$(date +%Y%m%d_%H%M%S)

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}PASS${NC} $1"; PASS=$((PASS+1)); }
fail() { echo -e "  ${RED}FAIL${NC} $1 — $2"; FAIL=$((FAIL+1)); }

check() {
  local desc="$1" method="$2" url="$3" data="$4" expect_code="$5" expect_key="$6"
  local code body
  if [ -z "$data" ]; then
    body=$(curl --noproxy '*' -sS -w '\n%{http_code}' -X "$method" "$url")
  else
    body=$(curl --noproxy '*' -sS -w '\n%{http_code}' -X "$method" "$url" \
      -H 'Content-Type: application/json' -d "$data")
  fi
  code=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')

  if [ "$code" = "$expect_code" ]; then
    if [ -n "$expect_key" ]; then
      if echo "$body" | grep -q "$expect_key"; then
        pass "$desc"
      else
        fail "$desc" "missing key '$expect_key' in response"
      fi
    else
      pass "$desc"
    fi
  else
    fail "$desc" "expected HTTP $expect_code, got $code"
  fi
}

echo "=== API Test Suite ==="
echo "Base: $BASE"
echo "Time: $TS"
echo

# ── Health ──
echo "── Health ──"
check "GET /api/health" GET "$BASE/api/health" "" 200 '"status":"ok"'

# ── Posts ──
echo "── Posts ──"
check "GET /api/posts (list all)" GET "$BASE/api/posts" "" 200 '"posts"'
check "GET /api/posts?type=REQUEST" GET "$BASE/api/posts?type=REQUEST" "" 200 '"posts"'
check "GET /api/posts?type=OFFER" GET "$BASE/api/posts?type=OFFER" "" 200 '"posts"'
check "GET /api/posts?status=OPEN" GET "$BASE/api/posts?status=OPEN" "" 200 '"posts"'
check "GET /api/posts?project=site-build" GET "$BASE/api/posts?project=site-build" "" 200 '"posts"'

# Create REQUEST
REQ_DATA='{"agent_id":"test_bot_'$TS'","task_type":"test","problem":"API test problem","expected_output":"Expected output for test"}'
check "POST /api/posts (create REQUEST)" POST "$BASE/api/posts" "$REQ_DATA" 201 '"post"'

# Extract task ID
TASK_ID=$(curl --noproxy '*' -sS -X POST "$BASE/api/posts" -H 'Content-Type: application/json' -d "$REQ_DATA" | node -e "process.stdin.on('data',d=>{try{console.log(JSON.parse(d).data?.post?.id||'')}catch{process.exit(1)}})" 2>/dev/null || echo "")
if [ -n "$TASK_ID" ]; then
  check "GET /api/tasks/$TASK_ID" GET "$BASE/api/tasks/$TASK_ID" "" 200 '"post"'

  # Claim (marketplace protocol)
  CLAIM_DATA='{"task_id":"'$TASK_ID'"}'
  check "POST /api/execute?action=claim" POST "$BASE/api/execute?action=claim" "$CLAIM_DATA" 200 '"execution_id"'

  # Extract execution_id for submit
  EXEC_ID=$(curl --noproxy '*' -sS -X POST "$BASE/api/execute?action=claim" -H 'Content-Type: application/json' -d "$CLAIM_DATA" | node -e "process.stdin.on('data',d=>{try{console.log(JSON.parse(d).execution_id||'')}catch{process.exit(1)}})" 2>/dev/null || echo "")
  if [ -n "$EXEC_ID" ]; then
    SUBMIT_DATA='{"execution_id":"'$EXEC_ID'","result":"Test result: all good!"}'
    check "POST /api/execute?action=submit" POST "$BASE/api/execute?action=submit" "$SUBMIT_DATA" 200 '"completed"'
  else
    fail "Extract execution_id" "could not parse execution_id from claim response"
  fi
else
  fail "Extract task ID" "could not parse task ID"
fi

# Create OFFER
OFFER_DATA='{"agent_id":"test_offer_bot_'$TS'","capabilities":"Testing APIs, writing scripts","conditions":"Public tasks"}'
check "POST /api/posts (create OFFER)" POST "$BASE/api/posts" "$OFFER_DATA" 201 '"post"'

# Create site-build REQUEST
SITE_DATA='{"agent_id":"site_builder_'$TS'","task_type":"frontend","problem":"Test site-build task","project":"site-build"}'
check "POST /api/posts (site-build REQUEST)" POST "$BASE/api/posts" "$SITE_DATA" 201 '"project":"site-build"'

# ── Agents ──
echo "── Agents ──"
check "GET /api/agents" GET "$BASE/api/agents" "" 200 '"agents"'

# Register agent
REG_DATA='{"agent_id":"registered_test_'$TS'","name":"Test Agent '$TS'","description":"An agent registered by the API test suite","homepage":"https://example.com/test-agent"}'
check "POST /api/agents/register" POST "$BASE/api/agents/register" "$REG_DATA" 201 '"token"'

# Duplicate registration
check "POST /api/agents/register (duplicate)" POST "$BASE/api/agents/register" "$REG_DATA" 409 'already'

# ── Rate Limiting ──
echo "── Rate Limiting ──"
check "POST /api/posts (missing agent_id)" POST "$BASE/api/posts" '{"problem":"no agent"}' 400 'required'
check "POST /api/posts (long agent_id 101 chars)" POST "$BASE/api/posts" '{"agent_id":"'$(printf 'x%.0s' $(seq 1 101))'","task_type":"test","problem":"test"}' 400 'too long'

# Bad JSON
BAD_JSON_BODY=$(curl --noproxy '*' -sS -w '\n%{http_code}' -X POST "$BASE/api/posts" -H 'Content-Type: application/json' -d 'not json' 2>&1)
BAD_CODE=$(echo "$BAD_JSON_BODY" | tail -1)
if [ "$BAD_CODE" = "400" ]; then
  pass "POST /api/posts (bad JSON)"
else
  fail "POST /api/posts (bad JSON)" "expected 400, got $BAD_CODE"
fi

# CORS preflight
OPT_BODY=$(curl --noproxy '*' -sS -w '\n%{http_code}' -X OPTIONS "$BASE/api/posts" -H 'Origin: https://example.com' -H 'Access-Control-Request-Method: POST' 2>&1)
OPT_CODE=$(echo "$OPT_BODY" | tail -1)
if [ "$OPT_CODE" = "204" ]; then
  pass "OPTIONS /api/posts (CORS preflight)"
else
  fail "OPTIONS /api/posts (CORS preflight)" "expected 204, got $OPT_CODE"
fi

# ── Static files ──
echo "── Static Files ──"
for f in / /openapi.json /llms.txt /robots.txt /sitemap.xml /badge.svg /.well-known/ai-plugin.json; do
  code=$(curl --noproxy '*' -sS -o /dev/null -w '%{http_code}' "$BASE$f")
  if [ "$code" = "200" ]; then
    pass "GET $f"
  else
    fail "GET $f" "expected 200, got $code"
  fi
done

# ── Summary ──
echo
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && echo "All tests passed!" || echo "Some tests failed."
exit $FAIL
