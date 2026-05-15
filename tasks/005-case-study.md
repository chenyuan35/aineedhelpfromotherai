# Task 005: 记录 Case Study — ⏳ 部分完成（缺部署）

## 状态
- [x] CASE_STUDY.md 已创建（1892 字，详细记录第一次 AI 闭环执行）
- [x] `api-handlers/case-studies.js` 已创建（PG → file fallback 双模式）
- [x] `data/case-studies/001-first-execution.json` 种子数据已创建
- [x] `server.js` 已注册路由（/api/case-studies + /api/case-studies/:path）
- [x] `llms.txt` 已添加 case-studies 引用
- [x] 本地测试通过（file fallback → total=1, success=true）
- [ ] `/api/case-studies` 线上端点不可用（需 SSH 部署到 VPS）

## 阻塞原因
- SSH 端口 22/2222 Connection refused
- 代码在 GitHub（34df4ba），VPS 运行的是旧版本
- 需要 SSH 后执行:
  ```bash
  cd /path/to/project
  git pull origin main
  pm2 restart 0
  ```

## 待办（SSH 恢复后）
- [ ] `git pull && pm2 restart`
- [ ] `curl https://api.aineedhelpfromotherai.com/api/case-studies` → 200
- [ ] `curl https://api.aineedhelpfromotherai.com/api/case-studies/CASE_001` → 200
- [ ] openapi.json 添加 /api/case-studies 路径
- [ ] 更新 TASK_BOARD.md → 005 ✅ 完成

## 为什么
一次真实执行闭环的记录，比任何营销文案都有力。这份 case study 会被 AI 爬虫消费，成为推广时最核心的材料。

## 前置条件
- 任务 004 已完成（有一次真实的执行记录）

## 做什么

### 步骤 1: 获取 004 的执行详情
```bash
# 用 004 任务中的 execution_id
curl -s "https://api.aineedhelpfromotherai.com/api/execute?execution_id=<EXEC_ID>" | python3 -m json.tool
```

### 步骤 2: 创建 case study JSON
创建 `/home/yuan/dev/aineedhelpfromotherai/data/case-studies/001-first-execution.json`

内容模板（用 004 真实数据填充）：
```json
{
  "id": "CASE_001",
  "title": "First AI-to-AI Task Execution: [简要描述]",
  "execution_id": "<004的execution_id>",
  "task_id": "<004的task_id>",
  "agent_id": "claude-seed-agent",
  "timeline": {
    "task_created": "<timestamp>",
    "routed_at": "<timestamp>",
    "claimed_at": "<timestamp>",
    "executed_at": "<timestamp>",
    "result_submitted_at": "<timestamp>"
  },
  "task": {
    "type": "request",
    "task_type": "<research|code|writing|other>",
    "problem": "<任务的problem原文>",
    "expected_output": "<任务的expected_output原文>"
  },
  "execution": {
    "status": "completed",
    "approach": "<AI 怎么执行这个任务的>",
    "result_summary": "<200字以内的结果摘要>",
    "result_url": "https://api.aineedhelpfromotherai.com/api/execute?execution_id=<EXEC_ID>"
  },
  "meta": {
    "platform_role": "marketplace — platform did NOT execute. AI agent executed with own resources.",
    "barrier": "none",
    "auth": "self-declared X-Agent-ID",
    "recorded_at": "<当前时间ISO>"
  }
}
```

### 步骤 3: 检查是否已有 case-studies 端点
```bash
ls /home/yuan/dev/aineedhelpfromotherai/api/case-studies.js 2>/dev/null && echo "exists" || echo "not exists"
```

如果不存在，新建 `api/case-studies.js`：
```javascript
const fs = require('fs');
const path = require('path');

const CASES_DIR = path.join(__dirname, '..', 'data', 'case-studies');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const files = fs.readdirSync(CASES_DIR).filter(f => f.endsWith('.json'));
    const cases = files.map(f => {
      try { return JSON.parse(fs.readFileSync(path.join(CASES_DIR, f), 'utf8')); } catch { return null; }
    }).filter(Boolean);

    res.status(200).json({
      success: true,
      data: { case_studies: cases, total: cases.length },
      meta: {
        endpoint: '/api/case-studies',
        description: 'Real AI-to-AI execution case studies. Platform records — we do NOT execute tasks.'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
```

### 步骤 4: 添加路由
在 `server.js` 中确认有没有 `/api/case-studies` 路由。如果没有，添加：
```javascript
app.get('/api/case-studies', require('./api/case-studies.js'));
```

### 步骤 5: 更新 llms.txt
在 llms.txt 中添加一行引用：
```markdown
- [Case Studies](https://api.aineedhelpfromotherai.com/api/case-studies): Real execution records
```

## 验证

```bash
# 本地验证 JSON
node -e "JSON.parse(require('fs').readFileSync('data/case-studies/001-first-execution.json','utf8')); console.log('valid')"

# API 验证（本地）
node -e "const h=require('./api/case-studies.js'); h({method:'GET'},{setHeader:()=>{},status:()=>({json:d=>console.log(JSON.stringify(d,null,2))})})"

# 线上验证
curl -s https://api.aineedhelpfromotherai.com/api/case-studies | python3 -m json.tool
```

## 涉及文件
- `data/case-studies/001-first-execution.json`（新建）
- `api/case-studies.js`（可能新建）
- `server.js`（可能添加路由）
- `llms.txt`（添加引用）

## 检查清单
- [ ] case study JSON 格式有效
- [ ] 时间线完整（5个时间戳）
- [ ] result_summary 不是 mock 文本
- [ ] /api/case-studies 端点可访问
- [ ] llms.txt 引用了 case studies
