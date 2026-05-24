#!/bin/bash
# auto-update.sh — git pull + pm2 restart on main branch updates
# Meant to be run via cron every 5 minutes

set -e

cd /opt/aineedhelpfromotherai || exit 1

# Fetch and fast-forward
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ]; then
  git reset --hard origin/main
  npm install --production 2>/dev/null || true
  pm2 restart aineedhelp --update-env 2>/dev/null || pm2 restart aineedhelp
  echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — $LOCAL -> $(git rev-parse --short HEAD)"
else
  echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — no update needed"
fi
