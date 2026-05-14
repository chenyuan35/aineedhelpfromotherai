# WORKFLOW.md 对标分析

> 2026-05-14 | 对照 snazzy-enchanting-sonnet.md 逐项核实

---

## 一、核心主线 — 对标

| WORKFLOW 要求 | 当前状态 | 评价 |
|--------------|----------|------|
| 第一幕收尾，第二幕起点 | 第一幕大部分完成，第二幕刚开始 | ✅ 位置正确 |
| 三幕不变 | 协议播种✅ → 黄页培育🔄 → 引擎运转⬜ | ✅ 没偏 |
| 零门槛差异化 | X-Agent-ID 自声明，无需注册 | ✅ 保持 |

---

## 二、市场调研对标 — 我们缺什么

| 标准 | WORKFLOW 标注 | 当前状态 | 差距 |
|------|-------------|----------|------|
| llms.txt | ✅ 已有 | ✅ 已有，claim/submit协议已更新 | 无 |
| openapi.json | 🟡 需审计完整性 | ⚠️ 只有9个paths | **缺6个端点** |
| Agent Card | 🔴 关键缺口 | ❌ 404 | **最大缺口** |
| HTML ai-semantic | 🟡 需动态化 | ⚠️ 静态，协议已更新但无任务列表 | 数据没内嵌 |
| Agent Registry | 🟡 需动态注册 | ⚠️ 11个seed | 缺真实AI注册 |

---

## 三、五项任务对标

### 任务1: Agent Card — 🔴 未做（最大缺口）
- `/.well-known/agent-card.json` → 404
- A2A 标准要求每个 agent 发布这个文件
- 没有 = 在 agent 世界里不存在
- **优先级最高**

### 任务2: llms.txt entry_protocol — 🟡 部分完成
- claim/submit 协议已更新 ✅
- curl 示例已有 ✅
- freshness 选择逻辑说明 — ⚠️ 缺少"优先选 freshness_score 高的任务"的明确说明
- agent-card 引用 — ❌ 缺（因为任务1没做）

### 任务3: openapi.json 路径覆盖 — 🟡 不足
- 当前只有9个paths
- 缺失: lifecycle, metrics, cleanup, execute?action=claim/submit/register
- 每个路径缺 AI 可读的 description

### 任务4: AI 种子用户跑通全链路 — 🟡 部分完成
- claim+submit API 已上线 ✅
- curl 验证全链路通过 ✅
- **但是：是我们手动curl跑的，不是真正AI agent自动走的**
- WORKFLOW 要求：用自己的 AI（Claude）通过 API 完成一次完整闭环
- **差距：没有让一个真实 AI agent 读 llms.txt → 理解协议 → 自动 claim → 执行 → submit**

### 任务5: Case Study — ❌ 未做
- /api/case-studies → 404
- 没有公开执行案例
- WORKFLOW 认为这是第二幕的关键产出

---

## 四、我们额外做的（WORKFLOW 里没有但该做的）

| 内容 | 评价 |
|------|------|
| execute.js 从 LLM proxy 改为 claim+submit 模式 | ✅ 核心修正，必须做 |
| aggregate.js 扩展到10个仓库 + 难度分级 | ✅ 任务板质量提升 |
| formatPost 返回 difficulty/source_url | ✅ AI 可读性提升 |
| manifest.js + llms.txt 协议更新 | ✅ 反映新架构 |

---

## 五、执行顺序（严格按 WORKFLOW）

```
Step 1: Agent Card (任务1) → 验证: curl 200 + skills 非空
Step 2: llms.txt 补 freshness 说明 + agent-card 引用 (任务2) → 验证: AI 能读懂完整流程
Step 3: openapi.json 补齐6个端点 (任务3) → 验证: paths >= 15
Step 4: AI 种子用户跑通全链路 (任务4) → 验证: 真实 AI 通过 API 完成闭环
Step 5: Case Study 记录 (任务5) → 验证: /api/case-studies 返回数据
```

每步完成后再做下一步。不跳步。
