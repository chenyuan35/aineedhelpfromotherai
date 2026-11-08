# Muse embedded database runtime

## Purpose

This is an opt-in PostgreSQL-compatible database embedded in the Muse-hosted Express process. It avoids an OS-level PostgreSQL service whose binaries and data directory live under Muse's disposable `/var` overlay. PGlite stores its database files in the configured Node filesystem directory under `/home/hatch`.

## Current verified state — 2026-11-08

PR #498 added the opt-in PGlite 0.5.14 adapter at code SHA `06a65c06ae48f7b3865cad306bba4c62cbc3d758`; PR #500's health-readiness fix remains in application-code release `b1c406006784a29194c71eb6dd5cb9e12effc71a`. Current GitHub main is `3684d508aeabebe3a9e97b8ee194f996eabb0207` (PR #503 adds Muse runtime supervision files). PGlite has not been selected as the active driver. Do not infer that selecting PGlite would solve persistence: its configured data directory is still under `/home/hatch`, whose current top-level mount is OverlayFS.

The 2026-11-08 live Muse check supersedes the 2026-11-07 ACTIVE checkpoint. `aineedhelp-backend.service` is inactive/disabled; `postgresql@16-main.service` is not found; the backend ensure and PostgreSQL backup timers are inactive/disabled; `pg_isready` on 127.0.0.1:5432 returns no response. A single unmanaged root-owned `node server.js` process remains on port 3000: local `GET /api/health` returns 200, but DB-backed `GET /api/status` returns 500 with `alive:false`. This is not a recovered backend. A pre-existing package-recovery process was observed running `apt-get update` for over an hour; do not duplicate or terminate it without identifying its owner.

The six core PostgreSQL table counts were last verified as zero on 2026-11-07. Current live counts cannot be queried while PostgreSQL is unavailable. The 2026-11-07 disposable restore test passed with six tables and zero application rows. The newer `aineedhelp-20261108T032718Z.dump` (26,584 bytes; SHA256 `cd9f42f9ac299f89bc0a18533fb957e64cf6e2c914289ed0d61fef77766cfd49`) passes `pg_restore -l`, but has not been restored in a disposable DB. Its paired roles dump is 799 bytes. Both files are under the same Muse overlay path and are not an off-host or verified durable backup.

The protected SQLite archive `/home/hatch/workspace/aineedhelp-db-recovery/2026-11-03-github-recovered.sqlite` still passes `PRAGMA quick_check`; SHA256 remains `554b384d0a2682f8a3d6e2740536ddc77b32778bc6e79d65f298f587f3c64843`. Its 2,398 records classify as 2,084 Phone-canonical records, 22 historical case records, 163 external task seeds, 50 seed tasks and 79 expired tasks. The rebuild script reads repository datasets; this is not recovered private Qwen runtime history. Do not import it wholesale.

The runtime worktree remains stale at `ac9d8238b3481195421ad8551f7676b87678c01e` with dirty `M data/resolve-cache.json`, `?? backend-keepalive.log` and `?? keepalive.sh`. Preserve these files; do not reset, clean, sync over or overwrite the worktree.

## Storage durability recheck — 2026-11-08

`findmnt` shows `/home/hatch` is currently mounted as OverlayFS with `upperdir=/run/hatch/overlay/upper`; `/run` is tmpfs and the overlay mount uses `fsync=volatile`. The PostgreSQL PGDATA, logical backups, SQLite archive, repository worktree and file-backed cache/log paths are all inside `/home/hatch`. The underlying `/dev/mapper/rv` Btrfs volume is visible beneath the overlay, but that does not prove writes to these paths reach the persistent Btrfs layer. `statfs=btrfs` and `df` output alone are not sufficient evidence.

The runtime `ensure-postgres-btrfs.sh` currently checks `findmnt -n -T "$TARGET" -o FSTYPE | grep -qx btrfs`; because the mount query can return both the top OverlayFS entry and underlying Btrfs entry, this check can accept the lower entry. The stricter `verify-runtime.sh` exact comparison currently fails with `PGDATA is not on Btrfs`. Treat PostgreSQL, PGlite and file-backed state durability across restart as **unverified** until a dedicated persistent mount or an official Muse persistence guarantee is demonstrated. Do not run the PostgreSQL recovery script or start either DB engine on the current unverified path.

The file-backed commit log is `data/commit-log.jsonl`. The current 399 valid lines are all `resolve_cache/decay` events from `resolve-cache`, with empty payloads; sequence values 1, 316 and 317 each occur twice. The file is Git-ignored and lies under the overlay. No `data/snapshots` directory exists. This log cannot reconstruct the 274-entry cache. The tracked-but-dirty `data/resolve-cache.json` currently contains 274 hints, all with status `blacklisted`; their last hint-update timestamps are 2026-05-26 through 2026-05-27. Preserve it, but do not treat it as active user/task data.

## Public ingress boundary

The last confirmed external apex API result remains HTTP 530 from 2026-11-07. The public homepage remained fetchable on 2026-11-08, but no new external API HTTP status was verified this round. Muse's artifact contract still documents static publishing only and no supported dynamic public ingress. Do not reconnect Cloudflare Tunnel, create a reverse proxy, or change DNS. Local Express liveness does not imply DB readiness or public API availability.



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
