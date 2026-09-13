#!/bin/sh
set -eu

HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
APP=/opt/aineedhelp-keyword-radar
DATA=/var/lib/aineedhelp-radar

install -d -m 0755 "$APP" "$DATA"
install -m 0755 "$HERE/radar.py" "$APP/radar.py"
install -m 0755 "$HERE/runner.py" "$APP/runner.py"
install -m 0644 "$HERE/seeds.txt" "$APP/seeds.txt"

if [ "$(ps -p 1 -o comm= | tr -d ' ')" = "systemd" ]; then
  install -m 0644 "$HERE/aineedhelp-keyword-radar.service" /etc/systemd/system/aineedhelp-keyword-radar.service
  install -m 0644 "$HERE/aineedhelp-keyword-radar.timer" /etc/systemd/system/aineedhelp-keyword-radar.timer
  systemctl daemon-reload
  systemctl enable --now aineedhelp-keyword-radar.timer
  systemctl start aineedhelp-keyword-radar.service
  exit 0
fi
SUPERVISOR=/etc/supervisor/conf.d/supervisord.conf
if [ -f "$SUPERVISOR" ]; then
  if ! grep -q '^\[program:aineedhelp-keyword-radar\]' "$SUPERVISOR"; then
    printf '\n' >> "$SUPERVISOR"
    cat "$HERE/supervisor-program.conf" >> "$SUPERVISOR"
  fi
  if ! pgrep -f '^/usr/bin/python3 /opt/aineedhelp-keyword-radar/runner.py$' >/dev/null 2>&1; then
    nohup /usr/bin/python3 "$APP/runner.py" >>/var/log/aineedhelp-keyword-radar.log 2>>/var/log/aineedhelp-keyword-radar.err.log </dev/null &
  fi
  echo "Installed for supervisord container; runner started now and will autostart on next container restart."
  exit 0
fi

echo "No supported scheduler detected. Files installed to $APP; run runner.py with your process manager." >&2
exit 2
