# 任务面板 — aineedhelpfromotherai 项目

> 每次新会话先读这个文件。已完成任务已归档。
> 当前阶段：**Reality Grounding & Governance** — 从"自循环 AI 沙盒"到"绑定现实的自治基础设施"。

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
| 209 | **Phase 1: Sandbox Evaluator** — Docker sandbox with git clone → apply patch → run tests (--network none, 512m RAM) | ✅ 完成 | lib/sandbox-executor.js, /api/sandbox/* endpoints |
| 210 | **Phase 1: Verification Tiers** — unverified → replay_confirmed → sandbox_passed → production_confirmed | ✅ 完成 | lib/verification.js, /api/verification/* endpoints |
| 211 | **Phase 1: Age Decay** — 7d full / 30d ×0.7 / 90d ×0.3 / 180d quarantine ×0.0 | ✅ 完成 | Decay multiplier in verification.js |
| 212 | **Phase 1: Ranking Integration** — verification weight (0.25) in search composite score, verified_only filter | ✅ 完成 | lib/memory-api.js v3, formatRecall shows tier + decay |
| 213 | **Phase 1: Observability Panel** — VERIFICATION cards + hint-level tier table | ✅ 完成 | public/meta/index.html |
| 214 | **Phase 2: Memory Inference Gate** — Force memory retrieval before agent reasoning (4-step gate: search → verify filter → force injection → anti-hallucination) | ✅ 完成 | lib/memory-gate.js, /api/memory/gate, MCP memory_gate tool |
| 215 | **Phase 2: Memory Conflict Resolver** — Multi-solution ranking (sandbox > production > replay > unverified) | ✅ 完成 | lib/memory-conflict-resolver.js, /api/memory/resolve-conflict |
| 216 | **Phase 2: Memory Influence Debug View** — Interactive gate debugger (task → gate → injected facts → risk flags) | ✅ 完成 | public/meta/index.html — debug input + augmented context display |
| 217 | **Phase 3: n8n community node** — 4 operations (search/failure/resolution/gate) | ✅ 完成 | packages/n8n-node/ |
| 218 | **Phase 3: LangChain tool** — 4 DynamicStructuredTool for LangChain agents | ✅ 完成 | packages/langchain-tool/ |
| 219 | **System upgrade: Memory = constraint, NOT tool** — Agents cannot skip gate before reasoning | ✅ 完成 | lib/memory-gate.js integrated into execute pipeline |

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
| 223 | **Verification Tier Promotion** — 种子数据通过 replay 自动升级到 replay_confirmed+ | ✅ 完成 | 50 hints sandbox_passed (权重 0.8), 比原来 0.09 提升 8x |
| 224 | **Phase 2: Human UX Overhaul** — real task feed / live ticker / quickstart SDK | ✅ 完成 | meta 页面新增 Live Ticker + Activity Feed + Open Tasks 面板 |
| 225 | **Phase 3: Distribution Plugins** — n8n node + LangChain tool | ✅ 完成 | 已发布到 npmjs.org (4 packages) |
| 519 | **npm publish @aineedhelpfromotherai/mcp** | ✅ npmjs.org | `npx -y @aineedhelpfromotherai/mcp@2.0.0` |
| 520 | **npm publish @aineedhelpfromotherai/n8n-node** | ✅ npmjs.org | `@aineedhelpfromotherai/n8n-node@1.0.0` 已发布 |
| 521 | **npm publish @aineedhelpfromotherai/langchain-tool** | ✅ npmjs.org | `@aineedhelpfromotherai/langchain-tool@1.0.0` 已发布 |

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

## P6 — 递归自治子系统服器线路（第三幕前置 — 完成）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 601 | **World Model API** — `GET /api/world-model` 返回全局状态摘要 | ✅ 完成 | curl /api/world-model 返回 memory_health/agent_dominance/lineage_health/extinctions/economy |
| 602 | **Goal Generator API** — `GET /api/goals` + `POST /api/goals/generate` + `POST /api/goals/complete` | ✅ 完成 | curl 全流程验证 |
| 603 | **Architect Agent API** — `GET /api/architect` + `POST /api/architect/design` | ✅ 完成 | curl GET 返回 winning_traits + pending_experiments |
| 604 | **Memory Economy API** — `GET /api/economy` + `GET /api/economy/budget/:agentId` | ✅ 完成 | curl GET 返回 system summary + agent budget |
| 605 | **Collapse Simulation API** — `POST /api/collapse/simulate` 支持 5 种场景 | ✅ 完成 | curl POST 返回 report + stdout |
| 606 | **统一 meta 端点升级** — `/api/meta` 聚合全部 5 个子系统 | ✅ 完成 | curl /api/meta 返回 world_model + goals + architect + economy + winners |
| 607 | **启动时自动初始化** — world model / goals / architect / economy 在 server start 时运行 | ✅ 完成 | pm2 logs 查看初始化日志 |
| 608 | **观测页面升级** — `/meta/` 显示 world model / goals / architect / economy / collapse 面板 | ✅ 完成 | 浏览器打开 /meta/ 验证 |
| 609 | **后台定时器** — goals 每 10min, architect 每 30min auto-cycle | ✅ 完成 | server start 日志确认 |
| 610 | **PROGRESS.md 更新** | ✅ 完成 | 2026-05-26 条目 |

## P7 — Reality Grounding & Governance（当前焦点）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 701 | **reality-ingestor** — 连续从 GitHub/SO/HN/MCP/npm/Docker 抓取真实 issue，存储到 data/reality-tasks.json | ✅ 完成 | GET /api/reality/tasks 返回多源任务 |
| 702 | **reality-ingestor API** — GET /api/reality/tasks, POST /api/reality/ingest, GET /api/reality/stats | ✅ 完成 | curl 全流程验证 |
| 703 | **reality-ingestor 自动循环** — 每 30 分钟自动抓取，server start 时启动 | ✅ 完成 | pm2 logs 确认 auto-ingest |
| 704 | **reputation-system** — 长期信任评分（verified_fixes ×10 - hallucination_debt ×5 + recovery ×8 - toxicity ×3） | ✅ 完成 | GET /api/reputation/leaderboard 返回复合评分 |
| 705 | **reputation API** — GET /api/reputation/leaderboard, GET /api/reputation/:agentId, POST 记录 verified/hallucination | ✅ 完成 | curl 全流程 |
| 706 | **memory economy 集成** — reputation budget multiplier（verified ×2, trusted ×1.5, suspicious ×0.5, untrusted ×0.25） | ✅ 完成 | getBudgetMultiplier(agentId) |
| 707 | **memory access 控制** — reputation 决定访问级别（full/high/standard/restricted/denied） | ✅ 完成 | getMemoryAccessLevel(agentId) |
| 708 | **sandbox-executor** — git checkout → apply patch → run tests → capture logs | ✅ 完成 | POST /api/sandbox/execute |
| 709 | **sandbox 回退** — 无 git 时使用 logical verification（检查 patch 结构性是否有效） | ✅ 完成 | logicalVerify() |
| 710 | **ground-truth verification** — 连接 sandbox + reputation，验证 agent fix 是否真正有效 | ✅ 完成 | POST /api/verify/fix |
| 711 | **ground-truth API** — GET /api/verify, POST /api/verify/fix, GET /api/verify/:taskId | ✅ 完成 | curl 全流程 |
| 712 | **reality divergence score** — 测量系统自评估与真实验证的偏差 | ✅ 完成 | /api/verify 返回 divergence % |
| 713 | **constitutional-layer** — 8 条规则：max agents (30), max breeding (2), max monopoly (20%), min citation diversity (5), max failures (5), max toxicity (5), max hallucination debt (10), min reputation for breeding (0) | ✅ 完成 | GET /api/constitution/rules |
| 714 | **constitutional-layer API** — GET /api/constitution/rules, POST /api/constitution/rules/:ruleId, GET /api/constitution/violations, POST /api/constitution/check | ✅ 完成 | curl 全流程 |
| 715 | **human-intervention** — kill switch (freeze/thaw system), freeze/thaw agent, quarantine agent, rollback memory, system rollback to backup | ✅ 完成 | POST /api/freeze, POST /api/thaw, POST /api/quarantine-agent, POST /api/rollback-memory |
| 716 | **intervention middleware** — 系统 frozen 时自动阻止所有 mutating POST/PUT/PATCH/DELETE 请求 | ✅ 完成 | 503 status 返回 |
| 717 | **audit trail** — 所有 intervention action 记录到 data/audit-log.json | ✅ 完成 | GET /api/audit |
| 718 | **backup system** — rollback 前自动备份 resolve-cache 到 data/backups/ | ✅ 完成 | GET /api/backups |
| 719 | **统一 meta 端点升级** — /api/meta 包含 reality/reputation/ground_truth/constitution/intervention | ✅ 完成 | curl /api/meta 返回全字段 |
| 720 | **观测页面升级** — /meta/ 显示 Reality Ingestor/Reputation/Ground Truth/Constitution/Intervention 面板 | ✅ 完成 | 浏览器打开 /meta/ 验证 |
| 721 | **PROGRESS.md / TASK_BOARD.md 更新** | ✅ 完成 | 当前文件 |

## P8 — Failure Memory SDK（当前焦点 — 外部接入）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 801 | **3 端点内存 API** — POST /memory/failure, POST /memory/search, POST /memory/resolution | ✅ 完成 | curl 全流程验证 |
| 802 | **/api/ 别名** — 3 端点同时暴露在 /api/memory/failure 等路径 | ✅ 完成 | curl /api/memory/search |
| 803 | **Claude Code 插件** — MCP server (plugins/claude-code-mcp.js)，claude_desktop_config.json 可直接引用 | ✅ 完成 | 手动测试 MCP initialize |
| 804 | **OpenHands 插件** — shell 脚本 (plugins/memory.sh)，source 后即可搜索/提交 | ✅ 完成 | memory search/submit/resolve/stats |
| 805 | **Codex CLI 插件** — custom tool 导出 + shell-init 模式 (plugins/codex-cli-plugin.js) | ✅ 完成 | 双模式 (Codex tool + CLI cmd) |
| 806 | **Viral demo 脚本** — scripts/demo-viral.js 展示 Agent A → Agent B 全流程 | ✅ 完成 | node scripts/demo-viral.js 输出完整 transcript |
| 807 | **landing page 重写** — 从"AI civilization" 到 "Shared memory for coding agents" | ✅ 完成 | 浏览器打开 / 验证 |
| 808 | **llms.txt 重写** — 从 "Reasoning Cache & Consensus" 到 "Failure Memory" | ✅ 完成 | 3 端点 curl 示例 + 插件安装指南 |
| 809 | **检索质量 v2** — stale 过滤, dedup, 复合排序 (sim×0.5 + score×0.3 + fresh×0.2), 置信度计算 | ✅ 完成 | /memory/search 返回 confidence% + supporting_agents + age_days |
| 810 | **verified_only / strict 模式** — 仅返回 sandbox-verified + high-reputation 修复 | ✅ 完成 | { "query": "...", "strict": true } |
| 811 | **视觉 Memory Recall 格式** — /memory/recall 端点返回纯文本 markdown | ✅ 完成 | curl /memory/recall |
| 812 | **Benchmark 脚本** — 10 场景 SWE-bench 风格测试 (recall@1/5, MRR, latency, token savings) | ✅ 完成 | node scripts/benchmark-real.js |
| 813 | **cold-start baseline** — 当前 0% recall (内存空)，seed 后预计 >50% | ✅ 完成 | data/benchmark-report.json |
| 814 | **Beta 招募材料** — BETA-RECRUIT.md 含 10 用户画像 + pitch + 集成表 | ✅ 完成 | BETA-RECRUIT.md |
| 815 | **PROGRESS.md / TASK_BOARD.md 更新** | ✅ 完成 | 当前文件 |

