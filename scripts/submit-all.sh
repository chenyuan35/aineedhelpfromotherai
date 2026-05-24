#!/usr/bin/env bash
set -euo pipefail

# ==============================================================
# submit-all.sh — Automated MCP Directory Submission Script
# ==============================================================
# Checks status of all existing submissions and provides commands
# to submit to directories that aren't yet listed.
#
# Usage:
#   ./scripts/submit-all.sh              # Status check only
#   ./scripts/submit-all.sh --submit     # Attempt submissions
#   ./scripts/submit-all.sh --help       # This help
# ==============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SERVER_NAME="aineedhelpfromotherai"
SERVER_URL="https://api.aineedhelpfromotherai.com/mcp"
REPO="chenyuan35/aineedhelpfromotherai"
REPO_URL="https://github.com/$REPO"
DESCRIPTION="MCP server: 13 tools for AI task execution, reasoning cache, consensus layer, failure warnings, agent scorecards"
GLAMA_PR="6706"
MCPFIND_PR="46"

check_gh() {
  if ! command -v gh &>/dev/null; then
    echo -e "${RED}Error: 'gh' CLI not found. Install from https://cli.github.com/${NC}"
    return 1
  fi
  if ! gh auth status &>/dev/null; then
    echo -e "${RED}Error: 'gh' not authenticated. Run 'gh auth login' first.${NC}"
    return 1
  fi
}

check_pr_status() {
  local repo="$1" pr="$2" label="$3"
  local state
  state=$(gh pr view "$pr" --repo "$repo" --json state,title,url,createdAt 2>/dev/null | jq -r '.state // "unknown"')
  local created
  created=$(gh pr view "$pr" --repo "$repo" --json createdAt 2>/dev/null | jq -r '.createdAt // "?"' | cut -dT -f1)
  if [ "$state" = "OPEN" ]; then
    echo -e "  ${YELLOW}🟡 OPEN${NC} (since $created) — $label PR #$pr"
  elif [ "$state" = "MERGED" ]; then
    echo -e "  ${GREEN}✅ MERGED${NC} — $label PR #$pr"
  elif [ "$state" = "CLOSED" ]; then
    echo -e "  ${RED}❌ CLOSED${NC} — $label PR #$pr"
  else
    echo -e "  ${RED}❓ UNKNOWN ($state)${NC} — $label PR #$pr"
  fi
}

check_issue_status() {
  local repo="$1" issue="$2" label="$3"
  local state
  state=$(gh issue view "$issue" --repo "$repo" --json state,title,url 2>/dev/null | jq -r '.state // "unknown"')
  if [ "$state" = "OPEN" ]; then
    echo -e "  ${YELLOW}🟡 OPEN${NC} — $label Issue #$issue"
  elif [ "$state" = "CLOSED" ]; then
    echo -e "  ${GREEN}✅ CLOSED${NC} — $label Issue #$issue"
  else
    echo -e "  ${RED}❓ UNKNOWN${NC} — $label Issue #$issue"
  fi
}

check_url_status() {
  local url="$1" label="$2"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")
  if [ "$code" = "200" ] || [ "$code" = "301" ] || [ "$code" = "302" ]; then
    echo -e "  ${GREEN}✅ $code${NC} — $label"
  elif [ "$code" = "404" ]; then
    echo -e "  ${RED}❌ 404${NC} — $label"
  else
    echo -e "  ${YELLOW}🟡 $code${NC} — $label"
  fi
}

