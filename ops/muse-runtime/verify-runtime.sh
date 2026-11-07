#!/usr/bin/env bash
# Read-only verification of the Muse backend's actual systemd and DB ownership.
set -Eeuo pipefail

REPO="${AINEEDHELP_REPO_ROOT:-/home/hatch/workspace/aineedhelpfromotherai}"
PGDATA="${AINEEDHELP_PGDATA:-/home/hatch/workspace/aineedhelp-db-runtime/pgdata}"
SERVICE="${AINEEDHELP_BACKEND_SERVICE:-aineedhelp-backend.service}"

for unit in "$SERVICE" postgresql@16-main.service aineedhelp-backend-ensure.timer aineedhelp-postgres-backup.timer; do
  systemctl is-active --quiet "$unit" || { echo "FAIL: $unit is not active"; exit 1; }
done
systemctl is-enabled --quiet "$SERVICE" || { echo "FAIL: $SERVICE is not enabled"; exit 1; }
systemctl is-enabled --quiet aineedhelp-backend-ensure.timer || { echo "FAIL: backend ensure timer is not enabled"; exit 1; }
systemctl is-enabled --quiet aineedhelp-postgres-backup.timer || { echo "FAIL: backup timer is not enabled"; exit 1; }

pg_isready -h 127.0.0.1 -p 5432 -t 3 >/dev/null
active_pgdata="$(setpriv --reuid=postgres --regid=postgres --init-groups psql -X -qAt -U postgres -d postgres -c 'SHOW data_directory')"
[[ "$active_pgdata" == "$PGDATA" ]] || { echo "FAIL: PostgreSQL data_directory=$active_pgdata"; exit 1; }
[[ "$(findmnt -n -T "$PGDATA" -o FSTYPE)" == "btrfs" ]] || { echo "FAIL: PGDATA is not on Btrfs"; exit 1; }

pid="$(systemctl show -p MainPID --value "$SERVICE")"
[[ "$pid" =~ ^[1-9][0-9]*$ ]] || { echo "FAIL: backend MainPID is not set"; exit 1; }
cwd="$(readlink -f "/proc/$pid/cwd")"
exe="$(readlink -f "/proc/$pid/exe")"
cgroup="$(cat "/proc/$pid/cgroup")"
[[ "$cwd" == "$REPO" ]] || { echo "FAIL: backend cwd=$cwd"; exit 1; }
[[ "$exe" == "/usr/bin/node" ]] || { echo "FAIL: backend executable=$exe"; exit 1; }
grep -q "/system.slice/$SERVICE" <<< "$cgroup" || { echo "FAIL: backend PID is not in $SERVICE cgroup"; exit 1; }

curl -fsS --max-time 5 http://127.0.0.1:3000/api/health | /usr/bin/node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);process.exit(d.status==="ok"&&d.runtime==="express"?0:1)}catch{process.exit(1)}})'
curl -fsS --max-time 5 http://127.0.0.1:3000/api/status | /usr/bin/node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);process.exit(d.alive===true?0:1)}catch{process.exit(1)}})'

printf 'PASS: systemd-managed Express pid=%s; PostgreSQL PGDATA=%s (Btrfs); liveness/readiness=200\n' "$pid" "$active_pgdata"
