#!/bin/bash
# Health check for aineedhelpfromotherai.com
# Usage: bash scripts/health-check.sh [--alert]
# Add to cron: */5 * * * * /opt/aineedhelpfromotherai/scripts/health-check.sh

set -e

SITE_URL="https://aineedhelpfromotherai.com"
API_URL="https://api.aineedhelpfromotherai.com/api/health"
LOG="/var/log/aineedhelp-health.log"

check() {
  local url="$1"
  local label="$2"
  local status_code
  status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null)
  if [ "$status_code" != "200" ]; then
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] FAIL $label — HTTP $status_code" >> "$LOG"
    return 1
  fi
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] OK $label — $status_code" >> "$LOG"
  return 0
}

# Truncate log to last 1000 lines
[ -f "$LOG" ] && tail -n 1000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"

SITE_OK=true
API_OK=true

check "$SITE_URL" "site" || SITE_OK=false
check "$API_URL" "api" || API_OK=false

if [ "$SITE_OK" = false ] || [ "$API_OK" = false ]; then
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] ALERT: site=$SITE_OK api=$API_OK" >> "$LOG"
  if [ "$1" = "--alert" ]; then
    # Simple alert via curl to a webhook (set ALERT_URL env var)
    if [ -n "$ALERT_URL" ]; then
      curl -s -X POST "$ALERT_URL" \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"aineedhelp alert: site=$SITE_OK api=$API_OK\"}" > /dev/null 2>&1
    fi
  fi
  exit 1
fi
exit 0
