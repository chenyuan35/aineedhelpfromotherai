# Muse embedded database runtime

## Purpose

This is an opt-in PostgreSQL-compatible database embedded in the Muse-hosted Express process. It avoids an OS-level PostgreSQL service whose binaries and data directory live under Muse's disposable `/var` overlay. PGlite stores its database files in the configured Node filesystem directory under `/home/hatch`.

## Current verified state — 2026-11-08

PR #498 added the opt-in PGlite 0.5.14 adapter at code SHA `06a65c06ae48f7b3865cad306bba4c62cbc3d758`; PR #500's health-readiness fix remains the latest application-code release at `b1c406006784a29194c71eb6dd5cb9e12effc71a`. Current GitHub main is `947f096e8d86314713eed9d3c57dcb449eb1f1d8` after PR #505; latest Vercel production deployment `dpl_9viVGWsXz6vESgch2bUCATuAcfWP` is READY on that exact SHA. PR #505 adds the shared topmost-PGDATA guard and regression test; it is merged in GitHub but has not been installed on Muse. PGlite has not been selected as the active driver. Do not infer that selecting PGlite would solve persistence: its configured data directory is under `/home/hatch`, whose topmost mount is OverlayFS.

The latest 2026-11-08 read-only Muse recheck finds `aineedhelp-backend.service`, PostgreSQL 16, `aineedhelp-backend-ensure.timer` and `aineedhelp-postgres-backup.timer` active. Local `GET /api/health` returns 200 and DB-backed `GET /api/status` returns `alive:true`. PostgreSQL is using `/home/hatch/workspace/aineedhelp-db-runtime/pgdata`; all six core tables (`posts`, `reasoning_objects`, `execution_history`, `task_lifecycle`, `agent_registry`, `agent_tokens`) contain zero rows. The read-only `verify-runtime.sh` exits 1 with `PGDATA is not on Btrfs`, because the topmost mount is OverlayFS. The local service is active and database-ready, but it is not verified durable across VM restart and it contains no restored business data. The earlier `apt-get update` process has exited.

All six live PostgreSQL core tables currently contain zero rows. The 2026-11-07 disposable restore test passed with six tables and zero application rows. The 2026-11-08 dump `aineedhelp-20261108T032718Z.dump` (26,584 bytes; SHA256 `cd9f42f9ac299f89bc0a18533fb957e64cf6e2c914289ed0d61fef77766cfd49`) passes `pg_restore -l`, but has not been restored in a disposable DB. Its paired roles dump is 799 bytes. Both files are under the same Muse overlay path and are not an off-host or verified durable backup.

The protected SQLite archive `/home/hatch/workspace/aineedhelp-db-recovery/2026-11-03-github-recovered.sqlite` still passes `PRAGMA quick_check`; SHA256 remains `554b384d0a2682f8a3d6e2740536ddc77b32778bc6e79d65f298f587f3c64843`. Its 2,398 records classify as 2,084 Phone-canonical records, 22 historical case records, 163 external task seeds, 50 seed tasks and 79 expired tasks. The rebuild script reads repository datasets; this is not recovered private Qwen runtime history. Do not import it wholesale.

The runtime worktree remains stale at `ac9d8238b3481195421ad8551f7676b87678c01e` with dirty `M data/resolve-cache.json`, `?? backend-keepalive.log` and `?? keepalive.sh`. Preserve these files; do not reset, clean, sync over or overwrite the worktree.

## Storage durability recheck — 2026-11-08

`findmnt --first-only` for PGDATA reports `overlay`. `/home/hatch` is an OverlayFS mount with `upperdir=/run/hatch/overlay/upper`; `/run` is tmpfs and the overlay uses `fsync=volatile`. `/proc/self/mountinfo` shows Btrfs mounts from `/dev/mapper/rv` stacked underneath the OverlayFS mount at the same target. PostgreSQL PGDATA, logical backups, SQLite archive, repository worktree and file-backed cache/log paths resolve through the topmost overlay. A Btrfs entry in the mount stack does not prove writes reach Btrfs. A separate Btrfs subvolume is mounted at `/run/hatch/resume`; it contains platform handoff/execution/index/profile-sync markers, is root-owned mode 0770, and no local docs designate it for custom application data. Do not repurpose this platform-owned volume as PGDATA or as a backup target.

The external runtime `ensure-postgres-btrfs.sh` checks `findmnt -n -T "$TARGET" -o FSTYPE | grep -qx btrfs`; this was reproduced returning success on the current unsafe stack because `findmnt` emits both `overlay` and `btrfs`. Its log repeatedly says `PostgreSQL 16 restored on Btrfs PGDATA`, but the active PGDATA topmost filesystem is still OverlayFS. The repository `verify-runtime.sh` compares the full multi-line result with `btrfs` and therefore fails closed. PR #505 is merged and adds `ops/muse-runtime/check-pgdata-mount.sh`, which uses `findmnt --first-only`; both `ensure-backend.sh` and `verify-runtime.sh` call it, and CI regression tests cover OverlayFS-over-Btrfs rejection, topmost Btrfs acceptance, lookup failure and missing PGDATA. The change is in GitHub main but is not installed on Muse. Treat PostgreSQL, PGlite and file-backed state durability across VM restart as **unverified**. Do not stop/restart the running DB or install/sync runtime scripts without an approved durable path and release gate.

