#!/usr/bin/env bash
# Idempotent manual promotion entrypoint; all ownership checks live in ensure-backend.sh.
set -Eeuo pipefail
ROOT="${AINEEDHELP_RECOVERY_ROOT:-/home/hatch/workspace/aineedhelp-db-recovery}"
exec /usr/bin/bash "$ROOT/ensure-backend.sh"
