# TikTok Direct Post audit remediation — 2026-10-02

## Session card

- Task: repair the existing `/tiktok-publish/` integration against the exact advanced-audit rejection and produce a genuine resubmission, without changing the website's Phone Radar mission.
- Why now: the base application is Live; advanced Direct Post audit is rejected, not still pending. The user explicitly authorized repair, deployment, a real compliant test, recording and submission.
- Write target: branch `fix/tiktok-direct-post-audit`, created from main commit `3750c763b960529e29ebf37f465525c263d4a786`; never edit main directly.
- Deliverable: verified UX fixes and discoverability/privacy disclosure, passing tests/CI/Preview, independently verified production, genuine end-to-end video and advanced form submission receipt.
- Steps: repair with regression tests; release via PR/CI/Preview; verify authorized account and actual media; record the real Direct Post ending; review footage and submit once.
- Parallel lane: bounded test-first code tasks within this same repair only; no Phone data admission or unrelated production expansion.
- Done condition: actual deployment and matching footage verified, and the precise advanced-audit request reads back as submitted. Submitted is not Approved.
- Stop conditions: login/code/device approval, unsupported account restriction, provider quota, missing genuine business facts, failed real publication or missing video evidence. Do not fabricate a posted result or bypass platform restrictions.

## Verified starting evidence

App ID: `7686819988157810696`. Existing public route: `https://aineedhelpfromotherai.com/tiktok-publish/`.

The portal UI shows the base application's Live version since Oct 1, 2026 2:14 PM. The separate advanced-audit rejection reason is:

> Your application did not follow our UX Guidelines. Please refer to point 1 to 5 under 'Required UX Implementation in Your App' in the Content Sharing Guidelines (https://developers.tiktok.com/doc/content-sharing-guidelines#required_ux_implementation_in_your_app). All the requirements mentioned here need to be shown in the demo video. The demo video should show the complete end-to-end flow of the integrations with TikTok and the ending must show that had been post under TikTok.

Advanced form limits read from the current portal schema: up to 3 MP4 files, each at most 50,000,000 bytes.

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

The current truthful state is implementation in progress. The user has additionally approved temporarily making the currently logged-in `buns790` account private solely for the unaudited `SELF_ONLY` demonstration, and explicitly requires restoring its prior public-account setting after the demonstration. The private-account setting has NOT been changed, and no new TikTok publication has been performed.

The parent independently reran the fixture-backed page regression and the five built-public-surface checks. A separate fix context is addressing newly identified nested TikTok quota responses, visible privacy-conflict explanations, submit-time video-file identity and creator-bound consent. Do not count these fixture results as live API evidence.

Local `npm run verify` failed against the retired `/failure-index.json` (HTTP 410); its runner, server and library files are unchanged in this branch. The local Phone generated-artifact gate also returned stale-artifact, so release remains blocked until its cause is reconciled and the required PR gates pass. Fresh GitHub main has advanced to `e5f902250921eaa232779104bdfb4c37c6a0c3ac` (Phone first-screen PR #342); reconcile against that state before release and do not overwrite the independent Phone changes.

Nothing in this document claims new production deployment, new recorded success, submitted advanced request or approval.
