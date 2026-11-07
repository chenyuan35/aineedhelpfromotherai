# Muse backend runtime operations

These scripts supervise the local Express + PostgreSQL runtime on Muse. They do not create public ingress and do not change DNS, Cloudflare, Vercel, billing, or account settings.

## Boot contract

Muse boots the systemd default.target; multi-user.target is not active. Therefore the backend and both timers must be enabled under default.target, not only multi-user.target or timers.target.

- aineedhelp-backend.service is WantedBy=default.target and Requires PostgreSQL 16.
- aineedhelp-backend-ensure.timer is WantedBy=default.target, starts after boot and checks every five minutes.
- aineedhelp-postgres-backup.timer is WantedBy=default.target and runs daily.
- PostgreSQL 16 must use /home/hatch/workspace/aineedhelp-db-runtime/pgdata on persistent Btrfs.

## Process supervision

The ensure script verifies both HTTP liveness/readiness and systemd ownership. A healthy unmanaged listener is not considered recovered.

If one exact root-owned node server.js process is found on port 3000 in the known Desktop Commander tool-session cgroup while the service unit is inactive, ensure-backend.sh sends SIGTERM, waits for the PID to exit and for port 3000 to be released, then starts the systemd unit. It never uses SIGKILL and refuses unidentified or multiple processes. Procfs cwd/exe inspection is restricted in this Muse runtime, so the handoff gate uses exact argv, UID, cgroup, port occupancy and successful API health/readiness.

verify-runtime.sh checks the default.target boot links, service cgroup, exact process argv, Btrfs PGDATA and local API readiness. Muse exposes OverlayFS stacked over the persistent Btrfs mount; validate PGDATA with both statfs and df filesystem type, and require a Btrfs layer in findmnt output rather than requiring the first findmnt row to equal btrfs.

## Installed paths

The runtime copies are installed under /home/hatch/workspace/aineedhelp-db-recovery/:
- ensure-backend.sh
- promote-express-to-systemd.sh
- verify-runtime.sh
- aineedhelp-backend.service
- aineedhelp-backend-ensure.service
- aineedhelp-backend-ensure.timer
- aineedhelp-postgres-backup.service
- aineedhelp-postgres-backup.timer

Keep installed copies synchronized from this reviewed directory; do not edit the dirty production checkout or overwrite its untracked keepalive files.

## Verification and boundary

Run bash -n on the scripts, then run verify-runtime.sh on Muse. A service restart test proves systemd process supervision, not full Muse VM reboot persistence. A full VM reboot must be scheduled separately because it interrupts the whole runtime.

The local API can be healthy while public Vercel /api/* routes remain HTTP 530. These scripts do not provide public ingress. Do not reconnect the Cloudflare Tunnel, add a reverse proxy, or change DNS without a documented Muse-supported ingress path and separate authorization.
