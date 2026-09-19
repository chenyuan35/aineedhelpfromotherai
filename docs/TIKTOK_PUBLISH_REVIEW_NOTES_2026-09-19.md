# TikTok App Review execution — 2026-09-19

Status: REVIEW PREPARATION IN PROGRESS. Do not press Submit for review.

## Verified production and merge state

- PR #140 is merged as `587e2757540306de5f6bcbc1b769c1a3adc71f96`; it adds the TikTok publisher flow.
- PR #141 is merged as `e15c6039e96d1a5c8e9e97a82da75b97d08a9a64`; its only change is the temporary `/api/tiktok/*` rewrite to the configured Sandbox Preview Functions.
- `https://aineedhelpfromotherai.com/tiktok-publish/` returns HTTP 200.
- A cookie-less GET to `https://aineedhelpfromotherai.com/api/tiktok/status/` returns HTTP 200 with `configured:true`, `connected:false`. This verifies configuration availability only, not the authenticated OAuth session or Developer Portal values.
- The user reports that the currently uploaded review demo appears as a still image. This session did not inspect the Portal or file directly. The existing asset is not acceptable as the final demonstration.
- The previously completed production-domain Sandbox OAuth is user-provided context and was not repeated in this session.

## Demo video acceptance

The reviewer video and the video selected inside the publisher are separate assets. The selected posting media must be a genuine moving MP4/MOV with an in-page playable preview; the reviewer evidence must be a continuous screen recording of the actual website and interactions. Do not submit a still image, slideshow, reconstructed UI, mock API result, or edited sequence that implies an action succeeded when it did not.

Capture on the exact production domain:
1. Open `https://aineedhelpfromotherai.com/tiktok-publish/` and show the domain and real publisher page.
2. Start Login Kit, show the real consent screen with `user.info.basic`, `video.publish`, and `video.upload`, authorize, and return to the site.
3. Show the connected identity and creator information/options returned by TikTok. Do not expose tokens, secrets, or unnecessary account identifiers.
4. Select a moving, noncommercial, non-AI MP4/MOV and play the page's video preview.
5. Show TikTok-returned privacy choices and actual comment, Duet, and Stitch availability. Demonstrate commercial-content and AIGC controls truthfully; leave each setting consistent with the selected media.
6. With explicit consent, run the actual Direct Post path and show TikTok's real response and resulting status.
7. Run the actual `video.upload` inbox path and show TikTok's real status. Do not describe `SEND_TO_USER_INBOX` as a published post; only a real `PUBLISH_COMPLETE` supports that claim.
8. Keep the capture continuous, readable, and unambiguous; only trim dead time at the beginning/end. Export as MP4/H.264 or MOV, under 50 MB. TikTok requires an end-to-end demo, matching website domain, and clear UI/interactions; first-time app review must use Sandbox. See the [TikTok App Review Guidelines](https://developers.tiktok.com/docs/en/app-review-guidelines).

## Direct Post privacy restriction

TikTok's current Direct Post documentation says unaudited clients can post only to private accounts; the Content Sharing Guidelines also require accounts using an unaudited API client to be private at posting time. Selecting per-post `SELF_ONLY` does not make a public target account private. Do not change the user's account privacy. If the existing Sandbox account triggers TikTok's restriction, record the actual returned code/message and explain the official limitation; do not claim success. Sources: [Direct Post API](https://developers.tiktok.com/docs/en/content-posting-api-reference-direct-post) and [Content Sharing Guidelines](https://developers.tiktok.com/docs/en/content-sharing-guidelines).

## Portal and submission gates

Before upload, verify the Production Draft's app name, description, website URL, Terms/Privacy URLs, Login Kit and Content Posting API products, and the exact requested scopes against the live product. Demonstrate every selected product and scope; remove anything not actually used. Confirm the uploaded reviewer recording is MP4/MOV and under 50 MB. Do not press Submit for review; stop for the user to inspect and authorize the final submission.

## Current blocker

No Playwright browser MCP is present in this session's tool inventory or `Codex mcp list`. Project rules make Playwright the only permitted browser control and prohibit CUA/standalone-browser fallbacks. Therefore the Portal review, recording, and upload are not complete. Resume these actions only when the permitted Playwright tool is available.

## Temporary Sandbox review bridge and rollback

PR #141's only Vercel rewrite maps `/api/tiktok/(.*)` to `https://aineedhelpfromotherai-tiktok-preview.vercel.app/api/tiktok/$1`. It keeps the reviewer-visible page on the production domain while using configured Sandbox Preview Functions.

Do not remove the rewrite while TikTok reviewers still need the Sandbox-backed flow. Retire it only after review no longer depends on the bridge and direct production functions/credentials are separately ready and explicitly authorized. Rollback is a normal fresh-branch/PR change removing only that `/api/tiktok/*` rewrite; then verify the direct production TikTok endpoints and confirm unrelated production routes are unchanged. No account-privacy, credential, billing, or other production setting changes are part of this review-video task.
