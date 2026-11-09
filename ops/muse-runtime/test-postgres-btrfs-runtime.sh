#!/usr/bin/env bash
set -Eeuo pipefail

HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="$(command -v python3)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

RECOVERY_ROOT="$TMP/recovery"
PGDATA="$TMP/pgdata"
BACKUPS="$TMP/backups"
BIN="$TMP/bin"
mkdir -p "$RECOVERY_ROOT" "$PGDATA" "$BIN"
printf '16\n' > "$PGDATA/PG_VERSION"
printf "data_directory = '/unused'\n" > "$TMP/postgresql.conf"
cp "$HERE/check-pgdata-mount.sh" "$RECOVERY_ROOT/check-pgdata-mount.sh"
cp "$HERE/ensure-postgres-btrfs.sh" "$RECOVERY_ROOT/ensure-postgres-btrfs.sh"
cp "$HERE/grant-postgres-traverse.py" "$RECOVERY_ROOT/grant-postgres-traverse.py"

cat > "$BIN/stat" <<'MOCK'
#!/usr/bin/env bash
set -Eeuo pipefail
if [[ "${1:-}" == "-f" ]]; then
  target="${@: -1}"
  if [[ -n "${MOCK_STAT_OVERLAY_PATH:-}" && "$target" == "$MOCK_STAT_OVERLAY_PATH" ]]; then
    echo overlay
  else
    echo "${MOCK_STAT_FSTYPE:-btrfs}"
  fi
else
  exec /usr/bin/stat "$@"
fi
MOCK
cat > "$BIN/python3" <<'MOCK'
#!/usr/bin/env bash
exit 0
MOCK
cat > "$BIN/pg_isready" <<'MOCK'
#!/usr/bin/env bash
exit 0
MOCK
cat > "$BIN/setpriv" <<'MOCK'
#!/usr/bin/env bash
printf '%s\n' "$AINEEDHELP_PGDATA"
MOCK
cat > "$BIN/systemctl" <<'MOCK'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$MOCK_SYSTEMCTL_CALLS"
exit 91
MOCK
cat > "$BIN/findmnt" <<'MOCK'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$MOCK_FINDMNT_CALLS"
exit 92
MOCK
cat > "$BIN/pg_dump" <<'MOCK'
#!/usr/bin/env bash
printf 'test archive payload\n'
MOCK
cat > "$BIN/pg_dumpall" <<'MOCK'
#!/usr/bin/env bash
printf 'test roles payload\n'
MOCK
cat > "$BIN/pg_restore" <<'MOCK'
#!/usr/bin/env bash
exit 0
MOCK
chmod +x "$BIN"/*

export PATH="$BIN:$PATH"
export AINEEDHELP_RECOVERY_ROOT="$RECOVERY_ROOT"
export AINEEDHELP_PGDATA="$PGDATA"
export AINEEDHELP_POSTGRES_CONFIG="$TMP/postgresql.conf"
export AINEEDHELP_BACKUPS_DIR="$BACKUPS"
export MOCK_SYSTEMCTL_CALLS="$TMP/systemctl.calls"
export MOCK_FINDMNT_CALLS="$TMP/findmnt.calls"

# OverlayFS must fail before ACL changes, PostgreSQL commands, or service stops.
status=0
MOCK_STAT_FSTYPE=overlay bash "$HERE/ensure-postgres-btrfs.sh" > "$TMP/overlay.log" 2>&1 || status=$?
[[ "$status" -ne 0 ]]
grep -q 'PGDATA filesystem is overlay' "$TMP/overlay.log"
[[ ! -e "$MOCK_SYSTEMCTL_CALLS" ]]
[[ ! -e "$MOCK_FINDMNT_CALLS" ]]

# Current PGDATA on Btrfs is accepted without changing PostgreSQL service state.
MOCK_STAT_FSTYPE=btrfs bash "$HERE/ensure-postgres-btrfs.sh"
[[ ! -e "$MOCK_SYSTEMCTL_CALLS" ]]
[[ ! -e "$MOCK_FINDMNT_CALLS" ]]

# A backup directory on OverlayFS is rejected even when PGDATA is on Btrfs.
mkdir -p "$BACKUPS"
status=0
MOCK_STAT_FSTYPE=btrfs MOCK_STAT_OVERLAY_PATH="$BACKUPS" bash "$HERE/backup-postgres-btrfs.sh" > "$TMP/backup-overlay.log" 2>&1 || status=$?
[[ "$status" -ne 0 ]]
grep -q 'backup directory filesystem is overlay' "$TMP/backup-overlay.log"
! compgen -G "$BACKUPS/aineedhelp-*.dump" >/dev/null

# Btrfs PGDATA and Btrfs backup path produce verified, private logical dumps.
MOCK_STAT_FSTYPE=btrfs bash "$HERE/backup-postgres-btrfs.sh" > "$TMP/backup.log"
DUMP=("$BACKUPS"/aineedhelp-*.dump)
ROLES=("$BACKUPS"/postgres-roles-*.sql)
[[ -s "${DUMP[0]}" && -s "${ROLES[0]}" ]]
[[ "$(stat -c '%a' "${DUMP[0]}")" == 600 ]]
[[ "$(stat -c '%a' "${ROLES[0]}")" == 600 ]]
[[ "$(stat -c '%a' "$BACKUPS")" == 700 ]]
[[ ! -e "$MOCK_SYSTEMCTL_CALLS" ]]
[[ ! -e "$MOCK_FINDMNT_CALLS" ]]

# The systemd backup unit performs the same statfs guard before ExecStart.
grep -Fqx 'ExecStartPre=/usr/bin/bash /home/hatch/workspace/aineedhelp-db-recovery/check-pgdata-mount.sh' "$HERE/aineedhelp-postgres-backup.service"

"$PYTHON_BIN" - "$HERE/grant-postgres-traverse.py" <<'PY'
import ast, pathlib, sys
ast.parse(pathlib.Path(sys.argv[1]).read_text())
PY

printf '%s\n' 'PASS: PGDATA recovery and backup fail closed on non-Btrfs; Btrfs backup artifacts are private and verified'
