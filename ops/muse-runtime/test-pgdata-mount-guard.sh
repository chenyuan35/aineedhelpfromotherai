#!/usr/bin/env bash
set -Eeuo pipefail

HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
HELPER="$HERE/check-pgdata-mount.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/pgdata" "$TMP/bin"

cat > "$TMP/bin/findmnt" <<'MOCK'
#!/usr/bin/env bash
set -Eeuo pipefail
if [[ "${MOCK_FINDMNT_FAIL:-0}" == "1" ]]; then exit 2; fi
first_only=0
for arg in "$@"; do
  [[ "$arg" == "--first-only" ]] && first_only=1
done
if [[ "$first_only" == 1 ]]; then
  printf '%s\n' "${MOCK_FINDMNT_TOP:-overlay}"
else
  printf '%b\n' "${MOCK_FINDMNT_STACK:-overlay\\nbtrfs}"
fi
MOCK
chmod +x "$TMP/bin/findmnt"

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

# Current Muse stack: OverlayFS is topmost even though Btrfs exists below it.
run_guard fail MOCK_FINDMNT_TOP=overlay MOCK_FINDMNT_STACK='overlay\nbtrfs'
# A genuinely topmost Btrfs mount is accepted.
run_guard pass MOCK_FINDMNT_TOP=btrfs MOCK_FINDMNT_STACK=btrfs
# An unknown mount lookup must fail closed.
run_guard fail MOCK_FINDMNT_FAIL=1
# A missing PGDATA path must fail before accepting any filesystem result.
status=0
AINEEDHELP_PGDATA="$TMP/missing" PATH="$TMP/bin:$PATH" bash "$HELPER" >/dev/null 2>&1 || status=$?
[[ "$status" -ne 0 ]] || { echo 'FAIL: missing PGDATA unexpectedly passed' >&2; exit 1; }
echo 'PASS: missing PGDATA fails closed'
