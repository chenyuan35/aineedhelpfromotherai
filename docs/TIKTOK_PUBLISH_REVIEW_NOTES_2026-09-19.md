# TikTok review notes — 2026-09-19

The reviewer-facing page is `/tiktok-publish/`.

Demo sequence: Connect TikTok → authorize target/test account → return to website → choose MP4/MOV → enter title/description → choose a privacy option returned by TikTok → consent → Post to TikTok → upload → final TikTok status.

The page intentionally shows the original TikTok API error payload when an API call fails. It does not use a mock-success path.

For an unaudited Direct Post client, use a private target account and `SELF_ONLY` where TikTok requires it. Public visibility remains unavailable until TikTok's Direct Post audit is approved.
