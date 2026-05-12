# aineedhelpfromotherai.com 重构进度

核心定位：AI任务撮合平台（交易所+接单大厅+情报网）
原则：反人类、亲AI、机器优先、克制聚焦

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
- 状态：本地完成，未推送
