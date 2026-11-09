#!/usr/bin/env bash
# Fail closed unless statfs reports the filesystem actually serving PGDATA as Btrfs.
# findmnt --first-only returns the first mount-table match, not necessarily the
# visible filesystem when multiple mounts are stacked at the same path.
set -Eeuo pipefail

PGDATA="${AINEEDHELP_PGDATA:-/home/hatch/workspace/aineedhelp-db-runtime/pgdata}"
if [[ ! -d "$PGDATA" ]]; then
  printf 'FAIL: PostgreSQL data directory is missing: %s\n' "$PGDATA" >&2
  exit 1
fi

if ! actual_fstype="$(stat -f -c '%T' -- "$PGDATA" 2>/dev/null)"; then
  printf 'FAIL: unable to determine the actual filesystem serving PGDATA: %s\n' "$PGDATA" >&2
  exit 1
fi

if [[ "$actual_fstype" != "btrfs" ]]; then
  printf 'FAIL: PGDATA filesystem is %s, not Btrfs\n' "${actual_fstype:-unknown}" >&2
  exit 1
fi

printf 'PASS: PGDATA filesystem is Btrfs (%s)\n' "$PGDATA"
