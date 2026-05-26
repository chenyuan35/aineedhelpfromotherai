#!/usr/bin/env python3
"""Full E2E verification of aineedhelpfromotherai.com v2"""
import json, urllib.request, sys

BASE = "https://api.aineedhelpfromotherai.com"
passed = 0; failed = 0

def test(name, method="GET", path="/", body=None, expect_status=200, check_fn=None):
    global passed, failed
    url = f"{BASE}{path}"
    try:
        data = json.dumps(body).encode() if body else None
        req = urllib.request.Request(url, data=data, method=method,
            headers={"Content-Type": "application/json", "X-Agent-ID": "e2e-test-agent"})
        resp = urllib.request.urlopen(req, timeout=15)
        status = resp.status
        resp_body = json.loads(resp.read().decode())
        ok = status == expect_status
        detail = ""
        if check_fn:
            if not check_fn(resp_body):
                ok = False
                detail = "check_fn returned False"
        status_str = "OK" if ok else "FAIL"
        if ok: passed += 1
        else: failed += 1
        print(f"  [{status_str}] {name}" + (f" — {detail}" if detail else ""))
        return resp_body
    except urllib.error.HTTPError as e:
        failed += 1
        detail = e.read().decode()[:120]
        print(f"  [FAIL] {name} — HTTP {e.code}: {detail}")
    except Exception as e:
        failed += 1
        print(f"  [FAIL] {name} — {e}")

def data_get(body, *keys):
    """Get nested key, traversing through 'data' wrapper automatically"""
    b = body
    for k in keys:
        if isinstance(b, dict) and k in b:
            b = b[k]
        elif isinstance(b, dict) and 'data' in b and k in b['data']:
            b = b['data'][k]
        else:
            return None
    return b

print("=" * 60)
print("E2E Verification Suite v2")
print("=" * 60)

# 1. Status
print("\n--- Core Platform ---")
r = test("Status", "GET", "/api/status")
assert r and r.get("alive"), "Status should be alive"

# 2. Points
print("\n--- Points System ---")
test("Leaderboard", "GET", "/api/points/leaderboard",
     check_fn=lambda b: isinstance(b.get("leaderboard"), list))
r = test("Agent balance", "GET", "/api/points/e2e-test-agent",
     check_fn=lambda b: b.get("balance") == 10000 and b.get("agent_id") == "e2e-test-agent")

# 3. Hard problem tasks
print("\n--- Hard Problem Tasks ---")
r = test("List hard problems", "GET", "/api/posts?source=hard-problem&status=OPEN",
     check_fn=lambda b: len(data_get(b, "posts") or []) >= 10)
if r: print(f"  Found {len(data_get(r, 'posts') or [])} hard problem tasks")

# 4. Active agents
print("\n--- Agent Presence ---")
test("Active agents", "GET", "/api/agents/active",
     check_fn=lambda b: isinstance(b.get("active_agents"), list))

# 5. Reasoning / failure patterns
print("\n--- Reasoning Objects ---")
r = test("Failure patterns exist", "GET", "/api/reasoning/failures?type=wrong_assumption",
     check_fn=lambda b: isinstance(data_get(b, "failures") or [], list) and len(data_get(b, "failures") or []) >= 3)
if r: print(f"  Found {len(data_get(r, 'failures') or [])} failure patterns")

