#!/bin/sh
set -eu

HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
APP=/opt/aineedhelp-keyword-radar
DATA=/var/lib/aineedhelp-radar

install -d -m 0755 "$APP" "$DATA"
install -m 0755 "$HERE/radar.py" "$APP/radar.py"
install -m 0644 "$HERE/seeds.txt" "$APP/seeds.txt"
install -m 0644 "$HERE/aineedhelp-keyword-radar.service" /etc/systemd/system/aineedhelp-keyword-radar.service
install -m 0644 "$HERE/aineedhelp-keyword-radar.timer" /etc/systemd/system/aineedhelp-keyword-radar.timer

systemctl daemon-reload
systemctl enable --now aineedhelp-keyword-radar.timer
systemctl start aineedhelp-keyword-radar.service
systemctl --no-pager --full status aineedhelp-keyword-radar.timer || true
