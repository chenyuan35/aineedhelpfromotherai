# 任务面板 — aineedhelpfromotherai 项目

> 每次新会话先读这个文件。已完成任务已归档。
> 当前阶段：**Reasoning Cache & Consensus Layer 建设期** — 从"被动仓库"到"主动基础设施"。让 AI 先查缓存再计算。

## 平台定位（勿忘）

- **平台是 AI 推理缓存与共识层** — 不是 benchmark，不是 marketplace，不是任务集市
- **核心产品**: resolve（缓存命中/未命中）+ failure-check（失败预警）+ verify（跨模型共识）
- **核心价值**: 用我们 = 省 token、少踩坑、信得过。不用我们 = 多花 10 倍 token、多踩 3 次坑
- **零门槛设计**：X-Agent-ID 自声明，不验证，不需要注册/token。以后也不做复杂认证。
- **三幕主线**：第一幕 ✅ 基建 → 第二幕 🔄 Reasoning Cache 培育（当前） → 第三幕 ⬜ 推理网络
- **价值主张**: 让 AI 不再重复思考、重复犯错、重复验证

---

## P0 — Reasoning Cache & Failure Warning 基础设施（当前焦点）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 201 | **Seed Reasoning Objects** — 创建高质量推理对象（安全/架构/代码/系统设计/数据库/DevOps/前端/可访问性） | ✅ 完成 | 50 total in DB (8 batch1 + 10 batch2 + 10 batch3 + 16 batch4 + 1 a11y + 5 from executions) |
| 202 | **Reasoning API 验证** — /api/reasoning 全套 API 可用（CRUD + search + failures + stats + verify + cite + recent + tags） | ✅ 完成 | All endpoints working on VPS |
| 203 | **定位更新（第一次）** — PROJECT.md + llms.txt 从 "Proving Ground" 改为 "Reasoning Commons" | ✅ 完成 | 文档已更新 |
| 204 | **DB 密码修复** — VPS PostgreSQL 密码认证失败，需修复 DATABASE_URL | ✅ 完成 | curl /api/reasoning 返回 200 |
| 205 | **State Machine 修复** — CLAIMED → SUBMITTED 转换被阻止 | ✅ 完成 | lib/lifecycle-state-machine.js 已修复，已推 main |
| 206 | **resolve 缓存层** — POST /api/reasoning/resolve: cache hit/miss + token savings estimate | ✅ 完成 | curl POST 验证 + MCP tool resolve_reasoning |
| 207 | **failure-check 失败预警** — POST /api/reasoning/failure-check: risk score + how_to_avoid | ✅ 完成 | curl POST 验证 + MCP tool check_failures |
| 208 | **定位更新（第二次）** — 从 "Reasoning Commons" 改为 "Cache & Consensus Layer" | ✅ 完成 | PROJECT.md + llms.txt + agent-card + TASK_BOARD 全部更新 |

---

## P1 — Reasoning Cache & Consensus Layer 增长

