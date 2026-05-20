# 任务面板 — aineedhelpfromotherai 项目

> 每次新会话先读这个文件。已完成任务已归档。
> 当前阶段：**System Observer + Protocol Stabilizer** — 系统已可观察。不再是"做功能"阶段，而是"让系统可理解"阶段。

## 平台定位（勿忘）

- **平台是 AI runtime interaction protocol** — 不是网站，不是 API 代理。定义 AI→AI 交互的 protocol surface。
- **零门槛设计**：X-Agent-ID 自声明，不验证，不需要注册/token。以后也不做复杂认证。
- **三幕主线**：第一幕 ✅ 播种 → 第二幕 🔄 竞技场培育（当前） → 第三幕 ⬜ 编排引擎
- **当前不做**：扩任务系统、扩生态叙事、增长优化、定义"谁来"

---

## 当前焦点：可观察性 + 稳定性

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 101 | **Execution Lifecycle Formalization** | ✅ 完成 | PROTOCOL.md + gateway.js 时间校验 |
| 102 | **MCP Usage Log Formalization** — GET /mcp/usage | ✅ 完成 | 任意 tool call 后有记录 |
| 103 | **Idempotency & Dedup 硬化** | ✅ 完成 | claim 幂等 + submit dedup + 表名 bug 修复 |
| 104 | **Schema Freeze v0.1** — 代码级 append-only | ✅ 完成 | mcp/schema.js Object.freeze |
| 105 | **Agent Behavior Report** — runtime 分类、行为聚类、tool sequence、failure 分布 | ✅ 完成 | `scripts/behavior-report.js` + `GET /api/behavior` |
| — | **种子数据注入** — 7 条 MCP + 8 条 REST API traces | ✅ 完成 | mcp_usage: 93 条, exec_history: 39 条 |

---

## 已知需跟踪

| # | 项目 | 状态 | 备注 |
|---|------|------|------|
| — | GITHUB_TOKEN 已激活 | ✅ | .env.vps 已设置，aggregate cron 内联提取 |
| — | 59% unknown runtime | ⬜ 数据质量 | 无 User-Agent 的历史流量残留 |
| — | Duplicate rate via API 不可计算 | ⬜ 需改进 | result 字段不在 list 查询中 |
| — | 40 seed tasks DB 状态与 seed 文件不同步 | ⬜ 不急 | 不重要 cached 数据 |

---

## 已完成任务（历史归档）

所有 55 条已完成任务详情见 PROGRESS.md。关键里程碑：

- 001-011: 协议播种（A2A 卡、llms.txt、openapi、VPS、种子任务）
- 012-020: 外部 AI 接入 + 聚合源（GitHub/HN/ArXiv/GitLab）
- 021-027: Reasoning Object（schema + API + execute 集成）
- 028-030: 线上修复 + meta tasks + 目录提交
- 031-042: 首个外部 AI + 安全测试 + toku.agency
- 043-044: Proving Ground + 入口对齐
- 046-055: MCP Gateway + 限流 + 协议硬化前置

---

## 每日维护管道（已就绪）

| 频率 | 脚本 | 作用 |
|------|------|------|
| 每 5 分钟 | `auto-update.sh` | Git pull + pm2 restart |
| 每 4 小时 | `generate-tasks.js` | 创建 5 个新鲜可 claim 本地任务 |
| 每 6 小时 | `aggregate.js` + `sync-seeds.js` | 拉取外部任务到 DB |
| 每 10 分钟 | `task-recovery.js` (内置) | 过期 claim 回收 + 过期 post 标记 |
| 每天 04:00 | `curl /api/cleanup` | 深度清理 |
| 每 12 小时 | `behavior-report.js` | 平台用量报告 |

---

## 当前阶段判断

系统已有外部 agent 交互（0xA672 等），但协议仍不稳定。

### 核心风险

- **double-submit**: 同一 execution 可能被多次提交（#045）
- **retry 不安全**: 非幂等操作重试导致状态污染
- **schema 漂移**: 工具名或 response shape 更改会 crash 外部 runtime
- **不可观测**: runtime operator 没有自服务监控入口
- **workload supply**: 任务池质量 + 持续性是日活的前提（新增关注）

### 当前允许

- **Generator 写 DB 创建任务**: 数据层操作，不涉及协议面，不影响现有 schema
- **metrics 扩展 workload 段**: 不新增 endpoint，扩展现有 response
- **aggregate.js 过滤增强**: 只改脚本逻辑，不改 schema

### 什么不做（当前）

- 不加新工具（第 5 个 MCP tool）
- 不加新 API endpoint
- 不发布到更多目录
- 不编排引擎

### 当前等待

- 24-72h 数据积累 → task_type performance model 置信度提升 → 决定 generator 优先级

---

## Commit History

```
63881d5  fix: align all AI-facing entry points to Proving Ground positioning
d6711d0  feat: Agent Proving Ground — leaderboard + scorecard + llms.txt rewrite
2829973  docs: add auto-test script reference to llms.txt Security Testing section
1700efc  chore: add auto security test script for external AI use
```

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
