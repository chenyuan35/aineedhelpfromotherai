# Muse embedded database runtime

## Purpose

This is an opt-in PostgreSQL-compatible database embedded in the Muse-hosted Express process. It avoids an OS-level PostgreSQL service whose binaries and data directory live under Muse's disposable `/var` overlay. PGlite stores its database files in the configured Node filesystem directory under `/home/hatch`.

## Current verified state — 2026-11-03

PR #498 added the opt-in PGlite 0.5.14 adapter at code SHA `06a65c06ae48f7b3865cad306bba4c62cbc3d758`; PR #500 is merged at current main `b1c406006784a29194c71eb6dd5cb9e12effc71a`. Current Vercel production `dpl_5fBiutA7Q4MjeU9cJNoutZepwNTb` is READY on that SHA. The PGlite code path remains opt-in and has not been activated on Muse.

Muse has Node v24.22.1 but no npm, npx, corepack, pnpm, yarn or bun executable; `@electric-sql/pglite` is not installed. Bounded HTTPS requests from the Muse container to GitHub, npm and the site apex time out. No approved package transfer/install path is currently verified. Do not bypass the platform network policy with a proxy or tunnel.

The local Express process is running. `GET /api/health` returns 200, while DB-dependent `GET /api/status` returns 500 with `ECONNREFUSED 127.0.0.1:5432`. `DB_DRIVER` and `PGLITE_DATA_DIR` are unset; no production environment configuration has been changed. The local user systemd manager is unavailable (`systemctl --user` reports `No medium found`), so process auto-recovery is unverified. PR #500 also makes the external health-check script probe both `/api/health` and `/api/status` and require `alive: true`; CI #366 and Eval Gate #1396 passed. No monitor process, timer, cron or alert channel is installed.

The platform documentation at `/home/hatch/docs/artifacts.md` says only static artifacts can be published and interactive apps cannot be public. No Muse-sanctioned dynamic inbound HTTP endpoint or port-forwarding contract for this Express service has been found. Third-party UseAPI documentation describes a Muse `type=web` public share as a single HTML file; this does not expose the running Express process or its database API (https://useapi.net/docs/api-muse-v1/get-muse-assets). The Vercel production API routes still target the disconnected Cloudflare Tunnel and return HTTP 530. Do not reconnect that tunnel or add an alternate reverse proxy without documented platform support and explicit authorization.

The protected SQLite archive at `/home/hatch/workspace/aineedhelp-db-recovery/2026-11-03-github-recovered.sqlite` remains separate from the live app DB. It is on persistent Btrfs and passed `PRAGMA quick_check`; it is not a PostgreSQL dump or a restored Qwen execution database. Do not import its historical/demo/expired task rows as live activity.

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
