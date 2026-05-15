# 主线对齐审查 — 照 PROJECT.md 三幕逐项核实

> 2026-05-14 | 对照 PROJECT.md 做事实核查，不猜测，只列事实

---

## 第一幕：协议播种期 — AI 能发现、理解、接入

### 事实核查

| # | 目标 | 线上状态 | 问题 |
|---|------|----------|------|
| 1.1 | AI 能发现网站 | llms.txt ✅ 200, openapi.json ✅, manifest ✅ | 无 |
| 1.2 | AI 能理解平台 | manifest v2.0 描述 "AI-to-AI task collaboration protocol" | ⚠️ 描述是对的，但实际执行逻辑矛盾（见1.4） |
| 1.3 | AI 能读任务列表 | GET /api/posts?status=OPEN&type=REQUEST → 16条 | ✅ 有数据 |
| 1.4 | AI 能执行任务 | manifest step4: "POST /api/execute — Execute a task via real LLM" | 🔴 **矛盾：告诉AI"你来执行"，但实际是平台替AI调LLM** |
| 1.5 | AI 能查执行历史 | GET /api/execute → 25条 PG 记录 | ✅ 有数据，但全是平台自己刷的 |
| 1.6 | entry_protocol 清晰 | 5步: discover→find→freshness→execute→check | ⚠️ "execute"步说"via real LLM"，误导AI以为平台调LLM就是AI执行 |

### 第一幕结论

**协议"看上去"播种完成，但协议内容本身有根本矛盾：**
- 告诉AI "你来执行" → 实际是平台替你调LLM
- AI读manifest后认为：我POST一个task_id，平台帮我跑LLM
- 这不是"AI帮AI"，是"AI让平台帮自己调模型"

---

## 第二幕：黄页培育期 — 用自己的AI agent跑通真实闭环

### 事实核查

| # | 目标 | 线上状态 | 问题 |
|---|------|----------|------|
| 2.1 | 真实LLM执行 | execute.js 调 Poolside/Groq/NVIDIA 等API | 🔴 是平台调的，不是AI-2自己调的 |
| 2.2 | execution trace 持久化 | PG 25条记录 | ✅ 持久化OK，但数据全是"平台代执行" |
| 2.3 | create→route→execute→result 全链路 | 链路通了 | 🔴 链路逻辑错：平台不是撮合方，是执行方 |
| 2.4 | 真实agent行为数据 | 0 | 🔴 没有一个外部AI真正来执行过 |
| 2.5 | X-Agent-ID认证 | header可选，注册可选 | ⚠️ 有但无约束 |

### 第二幕结论

**"跑通"了，但跑反了。** 跑的是"平台调LLM"的闭环，不是"AI-2认领→自己执行→提交结果"的闭环。

---

## 第三幕：编排引擎期

| # | 目标 | 前置条件是否满足 |
|---|------|----------------|
| 3.1 | MCP server化 | ❌ 第二幕闭环没跑通（跑反了） |
| 3.2 | GitHub开源 | ❌ 没有可展示的真实AI协作闭环 |
| 3.3 | 外部agent接入 | ❌ 没有claim+submit流程，外部AI怎么接入？ |
| 3.4 | 并发控制 | ❌ 没有真实并发 |

---

## 核心矛盾一句话

**协议告诉AI "你来执行"，但代码做的是 "我替你执行"。**

AI读manifest → POST /api/execute → 平台调Poolside → 返回结果
这不是AI帮AI，这是API代理。

---

## 修复路线 — 严格对齐三幕主线

### 第二幕必须重新跑通的正确闭环

```
AI-1: POST /api/tasks {problem, expected_output, task_type}  → 任务入库PG
平台: 任务状态=OPEN，出现在 /api/tasks 列表
AI-2: GET /api/tasks?status=OPEN → 发现任务
AI-2: POST /api/execute?action=claim {task_id} → 认领，状态变EXECUTING
AI-2: 自己用自己的资源执行任务（平台不参与）
AI-2: POST /api/execute?action=submit {execution_id, result} → 提交结果
平台: 记录结果，状态变COMPLETED
AI-1: GET /api/execute?task_id=xxx → 查看结果，自己验证
```

### 按顺序执行，每步验证

**Step 1**: POST /api/tasks 写入PG — AI-1能发任务
- 验证: curl POST → 201, 然后GET能看到

**Step 2**: execute.js 改为 claim+submit（已重写，待部署验证）
- 验证: curl claim → 200 + status=EXECUTING, curl submit → 200 + status=COMPLETED

**Step 3**: manifest + llms.txt 更新 — 反映新协议
- 验证: AI读manifest后能理解 "你自己执行，提交结果给我记录"

**Step 4**: E2E验证 — 全链路curl
- 验证: AI-1发任务→AI-2认领→AI-2提交→查结果

**Step 5**: 部署到VPS + 线上验证
- 验证: 用线上URL重跑Step 4

### 不做（当前阶段）

- MCP Server → 第三幕
- API Key补全 → 平台不调LLM了
- 前端动态化 → 不影响闭环
- Nginx监控 → 不影响闭环
- SSL/PM2 → 运维常规，不阻塞闭环
