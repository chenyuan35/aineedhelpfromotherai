#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/bin" "$TMP/taildrop" "$TMP/recv" "$TMP/backups"

python3 - "$TMP/source.sqlite3" <<'PY'
import sqlite3, sys
p=sys.argv[1]
db=sqlite3.connect(p)
db.execute('create table relay_daily (id integer primary key)')
db.execute('create table relay_state (id integer primary key)')
db.execute('create table source_fetch (id integer primary key)')
db.execute('create table lifecycle_events (id integer primary key)')
db.executemany('insert into relay_daily(id) values (?)', [(1,), (2,), (3,)])
db.commit(); db.close()
PY

cat > "$TMP/bin/tailscale" <<'SH'
#!/bin/sh
set -eu
if [ "$1 $2" = 'file cp' ]; then
  shift 2; name=''
  case "$1" in --name=*) name=${1#--name=}; shift;; esac
  src=$1
  cp "$src" "$FAKE_TAILDROP/$name"
  exit 0
fi
if [ "$1 $2" = 'file get' ]; then
  target=''
  for arg in "$@"; do target=$arg; done
  cp "$FAKE_TAILDROP"/* "$target"/
  rm -f "$FAKE_TAILDROP"/*
  exit 0
fi
exit 99
SH
chmod +x "$TMP/bin/tailscale"

PATH="$TMP/bin:$PATH" FAKE_TAILDROP="$TMP/taildrop" RELAY_OBSERVER_DB="$TMP/source.sqlite3" RELAY_BACKUP_TARGET=qwen-control \
  "$ROOT/ops/relay-observer-backup/aineedhelp-relay-observer-backup-push"
ls "$TMP/taildrop"/relay-history-*.sqlite3.gz >/dev/null
PATH="$TMP/bin:$PATH" FAKE_TAILDROP="$TMP/taildrop" RELAY_BACKUP_DEST="$TMP/backups" RELAY_BACKUP_RECEIVE_WAIT_SECONDS=1 \
  "$ROOT/ops/relay-observer-backup/aineedhelp-relay-observer-backup-receive"
gzip -t "$TMP/backups/latest.sqlite3.gz"
gunzip -c "$TMP/backups/latest.sqlite3.gz" > "$TMP/verify.sqlite3"
rows=$(python3 - "$TMP/verify.sqlite3" <<'PY'
import sqlite3,sys
c=sqlite3.connect(sys.argv[1]); print(c.execute('select count(*) from relay_daily').fetchone()[0]); c.close()
PY
)
[ "$rows" = 3 ]
echo 'relay observer backup transport test passed'
