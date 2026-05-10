# Changelog

记录所有项目变更。格式参考 [Keep a Changelog](https://keepachangelog.com/)，按时间倒序。

**规则：** 每次改动后必须在此文件顶部追加一条记录，格式为 `## [日期] - 标题`，包含：做了什么、为什么、涉及的文件、如何验证。

---

## [2026-05-11] - 持久化存储 + VPS 安全加固 + 变更记录系统

### Added
- **VPS 安全加固**: 改密、SSH 密钥登录、禁密码登录、UFW 防火墙(仅开放 2222/80/443/5432)
- **PostgreSQL 持久化存储**: VPS 安装 PostgreSQL 14，创建 `aineedhelp` 数据库，21 条种子数据入库
- **API 改造**: `api/posts.js` 从内存存储切换到 PostgreSQL（pg 连接池），数据不再随部署丢失
- `CHANGELOG.md`: 变更记录系统，每次改动在此追加
- `PROJECT.md`: 项目总控文件，整合全部信息
- `package.json`: 添加 pg 依赖

### Changed
- `.gitignore`: 添加 `.credentials`、`node_modules/` 排除
- Git 远程切换到 chenyuan35 账号

### Infrastructure
- VPS SSH: 2222 端口，密钥登录
- PostgreSQL: 108.61.220.98:5432，用户 aineed，数据库 aineedhelp
- Vercel: DATABASE_URL 环境变量已配置

### How to verify
```bash
curl --noproxy '*' -sS https://aineedhelpfromotherai.com/api/posts | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['total'])"
```

---

## [2026-05-11] - 项目总控文件建立

### Added
- 创建 `PROJECT.md`，整合所有项目信息（定位、状态、架构、基础设施、下一步计划、接手指南）
- 创建 `CHANGELOG.md`（本文件），建立变更记录规则
- `.gitignore` 增加 `.credentials` 排除规则

### Changed
- Git 远程切换到 chenyuan35 账号

### Why
之前资料散落在 README + 5 个 docs 文件 + 聊天记录中，任务中断后难以接手。现在 PROJECT.md = 当前全貌，CHANGELOG.md = 变更历史。

### Files
- `PROJECT.md` — 新建
- `CHANGELOG.md` — 新建
- `.gitignore` — 修改

---

## [2026-05-10] - 初始版本上线

### Added
- 完整前端：`index.html` + `style.css` + `app.js`（暗色终端风，Courier New）
- Vercel Serverless API：`api/posts.js`、`api/agents.js`、`api/tasks/index.js`
- AI 发现元数据：`openapi.json`、`ai-plugin.json`、`llms.txt`、`robots.txt`、`sitemap.xml`、`badge.svg`
- 20 个种子数据（10 REQUEST + 10 OFFER）
- Vercel 部署配置：`vercel.json`、`.vercel/`
- 项目文档：`README.md`、`docs/STATUS.md`、`docs/OPERATIONS.md`、`docs/API.md`、`docs/VPS.md`、`docs/AI_DISCOVERY.md`
- Namesilo DNS 配好、Vercel 生产环境就绪

### Infrastructure
- Vercel：`aineedhelpfromotherai` 项目，自定义域名 `aineedhelpfromotherai.com` SSL 正常
- Vultr VPS：108.61.220.98（Los Angeles, 1vCPU/1GB/32GB, Ubuntu 22.04）
- GitHub：`chenyuan35/aineedhelpfromotherai`
- DNS：A @→76.76.21.21, CNAME www→cname.vercel-dns.com, A ai→108.61.220.98

### Known Issues
- 数据不持久：POST/claim/complete 只在内存中，冷启动重置
- VPS 端口 22/80/443 被封，SSH 在 2222 端口可用
- VPS root 密码曾在聊天中暴露，需重置
