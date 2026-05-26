#!/bin/bash
# auto-update.sh — git pull + pm2 restart + multi-agent ecosystem launch
# Runs via cron every 5 minutes

set -e

cd /opt/aineedhelpfromotherai || exit 1

git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ]; then
  git reset --hard origin/main
  npm install --production 2>/dev/null || true

  # Restart main server FIRST so the seed can use the API
  pm2 restart aineedhelp --update-env 2>/dev/null || pm2 start server.js --name aineedhelp --update-env
  sleep 3

  # Run mass seed (idempotent — checks data/mass-seed.json)
  if [ ! -f data/mass-seed.json ]; then
    echo "[auto-update] Running mass seed (400 tasks)..."
    node scripts/seed-mass-tasks.js 2>&1 || echo "[auto-update] Seed failed (may be retryable)"
  fi

  # Kill old single resolver-bot if still running
  pm2 delete resolver-bot 2>/dev/null || true

  # Ensure logs directory
  mkdir -p logs

  # Launch or restart all 4 resolver agents via ecosystem
  for agent in resolver-fast resolver-careful resolver-skeptic resolver-minimal; do
    pm2 delete $agent 2>/dev/null || true
  done
  pm2 start ecosystem.config.js --update-env 2>/dev/null || echo "[auto-update] Ecosystem start failed — check ecosystem.config.js"

  echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — $LOCAL -> $(git rev-parse --short HEAD) — multi-agent deployed"
else
  echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — no update needed"
fi
