#!/usr/bin/env bash
set -Eeuo pipefail

HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
HELPER="$HERE/check-pgdata-mount.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/pgdata" "$TMP/bin"

cat > "$TMP/bin/stat" <<'MOCK'
#!/usr/bin/env bash
set -Eeuo pipefail
if [[ "${MOCK_STAT_FAIL:-0}" == "1" ]]; then exit 2; fi
printf '%s\n' "${MOCK_STAT_FSTYPE:-overlay}"
MOCK
chmod +x "$TMP/bin/stat"

run_guard() {
  local expected="$1"; shift
  local output status=0
  output="$(env PATH="$TMP/bin:$PATH" AINEEDHELP_PGDATA="$TMP/pgdata" "$@" bash "$HELPER" 2>&1)" || status=$?
  if [[ "$expected" == pass && "$status" -ne 0 ]]; then
    printf 'FAIL: expected pass, got status %s: %s\n' "$status" "$output" >&2
    exit 1
  fi
  if [[ "$expected" == fail && "$status" -eq 0 ]]; then
    printf 'FAIL: expected failure, got success: %s\n' "$output" >&2
    exit 1
  fi
  printf 'PASS: expected %s (status=%s)\n' "$expected" "$status"
}

# statfs identifies the visible Btrfs filesystem even when mountinfo contains
# other stacked entries at the same path.
run_guard pass MOCK_STAT_FSTYPE=btrfs
# OverlayFS must fail even when a Btrfs filesystem is stacked beneath it.
run_guard fail MOCK_STAT_FSTYPE=overlay
# Any other filesystem type fails closed.
run_guard fail MOCK_STAT_FSTYPE=ext4
# A failed filesystem lookup fails closed.
run_guard fail MOCK_STAT_FAIL=1
# A missing PGDATA path fails before accepting any filesystem result.
status=0
AINEEDHELP_PGDATA="$TMP/missing" PATH="$TMP/bin:$PATH" bash "$HELPER" >/dev/null 2>&1 || status=$?
[[ "$status" -ne 0 ]] || { echo 'FAIL: missing PGDATA unexpectedly passed' >&2; exit 1; }
echo 'PASS: missing PGDATA fails closed'
