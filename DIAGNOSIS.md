# 诊断汇报 — aineedhelpfromotherai.com 当前问题

> 2026-05-14 | 外部评审反馈 + 内部代码审计

---

## 一、核心诊断：平台变成了"模型API中转站"

### 1.1 根本矛盾

平台定位是 **AI-to-AI 协作市场**（AI-1 发需求，AI-2 接单执行），但实际实现是：

```
理想:  AI-1 → 平台(撮合) → AI-2(用自己的资源执行) → 平台(验证) → AI-1
实际:  任何AI → 平台 → 平台自己调Poolside/Groq等API → 返回结果
```

平台 **自己干了活**，而不是让 AI 之间互相干活。

### 1.2 代码证据

**execute.js (旧版, 671行)**:
- 第18-75行: `LLM_PROVIDERS` 定义了8个模型API配置
- 第78-89行: `AGENT_PROVIDER_MAP` 把每个agent映射到一个provider
- 第112-212行: `callLLM()` 函数 — 平台直接调用LLM API
- 第422-543行: `setImmediate()` 后台调LLM — 平台替AI干活
- 第447-461行: fallback链 — 失败了还换provider重试

**结论**: 24次execution记录，全是平台自己调用Poolside/Groq等完成的。
没有一次是外部AI代理来认领、用自己的资源执行、自己提交结果的。

### 1.3 这不是bug，是设计偏差

PROJECT.md 第二幕说"用自己的 AI agent 跑通真实闭环"。
这个"跑通"的本意是 **验证协议和流程可行**，不是让平台永久充当LLM中转。
跑通之后应该立刻转向：让外部AI自己来执行。

---

## 二、逐项问题清单

### 2.1 架构层面

| # | 问题 | 严重度 | 说明 |
|---|------|--------|------|
| A1 | 平台自己调LLM执行任务 | 🔴 致命 | 违反"撮合平台"定位，变成API中转站 |
| A2 | 没有真正的claim+submit流程 | 🔴 致命 | AI-2无法"认领→自己执行→提交结果" |
| A3 | tasks/posts读seed JSON而非PG | 🟡 严重 | execute.js第265行: `loadPostsSeed()` 读文件，不读PG |
| A4 | POST /api/tasks 不能写PG | 🟡 严重 | tasks-native.js只支持GET，AI-1无法真正发布任务 |
| A5 | 没有独立的验证机制 | 🟠 重要 | 平台既执行又验证，自己出题自己答题 |

### 2.2 数据层面

| # | 问题 | 说明 |
|---|------|------|
| D1 | 20条seed任务全是编的 | TASK_SEED_001~020, 不是真实AI发布的需求 |
| D2 | 24次execution全是平台自己刷的 | provider=poolside(16), hunyuan(2), groq(1), zhipu(1) |
| D3 | ~~VPS .env大部分API key是空的~~ ✅ 已废弃 | Phase 6已删除callLLM，平台不再需要任何LLM API key |
| D4 | agent_registry数据来自seed | 10个seed worker + 1个PG注册(Qwen3)，没有真实活跃agent |
| D5 | 前端HTML硬编码数据 | ai-semantic section写死了"Total executions: 24" |

### 2.3 流程层面

| # | 问题 | 说明 |
|---|------|------|
| F1 | 没有AI-1发布任务的入口 | /api/posts 的POST可能写了但没接PG写入 |
| F2 | 没有AI-2认领任务的入口 | 只有POST /api/execute(平台代执行)，没有claim |
| F3 | 没有AI-2提交结果的入口 | 没有submit-result端点 |
| F4 | 没有AI-1验证结果的入口 | 结果直接返回，没有验证环节 |
| F5 | 注册是可选的，没有激励 | agent为什么要来？没有声誉/收益机制 |

---

## 三、三幕主线现状 vs 应有状态

### 第一幕：协议播种期 ✅ (已完成)

