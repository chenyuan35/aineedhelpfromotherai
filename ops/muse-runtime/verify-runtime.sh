#!/usr/bin/env bash
# Read-only verification of the Muse backend's boot links, systemd ownership and DB.
set -Eeuo pipefail

PGDATA="${AINEEDHELP_PGDATA:-/home/hatch/workspace/aineedhelp-db-runtime/pgdata}"
SERVICE="${AINEEDHELP_BACKEND_SERVICE:-aineedhelp-backend.service}"
WANTS=/etc/systemd/system/default.target.wants

systemctl is-active --quiet default.target || { echo "FAIL: default.target is not active"; exit 1; }
for unit in "$SERVICE" postgresql@16-main.service aineedhelp-backend-ensure.timer aineedhelp-postgres-backup.timer; do
  systemctl is-active --quiet "$unit" || { echo "FAIL: $unit is not active"; exit 1; }
done
for unit in "$SERVICE" aineedhelp-backend-ensure.timer aineedhelp-postgres-backup.timer; do
  systemctl is-enabled --quiet "$unit" || { echo "FAIL: $unit is not enabled"; exit 1; }
  [[ -L "$WANTS/$unit" ]] || { echo "FAIL: $unit is not linked to default.target"; exit 1; }
done

pg_isready -h 127.0.0.1 -p 5432 -t 3 >/dev/null
active_pgdata="$(setpriv --reuid=postgres --regid=postgres --init-groups psql -X -qAt -U postgres -d postgres -c 'SHOW data_directory')"
[[ "$active_pgdata" == "$PGDATA" ]] || { echo "FAIL: PostgreSQL data_directory=$active_pgdata"; exit 1; }
[[ "$(findmnt -n -T "$PGDATA" -o FSTYPE)" == "btrfs" ]] || { echo "FAIL: PGDATA is not on Btrfs"; exit 1; }

pid="$(systemctl show -p MainPID --value "$SERVICE")"
[[ "$pid" =~ ^[1-9][0-9]*$ ]] || { echo "FAIL: backend MainPID is not set"; exit 1; }
uid="$(awk '/^Uid:/ {print $2}' "/proc/$pid/status")"
cmdline="$(tr '\0' ' ' < "/proc/$pid/cmdline" | sed 's/[[:space:]]*$//')"
cgroup="$(cat "/proc/$pid/cgroup")"
[[ "$uid" == "0" ]] || { echo "FAIL: backend UID=$uid"; exit 1; }
[[ "$cmdline" == "/usr/bin/node server.js" || "$cmdline" == "node server.js" ]] || { echo "FAIL: backend argv=$cmdline"; exit 1; }
grep -q "/system.slice/$SERVICE" <<< "$cgroup" || { echo "FAIL: backend PID is not in $SERVICE cgroup"; exit 1; }

curl -fsS --max-time 5 http://127.0.0.1:3000/api/health | /usr/bin/node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);process.exit(d.status==="ok"&&d.runtime==="express"?0:1)}catch{process.exit(1)}})'
curl -fsS --max-time 5 http://127.0.0.1:3000/api/status | /usr/bin/node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);process.exit(d.alive===true?0:1)}catch{process.exit(1)}})'

printf 'PASS: systemd-managed Express pid=%s; default.target boot links; PostgreSQL PGDATA=%s (Btrfs); liveness/readiness=200\n' "$pid" "$active_pgdata"
