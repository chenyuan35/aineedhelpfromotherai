#!/usr/bin/env bash
# External end-to-end check; run from an approved persistent monitor only.
# Example cron: */5 * * * * /path/to/scripts/health-check.sh --alert
set -u
umask 077

if [[ $# -gt 1 || ( $# -eq 1 && "$1" != '--alert' ) ]]; then
  echo 'Usage: health-check.sh [--alert]' >&2
  exit 2
fi

SITE_URL="${SITE_URL:-https://aineedhelpfromotherai.com/}"
# Liveness: proves the public Vercel rewrite reaches the Express process.
API_URL="${API_URL:-https://aineedhelpfromotherai.com/api/health}"
# Readiness: proves the database-backed application status is operational.
STATUS_URL="${STATUS_URL:-https://aineedhelpfromotherai.com/api/status}"
HEALTH_LOG="${HEALTH_LOG:-/var/log/aineedhelp-health.log}"
HEALTH_STATE_FILE="${HEALTH_STATE_FILE:-/var/tmp/aineedhelp-health.state}"
FAIL_THRESHOLD="${FAIL_THRESHOLD:-2}"
if ! [[ "$FAIL_THRESHOLD" =~ ^([1-9]|10)$ ]]; then
  echo 'FAIL_THRESHOLD must be an integer from 1 to 10' >&2
  exit 2
fi

log() {
  local line
  line="[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] $*"
  printf '%s\n' "$line" >> "$HEALTH_LOG" 2>/dev/null || printf '%s\n' "$line" >&2
}

probe() {
  local kind="$1" url="$2" body code valid=1
  body="$(mktemp)" || { log "FAIL $kind: temp-file unavailable"; return 1; }
  code="$(curl -sS -L --connect-timeout 5 --max-time 10 -o "$body" -w '%{http_code}' "$url" 2>/dev/null)"
  if [[ $? -eq 0 && "$code" == 200 ]]; then
    if [[ "$kind" == site ]]; then
      grep -qi '<html' "$body" && grep -Fq 'Phone Radar' "$body" && valid=0
    else
      node - "$body" "$kind" >/dev/null 2>&1 <<'JS'
const fs = require('fs');
const kind = process.argv[3];
try {
  const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  if (kind === 'api') {
    if (data.status !== 'ok' || data.runtime !== 'express') process.exitCode = 1;
  } else if (kind === 'database') {
    if (data.alive !== true) process.exitCode = 1;
  } else {
    process.exitCode = 1;
  }
} catch (_) {
  process.exitCode = 1;
}
JS
      valid=$?
    fi
  fi
  rm -f "$body"
  if (( valid != 0 )); then
    log "FAIL $kind: HTTP ${code:-000} or unexpected response"
    return 1
  fi
  log "OK $kind: HTTP 200 and content verified"
}

send_alert() {
  [[ "${1:-}" == '' ]] && return 0
  [[ "${ALERT_URL:-}" == '' || "${2:-}" != --alert ]] && return 0
  local payload
  payload="$(printf '{"text":"aineedhelp %s: site=%s api=%s database=%s"}' "$1" "$site_state" "$api_state" "$database_state")"
  curl -fsS --connect-timeout 5 --max-time 10 -X POST \
    -H 'Content-Type: application/json' --data "$payload" "$ALERT_URL" >/dev/null 2>&1 || log "WARN alert delivery failed"
}

prev=ok
fail_count=0
if [[ -f "$HEALTH_STATE_FILE" ]]; then
  read -r prev fail_count < "$HEALTH_STATE_FILE" || true
  [[ "$prev" =~ ^(ok|pending|down)$ ]] || prev=ok
  [[ "$fail_count" =~ ^[0-9]+$ ]] || fail_count=0
fi
save_state() {
  local tmp="${HEALTH_STATE_FILE}.$$"
  if printf '%s %s\n' "$1" "$2" > "$tmp" && mv -f "$tmp" "$HEALTH_STATE_FILE"; then
    return 0
  fi
  rm -f "$tmp"
  log "WARN cannot persist health state"
}

site_state=ok
api_state=ok
database_state=ok
probe site "$SITE_URL" || site_state=fail
probe api "$API_URL" || api_state=fail
probe database "$STATUS_URL" || database_state=fail
# Treat DB readiness failure as an API outage even when Express liveness is OK.
if [[ "$database_state" != ok ]]; then api_state=fail; fi

if [[ "$site_state" == ok && "$api_state" == ok && "$database_state" == ok ]]; then
  [[ "$prev" == down ]] && { log 'RECOVERED site, API and database'; send_alert RECOVERED "${1:-}"; }
  save_state ok 0
  exit 0
fi

if (( fail_count < FAIL_THRESHOLD )); then fail_count=$((fail_count + 1)); fi
if (( fail_count >= FAIL_THRESHOLD )); then
  if [[ "$prev" != down ]]; then
    log "DOWN site=$site_state api=$api_state database=$database_state"
    send_alert DOWN "${1:-}"
  fi
  save_state down "$fail_count"
else
  log "PENDING failure $fail_count/$FAIL_THRESHOLD site=$site_state api=$api_state database=$database_state"
  save_state pending "$fail_count"
fi
exit 1
