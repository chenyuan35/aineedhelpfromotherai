# 任务面板 — aineedhelpfromotherai 项目

> 每次新会话先读这个文件。已完成任务详情已归档到 PROGRESS.md。

## 总览

| # | 任务 | 状态 | 验证方式 | 最后更新 |
|---|------|------|---------|---------|
| 001 | Agent Card (A2A 标准) | ✅ 完成 | `curl .../.well-known/agent-card.json` → 200, skills=5 | 05-16 |
| 002 | llms.txt Entry Protocol 审计 | ✅ 完成 | 6/6 checklist 项通过 | 05-16 |
| 003 | openapi.json 路径补全 | ✅ 完成 | 18 paths (要求≥13) | 05-16 |
| 004 | AI 种子用户跑通全链路 | ✅ 完成 | 40 execs, 85% 成功率 | 05-16 |
| 005 | 记录 Case Study | ✅ 完成 | api-handlers/case-studies.js deployed, online 200 | 05-16 |
| 006 | 清理过期 LLM API Key 引用 | ✅ 完成 | PROJECT.md 0 处、.env 干净 | 05-16 |
| 007 | 文档审计与同步 — 对齐实际代码 | ✅ 完成 | 实际代码 vs 文档差异全部修正并同步 | 05-16 |
| 008 | VPS SSH 密钥配置 | ✅ 完成 | id_ed25519 密钥认证通过，无需密码 | 05-16 |
| 009 | VPS 重新部署 | ✅ 完成 | Node.js 18 + Nginx SSL + PM2 + PG14 全链路验证 | 05-16 |
| 010 | 种子任务续期 | ✅ 完成 | expires_at 2026-05-30 → 2026-06-30 (20条) | 05-16 |
| 011 | openapi.json 大修 | ✅ 完成 | v1.3.0, 22 paths (新增 channels/task-sources/graph/case-studies) | 05-16 |
| 012 | 外部 AI 接入四管齐下 | 🔄 进行中 | GitHub Issue #1 + llms.txt优化 + 目录提交 | 05-16 |
| 013 | 代码审计修复 12 项 | ✅ 完成 | node require 全部通过，validate 逻辑验证 | 05-16 |
| 014 | 修复聚合 cron | ✅ 完成 | last_fetched 回到当前时间 | 05-16 |
| 015 | 增加 3 个聚合源 (HN/ArXiv/GitLab) | ✅ 完成 | 37+ posts, 6 sources | 05-16 |
| 016 | 聚合后自动清洗（付费墙/低质量） | ✅ 完成 | quality_filter 过滤 5 类低质量 | 05-16 |
| 017 | 增加结构化字段 (estimated_tokens + capabilities) | ✅ 完成 | 9 种 capabilities 自动推断 | 05-16 |
| 018 | 提交 awesome-ai-agents PR | ✅ 完成 | PR #259 已提交 | 05-16 |
| 019 | 提交 awesome-mcp-servers | ❌ 跳过 | 平台不是 MCP Server（第三幕才做） | 05-16 |
| 020 | 刷新 ai-semantic HTML 数据 | ✅ 完成 | HTML + llms.txt 已更新 6 sources + metadata | 05-16 |
| 021 | /api/graph 数据填充 | ✅ 完成 | 20 nodes, 36 edges, 4 types, 6 relationships | 05-16 |
| 022 | Reasoning Object Schema 设计 | ✅ 完成 | 完整 schema + failure taxonomy + API 设计 | 05-16 |
| 023 | Reasoning Object API 实现 | ✅ 完成 | PG 表 + reasoning.js + 4 endpoints + VPS 部署 | 05-16 |
| 024 | openapi.json v1.4.0 | ✅ 完成 | 26 paths (新增 /api/reasoning + schemas) | 05-16 |
| 025 | execute.js 集成 structured_reasoning | ✅ 完成 | submit 自动创建 RO, E2E 验证通过 | 05-16 |
| 026 | llms.txt 更新 — Reasoning API 说明 | ✅ 完成 | 新增 6 endpoints + structured_reasoning 示例 | 05-16 |
| 027 | PROJECT.md 更新 — 反映 Reasoning Object 完成 | ✅ 完成 | 三层路线图 ✅, API 矩阵 18→24 端点 | 05-16 |
| 028 | 线上体验修复 — 6 项用户视角问题 | ✅ 完成 | can_claim_reason + openapi 枚举修正 + registry 渲染 + 去重 + 外部任务说明 | 05-17 |
| 029 | Self-improving meta tasks + llms.txt 重写 | ✅ 完成 | 3 条 meta tasks 入库 + llms.txt 重写 + origin=local 过滤器修复 + posts.js JSONB bug 修复 | 05-17 |
| 030 | 提交到 AI agent 目录 | ✅ 完成 | Agentry 注册成功 (3ad31b2ccc44) + PR #259 待合并 + agentrolodex.com 500 待恢复 | 05-17 |

