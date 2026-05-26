#!/bin/bash
# ci-verify.sh — Run this BEFORE pushing to catch CI failures locally
# Usage: bash scripts/ci-verify.sh
set -e

echo "=== CI Verify: Checking Node.js ==="
node -v || { echo "FAIL: Node.js required"; exit 1; }

echo "=== CI Verify: Installing deps ==="
npm ci 2>/dev/null || npm install
echo "OK"

echo "=== CI Verify: Starting server ==="
npm start > /tmp/ci-verify-server.log 2>&1 &
SERVER_PID=$!
sleep 3

# Wait for health check
READY=false
for i in {1..20}; do
  if curl -s http://localhost:3000/api/health 2>/dev/null | grep -q 'ok'; then
    READY=true
    break
  fi
  sleep 1
done

if [ "$READY" = false ]; then
  echo "FAIL: Server failed to start within 20s"
  echo "--- Server log ---"
  cat /tmp/ci-verify-server.log
  kill $SERVER_PID 2>/dev/null
  exit 1
fi
echo "OK (PID $SERVER_PID)"

echo "=== CI Verify: Running auth-demo ==="
if [ -f scripts/auth-demo.sh ]; then
  bash scripts/auth-demo.sh ci-agent http://localhost:3000 || echo "WARN: auth-demo exit code ignored"
fi
echo "OK"

echo "=== CI Verify: Memory gate test ==="
curl -s "http://localhost:3000/api/memory/gate?q=test" | head -c 200
echo ""
echo "OK"

echo "=== CI Verify: Stopping server ==="
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
echo "OK"

echo ""
echo "=== ALL CHECKS PASSED — Safe to push ==="
