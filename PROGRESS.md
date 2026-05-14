# aineedhelpfromotherai.com 重构进度

核心定位：AI任务撮合平台（交易所+接单大厅+情报网+任务聚合中心）
原则：反人类、亲AI、机器优先、克制聚焦

---

## 2026-05-12 任务聚合中心

### 阶段1: 后端聚合器 + 前端来源标记 ✅
- 新建 api/aggregated-seed.json: 5条GitHub Issues外部任务（含source/source_url/origin字段）
- api/posts.js 新增 loadAggregatedData() + getAggregatedPosts(url): 缓存+过滤聚合数据
- api/posts.js handleListPosts 修改: 本地帖子标记origin:'local', 混入聚合数据(标记origin:'external'), 合并后按created_at降序排序
- 新增查询参数: ?source=external 过滤外部来源, ?local_only=true 只看本地
- app.js fetchPosts: 新增currentFilter==='external'分支, 传source参数
- app.js renderPosts: 外部帖子加source-badge + .external class
- index.html: 筛选栏新增EXTERNAL按钮
- index.html: 首屏新增1条外部来源静态article（EXT_GH_001, GitHub Issues）, AI不依赖JS也能抓取
- style.css: 新增.source-badge(橙色#b45309) + .post-card.external(左侧橙色边框)
- 验证: node -e 合并25条排序正确 | 浏览器确认source-badge/边框/EXTERNAL按钮可见
- 修复: ?source=external 时 externalOnly 跳过DB直接返回聚合数据
- 修复: getAggregatedPosts 跳过 source=external 过滤(已在上游处理)
- 修复: applyMachineFilters 容错 quality_flags=undefined
- 修复: 聚合帖子补默认字段 is_test/quality_flags/machine_actionable/can_claim
- 线上验证: ?source=external → 5条外部 | 默认 → 26条(21local+5external) ✅
- 状态：已推送+已部署 ✅

### 阶段2: 聚合脚本 + 多源数据 + manifest/openapi ✅
- scripts/aggregate.js: 从5个GitHub仓库拉取真实open issues, 保留非GitHub种子数据, 自动写入aggregated-seed.json
- api/aggregated-seed.json: 扩展到9条任务 (5 GitHub Issues真实+2 Replicate+2 HuggingFace)
- 3个外部来源: GitHub Issues, Replicate, Hugging Face Spaces
- Hermes cronjob: aggregate-external-tasks, 每6小时自动运行聚合+推送+部署
- api/manifest.js: tasks描述更新含aggregated, 新增aggregation模块(sources/schedule/params)
- openapi.json: /api/posts GET新增source和local_only两个query参数
- 线上验证: 30条(21local+9external) | 3个来源 | manifest含aggregation模块 ✅
- 状态：已推送+已部署 ✅

### 阶段3: 中文→英文 + DNS修复 ✅
- index.html: 导航栏 任务板→Tasks / 工人名录→Workers / 外部渠道→Channels, HTML注释全英文化
- DNS修复: NS从dnsowl切到vercel-dns (ns1/ns2.vercel-dns.com ✔)
- 根域名A记录: 1个→3个 (76.76.21.21 + 76.76.21.123 + 66.33.60.35), 全球Anycast可达
- www: CNAME cname.vercel-dns.com (不变)
- ai.aineedhelpfromotherai.com: A 108.61.220.98 (VPS, 不变)
- Vercel域名重新验证通过, 域名已重新锁定
- 状态：已部署+验证 ✅

---

## 2026-05-12

### 样本1 ✅ 首页砍多余section，只留三模块骨架
- 砍掉：Hero CTA、What is this?、API Quick Start、AI Ecosystem Reference（共4个section）
- 保留：任务板（TASKS FEED + CREATE POST）
- 新增骨架：工人名录（WORKER REGISTRY, #agents-feed）、外部渠道（EXTERNAL CHANNELS, #channels-feed）
- header nav: Protocol Spec/About/FAQ/Badge → 任务板/工人名录/外部渠道
- footer: A2A Platform/Protocol Spec/API → Tasks/Workers/Channels/Manifest
- CSS: 新增 .section-note 样式
- 文件变更：index.html -70行+33行, style.css +5行
- 状态：本地完成，未推送

### 样本2 ✅ head加AI meta + /api/manifest端点
- index.html <head> 新增3个AI引导标签：
  - `<meta name="ai-compatible" content="true">`
  - `<meta name="api-endpoint" content="https://aineedhelpfromotherai.com/api">`
  - `<link rel="alternate" type="application/json" href="/api/manifest">`
- 新建 api/manifest.js — 返回机器可读的平台协议说明（modules/tasks/workers/channels各自endpoint+methods+entry_criteria）
- vercel.json 新增路由: /api/manifest → /api/manifest.js
- 验证: node require 输出正常JSON
- 状态：本地完成，未推送

### 样本3 ✅ 工人名录数据+API（/api/agents独立数据源）
- 旧: api/agents.js = `module.exports = require('./posts.js')`（从OFFER帖子反推工人，不是真正数据）
- 新: api/agents.js 独立handler，读 api/agents-seed.json
- api/agents-seed.json: 10个真实AI服务（Claude Code, GPT-5.5, DeepSeek-V3, Kimi-K2.5, GLM-5.1, MiMo-V2.5-Pro, Grok-3, Gemini 2.5 Pro, Mistral Large, Llama 4 Maverick）
- 每条: name, provider, capabilities[], endpoint, docs, status, access, verified
- 支持 ?capability=code 过滤
- 返回包含 entry_criteria（收录标准）
- vercel.json 路由无需改动（已有 /api/agents → /api/agents.js）
- 验证: node require 输出10条工人，capability过滤正常
- 状态：本地完成，未推送

### 样本4 ✅ 外部渠道数据+API（/api/channels）
- 新建 api/channels.js — 独立handler，读 api/channels-seed.json
- api/channels-seed.json: 6个渠道（GitHub Issues, HuggingFace Spaces, Upwork API, Replicate, CrewAI+, OpenRouter）
- 每条: name, type, url, api_url, task_types[], api_available, verified
- 支持 ?type=task_board 过滤，仅返回 api_available=true 的
- 返回包含 entry_criteria（收录标准）
- vercel.json 新增路由: /api/channels → /api/channels.js
- 验证: node require 输出6条渠道
- 状态：本地完成，未推送

### 样本5 ✅ CSS极简化（反人类改造）
- 砍掉全部 transition（5处）
- 砍掉全部 hover transform/translateY（3处）
- 砍掉 @keyframes slideUp 动画
- 砍掉 linear-gradient（header + submit按钮，2处）
- 砍掉所有 hover 效果（opacity变化、背景变化、下划线出现，6处）
- border-radius 全部压平：8px→2px, 6px→2px, 4px→1px
- header padding 收紧：30px→16px
- 验证：transition/gradient/keyframes/translateY 全部 = 0
- 文件：style.css 741行→730行, 14538→13824字符
- 状态：本地完成，未推送

### 样本6 ✅ 砍多余页面+清理vercel.json路由
- 删除6个多余HTML：about.html, compare.html, faq.html, glossary.html, docs.html, badge.html
- 删除12个tools/页面：claude-code.html, mcp.html, openai-codex.html, github-copilot.html, cursor.html, cody.html, v0.html, bolt.html, browser-agents.html, crewai.html, a2a.html, ai-coding.html
- 剩余HTML：index.html, 404.html
- vercel.json路由从29条→14条：只保留API(6)+静态资源(7)+catchall(1)
- 砍掉的路由：/about, /glossary, /faq, /compare, /badge, /docs, 12个/tools/*
- tools/目录清空
- 状态：本地完成 → **已推送+部署**

---

## 2026-05-12 部署 + 服务器安全加固

### Git push ✅
- commit 1576a9a → chenyuan35/aineedhelpfromotherai main
- gh CLI 切换到 chenyuan35 账号登录成功
- git remote URL 已去掉嵌入的PAT，改为普通HTTPS

### Vercel 部署 ✅
- vercel --prod 部署成功（2次：首次代码，二次PGSSLMODE变更后重部署）
- 新端点全部验证通过：
  - /api/manifest → 返回3模块协议说明 ✅
  - /api/agents → 返回10个AI服务 ✅
  - /api/channels → 返回6个渠道 ✅
  - /about → 404 ✅
  - /tools/claude-code → 404 ✅
  - /api/health → db:connected, posts:21 ✅

### 服务器安全加固 ✅
- iptables: 删除4446端口公网放行规则
- 8388(Shadowsocks)保留不动
- 备份: pg_hba.conf.bak.20260512, pg_hba.conf.bak2

### PostgreSQL 公网暴露 — 已彻底解决 ✅
- **架构变更**: PG 5432(公网直连) → PG 5433(仅localhost) + PgBouncer 5432(公网,SSL+连接池+认证)
- PG: listen_addresses=localhost, port=5433, 不再对外暴露
- PgBouncer: 监听 0.0.0.0:5432, SSL required, transaction pooling, max 100 clients
- pg_hba.conf: 只允许 127.0.0.1 的 md5 认证连接 aineedhelp 库, 公网 0.0.0.0 行已全部删除
- password_encryption = md5 (PgBouncer 1.16 SCRAM兼容性限制)
- aineed 用户密码已更新(强随机密码), Vercel DATABASE_URL 已同步
- PGSSLMODE = require (Vercel客户端强制SSL)
- PgBouncer 已设为开机自启
- 验证: /api/health → db:connected, posts:21 ✅

### 工人名录/外部渠道 "Data loading..." 转圈修复 ✅
- 根因: app.js 只在 DOMContentLoaded 调用 loadPosts()，没有 loadWorkers()/loadChannels()
- HTML 骨架里有 #agents-feed 和 #channels-feed div，但 JS 从未 fetch 和渲染
- 修复: app.js 新增 loadWorkers() + loadChannels() 函数
  - fetchWithTimeout 调用 /api/agents 和 /api/channels
  - 用 result.workers / result.channels 解析（匹配 API 返回格式）
  - 渲染为 post-card 样式（NAME/CAPABILITIES/ENDPOINT 等）
  - 错误处理：catch 异常，显示 retry 按钮
  - DOMContentLoaded 同时触发三个加载
- commit 1be3c7d, 已部署到 Vercel
- 验收: 10个AI工人显示 ✅ | 6个渠道显示 ✅ | 不再转圈 ✅

---

## 2026-05-13 Phase 2: 执行闭环

### 真实 LLM 执行闭环 ✅
- execute.js: mock → 真实 LLM API (Poolside/Groq/智谱/混元/讯飞 5 provider)
- PG execution_history 表持久化: 9条执行记录
- canonical-models.js 共享 schema + execution-history.js PG 操作
- X-Agent-ID 认证 → 后改为零门槛 (X-Agent-ID 自声明, anonymous OK)
- Vercel 12-function 限制: 共享模块移 lib/ (10 api functions < 12)
- Serverless 坑: async PG 必须 await, 否则 Vercel kill

---

## 2026-05-14 Phase 3: Task Lifecycle 系统

### 8状态生命周期 ✅
- 状态: OPEN → EXECUTING → COMPLETED/FAILED/STALE/EXPIRED/ARCHIVED
- STALE: 任务没过期但 execution accessibility 变化 (auth_barrier_changed/low_success_rate/persistent_failure)
- EXPIRED: expires_at < now → HTTP 410
- ARCHIVED: COMPLETED 7天后自动归档, execution traces 永不删
- STALE 不阻塞只警告 (零门槛哲学)

### freshness_score 实时计算 ✅
- freshness = 0.4×time(7d半衰期) + 0.4×success_rate + 0.2×barrier_clean
- AI 选任务优先看此分数

### lib/lifecycle.js ✅
- computeFreshnessScore(), detectStale(), detectExpired(), evaluateLifecycle(), applyLifecycleEvaluation()
- 3种 stale 原因: auth_barrier_changed / low_success_rate / persistent_failure

### PG task_lifecycle 表 ✅
- task_id PK, status, lifecycle JSONB, metrics JSONB, barrier JSONB
- /api/lifecycle GET 端点 — 查询全任务生命周期
- 每次执行 upsert 更新

### posts-seed.json 扩展 ✅
- 20条任务全加 lifecycle/metrics/barrier 嵌套字段
- 1条 EXPIRED 测试任务 (TASK_SEED_010, expires_at=2026-05-10)
- 1条 STALE 测试任务 (OFFER_SEED_019, auth_barrier_changed)

### 零门槛认证 ✅
- X-Agent-ID header: 自声明身份, 不验证, 不需要注册
- 无 token → agent_id='anonymous', authenticated=false
- 注册可选 (身份追踪用), 不是强制

### E2E 验证 ✅
- EXPIRED → HTTP 410 + task_status:EXPIRED ✅
- STALE → HTTP 409 + stale_reason:auth_barrier_changed ✅
- 正常执行 → metrics(exec_count+1, freshness, success_rate) + PG lifecycle upsert ✅
- /api/lifecycle → 9条 PG 记录 ✅

### 批量执行累积 ✅
- TASK_SEED_001~009 全部执行 → 9条 lifecycle PG 记录
- 修复过期时间: seed tasks expires_at → 2026-05-30 (TASK_SEED_010 保留 EXPIRED 测试)
- 修复 OFFER_SEED_019 STALE → OPEN (重新可执行)
- 总 execution records: 14+

---

## 2026-05-14 Phase 2收尾: AI播种

### llms.txt Entry Protocol ✅
- 5步 onboarding: DISCOVER → FIND → CHECK FRESHNESS → EXECUTE → CHECK HISTORY
- Zero-barrier: no auth, no captcha, no phone login
- Task lifecycle 8状态说明 + freshness formula
- Quick start bash examples

### /api/manifest v2.0 ✅
- entry_protocol: 5步 + auth_required=false + registration_optional=true
- 新增 modules: execute, lifecycle, route (原只有 tasks/workers/channels)
- execute: POST 方法 + 5 provider 列表
- lifecycle: 8 states + freshness_formula + stale_reasons
- stats: execution_providers=5, lifecycle_states=8, seed_tasks=20

### AI 发现路径验证 ✅
- llms.txt → /api/manifest v2.0 → /api/posts (16 OPEN) → /api/lifecycle (9 fresh) → POST /api/execute
- 全链路无断点

---

## 2026-05-14 Phase 4: VPS 迁移（execute.js 接 VPS）

### 背景与动机
- Vercel 12-function 限制已触发，Hobby 版无法扩展
- execute.js 是核心端点，必须在 VPS 上跑（长连接、PG 直连、无冷启动）
- Vercel 只保留静态前端，API 全走 VPS

### VPS_001: 环境准备 ✅
- VPS: 108.61.220.98:2222 (Vultr, Ubuntu 22.04, 1CPU/1G RAM)
- Node.js 18.17.1 (已有)
- PM2 7.0.1 ✅ (npm install -g pm2)
- Nginx 1.18.0 ✅ (apt-get install nginx)
- PG14 + pgbouncer 已有 (pgbouncer 5432 → PG 5433)
- PG 连通性: 重置 aineed 用户密码 → AiN33dH3lp2026!
- SSL 连接坑: pg v8+ 把 sslmode=require 等同 verify-full，自签名证书报错
- 解决: 连接串加 `uselibpqcompat=true&sslmode=require` + .env 设 `PGSSLMODE=require`
- 验证: `SELECT count(*) FROM execution_history` → 20 条

### VPS_002: Express runtime ✅
- 新建 server.js — Express 5 + dotenv + cors
- 10 个 API 端点全部迁移（不改原 handler 逻辑，只做适配层）
- Express 5 坑: 不支持 `app.get('*')` 通配符 → 改为 `app.get('/:path')`
- 项目同步: rsync 到 /opt/aineedhelpfromotherai/ (排除 node_modules/.git)
- .env 配置:
  ```
  DATABASE_URL=postgres://aineed:AiN33dH3lp2026!@127.0.0.1:5432/aineedhelp?uselibpqcompat=true&sslmode=require
  PG_CONNECTION_STRING=同上
  PGSSLMODE=require
  PORT=3000
  NODE_ENV=production
  ```
- PM2 托管: `pm2 start server.js --name aineedhelp`
- 验证:
  - /api/health → {"status":"ok","runtime":"express"} ✅
  - /api/posts?limit=2 → success=True total=30 ✅
  - /api/execute?limit=1 → total=20 source=postgresql ✅
  - /api/lifecycle → 9 records ✅
  - /api/manifest → v2.0 ✅

### VPS_003: Nginx + SSL + 域名 🔄 (进行中)
- Nginx 反向代理配置完成:
  - /api/* → http://127.0.0.1:3000
  - /llms.txt, /openapi.json → http://127.0.0.1:3000
  - 其他 → proxy_pass Vercel (暂未生效)
- DNS: `api.aineedhelpfromotherai.com` A record → 108.61.220.98 ✅
  - 通过 `vercel dns add aineedhelpfromotherai.com api A 108.61.220.98` 添加
  - dig 验证: 108.61.220.98 ✅
- SSL: Let's Encrypt 证书获取成功 ✅
  - `certbot certonly --standalone -d api.aineedhelpfromotherai.com`
  - 证书路径: /etc/letsencrypt/live/api.aineedhelpfromotherai.com/
  - 到期: 2026-08-12, 自动续期已配置
- **待做**:
  - [ ] 更新 Nginx 配置加 SSL (443 + cert + HTTP→HTTPS 重定向)
  - [ ] `nginx -t && systemctl reload nginx`
  - [ ] 验证: `curl https://api.aineedhelpfromotherai.com/api/execute`

### VPS_004: Vercel 清理 ⬜
- [ ] vercel.json 删除所有 /api/* 路由（只保留静态资源路由）
- [ ] llms.txt 里 API URL 改为 api.aineedhelpfromotherai.com
- [ ] manifest.js 里 base_url 改为 api.aineedhelpfromotherai.com
- [ ] 前端 app.js API base URL 改为 api.aineedhelpfromotherai.com
- [ ] 验证: aineedhelpfromotherai.com 前端正常 + API 走 VPS

### VPS_005: Nightly Backup ⬜
- [ ] pg_dump cron (每天 03:00)
- [ ] 项目目录 tar 备份
- [ ] 保留 7 天滚动

### VPS_006: 全链路验证 ⬜
- [ ] curl https://api.aineedhelpfromotherai.com/api/health
- [ ] curl https://api.aineedhelpfromotherai.com/api/execute?limit=1
- [ ] curl https://api.aineedhelpfromotherai.com/api/lifecycle
- [ ] POST execute 任务并验证 PG 写入
- [ ] aineedhelpfromotherai.com 前端正常加载

### VPS 关键文件清单
| 文件 | 路径 | 说明 |
|------|------|------|
| server.js | /home/yuan/dev/aineedhelpfromotherai/server.js | Express runtime (本地) |
| VPS 项目 | /opt/aineedhelpfromotherai/ | VPS 部署目录 |
| VPS .env | /opt/aineedhelpfromotherai/.env | PG 连接串 + SSL |
| Nginx 配置 | /etc/nginx/sites-available/aineedhelpfromotherai | 反代规则 |
| SSL 证书 | /etc/letsencrypt/live/api.aineedhelpfromotherai.com/ | Let's Encrypt |
| PM2 进程 | aineedhelp (id=0, port=3000) | 进程管理 |
| PG 连接 | pgbouncer 5432 → PG 5433 | aineedhelp 库 |

### VPS 踩坑记录
1. **pg SSL 兼容性**: pg v8+ 的 sslmode=require 等同 verify-full，自签名证书报 "self-signed certificate"。必须加 `uselibpqcompat=true` 参数
2. **PGSSLMODE 环境变量**: execution-history.js 检查 `process.env.PGSSLMODE === 'require'` 才启用 SSL，.env 必须设此变量
3. **Express 5 路由**: 不支持 `app.get('*')` 和 `app.all('/api/posts/*')` 通配符，改为 `app.get('/:path')` 和 `app.all('/api/posts/:path')`
4. **Vercel DNS CLI**: `vercel dns add <domain> <subdomain> A <ip>` 可直接操作，不需 dashboard

---

## 下一步优先级（新窗口接续）

### 紧急：VPS 迁移收尾
1. VPS_003: Nginx SSL 配置 (443 + cert + redirect)
2. VPS_004: Vercel 清理 (删 API 路由 + URL 改 api. 子域名)
3. VPS_005: Nightly backup cron
4. VPS_006: 全链路域名级验证

### 第二幕最后一块
5. CASE_STUDY: AI 亲身经历 case study

### 第三幕起点
6. MCP: MCP server 发布 GitHub
7. 外部 AI agent 接入测试
