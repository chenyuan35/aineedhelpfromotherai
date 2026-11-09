#!/usr/bin/env bash
# Local Btrfs backup: independent logical exports for DB and roles.
set -Eeuo pipefail
umask 077

ROOT="${AINEEDHELP_RECOVERY_ROOT:-/home/hatch/workspace/aineedhelp-db-recovery}"
PGDATA="${AINEEDHELP_PGDATA:-/home/hatch/workspace/aineedhelp-db-runtime/pgdata}"
BACKUPS="${AINEEDHELP_BACKUPS_DIR:-/home/hatch/workspace/aineedhelp-db-runtime/backups}"
STAMP="$(date -u +'%Y%m%dT%H%M%SZ')"
mkdir -p "$BACKUPS"
chmod 0700 "$BACKUPS"

if ! backup_fstype="$(stat -f -c '%T' -- "$BACKUPS" 2>/dev/null)"; then
  echo "FAIL: unable to determine backup directory filesystem: $BACKUPS" >&2
  exit 1
fi
if [[ "$backup_fstype" != "btrfs" ]]; then
  echo "FAIL: backup directory filesystem is $backup_fstype, not Btrfs: $BACKUPS" >&2
  exit 1
fi

exec 9>"$BACKUPS/.backup.lock"
flock -n 9 || { echo 'Backup already running'; exit 0; }

/usr/bin/bash "$ROOT/ensure-postgres-btrfs.sh"
active_pgdata="$(setpriv --reuid=postgres --regid=postgres --init-groups psql -X -qAt -U postgres -d postgres -c 'SHOW data_directory')"
test "$active_pgdata" = "$PGDATA"

MAIN="$BACKUPS/aineedhelp-$STAMP.dump"
ROLES="$BACKUPS/postgres-roles-$STAMP.sql"
MAIN_TMP="$MAIN.tmp"
ROLES_TMP="$ROLES.tmp"
cleanup() { rm -f -- "$MAIN_TMP" "$ROLES_TMP"; }
trap cleanup EXIT

setpriv --reuid=postgres --regid=postgres --init-groups pg_dump --format=custom --no-owner -U postgres -d aineedhelp > "$MAIN_TMP"
setpriv --reuid=postgres --regid=postgres --init-groups pg_dumpall --globals-only -U postgres > "$ROLES_TMP"
pg_restore -l "$MAIN_TMP" >/dev/null
test -s "$MAIN_TMP"
test -s "$ROLES_TMP"
chmod 0600 "$MAIN_TMP" "$ROLES_TMP"
mv -- "$MAIN_TMP" "$MAIN"
mv -- "$ROLES_TMP" "$ROLES"
# Do not report success if the filesystem cannot flush either dump.
sync -f "$MAIN"
sync -f "$ROLES"
sync -f "$BACKUPS"
printf 'Backup verified: %s (%s bytes) and roles (%s bytes)\n' "$MAIN" "$(stat -c %s "$MAIN")" "$(stat -c %s "$ROLES")"
