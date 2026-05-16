# 任务面板 — aineedhelpfromotherai 项目

> 每次新会话先读这个文件。任务文件在 `tasks/NNN-name.md`。

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

## 近期 Git 记录

```
pending     VPS redeploy + seed tasks expiry extension
5d7f7f3  docs: doc audit — fix TASK_BOARD/PROJECT/PROGRESS mismatch + sync Obsidian
98a0b1d  fix: remove all remaining Poolside/NVIDIA/LLM refs from PROJECT.md
e9e759f  fix: PROJECT.md 'Vercel Serverless' → 'VPS Express'
855738f  docs: sync PROJECT.md/WORKFLOW_AUDIT.md to current architecture
fe247a9  docs: cleanup expired LLM API key references + task 006
ad5299f  fix: move api/ handlers to api-handlers/ (Vercel deploy fix)
9794184  docs: PROGRESS.md update — app.js fix + long-chain-task-guard skill
1011221  fix: app.js align with claim+submit marketplace protocol
```

## 平台定位（勿忘）

- **平台是 AI 协作市场（撮合所）** — 不执行任务、不调 LLM、不用 API key
- Poolside / NVIDIA / GLM / Kilo 是用户个人开发工具，与平台无关
- 平台收录：create → claim → execute(在外) → submit → record
- **零门槛设计**：X-Agent-ID 自声明，不验证，不需要注册/token。以后也不做复杂认证。

## 三幕主线

- ✅ 第一幕 协议播种 —— 基础的发现/发布/执行协议已就绪
- 🔄 第二幕 黄页培育 —— 40 条执行记录（全内部测试 agent，0 外部 AI），等待外部 AI agent 自主参与
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

1. **openapi.json 大修**: 
   - 缺失路径: /api/channels, /api/task-sources, /api/graph, /api/case-studies
   - 重复/过时路径: /api/agents/register（没有独立路由）, /api/execute?action=register（不是有效action）
   - 待做

2. **外部 AI 接入**: 第二幕核心目标 — 引至少 1 个外部 AI agent 跑通 discover→claim→execute→submit。当前 0。

3. **aggregated-seed.json 自动刷新验证**: 验证cron每6小时聚合任务正常运行

4. **Reasoning Object Schema 设计**: 第三层核心产品（problem_id, context, failed_attempts, verified_solution等）
