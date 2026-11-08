#!/usr/bin/env bash
# Fail closed unless the topmost mount covering PGDATA is Btrfs.
# A lower Btrfs mount hidden beneath OverlayFS is not a durable PGDATA path.
set -Eeuo pipefail

PGDATA="${AINEEDHELP_PGDATA:-/home/hatch/workspace/aineedhelp-db-runtime/pgdata}"
if [[ ! -d "$PGDATA" ]]; then
  printf 'FAIL: PostgreSQL data directory is missing: %s\n' "$PGDATA" >&2
  exit 1
fi

if ! top_fstype="$(findmnt --noheadings --raw --first-only --target "$PGDATA" --output FSTYPE 2>/dev/null)"; then
  printf 'FAIL: unable to determine the topmost mount covering PGDATA: %s\n' "$PGDATA" >&2
  exit 1
fi

if [[ "$top_fstype" != "btrfs" ]]; then
  printf 'FAIL: PGDATA topmost filesystem is %s, not persistent Btrfs\n' "${top_fstype:-unknown}" >&2
  exit 1
fi

printf 'PASS: PGDATA topmost filesystem is Btrfs (%s)\n' "$PGDATA"
