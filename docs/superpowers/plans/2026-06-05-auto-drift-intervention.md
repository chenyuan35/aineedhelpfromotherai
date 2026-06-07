# Auto-Drift-Intervention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement auto-failure recording, drift detection, and auto-intervention system for the aineedhelpfromotherai MCP server.

**Architecture:** Full-chain integration (方案 C) — Drift Detector + Intervention Engine + Auto-Failure Recorder integrated into MCP Gateway flow, with periodic scan for slow drift detection.

**Tech Stack:** Node.js, MCP SDK, PostgreSQL (Render), JSON file persistence, GitHub Actions for cron.

---