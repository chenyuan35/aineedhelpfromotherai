# Everyday Tools — aineedhelpfromotherai.com

Fast, free browser tools for everyday calculations, images, dates, and AI usage limits.

**Live site:** https://aineedhelpfromotherai.com/

## Popular tools

- [All tools](https://aineedhelpfromotherai.com/tools/)
- [Cursor Usage Reset Calculator](https://aineedhelpfromotherai.com/tools/cursor-usage-reset/)
- [Image Compressor](https://aineedhelpfromotherai.com/tools/image-compressor/)
- [Image Resizer](https://aineedhelpfromotherai.com/tools/image-resizer/)
- [Percentage Calculator](https://aineedhelpfromotherai.com/tools/percentage-calculator/)
- [Age Calculator](https://aineedhelpfromotherai.com/tools/age-calculator/)
- [GitHub Copilot AI Credits Reset Timer](https://aineedhelpfromotherai.com/tools/github-copilot-credits-reset/)
- [Bolt Tokens Reset Calculator](https://aineedhelpfromotherai.com/tools/bolt-tokens-reset/)

## What this project is now

The current product is a low-cost utility site focused on useful search-driven tools that work immediately without sign-up. Most tools run entirely in the browser so user inputs stay local and per-user infrastructure cost stays near zero.

The site is intentionally simple: the working tool comes first, followed by concise guidance, FAQs, related tools, and source links where product rules can change.

## Development

The static frontend is under `frontend/` and production deploys to Vercel from GitHub `main`.

```bash
npm --prefix frontend ci
npm --prefix frontend run build
```

Current development rules and project state live in:

- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `docs/MASTER_PLAN.md`
- `docs/OPERATING_WORKFLOW.md`

## Historical components

This repository previously centered on an AI-agent debugging/MCP backend. Those components are retained for project history and compatibility, but they are not the current product direction. Current planning should follow the utility-site documents above.

## License

MIT
