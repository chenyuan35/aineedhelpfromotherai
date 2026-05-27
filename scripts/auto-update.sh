#!/bin/bash
# auto-update.sh — git pull + pm2 restart + multi-agent ecosystem + meta-layer activation
# Runs via cron every 5 minutes
# NOTE: no set -e — each step handles its own errors

cd /opt/aineedhelpfromotherai || exit 1

git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

# Maintenance even without code change
if [ "$LOCAL" == "$REMOTE" ]; then
  echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — no code change, maintenance cycle"

  # Rebuild telemetry frontend if missing
  if [ -d packages/agent-telemetry ] && [ ! -f packages/agent-telemetry/dist/index.html ]; then
    echo "[auto-update] Rebuilding telemetry frontend..."
    (cd packages/agent-telemetry && npm install 2>/dev/null && npm run build 2>/dev/null) && pm2 restart aineedhelp --update-env 2>/dev/null || echo "[auto-update] WARNING: telemetry rebuild/restart failed"
  fi

  # Rebuild main frontend if missing
  if [ -d frontend ] && [ ! -f frontend/dist/index.html ]; then
    echo "[auto-update] Rebuilding main frontend..."
    (cd frontend && npm install 2>/dev/null && npm run build 2>/dev/null) && pm2 restart aineedhelp --update-env 2>/dev/null || echo "[auto-update] WARNING: frontend rebuild/restart failed"
  fi

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
  exit 0
fi

# --- Code change detected ---
echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — $LOCAL -> $(git rev-parse --short origin/main)"

git reset --hard origin/main
npm install --production 2>/dev/null || true

# Build telemetry frontend
if [ -d packages/agent-telemetry ]; then
  echo "[auto-update] Building telemetry frontend..."
  (cd packages/agent-telemetry && npm install 2>/dev/null && npm run build 2>/dev/null) || echo "[auto-update] WARNING: telemetry build failed"
fi

# Build main frontend (Vite + Tailwind landing page)
if [ -d frontend ]; then
  echo "[auto-update] Building main frontend..."
  (cd frontend && npm install 2>/dev/null && npm run build 2>/dev/null) || echo "[auto-update] WARNING: main frontend build failed"
fi

# Restart main server
pm2 restart aineedhelp --update-env 2>/dev/null || pm2 start server.js --name aineedhelp --update-env || true
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
node scripts/self-play-generator.js --target=hallucination 2>&1 | tail -2 || true
echo "[auto-update] Meta-layer: processing ELO from replay log..."
curl -s -X POST http://127.0.0.1:3000/api/meta/process-replay 2>/dev/null | head -c 200 || true

echo "[auto-update] $(date -u '+%Y-%m-%dT%H:%M:%SZ') — $LOCAL -> $(git rev-parse --short HEAD) — multi-agent with meta-layer deployed"
