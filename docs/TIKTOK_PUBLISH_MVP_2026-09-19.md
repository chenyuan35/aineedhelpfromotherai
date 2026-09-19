# TikTok Video Publisher MVP — 2026-09-19

## User job

A user has a finished MP4/MOV on desktop and wants to authorize TikTok, review the post settings TikTok permits for that account, publish the video, and see the real TikTok result without moving the file through a separate mobile workflow.

## MVP scope

- Public page: `/tiktok-publish/`.
- Entry from `/tools/`; no homepage redesign and no new creator-tools category.
- TikTok OAuth via Login Kit with `video.publish` as the default scope.
- Optional `video.upload` handling only when that scope is actually granted.
- Query creator info before Direct Post and render only TikTok-returned privacy options.
- Accept MP4/MOV, initialize `FILE_UPLOAD`, upload media to TikTok, poll final publish status, and show the original TikTok error payload on failure.
- Use the same production site Terms and Privacy URLs supplied to TikTok review.

## Explicit non-goals

- No scheduled/background posting.
- No multi-account dashboard, content calendar, AI video generator, cross-posting suite, or creator SaaS expansion.
- No photo publishing in this MVP.
- No change to the homepage's primary product positioning.
- No mock-success path.

## Technical design and module boundaries

- `frontend/tiktok-publish/index.html`: review-visible UI and browser media transfer.
- `api/tiktok/auth.js`: OAuth start and anti-CSRF state.
- `api/tiktok/callback.js`: code exchange and encrypted session creation.
- `api/tiktok/status.js`: connection/creator-info state and publish-status polling.
- `api/tiktok/publish.js`: validates metadata and initializes Direct Post or optional inbox upload.
- `lib/tiktok-web.js`: shared OAuth/API/session helpers.
- Vercel Functions hold client credentials server-side; selected media is transferred to the temporary TikTok upload URL returned for that publish operation.

## Persistence and privacy

No new database is required. OAuth access/refresh credentials are encrypted with AES-256-GCM using a key derived from `TIKTOK_CLIENT_SECRET` and carried only in a Secure, HttpOnly, SameSite=Lax `__Host-` session cookie. Page JavaScript cannot read the OAuth credentials. The browser receives only TikTok's short-lived media-upload URL required to transfer the selected file; it never receives the app secret or OAuth access/refresh token.

## API surface

- `GET /api/tiktok/auth/`
- `GET /api/tiktok/callback/`
- `POST /api/tiktok/publish/`
- `GET /api/tiktok/status/`

## Deployment and configuration

Required server-side environment variables: `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_REDIRECT_URI`. Production redirect URI is `https://aineedhelpfromotherai.com/api/tiktok/callback/` and must be registered exactly in TikTok Developer Portal.

## Logging / observability

Do not log OAuth tokens, refresh tokens, the client secret, or temporary TikTok upload URLs. User-visible failures preserve TikTok's returned error body/code/log_id where available. Vercel runtime logs remain infrastructure-level diagnostics.

## Test strategy

1. Static contract test checks the public page, OAuth endpoints, no hard-coded secrets, creator-info use, Direct Post endpoint, status endpoint, and build registration.
2. Vercel Preview must render `/tiktok-publish/` and expose the serverless routes (configuration may remain intentionally missing in Preview).
3. Production acceptance requires real TikTok credentials, a target/test account authorized for `video.publish`, a real MP4/MOV upload, and a terminal TikTok status (`PUBLISH_COMPLETE` or an original TikTok failure). No mock result counts.

## Rollback

Revert the bounded PR/commit. No database migration or durable media storage needs cleanup. Removing the four API functions, shared helper, page registration, and legal copy restores the previous site.

## Operating cost

No new paid service is introduced. OAuth/init/status calls use Vercel Functions and TikTok APIs; video bytes transfer directly from the user's browser to TikTok rather than through the application server.

## Product boundary

This page is a bounded app-review utility, not a fourth strategic product pillar. It earns further investment only if TikTok approval or later search/usage evidence justifies it.
