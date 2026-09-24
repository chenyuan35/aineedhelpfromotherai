#!/bin/bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
PARSER="$ROOT/ops/phone-demand-watch/phone-demand-parse.pl"
WATCHER="$ROOT/ops/phone-demand-watch/aineedhelp-phone-demand-watch"
TIMER="$ROOT/ops/phone-demand-watch/aineedhelp-phone-demand-watch.timer"

perl -c "$PARSER" >/dev/null
bash -n "$WATCHER"
grep -Fq 'OnUnitActiveSec=1h' "$TIMER"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cat > "$TMP/feed.xml" <<'XML'
<rss><channel><item>
<title>ESIM.gg 保号，GPT 和 WhatsApp 接码成功</title>
<link>https://www.nodeseek.com/post-test</link>
<description><![CDATA[我在 <a href="https://esim.gg/plan">ESIM.gg</a> 买了号码，GPT 和 WhatsApp 验证码正常。闲鱼商家未发货可以退款。]]></description>
<pubDate>Wed, 23 Sep 2026 00:00:00 GMT</pubDate>
</item></channel></rss>
XML

ROW=$(perl "$PARSER" nodeseek "$TMP/feed.xml")
IFS=$'\t' read -r src category intent activity published title url excerpt services commerce hosts <<< "$ROW"
[ "$src" = nodeseek ]
[[ "$category" == *verification* ]]
[[ "$category" == *purchase* ]]
[[ "$services" == *openai* ]]
[[ "$services" == *whatsapp* ]]
[[ "$commerce" == *marketplace* ]]
[[ "$commerce" == *delivery-risk* ]]
[[ "$commerce" == *refund-risk* ]]
[ "$hosts" = esim.gg ]

echo 'phone demand watcher audit: PASS'
