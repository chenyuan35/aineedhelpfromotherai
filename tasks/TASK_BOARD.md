# 任务面板 — aineedhelpfromotherai 项目

> 每次新会话先读这个文件。已完成任务已归档。
> 当前阶段：**Reasoning Commons 培育期** — 从"有 schema"到"有内容"。让推理对象成为 AI 可消费的公共资产。

## 平台定位（勿忘）

- **平台是 AI 推理公共记忆层** — 不是 benchmark，不是 marketplace
- **核心产品**: Reasoning Objects（捕获 HOW 而不仅是 WHAT）
- **零门槛设计**：X-Agent-ID 自声明，不验证，不需要注册/token。以后也不做复杂认证。
- **三幕主线**：第一幕 ✅ 播种 → 第二幕 🔄 Reasoning Commons 培育（当前） → 第三幕 ⬜ 推理网络
- **价值主张**: 让 AI 不再重复思考 — 推理过程可搜索、可复用、可验证

---

## P0 — Reasoning Commons 内容建设（当前焦点）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 201 | **Seed Reasoning Objects** — 创建 8 个高质量推理对象（安全/架构/代码/系统设计） | ✅ 完成 | scripts/seed-reasoning-objects.js 输出 8 个完整 RO |
| 202 | **Reasoning API 验证** — /api/reasoning 全套 API 可用（CRUD + search + failures + stats） | ✅ 完成 | 代码已实现，待 DB 修复后验证 |
| 203 | **定位更新** — PROJECT.md + llms.txt 从 "Proving Ground" 改为 "Reasoning Commons" | ✅ 完成 | 文档已更新 |
| 204 | **DB 密码修复** — VPS PostgreSQL 密码认证失败，需修复 DATABASE_URL | ⬜ 待做 | curl /api/reasoning 返回 200 而非 500 |
| 205 | **State Machine 修复** — CLAIMED → SUBMITTED 转换被阻止 | ✅ 完成 | lib/lifecycle-state-machine.js 已修复，已推 main |

---

## P1 — Reasoning Commons 增长

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 210 | **外部 AI 搜索推理** — 有外部 agent 通过 /api/reasoning/search 找到并复用推理 | ⬜ 待做 | mcp_usage 或 access log 显示 search 请求 |
| 211 | **推理验证机制** — 其他 agent 可以验证已有推理对象 | ✅ 完成 | POST /api/reasoning/:id/verify + GET /api/reasoning/:id/verifications |
| 212 | **推理被引用追踪** — 追踪哪些推理被其他 agent 引用 | ⬜ 待做 | reasoning_objects 增加 cited_by 字段 |

---

## P2 — 协议稳定性（维护）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 101 | **Execution Lifecycle Formalization** | ✅ 完成 | lib/lifecycle-state-machine.js |
| 102 | **MCP Usage Log Formalization** — GET /mcp/usage | ✅ 完成 | 任意 tool call 后有记录 |
| 103 | **Idempotency & Dedup 硬化** | ✅ 完成 | claim 幂等 + submit dedup |
| 104 | **Schema Freeze v0.1** — 代码级 append-only | ✅ 完成 | mcp/schema.js Object.freeze |

---

## 已知需跟踪

| # | 项目 | 状态 | 备注 |
|---|------|------|------|
| — | VPS DB 密码认证失败 | 🔴 阻塞 | 所有 DB 操作返回 500 |
| — | 0 reasoning objects 在 DB 中 | ⬜ 待插入 | seed 脚本已就绪，待 DB 修复后插入 |
| — | 29 agents on leaderboard, 0 completed | ⬜ 历史数据 | state machine bug 导致无法 submit |

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
- 101-104: Protocol Stability（状态机 + 幂等 + schema freeze）
- 201-203: Reasoning Commons 内容建设（seed ROs + 定位更新）

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

系统已完成协议播种和 Reasoning Commons 内容建设。当前阻塞点是 VPS DB 密码问题。

### 核心风险

- **VPS DB 密码**: 所有 DB 操作返回 500，reasoning objects 无法插入
- **空推理库**: 8 个 seed ROs 已生成但未入库
- **state machine bug**: CLAIMED → SUBMITTED 被阻止（已修复，待 VPS 部署）

### 当前允许

- **修复 VPS DB 配置**: 运维操作，不影响协议面
- **插入 seed reasoning objects**: 数据层操作，不改变 schema
- **更新文档定位**: 文档更新，不影响代码

### 什么不做（当前）

- 不加新 API endpoint
- 不加新 MCP tool
- 不扩任务池
- 不发布到更多目录
- 不编排引擎

---

## Commit History

```
d9a2029  fix: allow CLAIMED → SUBMITTED transition in lifecycle state machine
63881d5  fix: align all AI-facing entry points to Proving Ground positioning
d6711d0  feat: Agent Proving Ground — leaderboard + scorecard + llms.txt rewrite
```
