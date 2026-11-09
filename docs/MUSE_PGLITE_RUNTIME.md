# Muse embedded database runtime

## Purpose

This is an opt-in PostgreSQL-compatible database embedded in the Muse-hosted Express process. It avoids an OS-level PostgreSQL service whose binaries and data directory live under Muse's disposable `/var` overlay. PGlite stores its database files in the configured Node filesystem directory under `/home/hatch`.

## Current verified state — 2026-11-09

PR #498 added the opt-in PGlite 0.5.14 adapter at code SHA `06a65c06ae48f7b3865cad306bba4c62cbc3d758`; PR #500's health-readiness fix remains the latest application-code release at `b1c406006784a29194c71eb6dd5cb9e12effc71a`. Current GitHub main is `505702f0a3e77e17c3d1159a6d9770a39b6407e1` after PR #507; Vercel production deployment `dpl_3BtkbkcCF3cEZQQB1PTs1HKHEANp` is READY on exact main SHA with apex/www aliases. PR #507 replaces PR #505's unreliable `findmnt --first-only` check with a statfs-based guard and regression tests; CI, Eval Gate, Preview and exact-main production are READY. The corrected guard is merged but has not been installed on Muse. PGlite has not been selected as the active driver.

The latest 2026-11-09 read-only Muse check finds `aineedhelp-backend.service`, PostgreSQL 16, `aineedhelp-backend-ensure.timer` and `aineedhelp-postgres-backup.timer` active/enabled. Local `GET /api/health` returns 200 and DB-backed `GET /api/status` returns `alive:true`. PostgreSQL uses `/home/hatch/workspace/aineedhelp-db-runtime/pgdata`; all six core tables (`posts`, `reasoning_objects`, `execution_history`, `task_lifecycle`, `agent_registry`, `agent_tokens`) in database `aineedhelp` are empty. `stat -f -c '%T'` and `df -T` report Btrfs `/dev/mapper/rv` for PGDATA. The active `home-hatch.mount` reports `Type=btrfs`, `What=/dev/mapper/rv`; the mount unit has no exposed fragment/source path, no `/etc/fstab` entry exists, and `/dev/mapper/rv` is not visible as a block-device node in this runtime. These observations do not prove restart durability. The corrected source guard is not installed; no runtime script or service has been changed.

All six live PostgreSQL core tables in the `aineedhelp` application database currently contain zero rows. The latest 2026-11-09 dump `backups/aineedhelp-20261109T032711Z.dump` (26,584 bytes; SHA256 `819b6183b953a926567d68b078a916bcdcd962e827358471e4401b20f0c23ce7`) passes `pg_restore -l` and restored successfully into a disposable database with six tables and zero rows. The temporary database and temporary copy were removed. The original backup directory and file are root-owned mode 0700/0600; the restore test copied the dump to `/tmp` as a temporary postgres-readable file, without changing the original permissions. No user-controlled off-host copy or platform-backup restore has been verified.

The protected SQLite archive `/home/hatch/workspace/aineedhelp-db-recovery/2026-11-03-github-recovered.sqlite` still passes `PRAGMA quick_check`; SHA256 remains `554b384d0a2682f8a3d6e2740536ddc77b32778bc6e79d65f298f587f3c64843`. Its 2,398 records classify as 2,084 Phone-canonical records, 22 historical case records, 163 external task seeds, 50 seed tasks and 79 expired tasks. The rebuild script reads repository datasets; this is not recovered private Qwen runtime history. Do not import it wholesale.

The runtime worktree remains stale at `ac9d8238b3481195421ad8551f7676b87678c01e` with dirty `M data/resolve-cache.json`, `?? backend-keepalive.log` and `?? keepalive.sh`. Preserve these files; do not reset, clean, sync over or overwrite the worktree.

## Storage durability recheck — 2026-11-09

`stat -f -c '%T'` for PGDATA and `/home/hatch/workspace` returns `btrfs`; `df -T` reports `/dev/mapper/rv`. `findmnt --target` lists three records at `/home/hatch`: OverlayFS mount ID 834 (parent 727), Btrfs ID 886 (parent 834), and Btrfs ID 1451 (parent 886). The `findmnt --first-only` output selects the first OverlayFS record; it is not a reliable visible-filesystem test. The actual PGDATA path reports Btrfs through `statfs`/`df`. The active systemd `home-hatch.mount` reports `Type=btrfs` and `What=/dev/mapper/rv`, but no `/etc/fstab` entry or unit fragment/source path is exposed, and `/dev/mapper/rv` is not visible as a block-device node inside this runtime.

PR #507 replaces the first-match guard with `stat -f -c '%T'`, which reports Btrfs for the live PGDATA path. The PR is merged at `505702f0a3e77e17c3d1159a6d9770a39b6407e1`; CI, Eval, Preview and exact-main production all pass. The source guard is not installed on Muse, and no runtime script/service was changed.

The current Btrfs observation and active mount unit do not prove PGDATA application consistency or restore behavior across Muse VM restart/replacement. Meta's official research article (https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) says the workspace filesystem is in the runtime cell and VM data is backed up continuously for restoration; this is platform-level evidence, but no PGDATA-specific RPO, snapshot consistency or restore interface is documented. The 2026-11-09 logical dump has been restored successfully in a disposable database; no user-controlled off-host copy or restore from Meta's platform backup has been verified. Local `~/docs/files-and-library.md` describes workspace files persisting between conversations; `~/docs/artifacts.md` separately describes restart persistence for an interactive artifact app's own database, which is not this PostgreSQL instance. The separate `/run/hatch/resume` Btrfs subvolume remains platform-owned and must not be repurposed for PGDATA or backups. Do not restart, migrate, import data or install runtime scripts until backup/recovery gates are cleared.

The file-backed commit log `data/commit-log.jsonl` now has 400 valid lines, all `resolve_cache/decay` events from `resolve-cache`, with empty payloads; sequence values 1, 316 and 317 each occur twice and max seq is 397. Boot replay processed all 400 events without errors, but they contain no business-state payload. The file is Git-ignored and lies under the Muse workspace; `statfs` currently reports Btrfs for that path, and Meta claims continuous VM-data backups, but recovery of this file has not been tested. No `data/snapshots` directory exists. This log cannot reconstruct the 274-entry cache. The tracked-but-dirty `data/resolve-cache.json` contains 274 hints, all with status `blacklisted`; their last hint-update timestamps are 2026-05-26 through 2026-05-27. Preserve it, but do not treat it as active user/task data.

## Public ingress boundary

On 2026-11-09, the production homepage returned HTTP 200, www returned canonical redirect HTTP 308 and sitemap returned HTTP 200; both apex `/api/health` and `/api/status` returned HTTP 530 with Cloudflare Tunnel Error 1033 for `api-tunnel.aineedhelpfromotherai.com`. Muse's artifact contract still documents static publishing only and no supported dynamic public ingress. Do not reconnect Cloudflare Tunnel, create a reverse proxy, or change DNS. Local Express liveness and database readiness do not imply durable storage or public API availability.



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
