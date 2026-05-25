#!/bin/bash
# test-error-standardization.sh — Test error response standardization

echo "Testing error response standardization..."
echo ""

# Test 1: Missing required field (400)
echo "Test 1: Missing required field (400)"
curl -s -X POST "http://localhost:3000/api/execute?action=claim" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.' || echo "Failed"
echo ""

# Test 2: Not found (404)
echo "Test 2: Not found (404)"
curl -s "http://localhost:3000/api/execute?execution_id=INVALID_ID" | jq '.' || echo "Failed"
echo ""

# Test 3: Rate limit (429)
echo "Test 3: Rate limit (429) — repeat claim 10 times"
for i in {1..10}; do
  curl -s -X POST "http://localhost:3000/api/execute?action=claim" \
    -H "Content-Type: application/json" \
    -H "X-Agent-ID: test-agent" \
    -d '{"task_id":"TASK_001"}' > /dev/null
done
curl -s -X POST "http://localhost:3000/api/execute?action=claim" \
  -H "Content-Type: application/json" \
  -H "X-Agent-ID: test-agent" \
  -d '{"task_id":"TASK_002"}' | jq '.' || echo "Failed"
echo ""

echo "All tests completed. Look for standardized error format:"
echo '{ "error": "...", "message": "...", "status_code": ... }'