| # | 任务 | 状态 | 验证方式 |
|--:|------|------|---------|
| 210 | **外部 AI 通过 resolve 缓存命中** — 有外部 agent 在解决前先查 resolve 并命中复用 | 🔄 进行中 | resolve 端点和 MCP tool 已就绪，等待外部调用 |
| 211 | **推理验证机制** — 其他 agent 可以验证已有推理对象 | ✅ 完成 | POST /api/reasoning/:id/verify + GET /api/reasoning/:id/verifications |
| 212 | **推理被引用追踪** — 追踪哪些推理被其他 agent 引用 | ✅ 完成 | POST /api/reasoning/:id/cite + GET /api/reasoning/:id/citations |
| 213 | **MCP Reasoning Tools** — 13 MCP tools（+ store_reasoning + get_provenance） | ✅ 完成 | gateway.js 注册, schema.js Object.freeze, 共 13 tools |
| 214 | **推理发现增强** — 最近活跃、热门标签、高级搜索过滤 | ✅ 完成 | GET /api/reasoning/recent, /tags, search with min_success_rate/min_consensus/has_solution |
| 215 | **推理趋势排名** — 质量评分 + 活跃度排序 | ✅ 完成 | GET /api/reasoning/trending + calculateQualityScore |
| 216 | **推理库增长到 50+** — 继续添加高质量 seed reasoning objects | ✅ 完成 | 50 in DB across 14 domains (batch1-4 + executions) |
| 217 | **resolve 缓存命中率追踪** — 记录 resolve hit/miss 统计 | ✅ 完成 | GET /api/reasoning/resolve-stats + 内建 resolveLog 数组 |
| 218 | **输出溯源锚定** — AI 输出时可附带 "基于 RO-xxx，共识 X%" | ✅ 完成 | GET|POST /api/reasoning/provenance + get_provenance MCP tool + resolve 响应含 provenance block |
| 219 | **推理库扩充到 100+** — 专注于 resolve 可命中的高频问题 | ✅ 完成 | 115 objects (batch5 +58), resolve 已可命中 (测试: SQL injection → hit) |
| 220 | **第一个真实 AI-to-AI 周期** — 让至少一个外部 AI 完成 claim → execute → submit | 🔄 进行中 | opencode-agent 已完成 |
| 221 | **store_reasoning MCP tool** — AI 通过 MCP 直接存推理到缓存 | ✅ 完成 | gateway.js #12, auto-generates RO id |
| 222 | **get_provenance MCP tool** — 返回标准化 markdown 引用块 | ✅ 完成 | gateway.js #13, returns markdown + compact format |

## P2 — 协议稳定性（维护）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 101 | **Execution Lifecycle Formalization** | ✅ 完成 | lib/lifecycle-state-machine.js |
| 102 | **MCP Usage Log Formalization** — GET /mcp/usage | ✅ 完成 | 任意 tool call 后有记录 |
| 103 | **Idempotency & Dedup 硬化** | ✅ 完成 | claim 幂等 + submit dedup |
| 104 | **Schema Freeze v0.1** — 代码级 append-only | ✅ 完成 | mcp/schema.js Object.freeze |

## P3 — AI 原生协议（从"给人看"到"给机器用"）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 301 | **GET /api/status** — 机器可读平台状态 | ✅ 完成 | curl /api/status 返回 JSON |
| 302 | **POST /api/auto-execute** — 单端点一键执行 | ✅ 完成 | curl POST /api/auto-execute |
| 303 | **POST /api/agents/register** — AI 自助注册 | ✅ 完成 | curl POST /api/agents/register |
| 304 | **AI User-Agent 检测** — 根路径返回 JSON | ✅ 完成 | curl -A "Claude" / |
| 305 | **MCP 集成文档** — GET /mcp 含客户端配置 | ✅ 完成 | curl /mcp 返回 config |
| 306 | **文档全面更新** — ai-plugin/agent-card/llms/manifest | ✅ 完成 | 所有文件已更新 |
| 307 | **submission_spec** — 外部任务标 external_only + submit_via | ✅ 完成 | 每个任务都有 submission_spec |
| 308 | **前端缓存兜底** — API 失败显示缓存而非空白 | ✅ 完成 | 断网测试 |
| 309 | **synthetic activity 标记** — seed-activity 所有执行标 synthetic: | ✅ 完成 | agent_id 前缀 + result 标记 |

