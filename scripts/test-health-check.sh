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
while (($#)); do
  if [[ "$1" == -o ]]; then shift; output="$1"; fi
  url="$1"
  shift
done
printf '%s\n' "$url" >> "$MOCK_REQUESTS"
if [[ "$url" == *'/api/health' ]]; then
  printf '%s' "${MOCK_API_BODY:-}" > "$output"
  printf '%s' "${MOCK_API_CODE:-200}"
else
  printf '%s' "${MOCK_SITE_BODY:-}" > "$output"
  printf '%s' "${MOCK_SITE_CODE:-200}"
fi
MOCK
chmod +x "$TEMP/bin/curl"
export PATH="$TEMP/bin:$PATH" HEALTH_LOG="$TEMP/health.log" HEALTH_STATE_FILE="$TEMP/state"
export MOCK_ALERTS="$TEMP/alerts" MOCK_REQUESTS="$TEMP/requests" ALERT_URL=https://alerts.example.invalid/hook
export MOCK_API_BODY='{"status":"ok","runtime":"express"}' MOCK_SITE_BODY='<html>Phone Radar</html>'
run_ok() { bash "$ROOT/health-check.sh" --alert || { echo 'expected success' >&2; exit 1; }; }
run_fail() { if bash "$ROOT/health-check.sh" --alert; then echo 'expected failure' >&2; exit 1; fi; }
run_ok
grep -qx 'ok 0' "$HEALTH_STATE_FILE"
grep -q '^https://aineedhelpfromotherai.com/api/health$' "$MOCK_REQUESTS"
[[ ! -f "$MOCK_ALERTS" ]]
export MOCK_API_BODY='{"status":"error","runtime":"express"}'
run_fail
grep -qx 'pending 1' "$HEALTH_STATE_FILE"
[[ ! -f "$MOCK_ALERTS" ]]
run_fail
grep -qx 'down 2' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp DOWN' "$MOCK_ALERTS")" -eq 1 ]]
run_fail
[[ "$(grep -c 'aineedhelp DOWN' "$MOCK_ALERTS")" -eq 1 ]]
export MOCK_API_BODY='{"status":"ok","runtime":"express"}'
run_ok
grep -qx 'ok 0' "$HEALTH_STATE_FILE"
[[ "$(grep -c 'aineedhelp RECOVERED' "$MOCK_ALERTS")" -eq 1 ]]
export MOCK_SITE_BODY='<html>Unrelated page</html>'
run_fail
grep -qx 'pending 1' "$HEALTH_STATE_FILE"
export MOCK_SITE_BODY='<html>Phone Radar</html>' MOCK_API_CODE=503
run_fail
grep -qx 'down 2' "$HEALTH_STATE_FILE"
echo 'health check regression passed'
