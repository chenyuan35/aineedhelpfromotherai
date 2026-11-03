#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
mkdir -p "$TEMP/bin"
cat > "$TEMP/bin/curl" <<'MOCK'
#!/usr/bin/env bash
if [[ " $* " == *' -X POST '* ]]; then
  printf '%s\n' "$*" >> "$MOCK_ALERTS"
  exit 0
fi
output=''
url=''
while (($#)); do
  case "$1" in
    -o) shift; output="$1" ;;
    -w) shift ;;
    *) url="$1" ;;
  esac
  shift
done
printf '%s\n' "$url" >> "$MOCK_REQUESTS"
case "$url" in
  */api/health)
    printf '%s' "${MOCK_API_BODY:-}" > "$output"
    printf '%s' "${MOCK_API_CODE:-200}"
    ;;
  */api/status)
    printf '%s' "${MOCK_STATUS_BODY:-}" > "$output"
    printf '%s' "${MOCK_STATUS_CODE:-200}"
    ;;
  *)
    printf '%s' "${MOCK_SITE_BODY:-}" > "$output"
    printf '%s' "${MOCK_SITE_CODE:-200}"
    ;;
esac
MOCK
chmod +x "$TEMP/bin/curl"
export PATH="$TEMP/bin:$PATH" HEALTH_LOG="$TEMP/health.log" HEALTH_STATE_FILE="$TEMP/state"
export MOCK_ALERTS="$TEMP/alerts" MOCK_REQUESTS="$TEMP/requests" ALERT_URL=https://alerts.example.invalid/hook
export MOCK_API_BODY='{"status":"ok","runtime":"express"}'
export MOCK_STATUS_BODY='{"alive":true}'
export MOCK_SITE_BODY='<html>Phone Radar</html>'
run_ok() { bash "$ROOT/health-check.sh" --alert || { echo 'expected success' >&2; exit 1; }; }
run_fail() { if bash "$ROOT/health-check.sh" --alert; then echo 'expected failure' >&2; exit 1; fi; }

# A healthy site, Express process and database all pass.
run_ok
grep -qx 'ok 0' "$HEALTH_STATE_FILE"
grep -q '^https://aineedhelpfromotherai.com/api/health$' "$MOCK_REQUESTS"
grep -q '^https://aineedhelpfromotherai.com/api/status$' "$MOCK_REQUESTS"
[[ ! -f "$MOCK_ALERTS" ]]

# Express liveness failure is still detected and alert transitions are deduplicated.
export MOCK_API_BODY='{"status":"error","runtime":"express"}'
run_fail
grep -qx 'pending 1' "$HEALTH_STATE_FILE"
[[ ! -f "$MOCK_ALERTS" ]]
run_fail
grep -qx 'down 2' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp DOWN' "$MOCK_ALERTS")" -eq 1 ]]
run_fail
[[ "$(grep -c 'aineedhelp DOWN' "$MOCK_ALERTS")" -eq 1 ]]

# Recovery requires both the Express liveness and database readiness probes.
export MOCK_API_BODY='{"status":"ok","runtime":"express"}'
run_ok
grep -qx 'ok 0' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp RECOVERED' "$MOCK_ALERTS")" -eq 1 ]]

# A bad site is still a failure.
export MOCK_SITE_BODY='<html>Unrelated page</html>'
run_fail
grep -qx 'pending 1' "$HEALTH_STATE_FILE"

# A database HTTP error is an outage even when Express liveness is healthy.
export MOCK_SITE_BODY='<html>Phone Radar</html>' MOCK_STATUS_CODE=503
run_fail
grep -qx 'down 2' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp DOWN' "$MOCK_ALERTS")" -eq 2 ]]

# HTTP 200 with alive=false must also fail readiness.
export MOCK_STATUS_CODE=200 MOCK_STATUS_BODY='{"alive":false,"reason":"database_unavailable"}'
run_fail
grep -qx 'down 2' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp DOWN' "$MOCK_ALERTS")" -eq 2 ]]

# Database recovery emits exactly one recovery transition.
export MOCK_STATUS_BODY='{"alive":true}'
run_ok
grep -qx 'ok 0' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp RECOVERED' "$MOCK_ALERTS")" -eq 2 ]]

# A database failure is independently caught while /api/health remains healthy.
export MOCK_STATUS_BODY='{"alive":false,"reason":"database_unavailable"}'
run_fail
grep -qx 'pending 1' "$HEALTH_STATE_FILE"
run_fail
grep -qx 'down 2' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp DOWN' "$MOCK_ALERTS")" -eq 3 ]]

export MOCK_STATUS_BODY='{"alive":true}'
run_ok
grep -qx 'ok 0' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp RECOVERED' "$MOCK_ALERTS")" -eq 3 ]]

echo 'health check liveness + database readiness regression passed'
