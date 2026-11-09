# Muse backend runtime operations

These scripts supervise the local Express + PostgreSQL runtime on Muse. They do not create public ingress and do not change DNS, Cloudflare, Vercel, billing, or account settings.

## Boot contract

Muse boots the systemd default.target; multi-user.target is not active. Therefore the backend and both timers must be enabled under default.target, not only multi-user.target or timers.target.

- aineedhelp-backend.service is WantedBy=default.target and Requires PostgreSQL 16.
- aineedhelp-backend-ensure.timer is WantedBy=default.target, starts after boot and checks every five minutes.
- aineedhelp-postgres-backup.timer is WantedBy=default.target and runs daily.
- PostgreSQL 16 must use /home/hatch/workspace/aineedhelp-db-runtime/pgdata. The current path resolves to Btrfs `/dev/mapper/rv`; verify the actual filesystem with the shared statfs guard, and do not infer restart durability from filesystem type alone.

## Process supervision

The ensure script verifies both HTTP liveness/readiness and systemd ownership. A healthy unmanaged listener is not considered recovered.

If one exact root-owned node server.js process is found on port 3000 in the known Desktop Commander tool-session cgroup while the service unit is inactive, ensure-backend.sh sends SIGTERM, waits for the PID to exit and for port 3000 to be released, then starts the systemd unit. It never uses SIGKILL and refuses unidentified or multiple processes. Procfs cwd/exe inspection is restricted in this Muse runtime, so the handoff gate uses exact argv, UID, cgroup, port occupancy and successful API health/readiness.

check-pgdata-mount.sh uses `stat -f -c '%T'` to identify the filesystem actually serving PGDATA. The versioned ensure-postgres-btrfs.sh calls this guard before ACL or PostgreSQL recovery actions. The daily backup service runs the same guard in ExecStartPre, and backup-postgres-btrfs.sh separately verifies that its destination directory is also on Btrfs before writing. It creates owner-only logical DB/role dumps and treats a failed filesystem sync as a failed backup; this is still a local backup, not an off-host recovery copy. Do not use `findmnt --first-only` as a topmost-mount test: it returns the first match, which may not be the visible filesystem when mount records are stacked. Both ensure-backend.sh and verify-runtime.sh call this guard before accepting the database path. A Btrfs result is not, by itself, proof of VM restart durability. verify-runtime.sh also checks the default.target boot links, service cgroup, exact process argv and local API readiness.

## Installed paths

The runtime copies are installed under /home/hatch/workspace/aineedhelp-db-recovery/:
- ensure-backend.sh
- ensure-postgres-btrfs.sh
- backup-postgres-btrfs.sh
- grant-postgres-traverse.py
- promote-express-to-systemd.sh
- verify-runtime.sh
- check-pgdata-mount.sh
- aineedhelp-backend.service
- aineedhelp-backend-ensure.service
- aineedhelp-backend-ensure.timer
- aineedhelp-postgres-backup.service
- aineedhelp-postgres-backup.timer

Keep installed copies synchronized from this reviewed directory; do not edit the dirty production checkout or overwrite its untracked keepalive files.

## Verification and boundary

Run bash -n and the mount-guard regression tests before release. Install reviewed runtime scripts only after the storage/backup gate is cleared. Then run verify-runtime.sh on Muse. A service restart test proves systemd process supervision, not full Muse VM reboot persistence. A full VM reboot must be scheduled separately because it interrupts the whole runtime.

The local API can be healthy while public Vercel /api/* routes remain HTTP 530. These scripts do not provide public ingress. Do not reconnect the Cloudflare Tunnel, add a reverse proxy, or change DNS without a documented Muse-supported ingress path and separate authorization.
