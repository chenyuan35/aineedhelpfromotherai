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

NORMALIZE_FN=$(sed -n '/^normalize_dedupe_link()/,/^}/p' "$WATCHER")
eval "$NORMALIZE_FN"
V2EX_ROOT='https://www.v2ex.com/t/123456'
[ "$(normalize_dedupe_link v2ex "$V2EX_ROOT")" = "$V2EX_ROOT" ]
[ "$(normalize_dedupe_link v2ex "$V2EX_ROOT#reply1")" = "$V2EX_ROOT" ]
[ "$(normalize_dedupe_link v2ex "$V2EX_ROOT#reply99")" = "$V2EX_ROOT" ]
[ "$(normalize_dedupe_link v2ex 'https://www.v2ex.com/t/654321#reply1')" != "$V2EX_ROOT" ]
[ "$(normalize_dedupe_link nodeseek 'https://www.nodeseek.com/post-test#reply1')" = 'https://www.nodeseek.com/post-test#reply1' ]
V2EX_HASH_1=$(printf '%s\t%s' v2ex "$(normalize_dedupe_link v2ex "$V2EX_ROOT#reply1")" | sha256sum | cut -d' ' -f1)
V2EX_HASH_2=$(printf '%s\t%s' v2ex "$(normalize_dedupe_link v2ex "$V2EX_ROOT#reply99")" | sha256sum | cut -d' ' -f1)
[ "$V2EX_HASH_1" = "$V2EX_HASH_2" ]

V2EX_SEEN_FN=$(sed -n '/^v2ex_root_seen()/,/^}/p' "$WATCHER")
eval "$V2EX_SEEN_FN"
CANDIDATES="$TMP/candidates.tsv"
cat > "$CANDIDATES" <<'TSV'
observed_at	source	category	intent	activity	published	title	url	excerpt	services	commerce	mentioned_hosts
2026-09-25T00:00:00Z	v2ex	purchase	question	-	2026-09-25T00:00:00Z	Legacy thread	https://www.v2ex.com/t/123456#reply7	excerpt	-	-	-
TSV
v2ex_root_seen "$V2EX_ROOT"
! v2ex_root_seen 'https://www.v2ex.com/t/999999'
grep -Fq 'v2ex_root_seen "$dedupe_link"' "$WATCHER"

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
