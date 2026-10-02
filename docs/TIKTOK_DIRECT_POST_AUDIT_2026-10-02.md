# TikTok Direct Post audit remediation — 2026-10-02

## Session card

- Task: repair the existing `/tiktok-publish/` integration against the exact advanced-audit rejection and produce a genuine resubmission, without changing the website's Phone Radar mission.
- Why now: the base application is Live; advanced Direct Post audit was rejected, not still pending. The user explicitly authorized repair, deployment, a real compliant test, recording and submission.
- Write target: branch `fix/tiktok-direct-post-audit`, created from main commit `3750c763b960529e29ebf37f465525c263d4a786`; never edit main directly.
- Deliverable: verified UX fixes and discoverability/privacy disclosure, passing tests/CI/Preview, independently verified production, genuine end-to-end video and advanced form submission receipt.
- Steps: repair with regression tests; release via PR/CI/Preview; verify authorized account and actual media; record the real Direct Post ending; review footage and submit once.
- Parallel lane: bounded test-first code tasks within this same repair only; no Phone data admission or unrelated production expansion.
- Done condition: actual deployment and matching footage verified, and the precise advanced-audit request reads back as submitted. Submitted is not Approved.
- Stop conditions: login/code/device approval, unsupported account restriction, provider quota, missing genuine business facts, failed real publication or missing video evidence. Do not fabricate a posted result or bypass platform restrictions.

## Verified starting evidence

App ID: `7686819988157810696`. Existing public route: `https://aineedhelpfromotherai.com/tiktok-publish/`.

The portal UI showed the base application's Live version since Oct 1, 2026 2:14 PM. The separate advanced-audit rejection reason was:

> Your application did not follow our UX Guidelines. Please refer to point 1 to 5 under 'Required UX Implementation in Your App' in the Content Sharing Guidelines (https://developers.tiktok.com/doc/content-sharing-guidelines#required_ux_implementation_in_your_app). All the requirements mentioned here need to be shown in the demo video. The demo video should show the complete end-to-end flow of the integrations with TikTok and the ending must show that had been post under TikTok.

Advanced form limits read from the portal schema: up to 3 MP4 files, each at most 50,000,000 bytes.

Existing selected scopes remain `user.info.basic`, `video.publish`, `video.upload`.

## Bounded defect contract

1. Add genuine music/branded-policy links and correct consent switching.
2. Enforce commercial category notification and preserve manually chosen privacy through branded-content conflicts with explicit disabled-state explanations.
3. Provide actionable creator-quota errors and retain disabled interactions/dynamic duration/privacy constraints.
4. Redact displayed upload URLs/credentials; retain safe error fields and publish identifiers.
5. Keep an in-flight publish ID, resume status queries without another initialization, distinguish all terminal/non-terminal outcomes.
6. Make the existing tool discoverable after the actual final build/Reset-strip order, without reviving Reset as a primary product.
7. Update generator-owned privacy/terms/about text to describe real OAuth encrypted-cookie data flow, browser-to-TikTok transfer, retention and lawful user-controlled usage. Do not claim unsupported automatic revocation/deletion or fabricated customer metrics.

## Release and demonstration gates

Use the existing GitHub/Vercel release path and preserve the configured TikTok bridge until its exact client/environment and credentials are verified. Do not print credentials, create `.env` files, change DNS, billing, AdSense or model/provider settings.

Unaudited Direct Post requires a compliant private test account and manually selected `SELF_ONLY`. The creator's own final TikTok interface is the ending proof; a missing public post ID is not a private-post failure.

A controlled UI/HTTP fixture is an offline regression aid only. It must never be presented as a live API publication in the review video.

Re-review the actual copyrighted/original video, apply truthful AIGC disclosure, conceal sensitive response fields before recording, preserve the genuine processing outcome and show the same target account/title/material at the end.

## Verified completion and resubmission — 2026-10-02

The authorized one-off YUAA browser session was used only for the real TikTok account/login workflow and portal submission. It is not project infrastructure and does not host any website service or durable project dependency.

Live Direct Post verification used the connected creator `Ethereal` (`@healing...c`). The account was temporarily switched to private for the unaudited `SELF_ONLY` demonstration and restored to its prior public-account setting after the test.

Two genuine Direct Post runs completed through the production `/tiktok-publish/` flow. TikTok returned terminal `PUBLISH_COMPLETE`, and the creator profile showed the newly posted review media. The second review post used the title `TikTok Direct Post API Review Demo`; the live creator view showed the same title/material and the 8-second video.

A 28-second 1280×720 MP4 review artifact, `tiktok-direct-post-audit-demo.mp4`, was assembled from the real connected-account, media-selection, settings, processing/completion and creator-profile proof states. It was uploaded to the TikTok Content Posting API reapplication form.

The reapplication used app ID `7686819988157810696`, described the user-initiated Direct Post/inbox-upload workflow, reported the current daily-use estimate as less than 100 users, and truthfully stated that the application does not persist Content Posting API response fields in an application database. OAuth access/refresh credentials remain encrypted in a Secure, HttpOnly session cookie; temporary upload URLs are not persisted or logged.

The required declaration checkboxes were accepted and the portal then displayed the exact confirmation:

> Your Application to request access to Content Posting API has been submitted!

The same confirmation states that TikTok will respond in approximately 2–4 weeks and that status should be checked from Manage apps.

Current status: **SUBMITTED / WAITING FOR TIKTOK REVIEW**. This is not approval. Do not submit again unless TikTok returns a rejection or requests new evidence.
