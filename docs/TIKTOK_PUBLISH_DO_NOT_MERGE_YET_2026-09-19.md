# TikTok Publisher — post-merge review gate

The implementation merge gates are satisfied:
- PR #140 merged as `587e2757540306de5f6bcbc1b769c1a3adc71f96`.
- PR #141 merged as `e15c6039e96d1a5c8e9e97a82da75b97d08a9a64`.

The App Review submission gate remains OPEN. The Production Draft and current uploaded demo have not been inspected in this session. The user reports the demo currently appears as a still image; replace it with a continuous recording of actual production-domain UI interactions and real Sandbox responses. Verify Portal fields and a compliant MP4/MOV under 50 MB, then stop before Submit for review.

Do not change the user's TikTok account privacy. Unaudited Direct Post has TikTok's private-account restriction; if the real response is the documented restriction, show and explain it rather than inventing a successful post. Keep Direct Post, inbox upload, and final TikTok status claims distinct.

The temporary PR #141 bridge is the sole `/api/tiktok/*` rewrite to Sandbox Preview Functions. Keep it while reviewer access depends on Sandbox. Remove only that rewrite in a fresh branch/PR after review no longer needs it and direct production functions are ready and authorized; verify production endpoints after rollback. Full steps and evidence are in `docs/TIKTOK_PUBLISH_REVIEW_NOTES_2026-09-19.md`.