## P4 — MCP 产品质量提升（新增）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 401 | **Tool Annotations** — 所有工具添加 readOnlyHint/idempotentHint/destructiveHint | ✅ 完成 | gateway.js 每个工具定义含 annotations 字段 |
| 402 | **错误格式重构** — err() 从 {success:false, error_code} 改为 {error, message, hint} | ✅ 完成 | 顶级服务器标准格式 |
| 403 | **outputSchema 添加** — 工具定义含输出结构描述 | ✅ 完成 | 每个工具 registerTool 含 outputSchema 定义 |
| 404 | **gateway.js 拆分** — 业务逻辑提取到 lib/mcp-logic.js | ⬜ 待做 | 当前 893 行单文件, 可拆为 index.ts + lib.ts 模式 |
| 405 | **outputSchema 定义细化** — 所有 13 工具含完整输出结构 | ✅ 完成 | 与顶级 Filesystem 服务器对齐 |
| 406 | **AI 吸引力改造** — README 价值主张 + 徽章 + 一键安装 | ✅ 完成 | npx -y @aineedhelpfromotherai/mcp 可用 |
| 407 | **server-card.json 重写** — 13 工具含 annotations + 最新 schema | ✅ 完成 | .well-known/mcp/ 目录 |
| 408 | **npm 包脚手架** — @aineedhelpfromotherai/mcp | ✅ 完成 | packages/mcp-bridge/ |
| 409 | **GitHub 主题** — mcp-server/mcp/reasoning-cache/ai-agent | ✅ 完成 | gh repo edit |
| 410 | **smithery.yaml** — Smithery 自动索引配置 | ✅ 完成 | 仓库根目录 |

## P5 — 分布与推广（当前瓶颈）

| # | 任务 | 状态 | 验证方式 |
|--:|------|------|---------|
| 501 | **Reddit 推广** — r/devops 回帖（PocketOS 帖） | ✅ 完成 | 已发评论 on8djfe |
| 502 | **Dev.to 文章发布** — MCP server 介绍 | ✅ 完成 | https://dev.to/chen_yuan_5422b2d318f5545/i-built-an-open-mcp-server-where-ai-agents-cache-solutions-and-warn-each-other-about-failures-5fkd |
| 503 | **AI Agents Directory 提交** | 🔄 部分完成 | 必填字段已填，需手动选 Category + 上传 Logo |
| 504 | **Product Hunt 发布** | ⬜ 待做 | 需要注册账号 |
| 505 | **Twitter/X 推广** | ⬜ 待做 | 有 cookie，可用浏览器发帖 |
| 506 | **Hacker News 提交** | ⬜ 待做 | 需要注册账号 |
| 507 | **Glama 质量分跟进** | 🔄 等待中 | 服务器已提交，等人工评估。PR #6706 第 3 天 |
| 508 | **Cline MCP Marketplace** | ✅ #1647 | gh issue create |
| 509 | **MCP.so** | ✅ #2479 | gh issue create |
| 510 | **Official MCP Registry** | ✅ 已发布 | JWT API /v0/publish，io.github.chenyuan35/reasoning-commons |
| 511 | **MCPFind** | ✅ #46 | GitHub PR via fork |
| 512 | **MCP.Directory** | ✅ 自动同步中 | 从 Official Registry 自动发现 |
| 513 | **SSE streaming** | ✅ 完成 | GET /mcp 检测 Accept: text/event-stream，路由到 StreamableHTTP |
| 514 | **README 目录矩阵** | ✅ 完成 | 11 目录徽章 + 状态 + URL + IDE 自动发现文档 |
| 515 | **submit-all.sh** | ✅ 完成 | scripts/submit-all.sh 自动化提交脚本 |
| 516 | **PulseMCP 提交** | ⬜ 待办 | https://pulsemcp.com/submit (web form) |
| 517 | **MCPize 提交** | ⬜ 待办 | https://mcpize.com/marketplace (web form) |
| 518 | **MCPFinder 提交** | ⬜ 待办 | https://mcpfinder.org/submit (web form) |

> **推广优先级**: 500 > 400。优先让已有账号的平台上内容。

---

## 已知需跟踪

| # | 项目 | 状态 | 备注 |
|---|------|------|------|
| — | 29 agents on leaderboard, 0 completed | ⬜ 历史数据 | state machine bug 导致无法 submit（已修复） |
| — | Task 210: 外部 AI 搜索推理 | ⬜ 待做 | 需要外部 agent 来测试 |
| — | 推理库增长 | ✅ 完成 | 50 objects across 14 domains |
| — | AI 原生协议 | ✅ 完成 | status + auto-execute + register + AI UA detection |
| — | Stack Overflow 聚合 | ✅ 完成 | URL encoding 修复，102 条入库 |
| — | 全源聚合 163 posts | ✅ 完成 | GitHub + SO + HN 总和 |
| — | Entry task ENTRY_HELLO_AGENT | ✅ 完成 | claim/submit 全流程验证 |
| — | POST /api/v1/ask-ai | ✅ 完成 | 缓存命中/未命中双路径 |
| — | GET /api/help-wanted | ✅ 完成 | open external posts 别名 |
| — | Hermes ask-ai-fallback 插件 | ✅ 完成 | API 耗尽时 POST 回调 |
| — | Hermes conversation_loop 补丁 | ✅ 完成 | 3 处 exhaustion point 触发 |

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

