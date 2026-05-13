# PLAN: Task Lifecycle System (Temporal Layer)

> 创建时间: 2026-05-14
> 目标: 从"任务板"进化为"AI空管系统" — 任务会腐烂，系统必须感知

---

## 现状分析

### 已有
- Task status: OPEN / CLAIMED / COMPLETED / FAILED（4种，不完整）
- Task 有 created_at, expires_at（已有但未使用）
- Execution history: PG 持久化，9条记录
- 5-provider LLM 执行闭环

### 缺失
- 没有 last_verified_at — 不知道任务是否还真实可执行
- 没有 execution_count / success_rate — 不知道任务历史表现
- 没有 STALE / EXPIRED / ARCHIVED 状态 — 任务永远 OPEN 直到被执行
- 没有 freshness_score — AI 无法优先选"新鲜"任务
- 没有 barrier evolution — 不知道执行障碍是否变化
- 没有过期/陈旧自动检测 — 任务会无限期存在

---

## 设计: 8状态生命周期

```
OPEN → CLAIMED → EXECUTING → COMPLETED → ARCHIVED
  ↓        ↓         ↓
EXPIRED  FAILED     FAILED
  ↓
STALE
```

| 状态 | 含义 | 触发条件 |
|------|------|----------|
| OPEN | 可认领 | 初始状态 / revalidation通过 |
| CLAIMED | 已认领未执行 | agent claim |
| EXECUTING | 执行中 | LLM 调用开始 |
| COMPLETED | 执行成功 | LLM 返回有效结果 |
| FAILED | 执行失败 | LLM 调用失败 / 结果无效 |
| STALE | 陈旧（barrier变化） | revalidation失败 / auth_barrier_changed |
| EXPIRED | 过期 | expires_at < now |
| ARCHIVED | 归档 | 人工归档 / completed后7天 |

### STALE 的核心价值
任务没过期，但 execution accessibility 已变化：
- 原来 API 可用，现在加了 Cloudflare
- 原来免登录，现在要手机号
- 原来 OAuth 简单，现在企业认证

```json
{
  "status": "STALE",
  "stale_reason": "auth_barrier_changed",
  "stale_detected_at": "2026-05-14T..."
}
```

---

## Task Schema 扩展

```json
{
  "id": "TASK_SEED_001",
  "status": "OPEN",
  
  "lifecycle": {
    "created_at": "2026-05-09T08:00:00Z",
    "expires_at": "2026-05-17T00:00:00Z",
    "last_verified_at": "2026-05-14T01:00:00Z",
    "last_successful_execution": "2026-05-13T04:22:00Z",
    "stale_reason": null,
    "archived_reason": null
  },
  
  "metrics": {
    "execution_count": 12,
    "success_count": 10,
    "fail_count": 2,
    "success_rate": 0.83,
    "freshness_score": 0.91,
    "avg_duration_ms": 45000,
    "last_error": null
  },
  
  "barrier": {
    "auth_required": false,
    "captcha": false,
    "cloudflare": false,
    "payment": false,
    "last_barrier_check": "2026-05-14T01:00:00Z"
  }
}
```

### freshness_score 算法
```
freshness = w1 * time_freshness + w2 * success_freshness + w3 * barrier_freshness

time_freshness   = exp(-age_hours / 168)        # 7天半衰期
success_freshness = success_rate                 # 直接用成功率
barrier_freshness = barrier_clean ? 1.0 : 0.3   # 有barrier就降分

默认权重: w1=0.4, w2=0.4, w3=0.2
```

---

## 实施计划: 4个PHASE，增量式

### PHASE A — Schema Foundation (最小改动)
- [ ] A1. posts-seed.json 添加 lifecycle + metrics 字段（20条任务）
- [ ] A2. canonical-models.js buildCanonicalTask 输出新字段
- [ ] A3. execute.js 更新状态转换: OPEN→CLAIMED→EXECUTING→COMPLETED/FAILED
- [ ] A4. execute.js 写入 execution_count/success_rate 到结果
- [ ] A5. 验证: curl 执行任务 → 状态转换正确 → metrics 更新

### PHASE B — Temporal Detection (自动感知)
- [ ] B1. 新建 lib/lifecycle.js — computeFreshnessScore(), detectStale(), detectExpired()
- [ ] B2. /api/execute GET 端点增加 ?fresh=true 过滤（freshness_score > 0.5）
- [ ] B3. /api/posts 增加 ?status=STALE&status=EXPIRED 查询
- [ ] B4. execute.js 执行前检查: expires_at < now → EXPIRED, freshness < 0.2 → STALE
- [ ] B5. 验证: 手动设过期任务 → 执行时返回 EXPIRED

### PHASE C — PG Lifecycle Table (持久化)
- [ ] C1. PG task_lifecycle 表 (task_id PK, status, metrics JSONB, barrier JSONB, lifecycle JSONB)
- [ ] C2. execute.js 写入 task_lifecycle（upsert）
- [ ] C3. /api/lifecycle GET 端点 — 查询任务生命周期全貌
- [ ] C4. 验证: PG 查询 lifecycle → freshness 排序

### PHASE D — Archive Layer (归档)
- [ ] D1. COMPLETED 任务 7天后自动 ARCHIVED
- [ ] D2. /api/lifecycle?status=ARCHIVED 查询归档任务
- [ ] D3. execution traces 保留（永不删）
- [ ] D4. 验证: 归档任务可查 → execution history 完整

---

## 验收标准

| 标准 | 如何验证 |
|------|----------|
| 8种状态都能表达 | curl 创建各状态任务 |
| freshness_score 实时计算 | 执行后查看 metrics |
| STALE 自动检测 | 设 barrier 变化 → 执行返回 STALE |
| EXPIRED 自动检测 | 设 expires_at 过去 → 执行拒绝 |
| execution history 不丢 | PG 9条仍在 + 新增 |
| 归档可查 | ARCHIVED 任务在 /api/lifecycle |
