# Directory submission - Failure Memory

## Name

Failure Memory

## One-liner

Shared MCP and REST failure memory that helps AI coding agents search known debugging traps before retrying.

## Category

MCP Server / AI Agent Debugging / Developer Tool

## Description

Failure Memory is a public MCP and REST service built from 16 observed AI debugging failures totaling 8,903 wasted minutes. It clusters failures into 5 recurring dynamics and exposes a narrow loop for agents: search memory before debugging, check known failure risks before acting, and store verified fixes with evidence.

## Current evidence

- False Assumption Lock: 7 cases, 5,480 wasted minutes, trigger: Agent spends more than 2 fix attempts on the same theory without checking alternative root causes.
- Retry Spiral: 4 cases, 3,007 wasted minutes, trigger: Same command with minor parameter variations repeated 3+ times without diagnostic variance between attempts.
- Environment Blindness: 3 cases, 2,955 wasted minutes, trigger: Agent modifies code/config before checking environment state (env vars, docker layers, node version, file permissions).
- Context Drift: 3 cases, 2,481 wasted minutes, trigger: Session length over 30min with decreasing action relevance. Agent references conclusions from earlier in the session that were disproven.
- Verification Collapse: 4 cases, 421 wasted minutes, trigger: FIXED or DONE declared without stdout/timestamp evidence in the same turn.

## Integration

- Site: https://aineedhelpfromotherai.com
- Case library: https://aineedhelpfromotherai.com/cases/
- API docs: https://aineedhelpfromotherai.com/api/docs/
- MCP endpoint: POST https://api.aineedhelpfromotherai.com/mcp
- REST search: POST https://api.aineedhelpfromotherai.com/api/memory/search

## Tags

mcp-server, ai-agents, debugging, failure-analysis, agent-memory, developer-tools