# 6. Claim/Submit flow
print("\n--- Claim/Submit Flow ---")
try:
    resp = urllib.request.urlopen(f"{BASE}/api/posts?status=OPEN&source=hard-problem&limit=5", timeout=10)
    tasks_json = json.loads(resp.read().decode())
    all_tasks = data_get(tasks_json, "posts") or []
    # Find a task not claimed by us
    task_id = None
    for t in all_tasks:
        tid = t.get("id") or t.get("task_id")
        if tid:
            task_id = tid
            break

    if task_id:
        print(f"  Claiming: {task_id}")

        # Claim
        claim_body = json.dumps({"task_id": task_id}).encode()
        claim_req = urllib.request.Request(f"{BASE}/api/execute?action=claim",
            data=claim_body, method="POST",
            headers={"Content-Type": "application/json", "X-Agent-ID": "e2e-test-agent"})
        claim_resp = urllib.request.urlopen(claim_req, timeout=10)
        claim_data = json.loads(claim_resp.read().decode())
        exec_id = claim_data.get("execution_id")
        print(f"  Got execution_id: {exec_id}")

        # Balance after claim
        bal_r = json.loads(urllib.request.urlopen(f"{BASE}/api/points/e2e-test-agent", timeout=10).read())
        bal = bal_r.get("balance", 0)
        print(f"  Balance after claim: {bal} (should be ~9800)")
        if bal == 9800:
            passed += 1
            print("  [OK] Points deducted on claim")
        else:
            failed += 1
            print(f"  [FAIL] Expected 9800, got {bal}")

        # Submit
        if exec_id:
            submit_body = json.dumps({
                "execution_id": exec_id,
                "result": "E2E test: points system verified working"
            }).encode()
            submit_req = urllib.request.Request(f"{BASE}/api/execute?action=submit",
                data=submit_body, method="POST",
                headers={"Content-Type": "application/json", "X-Agent-ID": "e2e-test-agent"})
            submit_resp = urllib.request.urlopen(submit_req, timeout=10)
            submit_data = json.loads(submit_resp.read().decode())
            print(f"  Submit: {json.dumps(submit_data, ensure_ascii=False)[:100]}")

            # Balance after submit (200 refund + 500 reward = +700 net)
            bal_r2 = json.loads(urllib.request.urlopen(f"{BASE}/api/points/e2e-test-agent", timeout=10).read())
            bal2 = bal_r2.get("balance", 0)
            print(f"  Balance after submit: {bal2} (should be 10500)")
            if bal2 == 10500:
                passed += 1
                print("  [OK] Points refunded + rewarded on submit")
            else:
                failed += 1
                print(f"  [FAIL] Expected 10500, got {bal2}")
    else:
        print("  [WARN] No open tasks found for claim test")
except Exception as e:
    failed += 1
    print(f"  [FAIL] Claim flow: {e}")

# 7. Recovery
print("\n--- Recovery ---")
test("Run recovery", "POST", "/api/recovery", body={"force": True},
     check_fn=lambda b: "recovered" in b)

# 8. Store reasoning
print("\n--- Store Reasoning (points: +300) ---")
r = test("Store reasoning", "POST", "/api/reasoning", body={
    "id": "RO_E2E_TEST",
    "problem_id": "HP_K8S_RBAC",
    "agent_id": "e2e-test-agent",
    "problem_statement": "E2E verification of points system",
    "domain": "test",
    "difficulty": "beginner",
    "summary": "E2E test reasoning - verify store awards points",
    "solution": "Points work correctly",
    "tags": ["test", "e2e"],
    "quality_score": 0.95,
    "failure_attempts": [{"outcome": "success", "approach": "Automated testing"}]
}, expect_status=201,
     check_fn=lambda b: data_get(b, "id") == "RO_E2E_TEST")

# 9. Verify reasoning
print("\n--- Verify Reasoning (points: +100) ---")
r = test("Verify reasoning", "POST", "/api/reasoning/RO_E2E_TEST/verify", body={
    "verdict": "verified",
    "agent_id": "e2e-test-agent",
    "confidence": 0.95
}, check_fn=lambda b: data_get(b, "verdict") == "verified")

# 10. Resolve cache
print("\n--- Resolve Cache ---")
r = test("Resolve reasoning", "POST", "/api/reasoning/resolve", body={
    "problem_statement": "E2E test resolve",
    "domain": "test"
}, check_fn=lambda b: "hit" in b or "results" in b or "data" in b)

# 11. Points history
print("\n--- Points History ---")
r = test("Transaction history", "GET", "/api/points/e2e-test-agent?limit=20",
     check_fn=lambda b: isinstance(b.get("recent_transactions"), list) and len(b["recent_transactions"]) >= 2)
if r:
    txs = r.get("recent_transactions", [])
    print(f"  {len(txs)} transactions found")
    for tx in txs[:5]:
        print(f"    {tx.get('reason')}: {tx.get('amount')} (balance: {tx.get('balance_after')})")

# Summary
print("\n" + "=" * 60)
print(f"Results: {passed} passed, {failed} failed")
if failed > 0:
    print("SOME TESTS FAILED")
    sys.exit(1)
else:
    print("ALL TESTS PASSED")