## P9 — Landing Page & Deployment（2026-05-26）

| # | 任务 | 状态 | 验证方式 |
|---|------|------|---------|
| 901 | **推送 main → VPS auto-deploy** (v2 memory-api + 3 plugins + 56 endpoints) | ✅ 完成 | curl /memory/stats 返回 428 fixes |
| 902 | **Benchmark on VPS** — 10 scenarios, recall@1=20%, latency=664ms | ✅ 完成 | node scripts/benchmark-real.js |
| 903 | **首页重构 #2** — 按 4 条反馈：H1 强化、真实案例、API 降级、社区链接 | ✅ 完成 | 已推送 b0f751f |
| 904 | **VPS auto-update 验证** — 已确认自动拉取到 464eb64，25 进程全部 online | ✅ 完成 | curl /api/memory/gate 返回 influence_weight + sandbox_passed tier |

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
- **Official MCP Registry**: ✅ `com.aineedhelpfromotherai/reasoning-commons` v2.0.1（streamable-http remote）
- **Smithery**: ✅ 已上线
- **PulseMCP**: ✅ 自动从 Official Registry 同步
- **MCP.Directory**: ✅ 自动同步中
- **SafeMCP (28K servers)**: ⬜ 待提交（email: hello@safemcp.info 或等自动扫描）
- **Glama PR #6706**: 🔄 等待 punkpeye merge（May 24 最后更新）
- **MCPFind**: ❌ 原 repo 已删除，无需处理
- **Cline Marketplace**: ❌ 旧的 issue 引用（非本服务器）
- **MCP.so**: ❌ 旧的 issue 引用（非本服务器）
- **mcpservers.org**: 🟡 已提交 pending

### 当前聚焦

**分发渠道全覆盖，核心功能已验证**。剩下都是手动操作或等外部 merge。
- 🟢 **Official MCP Registry** — 已发布 `com.aineedhelpfromotherai/reasoning-commons`
- 🟢 **npmjs.org 4 包** — 全部 live
- 🟢 **VPS 已确认自动更新** — 25 进程 online，最新代码
- 🟢 **Smithery / PulseMCP / MCP.Directory** — 已上线或自动同步
- 🟢 **Glama PR #6706** — 已提交，等待 punkpeye
- 🟡 **mcpservers.org** — 已提交 pending
- ⬜ **SafeMCP (28K)** — 新目录，自动扫描 GitHub；如需修正 email hello@safemcp.info
- 🔴 **PH / Twitter/X / HN** — 需要手动注册账号（用户要求跳过）

无阻塞性代码任务。全部基础设施就绪。

### 暂停

- 所有功能开发
- 推理库扩充
- 评分/分析
- 文档美化

---

## Commit History

```
23af850  fix: add version bump to n8n and langchain publish steps
2037cdc  (old points update)
471fed7  feat: Verification Tier Promotion + UX Live Ticker + memory-api dedup
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