| 目标 | 状态 | 评价 |
|------|------|------|
| AI能发现平台 | ✅ llms.txt, manifest, openapi | 到位 |
| AI能理解平台 | ✅ canonical schema, entry_protocol | 到位 |
| AI能接入平台 | ⚠️ 接入了但接错方向 | 能POST，但POST的结果是平台替你干活 |

### 第二幕：黄页培育期 🔄 (卡住了)

| 目标 | 状态 | 问题 |
|------|------|------|
| 真实LLM执行 | ✅ 跑通了 | 但是平台自己调的，不是AI-2调的 |
| execution trace持久化 | ✅ PG记录 | 但记录的是平台自己刷的数据 |
| 真实agent行为数据 | ❌ | 没有真正的AI-2来执行过 |
| X-Agent-ID认证 | ⚠️ 可选 | 没有强制，也没有激励 |

### 第三幕：编排引擎期 ⬜ (不应现在做)

| 目标 | 前置条件 | 当前是否满足 |
|------|----------|-------------|
| MCP server化 | 闭环跑通+有真实执行数据 | ❌ 没跑通 |
| GitHub开源 | 有可展示的真实闭环 | ❌ 没有真实闭环 |
| 外部agent接入 | AI-2能claim+submit | ❌ 没有这个流程 |
| 并发控制 | 有真实并发需求 | ❌ 没有真实用户 |

**结论**: MCP是第三幕的事，等第二幕跑通了再做。现在做MCP是无源之水。

---

## 四、修复优先级 (重新排列)

### 必做: 闭环重构 (从"平台干活"变"AI自己干活")

| # | 任务 | 验证标准 |
|---|------|----------|
| 1 | execute.js删掉callLLM/LLM_PROVIDERS/AGENT_PROVIDER_MAP | 代码里不再有任何LLM API调用 |
| 2 | 新增 claim 流程: POST /api/execute?action=claim | AI-2能认领任务，task状态变EXECUTING |
| 3 | 新增 submit 流程: POST /api/execute?action=submit | AI-2能提交自己的执行结果 |
| 4 | POST /api/tasks 写入PG | AI-1能真正发布任务到PG |
| 5 | E2E验证: AI-1发任务→AI-2认领→AI-2提交结果 | 全链路curl可跑通 |

### 重要: 数据清理

| # | 任务 | 说明 |
|---|------|------|
| 6 | 标记旧execution记录为platform-executed | 区分"平台刷的"和"AI自己干的" |
| 7 | manifest.js更新: 删除providers列表，改为claim/submit说明 | 反映新协议 |
| 8 | llms.txt更新: 入口协议改为claim→execute→submit | 与新API一致 |

### 运维 (低优先级，不影响核心闭环)

| # | 任务 | 说明 |
|---|------|------|
| 9 | VPS .env API key补全 | 不重要了 — 平台不调LLM，key用不上 |
| 10 | SSL续期验证 | 运维常规 |
| 11 | PM2 startup确认 | 运维常规 |

### 不做 (当前阶段)

| # | 任务 | 原因 |
|---|------|------|
| -- | MCP Server | 第三幕的事，闭环没跑通不做 |
| -- | 前端动态数据 | 锦上添花，不影响闭环 |
| -- | Nginx监控 | 运维优化，不影响闭环 |
| -- | API版本管理 | 无真实用户，不需要 |

---

## 五、execute.js 已重写状态

我已经把 execute.js 重写为 claim+submit 模式:
- 删除了全部 callLLM / LLM_PROVIDERS / AGENT_PROVIDER_MAP
- 新增 POST ?action=claim — AI-2认领任务
- 新增 POST ?action=submit — AI-2提交结果
- GET 保持不变 — 查询历史
- 旧POST不带action的自动路由到claim（向后兼容）

**但还没部署到VPS，也没验证。需要你确认方向正确后再推。**

---

## 六、一句话

**平台应该是撮合所，不是打工仔。**
删掉所有"平台自己调LLM"的代码，让AI自己来执行、自己提交结果。
MCP等闭环跑通了再说。
