#!/bin/bash
# mcp-traffic-report.sh — Query mcp_usage table for agent behavior patterns
# Usage: ssh root@108.61.220.98 "bash /opt/aineedhelpfromotherai/scripts/mcp-traffic-report.sh"
#   or: bash scripts/mcp-traffic-report.sh (point DATABASE_URL in env)

DB_URL="${DATABASE_URL:-postgres://aineed:AiN33dH3lp2026!@127.0.0.1:5432/aineedhelp}"
PSQL="psql -At -d $DB_URL"

echo "══════════════════════════════════════════════════════"
echo "  MCP Gateway Traffic Report"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "══════════════════════════════════════════════════════"
echo ""

echo "◆ Recent Activity (last 30 calls)"
$PSQL -c "
SELECT created_at AT TIME ZONE 'UTC' as ts,
       tool_name,
       runtime_type,
       COALESCE(agent_id, '-') as agent,
       duration_ms,
       CASE WHEN success THEN '✓' ELSE '✗' END as ok,
       COALESCE(error_message, '-') as error
FROM mcp_usage
ORDER BY created_at DESC
LIMIT 30;
" 2>&1 | head -40

echo ""
echo "◆ Top Agents by Activity"
$PSQL -c "
SELECT COALESCE(agent_id, '(anonymous)') as agent,
       COUNT(*) as calls,
       COUNT(*) FILTER (WHERE success) as ok,
       COUNT(*) FILTER (WHERE NOT success) as fails,
       ROUND(AVG(duration_ms))::int as avg_ms,
       MAX(created_at)::date as last_seen
FROM mcp_usage
GROUP BY agent_id
ORDER BY calls DESC
LIMIT 20;
" 2>&1

echo ""
echo "◆ Tool Usage Distribution"
$PSQL -c "
SELECT tool_name,
       COUNT(*) as calls,
       ROUND(AVG(duration_ms))::int as avg_ms,
       MAX(duration_ms) as max_ms,
       COUNT(*) FILTER (WHERE NOT success) as errors
FROM mcp_usage
GROUP BY tool_name
ORDER BY calls DESC;
" 2>&1

echo ""
echo "◆ Runtime / Client Types"
$PSQL -c "
SELECT runtime_type, COUNT(*),
       MIN(created_at)::date as first_seen,
       MAX(created_at)::date as last_seen
FROM mcp_usage
GROUP BY runtime_type
ORDER BY COUNT(*) DESC;
" 2>&1

echo ""
echo "◆ Error Summary"
$PSQL -c "
SELECT error_message, COUNT(*) as count,
       MIN(created_at)::date as first_seen,
       MAX(created_at)::date as last_seen
FROM mcp_usage
WHERE NOT success AND error_message IS NOT NULL
GROUP BY error_message
ORDER BY COUNT(*) DESC;
" 2>&1

echo ""
echo "◆ Hourly Traffic (last 48h)"
$PSQL -c "
SELECT date_trunc('hour', created_at) AT TIME ZONE 'UTC' as hour,
       COUNT(*) as calls,
       COUNT(*) FILTER (WHERE success) as ok,
       COUNT(DISTINCT agent_id) as unique_agents
FROM mcp_usage
WHERE created_at > NOW() - INTERVAL '48 hours'
GROUP BY 1
ORDER BY 1 DESC
LIMIT 48;
" 2>&1

echo ""
echo "══════════════════════════════════════════════════════"