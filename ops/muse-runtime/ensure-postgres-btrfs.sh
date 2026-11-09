#!/usr/bin/env bash
# Fail-closed PG16 recovery. Never replace a running non-empty fallback DB.
set -Eeuo pipefail
umask 077

ROOT="${AINEEDHELP_RECOVERY_ROOT:-/home/hatch/workspace/aineedhelp-db-recovery}"
TARGET="${AINEEDHELP_PGDATA:-/home/hatch/workspace/aineedhelp-db-runtime/pgdata}"
CONF="${AINEEDHELP_POSTGRES_CONFIG:-/etc/postgresql/16/main/postgresql.conf}"
UNIT="${AINEEDHELP_POSTGRES_UNIT:-postgresql@16-main.service}"

log() { printf '[%s] [pg-ensure] %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*" >> "$ROOT/backend-ensure.log"; }

check_data_dir() {
  setpriv --reuid=postgres --regid=postgres --init-groups \
    psql -X -qAt -U postgres -d postgres -c 'SHOW data_directory' 2>/dev/null
}

if [[ ! -f "$TARGET/PG_VERSION" ]] || [[ "$(cat "$TARGET/PG_VERSION")" != 16 ]]; then
  log "Persistent PostgreSQL 16 data directory is missing; refusing fallback"
  exit 1
fi

# Use statfs, not findmnt's list of stacked mount matches. This is the same
# guard used by backend readiness and runtime verification.
AINEEDHELP_PGDATA="$TARGET" /usr/bin/bash "$ROOT/check-pgdata-mount.sh" || {
  log "PGDATA is not on Btrfs; refusing PostgreSQL recovery"
  exit 1
}

[[ -f "$CONF" ]] || { log "PostgreSQL config absent; platform bootstrap required"; exit 1; }
python3 "$ROOT/grant-postgres-traverse.py" >/dev/null

if pg_isready -h 127.0.0.1 -p 5432 -t 2 >/dev/null 2>&1; then
  active="$(check_data_dir)" || { log "Unable to verify PostgreSQL's current directory"; exit 1; }
  if [[ "$active" == "$TARGET" ]]; then exit 0; fi

  app_exists="$(setpriv --reuid=postgres --regid=postgres --init-groups \
    psql -X -qAt -U postgres -d postgres -c "SELECT count(*) FROM pg_database WHERE datname='aineedhelp'" 2>/dev/null)" || exit 1
  if [[ "$app_exists" == 1 ]]; then
    rows="$(setpriv --reuid=postgres --regid=postgres --init-groups \
      psql -X -qAt -U postgres -d aineedhelp -c \
      'SELECT (SELECT count(*) FROM posts)+(SELECT count(*) FROM reasoning_objects)+(SELECT count(*) FROM execution_history)+(SELECT count(*) FROM task_lifecycle)+(SELECT count(*) FROM agent_registry)+(SELECT count(*) FROM agent_tokens)' 2>/dev/null)" || {
        log "Fallback database schema unknown; refusing automatic switch"
        exit 1
      }
    if [[ "$rows" != 0 ]]; then
      log "Fallback database has $rows rows; refusing automatic switch and preserving all data"
      exit 1
    fi
  fi
  log "Empty fallback cluster found; switching to persistent PGDATA"
fi

backup="$ROOT/postgresql.conf.before-auto-restore-$(date -u +'%Y%m%dT%H%M%SZ')"
cp -p "$CONF" "$backup"
chmod 0600 "$backup"
revert() {
  local code=$?
  trap - ERR EXIT
  systemctl stop "$UNIT" >/dev/null 2>&1 || true
  cp "$backup" "$CONF" 2>/dev/null || true
  systemctl start "$UNIT" >/dev/null 2>&1 || true
  log "PGDATA recovery failed; reverted prior config, retained all data"
  exit "$code"
}
trap revert ERR EXIT
systemctl stop "$UNIT"
python3 - "$CONF" "$TARGET" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
lines = path.read_text().splitlines(keepends=True)
index = [i for i, line in enumerate(lines) if line.lstrip().startswith("data_directory =")]
if len(index) != 1:
    raise SystemExit("Unexpected PG16 config layout")
lines[index[0]] = "data_directory = '" + sys.argv[2] + "'\n"
path.write_text(''.join(lines))
PY
systemctl start "$UNIT"
for _ in {1..20}; do
  if pg_isready -h 127.0.0.1 -p 5432 -t 2 >/dev/null 2>&1; then break; fi
  sleep 1
done
active="$(check_data_dir)"
[[ "$active" == "$TARGET" ]] || { log "PGDATA switch verification failed"; exit 1; }
trap - ERR EXIT
log "PostgreSQL 16 restored on Btrfs PGDATA"
