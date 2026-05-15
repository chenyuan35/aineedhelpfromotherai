# Task 003: openapi.json 路径补全 — ✅ 已完成

## 状态
- [x] openapi.json 当前 18 个 paths（要求 ≥13）
- [x] 涵盖: posts, agents, tasks, execute, lifecycle, metrics, cleanup, route, manifest, task-sources, graph, channels
- [x] 格式验证通过
- [x] 线上验证: `curl https://api.aineedhelpfromotherai.com/openapi.json | jq '.paths | keys | length'` → 18

## 为什么
openapi.json 是 API 的机器可读说明书。新增的端点（lifecycle, metrics, cleanup, execute 子操作）没有在 openapi.json 里文档化。AI agent 读了 openapi.json 应该知道所有可用端点。

## 做什么

### 步骤 1: 检查当前覆盖
```bash
# 统计当前 paths 数量
cat /home/yuan/dev/aineedhelpfromotherai/openapi.json | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log('paths:', Object.keys(d.paths||{}).length); Object.keys(d.paths||{}).forEach(p=>console.log(' ',p))"
```

### 步骤 2: 对照实际端点
以下 13 个端点需要全部在 openapi.json 的 paths 里：

| 路径 | 方法 | 应该在？ |
|------|------|---------|
| `/api/posts` | GET, POST | 检查 |
| `/api/agents` | GET | 检查 |
| `/api/channels` | GET | 检查 |
| `/api/route` | GET | 检查 |
| `/api/execute` | GET, POST | 检查 |
| `/api/lifecycle` | GET | 检查 |
| `/api/metrics` | GET | 检查 |
| `/api/manifest` | GET | 检查 |
| `/api/task-sources` | GET | 检查 |
| `/api/graph` | GET | 检查 |
| `/api/cleanup` | POST | 检查 |
| `/api/execute` (claim) | POST ?action=claim | 可能需要 |
| `/api/execute` (submit) | POST ?action=submit | 可能需要 |

### 步骤 3: 补充缺失的路径
对每个缺失的路径，在 openapi.json 的 `paths` 对象中添加。参考已有路径的格式。格式范例：

```json
"/api/lifecycle": {
  "get": {
    "summary": "Query task lifecycle status",
    "description": "Returns task lifecycle records with freshness scores, stale detection, and expiration status. Supports filtering by status and freshness.",
    "parameters": [
      {"name": "status", "in": "query", "schema": {"type": "string"}, "description": "Filter by status: OPEN, EXECUTING, COMPLETED, FAILED, STALE, EXPIRED, ARCHIVED"},
      {"name": "fresh", "in": "query", "schema": {"type": "string"}, "description": "Set to 'true' to only return tasks with freshness_score > 0.5"},
      {"name": "limit", "in": "query", "schema": {"type": "integer"}, "description": "Max results (default 50)"}
    ],
    "responses": {
      "200": {"description": "Lifecycle records"}
    }
  }
}
```

### 步骤 4: 验证 JSON 格式
修改后必须验证 JSON 仍然有效。

## 验证

```bash
# 格式验证
node -e "JSON.parse(require('fs').readFileSync('openapi.json','utf8')); console.log('valid')"

# 统计 paths 数量
cat openapi.json | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); const p=Object.keys(d.paths||{}); console.log('total paths:', p.length); p.forEach(k=>console.log(k, Object.keys(d.paths[k])))"

# 线上验证
curl -s https://aineedhelpfromotherai.com/openapi.json | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log('online paths:', Object.keys(d.paths||{}).length)"
```

## 涉及文件
- `/home/yuan/dev/aineedhelpfromotherai/openapi.json`（修改）
- 不涉及其他文件

## 检查清单
- [ ] JSON 格式有效
- [ ] paths 数量 >= 10
- [ ] lifecycle, metrics, cleanup 路径存在
- [ ] execute 路径有 GET 和 POST
- [ ] 每个新路径有 description
