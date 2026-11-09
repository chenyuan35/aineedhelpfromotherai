#!/usr/bin/env bash
# Keep the Muse-hosted Express API under systemd, not merely HTTP-responsive.
set -Eeuo pipefail
umask 077

ROOT="${AINEEDHELP_RECOVERY_ROOT:-/home/hatch/workspace/aineedhelp-db-recovery}"
PGDATA="${AINEEDHELP_PGDATA:-/home/hatch/workspace/aineedhelp-db-runtime/pgdata}"
SERVICE="${AINEEDHELP_BACKEND_SERVICE:-aineedhelp-backend.service}"
LOG="${AINEEDHELP_BACKEND_LOG:-$ROOT/backend-ensure.log}"
HEALTH_URL="http://127.0.0.1:3000/api/health"
STATUS_URL="http://127.0.0.1:3000/api/status"

log() {
  printf '[%s] %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*" >> "$LOG"
}

health_ok() {
  local body
  body="$(curl -fsS --connect-timeout 2 --max-time 4 "$HEALTH_URL" 2>/dev/null)" || return 1
  printf '%s' "$body" | /usr/bin/node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);process.exit(d.status==="ok"&&d.runtime==="express"?0:1)}catch{process.exit(1)}})' >/dev/null 2>&1
}

readiness_ok() {
  local body
  body="$(curl -fsS --connect-timeout 2 --max-time 4 "$STATUS_URL" 2>/dev/null)" || return 1
  printf '%s' "$body" | /usr/bin/node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);process.exit(d.alive===true?0:1)}catch{process.exit(1)}})' >/dev/null 2>&1
}

port_busy() {
  ss -ltn 'sport = :3000' 2>/dev/null | tail -n +2 | grep -q .
}

unit_state() {
  systemctl show -p ActiveState --value "$SERVICE" 2>/dev/null || true
}

# The Muse terminal runner restricts /proc cwd/exe inspection. Identify the
# one permitted handoff candidate by exact argv, root UID, tool-session cgroup,
# sole node-server count and a healthy listener on port 3000.
safe_unmanaged_pid() {
  local -a pids=()
  mapfile -t pids < <(pgrep -f '(^|/)node server\.js$' || true)
  if (("${#pids[@]}" != 1)); then
    log "Healthy unmanaged API found, but expected exactly one node server.js; refusing handoff (count=${#pids[@]})"
    return 1
  fi

  local pid="${pids[0]}"
  local uid cmdline cgroup
  uid="$(awk '/^Uid:/ {print $2}' "/proc/$pid/status" 2>/dev/null || true)"
  cmdline="$(tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null | sed 's/[[:space:]]*$//')"
  cgroup="$(cat "/proc/$pid/cgroup" 2>/dev/null || true)"
  local -a argv=()
  read -r -a argv <<< "$cmdline"

  if [[ "$uid" != "0" ]] ||
     (("${#argv[@]}" != 2)) ||
     [[ "$(basename "${argv[0]:-}")" != "node" || "${argv[1]:-}" != "server.js" ]] ||
     ! grep -q '^0::/init\.scope/hatch-tool-prepared-' <<< "$cgroup" ||
     ! port_busy; then
    log "Port 3000 listener is not the exact verified tool-session node server; refusing handoff (pid=$pid uid=$uid cgroup=$cgroup argv=$cmdline)"
    return 1
  fi

  printf '%s\n' "$pid"
}

handoff_unmanaged() {
  local pid
  pid="$(safe_unmanaged_pid)" || return 1
  log "Gracefully handing off verified unmanaged backend pid=$pid to systemd"
  kill -TERM "$pid"

  for _ in {1..20}; do
    if ! kill -0 "$pid" 2>/dev/null; then break; fi
    sleep 1
  done

  if kill -0 "$pid" 2>/dev/null; then
    log "Unmanaged backend pid=$pid did not exit after SIGTERM; refusing force-kill or duplicate start"
    return 1
  fi
  if port_busy; then
    log "Port 3000 remains occupied after unmanaged backend exit; refusing duplicate start"
    return 1
  fi
}

# Check the filesystem actually serving PGDATA before calling the legacy
# recovery helper. Do not infer visibility from findmnt's first mount match.
AINEEDHELP_PGDATA="$PGDATA" /usr/bin/bash "$ROOT/check-pgdata-mount.sh" || {
  log "PGDATA is not on Btrfs; refusing backend recovery"
  exit 1
}

# Always verify the actual PGDATA first. Never accept a healthy empty fallback
# cluster when the persistent Btrfs database is expected.
/usr/bin/bash "$ROOT/ensure-postgres-btrfs.sh" || {
  log "Persistent PostgreSQL recovery blocked; refusing backend readiness"
  exit 1
}

if ! pg_isready -h 127.0.0.1 -p 5432 -t 2 >/dev/null 2>&1; then
  log "PostgreSQL is unavailable after persistent-PGDATA verification"
  exit 1
fi

state="$(unit_state)"
case "$state" in
  active)
    if health_ok && readiness_ok; then exit 0; fi
    log "Managed backend unit is active but liveness/readiness failed; restarting managed service"
    systemctl restart "$SERVICE" || { log "Managed backend restart failed"; exit 1; }
    ;;
  activating|deactivating|reloading)
    log "Managed backend unit is transitioning ($state); leaving it untouched"
    exit 0
    ;;
  *)
    if health_ok && readiness_ok && port_busy; then
      handoff_unmanaged || exit 1
    elif port_busy; then
      log "Port 3000 is occupied by an unhealthy or unidentified unmanaged process; refusing to kill or duplicate it"
      exit 1
    fi

    if [[ "$state" == "failed" ]]; then
      systemctl reset-failed "$SERVICE" || { log "Could not reset failed backend unit"; exit 1; }
    fi
    log "Starting systemd-managed backend (previous unit state=$state)"
    systemctl start "$SERVICE" || { log "Managed backend start failed"; exit 1; }
    ;;
esac

for _ in {1..20}; do
  if systemctl is-active --quiet "$SERVICE" && health_ok && readiness_ok; then
    log "Backend is systemd-managed; liveness and database readiness verified"
    exit 0
  fi
  sleep 1
done

log "Backend failed managed-service/liveness/readiness verification after start or restart"
exit 1
