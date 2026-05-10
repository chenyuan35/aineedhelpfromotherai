#!/bin/bash
# Submit sitemap to search engines
# Usage: bash scripts/submit-sitemap.sh
# Run without proxy to reach search engines
# Usage: bash scripts/submit-sitemap.sh

SITEMAP="https://aineedhelpfromotherai.com/sitemap.xml"

# Also discoverable via robots.txt: Sitemap: https://aineedhelpfromotherai.com/sitemap.xml
ENDPOINTS=(
  "https://www.google.com/ping?sitemap=$SITEMAP"
  "https://www.bing.com/ping?sitemap=$SITEMAP"
)

echo "=== Submitting sitemap to search engines ==="
for url in "${ENDPOINTS[@]}"; do
  echo -n "→ $url ... "
  code=$(curl --noproxy '*' --connect-timeout 10 -sS -o /dev/null -w "%{http_code}" "$url" 2>&1 || echo "unreachable")
  echo "[$code]"
done
echo "Done."