## 近期 Git 记录

```
5587c3c  feat: external AI access — 4-prong strategy
b006393  feat: openapi.json v1.3.0 — add channels/task-sources/graph/case-studies
d901709  fix: VPS redeploy + seed tasks expiry extension to 2026-06-30
b462b23  docs: record 2026-05-16 cleanup, automation, and claude-mem fix
db0e341  chore: deduplicate docs, add sync automation (script + hook + CLAUDE.md)
b983c45  docs: update task 005 status + TASK_BOARD.md sync
34df4ba  feat: /api/case-studies endpoint (Task 005-001)
5c1994d  fix: update all 6 task files with real completion + create TASK_BOARD.md
98a0b1d  fix: remove all remaining Poolside/NVIDIA/LLM refs from PROJECT.md
855738f  docs: sync PROJECT.md/WORKFLOW_AUDIT.md to current architecture
ad5299f  fix: move api/ handlers to api-handlers/
1011221  fix: app.js align with claim+submit marketplace protocol
```

## 平台定位（勿忘）

- **平台是 AI 协作市场（撮合所）** — 不执行任务、不调 LLM、不用 API key
- Poolside / NVIDIA / GLM / Kilo 是用户个人开发工具，与平台无关
- 平台收录：create → claim → execute(在外) → submit → record
- **零门槛设计**：X-Agent-ID 自声明，不验证，不需要注册/token。以后也不做复杂认证。

## 三幕主线

- ✅ 第一幕 协议播种 —— 基础的发现/发布/执行协议已就绪
- 🔄 第二幕 黄页培育 —— 10 条本地可 claim 任务（3 条 meta + 7 条 seed），4 条执行记录（全内部测试），0 外部 AI
- ⬜ 第三幕 编排引擎 —— 待第二幕跑通后启动

## 实际代码状态 vs 文档差异（已修复）

| 文档名 | 原来错的 | 实际正确状态 |
|--------|---------|-------------|
| PROJECT.md L60 | `[ ] 前端对齐新协议 (app.js 仍用旧格式)` | ✅ 已修复 (2026-05-15, commit 1011221) |
| PROJECT.md L100 | `[ ] 真实 agent 行为数据积累` | ⚠️ 40条记录但0外部AI |
| PROJECT.md L146 | `[ ] canonical 数据收敛` 列为进行中 | ✅ route.js+execute.js 已使用 canonical-models |
| PROJECT.md L147 | `[ ] X-Agent-ID 认证机制` 列为进行中 | 🚫 零门槛设计选择, 不做认证 |
| PROJECT.md L117 | "17 endpoints" | 实际 14 个 unique API base path |
| TASK_BOARD.md #3 | "文档同步: 可自动化" | ✅ 已自动化 (sync-obsidian.sh) |
| openapi.json | 缺少 /api/channels, task-sources, graph, case-studies | 有 18 个 path 但部分过时 |

## 已知未完成（下次可做）

1. **0 外部 AI 执行 — 核心卡点**: 基础设施已完备（claim/submit/reasoning/graph/manifest/llms.txt/openapi/agent-card），但无外部 AI 走通闭环。策略：self-improving meta tasks（完成 = 改善平台可发现性 = 降低下次发现门槛）。

2. **AI agent 目录提交状态**:
   - ✅ **Agentry**: 已注册 (ID: 3ad31b2ccc44), category=Operations & Workflow, a2a_support=Yes, 等待 trust score 扫描
   - ⏳ **PR #259** (awesome-ai-agents-2026): OPEN, 创建于 2026-05-16, 待合并
   - ❌ **agentrolodex.com**: 500 错误，站点不可用，待恢复后重试

3. **aggregated-seed.json 自动刷新验证**: 验证cron每6小时聚合任务正常运行

4. **Reasoning Object Schema 设计**: ✅ 已完成 — tasks/reasoning-object-schema.md + CANONICAL-SCHEMA.md 已更新

5. **/api/graph 数据填充**: ✅ 已完成 — 20 nodes (platform/workers/sources/protocols), 36 edges (implements/aggregates/registered_worker/can_execute)

6. **Reasoning Object API 实现**: ✅ 已完成 — lib/reasoning-storage.js + api-handlers/reasoning.js + PG reasoning_objects 表 + 4 endpoints (search/stats/failures/CRUD)

7. **posts.js JSONB bug**: ✅ 已修复 — tags 数组插入时需 JSON.stringify()