cmd_status() {
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  MCP Directory Submission Status${NC}"
  echo -e "${CYAN}  $(date -u '+%Y-%m-%d %H:%M UTC')${NC}"
  echo -e "${CYAN}  Server: $SERVER_URL${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
  echo ""

  echo -e "${BLUE}── Directory Status ──${NC}"
  check_url_status "https://api.aineedhelpfromotherai.com/mcp/health" "Server Health Check"
  echo ""

  echo -e "${BLUE}── PR Submissions ──${NC}"
  if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
    check_pr_status "punkpeye/awesome-mcp-servers" "$GLAMA_PR" "Glama/awesome-mcp-servers"
    check_pr_status "MCPFind/mcp-find" "$MCPFIND_PR" "MCPFind"
  else
    echo -e "  ${YELLOW}gh CLI not available — skipping PR checks${NC}"
    echo -e "  Glama PR #$GLAMA_PR: https://github.com/punkpeye/awesome-mcp-servers/pull/$GLAMA_PR"
    echo -e "  MCPFind PR #$MCPFIND_PR: https://github.com/MCPFind/mcp-find/pull/$MCPFIND_PR"
  fi
  echo ""

  echo -e "${BLUE}── Issue Submissions ──${NC}"
  if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
    check_issue_status "cline/mcp-marketplace" "1647" "Cline Marketplace"
    check_issue_status "chatmcp/mcp-directory" "2479" "MCP.so"
  else
    echo -e "  Cline Marketplace Issue #1647: https://github.com/cline/mcp-marketplace/issues/1647"
    echo -e "  MCP.so Issue #2479: https://github.com/chatmcp/mcp-directory/issues/2479"
  fi
  echo ""

  echo -e "${BLUE}── Registry URLs ──${NC}"
  check_url_status "https://glama.ai/mcp/servers/chenyuan35/aineedhelpfromotherai" "Glama page"
  check_url_status "https://smithery.ai/servers/chenyuan19920509/aineedhelpfromotherai" "Smithery page"
  check_url_status "https://registry.modelcontextprotocol.io/v0.1/api/servers/io.github.chenyuan35%2Freasoning-commons" "Official Registry"
  echo ""

  echo -e "${BLUE}── Remaining Directories (not yet submitted) ──${NC}"
  echo -e "  ${YELLOW}⬜ ${NC} PulseMCP — https://pulsemcp.com/submit"
  echo -e "  ${YELLOW}⬜ ${NC} MCPize — https://mcpize.com/marketplace"
  echo -e "  ${YELLOW}⬜ ${NC} MCPFinder — https://mcpfinder.org/submit"
  echo -e "  ${YELLOW}⬜ ${NC} mcpservers.org — wong2/awesome-mcp-servers"
  echo ""

  echo -e "${BLUE}── Tool Count ──${NC}"
  local tool_count
  tool_count=$(node -e "
    const s = require('./mcp/schema.js');
    const names = Object.keys(s.TOOL_LIST || s).filter(k => k !== 'TOOL_LIST' && k !== 'TOOL_NAMES');
    const list = s.TOOL_LIST || [];
    console.log(list.length || names.length || '?');
  " 2>/dev/null || echo "?")
  echo -e "  Total MCP tools: ${CYAN}$tool_count${NC}"
  echo ""

  echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
}

cmd_submit_mcpfind() {
  echo -e "${BLUE}→ Submitting to MCPFind...${NC}"
  local tmpdir
  tmpdir=$(mktemp -d)
  git clone --depth=1 https://github.com/MCPFind/mcp-find.git "$tmpdir/mcp-find" 2>/dev/null || {
    echo -e "${YELLOW}  Skipping: couldn't clone MCPFind repo${NC}"
    return
  }
  cd "$tmpdir/mcp-find"
  if grep -q "aineedhelpfromotherai" community-servers.yml 2>/dev/null; then
    echo -e "${GREEN}  Already listed in community-servers.yml${NC}"
  else
    cat >> community-servers.yml << EOF

  - name: "AI-Need-Help Reasoning Commons"
    github_url: "$REPO_URL"
    package_name: "aineedhelpfromotherai"
    description: "MCP server with 13 tools for AI task execution, reasoning cache, consensus layer, failure warnings, and agent scorecards."
    package_type: "docker"
    category: "developer-tools"
EOF
    git add community-servers.yml
    git commit -m "Add AI-Need-Help MCP server"
    git push origin main 2>/dev/null && {
      gh pr create --repo MCPFind/mcp-find \
        --title "Add: AI-Need-Help MCP Server (aineedhelpfromotherai)" \
        --body "Adding the AI-Need-Help Reasoning Commons MCP server.

**Name**: AI-Need-Help MCP Server
**GitHub**: $REPO_URL
**Endpoint**: $SERVER_URL
**Description**: MCP server with 13 tools for AI task execution, reasoning cache, consensus layer, failure warnings, and agent scorecards.

This server provides a reasoning cache (resolve before compute), failure early warning system (check before execute), and agent scorecards with leaderboard." \
        --base main || echo -e "${YELLOW}  PR may already exist${NC}"
    }
  fi
  rm -rf "$tmpdir"
}

cmd_submit_awesome() {
  echo -e "${BLUE}→ Submitting to punkpeye/awesome-mcp-servers...${NC}"
  local tmpdir
  tmpdir=$(mktemp -d)
  git clone --depth=1 https://github.com/punkpeye/awesome-mcp-servers.git "$tmpdir/awesome" 2>/dev/null || {
    echo -e "${YELLOW}  Skipping: couldn't clone repo${NC}"
    return
  }
  cd "$tmpdir/awesome"
  local fork_url
  fork_url=$(gh repo fork --remote 2>/dev/null | head -1 || true)
  local entry="  - [AI-Need-Help Reasoning Commons](https://github.com/chenyuan35/aineedhelpfromotherai) 📇 - MCP server for AI task execution, reasoning cache, consensus layer, and agent scorecards."
  if grep -q "chenyuan35/aineedhelpfromotherai" README.md 2>/dev/null; then
    echo -e "${GREEN}  Already listed in README.md${NC}"
  else
    sed -i "/^## Server Implementations/a\\$entry" README.md
    git add README.md
    git commit -m "Add Reasoning Commons MCP server (Knowledge & Memory)"
    git push origin main 2>/dev/null && {
      gh pr create --repo punkpeye/awesome-mcp-servers \
        --title "Add Reasoning Commons MCP server (Knowledge & Memory)" \
        --body "$(cat tasks/awesome-mcp-servers-pr.md 2>/dev/null || echo "Adding aineedhelpfromotherai MCP server")" \
        --base main || echo -e "${YELLOW}  PR may already exist${NC}"
    }
  fi
  rm -rf "$tmpdir"
}

cmd_submit() {
  if ! check_gh; then
    echo -e "${RED}Cannot submit without 'gh' CLI.${NC}"
    exit 1
  fi
  cmd_submit_mcpfind
  echo ""
  cmd_submit_awesome
  echo ""
  echo -e "${YELLOW}Note: PulseMCP, MCPize, MCPFinder require web forms (browser).${NC}"
  echo -e "${YELLOW}  PulseMCP: https://pulsemcp.com/submit${NC}"
  echo -e "${YELLOW}  MCPize:   https://mcpize.com/marketplace${NC}"
  echo -e "${YELLOW}  MCPFinder: https://mcpfinder.org/submit${NC}"
}

case "${1:-}" in
  --submit|-s)
    cmd_status
    echo ""
    cmd_submit
    ;;
  --help|-h)
    echo "Usage: $0 [--submit|--status|--help]"
    echo ""
    echo "  (no args)   Show submission status dashboard"
    echo "  --submit    Attempt automated submissions to unlisted directories"
    echo "  --help      Show this help"
    ;;
  *)
    cmd_status
    ;;
esac