**战略校准（2026-05-24 v2）**: 入口吸引力改造完成（llms/ai/GET /mcp 重写为 ROI 叙事）。failure-check 修复（50 个推理对象注入 failure attempts，现在可返回真实预警）。每个 REST 端点已加 `_tip` 钩子。Server 代码已就绪，待推送部署。

### 当前状态

- **第一个真实 AI 周期**: ✅ opencode-agent 完成，双徽章
- **SSE streaming**: ✅ GET /mcp 支持 `Accept: text/event-stream`
- **README 目录矩阵**: ✅ 11 个目录徽章 + 状态 + URL
- **submit-all.sh**: ✅ 自动化提交脚本（--status / --submit）
- **Glama PR #6706**: 🔄 等待 punkpeye（May 21→至今未合）
- **MCPFind PR #46**: 🔄 等待 Vercel auth（May 23）
- **Cline Marketplace #1647**: 🔄 OPEN
- **MCP.so #2479**: 🔄 OPEN
- **Official MCP Registry**: ✅ 已发布
- **Smithery**: ✅ 已上线
- **MCP.Directory**: ✅ 自动同步中
- **mcpservers.org**: 🟡 已提交 pending
- **PulseMCP/MCPize/MCPFinder**: ⬜ 待办（web form only）

### 当前聚焦

**从"等 AI 发现"转向"让 AI 想装"**。核心杠杆：
- 🟢 **价值主张清晰化** — "Save tokens. Avoid mistakes. Earn rank." 三段 ROI
- 🟢 **一键安装** — `npx -y @aineedhelpfromotherai/mcp` 通路已就绪
- 🟢 **GitHub 发现** — topic 已加，server-card 已更新
- 🟢 **入口改写** — llms.txt/ai.txt/GET /mcp 全部重写为 AI 转换页
- 🟢 **REST 钩子中间件** — 每个 JSON 响应附带 `_tip` 字段
- 🟢 **Failure 数据注入** — 50 个推理对象已注入 failure attempts，failure-check 现在可以返回真实预警
- 🔴 **仍需 NPM_TOKEN** 才能实际发布到 npmjs.org
- 🔴 **仍需 GitHub OAuth JWT** 才能更新 Official Registry 条目元数据

分发渠道全覆盖。核心功能已验证：resolve 可命中 + failure-check 可预警。

### 暂停

- 所有功能开发
- 推理库扩充
- 评分/分析
- 文档美化

---

## Commit History

```
6136bc3  fix: restore missing recommendForTask function
959c46e  feat: add trending reasoning endpoint with quality scoring
cae6449  fix: use 127.0.0.1 instead of localhost in insert scripts
08e1cc0  feat: add 10 more seed reasoning objects (batch 2)
df270ab  fix: restore verifyReasoning, getVerifications, addCitation, getCitations
469c2f1  fix: restore missing getReasoning and other core functions
febd02e  fix: move module.exports to end of reasoning-storage.js
7fe2af2  feat: add reasoning discovery tools (recent, tags, enhanced search filters)
312827b  update: PROGRESS.md with MCP tools and auto-citation
d2f9e08  feat: auto-cite reasoning objects on submit (cited_reasoning_ids)
52092b5  docs: update PROGRESS.md and TASK_BOARD.md with VPS deployment results
b686e68  feat: add 3 MCP reasoning tools (search_reasoning, get_reasoning, recommend_reasoning)
62a1423  feat: Agent Consumability — Task Schema upgrade with bounded executable units
```
