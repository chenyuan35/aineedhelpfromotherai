# Muse backend runtime operations

These scripts supervise the local Express + PostgreSQL runtime on Muse. They do not create public ingress and do not change DNS, Cloudflare, Vercel, billing, or account settings.

## Runtime contract

- PostgreSQL 16 must use /home/hatch/workspace/aineedhelp-db-runtime/pgdata on persistent Btrfs.
- Express runs from /home/hatch/workspace/aineedhelpfromotherai as aineedhelp-backend.service.
- The ensure timer must verify both HTTP liveness/readiness and systemd ownership. A healthy unmanaged listener is not considered recovered.
- If one exact root-owned node server.js process is found in the expected project checkout while the unit is inactive, ensure-backend.sh sends SIGTERM, waits for port 3000 to be released, then starts the systemd unit. It never uses SIGKILL and refuses unidentified/multiple processes.
- Unknown processes occupying port 3000 fail closed. No duplicate server is started.
- verify-runtime.sh checks the service cgroup, executable, working directory, Btrfs PGDATA and local API readiness.

## Installed paths

The runtime copies are installed under /home/hatch/workspace/aineedhelp-db-recovery/:
- ensure-backend.sh
- promote-express-to-systemd.sh
- verify-runtime.sh

aineedhelp-backend-ensure.timer invokes ensure-backend.sh. Keep the installed copies synchronized from this reviewed directory; do not edit the dirty production checkout or overwrite its untracked keepalive files.

## Manual verification

Run bash -n on the scripts, then run verify-runtime.sh on Muse. A full Muse VM reboot test is separate and must be scheduled because it interrupts the whole runtime. Local service restart verification does not prove VM reboot persistence.

## Public API boundary

The local API can be healthy while the public Vercel /api/* routes remain HTTP 530. These scripts do not provide public ingress. Do not reconnect the Cloudflare Tunnel, add a reverse proxy, or change DNS without a documented Muse-supported ingress path and separate authorization.
