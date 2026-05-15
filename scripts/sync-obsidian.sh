#!/bin/bash
# sync-obsidian.sh — 自动同步 repo 核心文档到 ObsidianVault
# 每次改完 PROGRESS/PROJECT 后运行一次即可
set -euo pipefail

VAULT="/home/yuan/ObsidianVault/项目笔记"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
DRIFT=0

# 映射: repo文件 → Obsidian文件
declare -A MAP=(
  ["$REPO/PROJECT.md"]="$VAULT/aineedhelpfromotherai-PROJECT.md"
  ["$REPO/PROGRESS.md"]="$VAULT/aineedhelpfromotherai-进度.md"
  ["$REPO/tasks/TASK_BOARD.md"]="$VAULT/TASK_BOARD.md"
  ["$REPO/COLLABORATION.md"]="$VAULT/COLLABORATION.md"
  ["$REPO/CASE_STUDY.md"]="$VAULT/CASE_STUDY.md"
  ["$REPO/MAINLINE_AUDIT.md"]="$VAULT/MAINLINE_AUDIT.md"
  ["$REPO/WORKFLOW_AUDIT.md"]="$VAULT/WORKFLOW_AUDIT.md"
  ["$REPO/CANONICAL-SCHEMA.md"]="$VAULT/CANONICAL-SCHEMA.md"
)

sync_one() {
  local src="$1" dst="$2"
  if [[ ! -f "$src" ]]; then
    echo "  ⚠ MISSING: $src (源文件不存在)"
    return 0
  fi
  if [[ ! -f "$dst" ]]; then
    cp "$src" "$dst"
    echo "  + NEW: $(basename "$dst")"
    DRIFT=1
  elif [[ "$src" -nt "$dst" ]]; then
    cp "$src" "$dst"
    echo "  ↻ SYNC: $(basename "$dst") (repo newer)"
    DRIFT=1
  else
    echo "  ✓ OK: $(basename "$dst")"
  fi
}

echo "=== docs-sync: $REPO → $VAULT ==="
for src in "${!MAP[@]}"; do
  sync_one "$src" "${MAP[$src]}"
done

# 检查是否有 repo 有但 vault 没有的额外文件（孤儿检测）
for vault_file in "$VAULT"/*.md; do
  name=$(basename "$vault_file")
  found=0
  for dst in "${MAP[@]}"; do
    [[ "$(basename "$dst")" == "$name" ]] && found=1 && break
  done
  if [[ $found -eq 0 ]]; then
    echo "  ? ORPHAN: $name (在 vault 中但不在映射表里)"
  fi
done

echo "=== $([ $DRIFT -eq 0 ] && echo '全部同步，无漂移' || echo '同步完成') ==="
exit $DRIFT
