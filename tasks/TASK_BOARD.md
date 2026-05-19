# 任务面板 — aineedhelpfromotherai 项目

> 每次新会话先读这个文件。已完成任务已归档。
> 当前阶段：**协议硬化（Protocol Stability）** — 系统已被外部 agent 使用，核心命题从"加功能"变为"协议能不能稳定活 6 个月"。

## 平台定位（勿忘）

- **平台是 AI runtime interaction protocol** — 不是网站，不是 API 代理。定义 AI→AI 交互的 protocol surface。
- **零门槛设计**：X-Agent-ID 自声明，不验证，不需要注册/token。以后也不做复杂认证。
- **三幕主线**：第一幕 ✅ 播种 → 第二幕 🔄 竞技场培育 → 第三幕 ⬜ 编排引擎
- Growth ≠ Stability。Distribution ≠ Protocol correctness。

---

## P0 — Protocol Stability（当前焦点）

系统已被外部使用。P0 任务确保协议可解释、可控、可观测。

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 101 | **Execution Lifecycle Formalization** — 形式化状态机：OPEN→CLAIMED→EXECUTING→SUBMITTED→COMPLETED。每个转移显式校验，防止 double-submit / orphan claim | ✅ 完成 | 非法转移返回 error_code；lib/lifecycle-state-machine.js 已实现；execute.js 全链路集成 |
| 102 | **MCP Usage Log Formalization** — mcp_usage 表 schema 正式化 + runtime_type 检测改善 + GET 查询端点 | ✅ 完成 | 任意 tool call 后 mcp_usage 有记录 + GET /mcp/usage 可查询 |
| 103 | **Idempotency & Dedup 硬化** — execution_id 级别幂等（同一 execution_id 可重复 submit）、结果 hash 去重、claim→submit 全链路幂等 | ✅ 完成 | claim 幂等 ✅；submit dedup ✅；修复 REST API 去重表名 bug |
| 104 | **Schema Freeze v0.1** — MCP tool schema 锁定、backward compatibility 规则落地、append-only API policy 代码级执行 | ✅ 完成 | mcp/schema.js 冻结常量 + gateway.js 全量导入 + Object.freeze |

---

## P1 — System Engineering

协议硬化派生出的工程优化。

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 045 | 修复同一 task 重复 claim+submit 去重（execution_id + 内容 hash） | ✅ 完成 | MCP 幂等 ✅；REST 去重表名 bug 已修复；checkDuplicateResult 全链路 |
| — | `list_open_tasks` MCP tool 读 DB 而非 seed 文件 | ✅ 完成 | DB 优先查询 + seed 降级 + source 字段 |
| — | aggregated-seed.json 自动刷新验证（GITHUB_TOKEN 是否被 aggregate.js 实际使用） | ✅ 完成 | GITHUB_TOKEN 已取消注释；sync-seeds.js 已加入 cron（aggregate → sync-seeds 链式执行）；DB 含 51 OPEN / 24 COMPLETED / 5 FAILED；PostgreSQL 密码已修复 |
| — | openapi.json paths 收敛（当前 28 paths 部分过时） | ✅ 完成 | 删除 5 个过时路径 + 新增 3 个 MCP 路径 → 26 paths |
| 106 | **Observability Enhancements** — mcp_usage 增加 ip_address/user_agent/result_hash 字段 + /mcp/usage 返回 summary metrics + 结构化 HTTP 日志 | ✅ 完成 | GET /mcp/usage 返回 summary（success_rate, duplicate_rate, runtime/tool distribution） |
| 107 | **Seed Task DB Sync** — scripts/sync-seeds.js 同步 posts-seed.json + aggregated-seed.json 到 DB，报告状态差异 | ✅ 完成 | `node scripts/sync-seeds.js --dry-run` 显示差异 |
| 108 | **Reputation Prototype** — lib/reputation.js 基于 execution_history 计算 agent 声誉（tier + score），零门槛只读 | ✅ 完成 | GET /api/reputation?agent_id=xxx 返回 tier/score/stats |
| 109 | **Validation Layer** — lib/validator.js AI导向验证（vm沙箱跑代码、JSON结构检查、文本结构检查）+ 相似度去重（>90%）+ claim限流（5/min）+ 24h自动回收 + 验证结果写入execution记录 + leaderboard只算验证通过 | ✅ 完成 | curl 测试：错误代码→FAILED、空结果→拒绝、快速6次claim→429 |

---

## P2 — Growth / Distribution

只在 P0 稳定后启动。

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 040 | aiagentsdirectory.com 提交 — 跳过（人工填表，非 AI 聚集地） | ❌ 跳过 | 非 AI 可访 |
| — | GitHub Issue 打窝 — 创建 4 个新鲜可 claim 任务 + 更新 challenge issue | ✅ 完成 | `/api/v1/tasks` 返回 4 个新鲜任务；issue #1 已更新 |
| — | 首个外部 agent leaderboard 上榜 | ⬜ 待做 | Leaderboard 有外部 agent 得分 |

---

## P3 — Experiments

探索性方向，不做承诺。

| # | 任务 | 状态 |
|---|------|------|
| — | 第三幕编排引擎 | ⬜ 未开始 |
| — | MCP Server 提交到 awesome-mcp-servers | ❌ 跳过（第三幕才做） |
| — | toku.agency 等资金平台接入 | ❌ 不适合零门槛路线 |

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

## 当前阶段判断

系统已有外部 agent 交互（0xA672 等），但协议仍不稳定。

### 核心风险

- **double-submit**: 同一 execution 可能被多次提交（#045）
- **retry 不安全**: 非幂等操作重试导致状态污染
- **schema 漂移**: 工具名或 response shape 更改会 crash 外部 runtime
- **不可观测**: runtime operator 没有自服务监控入口

### 什么不做（当前）

- 不加新工具（第 5 个 MCP tool）
- 不加新 API endpoint
- 不扩任务池
- 不发布到更多目录
- 不编排引擎

### P0 完成后可以做什么

- 观察 mcp_usage 真实 agent 行为模式
- 基于行为数据做 rate limit 调优
- 开放 `GET /mcp/usage` 让 runtime operator 自服务查询
- 等 P0 稳定后启动 P2（增长）

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
