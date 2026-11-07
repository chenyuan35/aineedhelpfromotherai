# Muse embedded database runtime

## Purpose

This is an opt-in PostgreSQL-compatible database embedded in the Muse-hosted Express process. It avoids an OS-level PostgreSQL service whose binaries and data directory live under Muse's disposable `/var` overlay. PGlite stores its database files in the configured Node filesystem directory under `/home/hatch`.

## Current verified state — 2026-11-07

PR #498 added the opt-in PGlite 0.5.14 adapter at code SHA `06a65c06ae48f7b3865cad306bba4c62cbc3d758`; PR #500's health-readiness fix remains in the deployed code release `b1c406006784a29194c71eb6dd5cb9e12effc71a`. PGlite is still **not installed or selected**. The active Muse runtime currently uses PostgreSQL 16 through the existing `pg.Pool` path (`DB_DRIVER` and `PGLITE_DATA_DIR` are unset; the runtime's `DATABASE_URL` value is private and must not be printed).

The connected Muse `htch-runtime` now has `aineedhelp-backend.service` **active and enabled** under systemd. The service was handed over gracefully from the prior unmanaged Node process. Local `GET /api/health` returns 200 and DB-backed `GET /api/status` returns 200 with `alive: true`. PostgreSQL 16 is active at `/home/hatch/workspace/aineedhelp-db-runtime/pgdata`, and `findmnt` confirms this directory is on persistent Btrfs. `aineedhelp-backend-ensure.timer` is active with five-minute checks; `aineedhelp-postgres-backup.timer` is active daily.

The six core application tables (`posts`, `reasoning_objects`, `execution_history`, `task_lifecycle`, `agent_registry`, `agent_tokens`) each currently contain **zero rows**. A fresh logical backup was created at `2026-11-07T08:06:12Z`; the disposable restore test passed with `tables=6 app_rows=0`, and the production DB remained unchanged. This proves schema-only local backup/restore on the same Btrfs volume, not business-data recovery or off-host backup. Full Muse VM reboot persistence is not yet tested.

The active systemd service still runs from the stale Muse checkout `ac9d8238b3481195421ad8551f7676b87678c01e`, which has dirty files `M data/resolve-cache.json`, `?? backend-keepalive.log`, and `?? keepalive.sh`. Preserve them; do not reset, clean, sync over or overwrite the production worktree. Runtime code alignment must use a fresh worktree and controlled release.

External apex `/api/health`, `/api/status` and `/api/diagnostics` currently return HTTP 530 through `api-tunnel.aineedhelpfromotherai.com`. Muse's own `/home/hatch/docs/artifacts.md` says only static artifacts can be published and interactive apps cannot be public. No supported Muse dynamic public ingress is documented. Do not reconnect Cloudflare Tunnel, create a reverse proxy, or change DNS. Local runtime ACTIVE does not mean public API restored.

The protected SQLite archive at `/home/hatch/workspace/aineedhelp-db-recovery/2026-11-03-github-recovered.sqlite` remains separate from the live PostgreSQL DB. It passed `PRAGMA quick_check` and contains 2,398 file-backed records, but includes historical/task/aggregation seeds and is not a restored private Qwen runtime database. Do not import it into live tables without a reviewed provenance allowlist and a separate rollback backup.

## Explicit configuration

Set these variables in the Muse runtime only:

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
