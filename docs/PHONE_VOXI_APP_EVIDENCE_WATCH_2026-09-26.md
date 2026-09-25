# VOXI App Verification Evidence Watch — 2026-09-26

Status: **ACTIVE EVIDENCE GAP / BACKSTAGE ONLY**

## Why this target exists

VOXI is currently a strong UK pilot route on acquisition and keep-alive economics, but the normalized Phone Radar app matrix still has no qualifying VOXI observations for OpenAI/ChatGPT/Codex, Telegram or WhatsApp. That missing evidence must remain missing; recommendation order is not permission to invent compatibility.

## Watcher behavior

The community watcher now gives an explicit `voxi-app-evidence` category to public-feed items that mention VOXI together with an app/OTP verification term. OpenAI/ChatGPT/Codex, Telegram and WhatsApp continue to use the existing service tags. Matching items are surfaced first in `latest.md` for manual review and still enter the normal dedupe/review path. They do not auto-publish or count as successful verification merely because they match the query.

The target vocabulary includes VOXI plus terms such as ChatGPT/OpenAI/Codex, Telegram/TG, WhatsApp, OTP, SMS, verification, 验证码, 接码, 短信 and 电报.

## Source constraints

NodeSeek remains observable through its existing public RSS feed. The observer's direct NodeSeek search-page probes currently return Cloudflare HTTP 403, so the watcher does not bypass that control or add search-page scraping.

LINUX DO cannot be added as a direct search source under the current rules. On 2026-09-26, its public `robots.txt` explicitly disallowed `/search` for `User-agent: *`, while direct `/search?q=voxi` returned Cloudflare HTTP 403. Topic/category RSS patterns are also disallowed by that robots policy. The watcher therefore does not automate LINUX DO search, login, Cloudflare bypass or hidden APIs.

Manual public web discovery may still identify individual LINUX DO threads for review when they are already indexed by a search provider. That is a research path, not an observer crawl path.

## Current evidence disposition

A targeted public-web review found VOXI-related discussions and general OpenAI/Codex verification discussions, but no current independent end-to-end VOXI reproduction that justifies filling the OpenAI/ChatGPT/Codex, Telegram or WhatsApp cells. The production matrix therefore stays at zero qualifying VOXI app observations.

## Promotion trigger

Add an app observation only when a current attributable report states the route, service, operation and outcome clearly enough to normalize and deduplicate. Continue to require at least five independent observations before rendering a percentage for the same route + service + operation group.