Meta's public product page describes Muse Secure VM as a “persistent, dedicated virtual machine” with storage (https://ai.meta.com/muse/). This is a high-level product statement; it does not specify how the observed OverlayFS upperdir under tmpfs is persisted, whether this custom PGDATA path survives VM restart/replacement, or which mount path is supported for external database files. Local `~/docs/files-and-library.md` says workspace files persist between conversations; `~/docs/artifacts.md` separately describes persistence for an interactive artifact app's own database, but interactive apps cannot be published and public pages are static snapshots. Neither local document maps its persistence guarantee to this custom PostgreSQL/PGlite directory. Treat VM-level persistence and exact PGDATA durability as separate questions until a technical contract or supported mount is established.

The file-backed commit log `data/commit-log.jsonl` now has 400 valid lines, all `resolve_cache/decay` events from `resolve-cache`, with empty payloads; sequence values 1, 316 and 317 each occur twice and max seq is 397. Boot replay processed all 400 events without errors, but they contain no business-state payload. The file is Git-ignored and lies under the overlay. No `data/snapshots` directory exists. This log cannot reconstruct the 274-entry cache. The tracked-but-dirty `data/resolve-cache.json` contains 274 hints, all with status `blacklisted`; their last hint-update timestamps are 2026-05-26 through 2026-05-27. Preserve it, but do not treat it as active user/task data.

## Public ingress boundary

The last confirmed external apex API result remains HTTP 530 from 2026-11-07. After PR #505's production deployment, the public homepage, Phone Radar hub and directory pages were fetched successfully, but the public page-fetcher cannot retrieve `/api/health` or `/api/status`; no newer external API HTTP status is verified. Muse's artifact contract still documents static publishing only and no supported dynamic public ingress. Do not reconnect Cloudflare Tunnel, create a reverse proxy, or change DNS. Local Express liveness and database readiness do not imply durable storage or public API availability.



## Candidate configuration — NOT ACTIVE

Do not apply these variables until the exact data directory is proven to use a durable Muse-supported storage layer. If that gate passes, configure them in the Muse runtime only:

```dotenv
DB_DRIVER=pglite
PGLITE_DATA_DIR=/home/hatch/workspace/aineedhelp-db-runtime/pglite
```

`DB_DRIVER=pglite` explicitly selects the embedded engine and takes precedence over any stale `DATABASE_URL`. `PGLITE_DATA_DIR` must be an absolute path. The application creates the directory with owner-only permissions when it is new. Do not put database files under `/tmp`, `/var`, the repository checkout, or `node_modules`. Do not set these variables in Vercel.

When `DB_DRIVER` is unset or `postgres`, the existing `DATABASE_URL` PostgreSQL path remains unchanged. Unknown driver values fail closed.

## Compatibility and limits

- The application continues to use its existing `pg.Pool` query interface through PGlite's official `createPgConfig()` adapter.
- PGlite is single-connection. The adapter pool is deliberately capped at `max: 1`; application queries are serialized.
- PGlite does not open a PostgreSQL TCP listener and does not require port 5432.
- The test `npm run test:pglite` creates a temporary database, runs the actual application schema, writes a marker, closes the process, opens a new process, checks the marker, and exercises `/api/status`.
- A passing CI test proves process-level file persistence in the test environment. It does not by itself prove Muse VM reboot persistence, backup recoverability, production startup management, or public API reachability.

## Data recovery boundary

The old Muse PostgreSQL cluster was empty and lived on disposable storage. The protected SQLite archive in `aineedhelp-db-recovery` is a separate source archive, not a live application database. Do not import expired task fixtures, example reasoning objects, or external aggregation seeds as real users, active tasks, or production execution history. Original private Qwen runtime records remain unrecovered.

Use a new PGlite data directory. Do not point it at either old PostgreSQL dump or the SQLite archive. Before any later data import, create and verify a separate backup and define the exact import allowlist.

## Still separate from database persistence

PGlite does not restore the public API route. The existing Vercel rewrites still depend on the disconnected Cloudflare Tunnel and have returned HTTP 530. Do not start an unapproved tunnel, reverse proxy, or DNS change. Public ingress must be explicitly supported by Muse and separately verified from outside the VM.

Process auto-start/recovery and automated off-host backups also remain separate verification gates. Do not describe the backend as restored until database restart tests, process recovery, backup recovery, and external Vercel-to-Muse API checks all pass.

## Rollback

To return to external PostgreSQL, set `DB_DRIVER=postgres` and restore the verified `DATABASE_URL` in the Muse runtime. Keep the PGlite data directory untouched until the rollback and any needed export have been independently verified.
