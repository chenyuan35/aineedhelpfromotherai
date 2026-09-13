#!/usr/bin/env python3
"""Low-cost keyword discovery radar using public autocomplete endpoints."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import random
import re
import time
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path

UA = "Mozilla/5.0 (compatible; aineedhelp-keyword-radar/1.0)"
GOOGLE = "https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q={}"
BING = "https://api.bing.com/osjson.aspx?query={}"

INTENT_TERMS = {
    "reset", "calculator", "converter", "compress", "compressor", "resize",
    "resizer", "counter", "timer", "countdown", "checker", "generator",
    "estimator", "credits", "tokens", "quota", "limit", "usage",
}
REPEAT_TERMS = {"reset", "timer", "countdown", "daily", "weekly", "monthly", "credits", "quota", "usage", "limit", "status"}
IRRELEVANT = {
    "credit score", "credit repair", "credit report", "credit card", "credit bureau",
    "airpod", "fanduel", "crypto", "coin presale", "debt relief", "loan",
}

def normalize(text: str) -> str:
    text = re.sub(r"\s+", " ", text.strip().lower())
    return text.strip(" -–—.,:;!?\"'")


def fetch_json(url: str, timeout: float) -> object:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.load(response)


def suggestions(source: str, query: str, timeout: float) -> list[str]:
    url = (GOOGLE if source == "google" else BING).format(urllib.parse.quote(query))
    data = fetch_json(url, timeout)
    if not isinstance(data, list) or len(data) < 2 or not isinstance(data[1], list):
        return []
    return [normalize(str(item)) for item in data[1] if str(item).strip()]


def load_seeds(path: Path) -> list[str]:
    seeds = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            seeds.append(line)
    return seeds


def build_queries(seeds: list[str], now: dt.datetime) -> list[tuple[str, str]]:
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    start = now.timetuple().tm_yday % len(alphabet)
    rotating = [alphabet[(start + i) % len(alphabet)] for i in range(5)]
    queries: list[tuple[str, str]] = []
    for seed in seeds:
        base = normalize(seed)
        variants = [base, f"{base} reset", f"{base} reset time", f"when does {base} reset", f"when do {base} reset"]
        variants.extend(f"{base} {letter}" for letter in rotating)
        seen = set()
        for query in variants:
            query = normalize(query)
            if query and query not in seen:
                seen.add(query)
                queries.append((base, query))
    return queries


def is_relevant(phrase: str) -> bool:
    if any(term in phrase for term in IRRELEVANT):
        return False
    words = phrase.split()
    if len(words) < 2 or len(words) > 14:
        return False
    return any(term in words or term in phrase for term in INTENT_TERMS)


def score_phrase(phrase: str, sources: set[str], origins: set[str], is_new: bool) -> int:
    words = set(phrase.split())
    score = len(sources) * 12 + min(len(origins) * 2, 12)
    score += min(sum(6 for term in INTENT_TERMS if term in words or term in phrase), 30)
    score += min(sum(5 for term in REPEAT_TERMS if term in words or term in phrase), 25)
    if phrase.startswith(("when ", "how ", "what ")):
        score += 5
    if is_new:
        score += 8
    if 3 <= len(words) <= 8:
        score += 4
    return score


def read_state(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, OSError):
        return {}


def write_json(path: Path, value: object) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def render_markdown(payload: dict) -> str:
    rows = payload["candidates"][:60]
    out = [
        "# Keyword Radar — Latest",
        "",
        f"Generated: {payload['generated_at']}",
        f"Queries attempted: {payload['queries_attempted']}",
        f"Successful source requests: {payload['requests_ok']} / {payload['requests_total']}",
        "",
        "Scores are discovery heuristics, not search-volume estimates. Validate winners with SEO metrics/Search Console before mass publishing.",
        "",
        "| Score | New | Query | Sources | Seed signals |",
        "|---:|:---:|---|---|---:|",
    ]
    for item in rows:
        phrase = item["phrase"].replace("|", "\\|")
        out.append(f"| {item['score']} | {'yes' if item['new'] else ''} | {phrase} | {', '.join(item['sources'])} | {item['origin_count']} |")
    return "\n".join(out) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--seeds", type=Path, default=Path(__file__).with_name("seeds.txt"))
    parser.add_argument("--data-dir", type=Path, default=Path("/var/lib/aineedhelp-radar"))
    parser.add_argument("--timeout", type=float, default=8.0)
    parser.add_argument("--max-queries", type=int, default=0, help="0 means all generated queries")
    parser.add_argument("--sleep", type=float, default=0.12)
    args = parser.parse_args()

    now = dt.datetime.now(dt.timezone.utc)
    seeds = load_seeds(args.seeds)
    queries = build_queries(seeds, now)
    if args.max_queries > 0:
        queries = queries[: args.max_queries]

    args.data_dir.mkdir(parents=True, exist_ok=True)
    reports_dir = args.data_dir / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    state_path = args.data_dir / "seen.json"
    state = read_state(state_path)

    found: dict[str, dict[str, set[str]]] = defaultdict(lambda: {"sources": set(), "origins": set()})
    requests_ok = 0
    requests_total = 0
    errors: list[str] = []

    for origin, query in queries:
        for source in ("google", "bing"):
            requests_total += 1
            try:
                items = suggestions(source, query, args.timeout)
                requests_ok += 1
                for phrase in items:
                    if is_relevant(phrase):
                        found[phrase]["sources"].add(source)
                        found[phrase]["origins"].add(origin)
            except Exception as exc:
                errors.append(f"{source}: {query}: {type(exc).__name__}: {str(exc)[:120]}")
            if args.sleep > 0:
                time.sleep(args.sleep + random.random() * args.sleep)

    generated = now.isoformat().replace("+00:00", "Z")
    candidates = []
    for phrase, meta in found.items():
        old = state.get(phrase, {})
        is_new = not bool(old)
        sources = sorted(meta["sources"])
        origins = sorted(meta["origins"])
        candidates.append({
            "phrase": phrase,
            "score": score_phrase(phrase, set(sources), set(origins), is_new),
            "new": is_new,
            "sources": sources,
            "origin_count": len(origins),
            "origins": origins,
        })
        state[phrase] = {
            "first_seen": old.get("first_seen", generated),
            "last_seen": generated,
            "runs_seen": int(old.get("runs_seen", 0)) + 1,
        }

    candidates.sort(key=lambda item: (-item["score"], item["phrase"]))
    payload = {
        "generated_at": generated,
        "queries_attempted": len(queries),
        "requests_ok": requests_ok,
        "requests_total": requests_total,
        "errors": errors[:40],
        "candidates": candidates[:300],
    }

    stamp = now.strftime("%Y%m%dT%H%M%SZ")
    report_path = reports_dir / f"{stamp}.json"
    write_json(report_path, payload)
    write_json(args.data_dir / "latest.json", payload)
    write_json(state_path, state)
    (args.data_dir / "latest.md").write_text(render_markdown(payload), encoding="utf-8")

    print(f"keyword-radar: {len(candidates)} candidates, {requests_ok}/{requests_total} requests OK")
    print(f"latest: {args.data_dir / 'latest.md'}")
    if errors:
        print(f"warnings: {len(errors)} request errors (see latest.json)")
    return 0 if requests_ok else 2


if __name__ == "__main__":
    raise SystemExit(main())
