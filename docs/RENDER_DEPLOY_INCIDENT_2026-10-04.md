# Render deployment incident closeout — 2026-10-04

## Incident

Render deployment `dep-db0hicqvcj2c739ahhg0` for commit `3b9df1f1cdc662e15e1f7b7d0fa3c0e4e2cc49c3` ended `update_failed` on 2026-10-03 at 15:21:40 UTC.

The commit itself was documentation-only in its final tree. Its temporary Phone coverage updater had already been removed before the squash merge, so the final commit did not change the runtime, build command, start command, or Phone production data.

## Verified failure mode

- Render checkout and frontend build completed successfully.
- `node server.js` started and logged `Express runtime on port 10000`.
- The failed deployment later reported `Port scan timeout reached, no open ports detected` and timed out.
- The service was configured with root `package.json` engine `>=20`, so Render resolved the runtime to Node 26.10.0.
- A separate legacy database error also appeared: `getaddrinfo ENOTFOUND dpg-d8c164cua31s739joel0-a`.
- The database bootstrap code swallowed that error and the server then emitted a misleading `Schema ready` message.

The same stale database hostname had also appeared on successful Render deploys, so it was not the direct cause of the 15:21 port-scan failure.

## Runtime repair

PR #374 (`e819fce4bb9bbd73fbd18faccd74c95aa945ec89`) made two bounded runtime-safety changes:

1. Root Node engine is pinned to `24.x`. Current Vercel rejects Node 20 as discontinued, while Render accepted the shared Node 24 line. This prevents Render from floating from `>=20` to Node 26 without breaking Vercel builds.
2. `lib/db.js` now rethrows outer schema-bootstrap failures after logging them, allowing the existing server startup catch to report the failure instead of printing false `Schema ready` success.

No Phone product logic, publication state, sitemap, DNS, billing, AdSense, database data, or account-critical setting changed.

## Runtime verification

- PR #374 Vercel Preview: READY on Node 24-compatible configuration.
- CI #240: PASS.
- Eval Gate #1128: PASS.
- Render main deployment `dep-db0lfdeq1p3s73egjdag` checked out merge `e819fce4bb9bbd73fbd18faccd74c95aa945ec89`.
- Render selected Node 24.21.0 from `package.json`.
- Render build completed successfully.
- `node server.js` bound to port 10000.
- Render declared `Your service is live` at 2026-10-03 19:30:54 UTC.

## Database topology and stale-configuration cleanup — resolved

The database warning was a separate historical-Render configuration defect, not a Phone deployment failure and not the authoritative Relay database path.

Production verification on 2026-10-04 established the current Relay path as:

`Vercel /api/reasoning/relay-risk-v2 → api-tunnel.aineedhelpfromotherai.com → Qwen PM2 reverse-proxy/api-server → local PostgreSQL`

Verified production state before cleanup:

- Qwen `reverse-proxy`, `api-server`, and `relay-risk-scheduler` were online.
- Qwen local `/api/health` and Relay v2 returned HTTP 200.
- The authoritative PostgreSQL connection resolved locally on Qwen (`localhost:5432`); a read-only check returned 22,289 `relay_source_daily` rows and one `relay_source_meta` row.
- The connected Render workspace listed no PostgreSQL instance. Its old `DATABASE_URL` therefore pointed only to a deleted/unreachable historical Render database and was not used by the production Relay tunnel.

After explicit workspace confirmation, the stale Render `DATABASE_URL` was cleared without changing Qwen PostgreSQL or Relay data. Configuration deploy `dep-db0lu46gekts73a9h1k0` reached `live`; the former `ENOTFOUND` disappeared.

PR #376 (`21682320220a2e2cb8ac7f387ea36e2a5743c2ec`) then made an intentionally absent database fail schema initialization instead of returning success. Vercel Preview was READY, CI #242 passed, Eval Gate #1132 passed, Vercel production reached READY, and Render deployment `dep-db0m0bbtqb8s738ivhv0` reached `live`.

Because the existing Winston call drops the second string argument from its JSON message, PR #377 (`bb909a33ab14287675556569df1ee5315af9e824`) added an explicit no-database warning. Vercel Preview was READY, CI #244 passed, Eval Gate #1134 passed, Vercel production deployment `dpl_h3QVGAssV8YVBWtHvPx6GC7TUBWz` reached READY, and Render deployment `dep-db0m3ivf3r2c73b814e0` reached `live`. Render now logs `[db] Disabled (DATABASE_URL not configured)` and no longer logs either the stale-host `ENOTFOUND` or a false database-ready success.

Qwen production was fast-forwarded without resetting, stashing, deleting, or overwriting its dirty runtime files. Only `api-server` was restarted. After the normal short restart window, `api-server`, `reverse-proxy`, and `relay-risk-scheduler` were online; Qwen continued to log a real `[db] Schema ready` against its local PostgreSQL. Local health and Relay checks returned HTTP 200, and the apex-domain health and Relay endpoints returned final HTTP 200 after canonical redirect following.

## Residual Render housekeeping

The Render web service still has native Git commit auto-deploy enabled even though `.github/workflows/deploy.yml` is already manual-only and Render is a historical fallback rather than the authoritative Relay production path. The currently exposed Render connector can read this state but does not expose a service-update action for changing `autoDeploy`; no authenticated Render Dashboard browser session is connected in this work round.

This is a low-risk maintenance/configuration mismatch, not an active production blocker. Do not create a replacement Render service, database, paid dependency, or alternate production path merely to remove it. If a future authenticated Render settings action is available, disable native auto-deploy while preserving manual fallback capability, then verify that Vercel + `api-tunnel` remain the authoritative path.
