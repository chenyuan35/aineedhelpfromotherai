#!/bin/bash
# auto-update.sh — git pull + pm2 restart + multi-agent ecosystem + meta-layer activation
# Runs via cron every 5 minutes

set -e

cd /opt/aineedhelpfromotherai || exit 1

# Ensure telemetry frontend dist exists (every cycle, not just on code change)
if [ -d packages/agent-telemetry ] && [ ! -f packages/agent-telemetry/dist/index.html ]; then
  echo "[auto-update] Building telemetry frontend..."
  (cd packages/agent-telemetry && npm install 2>/dev/null && npm run build 2>/dev/null) || echo "[auto-update] WARNING: telemetry build failed"
fi

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

  # Meta-layer: run self-play generation (idempotent on same data)
  echo "[auto-update] Meta-layer: self-play adversarial generation..."
  node scripts/self-play-generator.js --target=hallucination 2>&1 | tail -2
  echo "[auto-update] Meta-layer: processing ELO from replay log..."
  curl -s -X POST http://127.0.0.1:3000/api/meta/process-replay 2>/dev/null | head -c 200 || echo "[auto-update] ELO processing unavailable"

  echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — $LOCAL -> $(git rev-parse --short HEAD) — multi-agent with meta-layer deployed"
else
  # Even without code change: run meta-layer maintenance every cycle
  echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — meta-layer maintenance"

  # Periodic: failure replay (every 30 min = every 6th cycle)
  MINUTE=$(date +%M)
  if [ $((10#$MINUTE % 30)) -lt 5 ]; then
    echo "[auto-update] Running failure replay..."
    node scripts/failure-replay.js --limit=3 2>&1 | tail -3
  fi

  # Periodic: self-play new adversarial tasks (every hour)
  if [ $((10#$MINUTE)) -lt 3 ]; then
    echo "[auto-update] Running self-play generation..."
    node scripts/self-play-generator.js --target=hallucination 2>&1 | tail -2
  fi

  # Periodic: ELO processing
  curl -s -X POST http://127.0.0.1:3000/api/meta/process-replay 2>/dev/null | head -c 100 || true
fi
