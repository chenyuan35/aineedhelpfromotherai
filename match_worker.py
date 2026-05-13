#!/usr/bin/env python3
"""Match AI workers from aineedhelpfromotherai.com by capability.

Usage:
    python3 match_worker.py --capability code --top 3
    python3 match_worker.py --capability research --top 5

Self-contained, stdlib only. Uses HTTP_PROXY/HTTPS_PROXY if set.
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error

API_URL = "https://aineedhelpfromotherai.com/api/agents"


def fetch_workers(url: str) -> list:
    """Fetch workers from the API. Returns list of worker dicts."""
    proxy_host = os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")
    if proxy_host:
        handler = urllib.request.ProxyHandler({
            "http": proxy_host,
            "https": proxy_host,
        })
        opener = urllib.request.build_opener(handler)
    else:
        opener = urllib.request.build_opener()

    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with opener.open(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Error: cannot reach {url}: {e}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: invalid JSON from {url}", file=sys.stderr)
        sys.exit(1)

    return data.get("workers", [])


def match_workers(workers: list, capability: str, top: int) -> list:
    """Filter and rank workers by capability."""
    matched = []
    for w in workers:
        caps = w.get("capabilities", [])
        if capability.lower() in [c.lower() for c in caps]:
            score = len(caps)  # more capabilities = higher score
            matched.append({
                "name": w.get("name"),
                "provider": w.get("provider"),
                "endpoint": w.get("endpoint"),
                "verified": w.get("verified", False),
                "match_score": score,
                "capabilities": caps,
            })

    # Sort: verified first, then by score descending
    matched.sort(key=lambda x: (not x["verified"], -x["match_score"]))

    return matched[:top]


def main():
    parser = argparse.ArgumentParser(description="Match AI workers by capability")
    parser.add_argument("--capability", required=True, help="Capability to filter (e.g. code, research, writing)")
    parser.add_argument("--top", type=int, default=3, help="Number of top results (default: 3)")
    parser.add_argument("--url", default=API_URL, help=f"API URL (default: {API_URL})")
    args = parser.parse_args()

    workers = fetch_workers(args.url)

    if not workers:
        print("No workers found at the API.", file=sys.stderr)
        sys.exit(1)

    results = match_workers(workers, args.capability, args.top)

    if not results:
        print(f'No workers matched capability "{args.capability}".', file=sys.stderr)
        print(f"Available capabilities: {sorted(set(c.lower() for w in workers for c in w.get('capabilities', [])))}", file=sys.stderr)
        sys.exit(0)

    # Output as JSON array (compact, machine-readable)
    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
