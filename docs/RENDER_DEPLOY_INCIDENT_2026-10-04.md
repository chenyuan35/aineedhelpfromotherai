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

## Repair

PR #374 (`e819fce4bb9bbd73fbd18faccd74c95aa945ec89`) made two bounded runtime-safety changes:

1. Root Node engine is pinned to `24.x`. Current Vercel rejects Node 20 as discontinued, while Render accepted the shared Node 24 line. This prevents Render from floating from `>=20` to Node 26 without breaking Vercel builds.
2. `lib/db.js` now rethrows outer schema-bootstrap failures after logging them, allowing the existing server startup catch to report the failure instead of printing false `Schema ready` success.

No Phone product logic, publication state, sitemap, DNS, billing, AdSense, database data, or account-critical setting changed.

## Verification

- PR #374 Vercel Preview: READY on Node 24-compatible configuration.
- CI #240: PASS.
- Eval Gate #1128: PASS.
- Render main deployment `dep-db0lfdeq1p3s73egjdag` checked out merge `e819fce4bb9bbd73fbd18faccd74c95aa945ec89`.
- Render selected Node 24.21.0 from `package.json`.
- Render build completed successfully.
- `node server.js` bound to port 10000.
- Render declared `Your service is live` at 2026-10-03 19:30:54 UTC.
- The database DNS failure remains visible as an error/warning and no longer produces a false `Schema ready` success.

## Remaining database configuration issue

The connected Render workspace currently lists no PostgreSQL instances, while the legacy Render service still has a `DATABASE_URL` resolving to the deleted/unreachable hostname `dpg-d8c164cua31s739joel0-a`.

Do not clear or replace that environment variable blindly. `lib/relay-risk-v2.js` uses the database for Relay community votes and source/history state. The current production API path is routed through `api-tunnel.aineedhelpfromotherai.com`, so any database credential/runtime cleanup must first identify the actual authoritative backend database and confirm Relay behavior before changing environment state.

This stale Render database setting is a separate infrastructure cleanup item, not a blocker for the repaired Render deployment and not evidence that Phone data failed to ship.
