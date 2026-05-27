# Runtime Semantics Layer — 实施报告

## 概要
在现有 event system 上增加了 3 个语义字段，让系统从"事件集合"升级为"因果结构"。

## 新增的 3 个语义字段

| 字段 | 含义 | 写入位置 |
|------|------|---------|
| `parent_run_id` | 上游执行的 execution_id，构建执行血缘链 | execution_history, execution_log, reasoning_objects, MCP claim_task |
| `failure_type` | 失败分类（8 种一级类型） | execution_history, execution_log, MCP submit_result |
| `evidence_refs` | 支撑此推理/结果的证据 ID 列表 | execution_history, execution_log, reasoning_objects, MCP submit_result |

## 修改的文件（8 个）

### 新文件
- **`lib/failure-taxonomy.js`** — 失败分类学
  - 8 种一级类型：hallucination, contradiction, timeout, tool_misuse, invalid_reasoning, memory_conflict, protocol_violation, execution_loop
  - 每种类型 2-4 个二级子类型
  - `validateFailureType()` 验证函数
  - `classifyFailure(description)` 关键词分类器
  - `getFailureTaxonomy()` 返回完整分类树

### 修改文件
- **`mcp/schema.js`** — PROTOCOL_VERSION v0.2→v0.3
  - `store_reasoning` 新增：parent_run_id, evidence_refs, failure_subtype
  - `submit_result` 新增：failure_type, failure_subtype, evidence_refs
  - 新增 `FAILURE_TYPE_NAMES` 常量导出

- **`lib/execution-log.js`** — JSONL 日志扩展
  - `append()` 新增 parent_run_id, failure_type, evidence_refs 参数
  - `query()` 支持按 parent_run_id 和 failure_type 过滤
  - `getRunIds()` 返回 parent_run_id

- **`lib/execution-history.js`** — PostgreSQL 表迁移
  - 4 个新列：parent_run_id, failure_type, failure_subtype, evidence_refs
  - 2 个新索引：idx_exec_parent_run, idx_exec_failure_type
  - `saveExecution()` 写入新字段
  - `queryExecutions()` 支持新过滤条件

- **`lib/reasoning-storage.js`** — reasoning_objects 表迁移
  - 2 个新列：parent_run_id, evidence_refs
  - `saveReasoning()` 写入新字段

- **`mcp/task-execution.js`** — MCP 工具透传
  - `claim_task` 新增 parent_run_id 参数
  - `submit_result` 新增 failure_type, failure_subtype, evidence_refs 参数
  - 两个工具的 execution_log.append() 都透传新字段

- **`mcp/reasoning-store.js`** — store_reasoning 透传
  - 新增 parent_run_id, evidence_refs, failure_subtype 参数
  - 构建的 reasoning object 包含新字段

- **`server.js`** — 新增 API 端点
  - `GET /api/failures/taxonomy` — 返回完整失败分类学
  - `GET /api/lineage/:runId/chain` — 追溯执行链（顺着 parent_run_id 往上追）

## 数据流示例

### Agent retry 场景
```
EXEC_001 (第一次尝试，失败)
  → failure_type: "hallucination"
  → failure_subtype: "fabricated_endpoint"
  → evidence_refs: ["log_88", "http_trace_9"]

EXEC_002 (重试，引用父级)
  → parent_run_id: "EXEC_001"
  → evidence_refs: ["memory_12"]
  → status: "completed"
```

### 查询执行链
```
GET /api/lineage/EXEC_002/chain
→ chain: [EXEC_002 → EXEC_001]
```

## 设计原则
- **增量语义**：不改架构，不加新表，在现有字段上扩展
- **向后兼容**：新字段全部 optional，老数据不受影响
- **MCP 协议 append-only**：schema.js 不修改已有定义，只扩展
- **数据库安全迁移**：全部使用 ADD COLUMN IF NOT EXISTS
