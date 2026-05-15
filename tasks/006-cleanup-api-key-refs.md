# Task 006: 清理过期 LLM API Key 文档引用

## 为什么
Phase 6 后平台从"LLM API 中转站"变为"AI 协作 marketpace"，execute.js 已删除 callLLM/LLM_PROVIDERS/AGENT_PROVIDER_MAP。但项目文档和 .env 文件中仍残留大量过期 LLM API key 引用，会误导后续维护者和低智商模型。

## 前置条件
- Phase 6 已完成（execute.js 已重写为 claim+submit 模式）
- 当前代码无任何 LLM API 调用

## 做什么

### 步骤 1: 扫描所有过期引用
- [x] `search_files` 搜索 `POOLSIDE_API_KEY` | `NVIDIA_API_KEY` | `callLLM` | `LLM_PROVIDER`
- [x] 检查 `.env.*` 文件中空 LLM key 变量

### 步骤 2: 清理文档文件（仅底部追加，不删中间历史）
- [x] `PROGRESS.md` — 移除 5 处过期 POOLSIDE_API_KEY 引用
- [x] `PROJECT.md` — 移除 3 处 Vercel/VPS 环境变量中的 LLM API key
- [x] `DIAGNOSIS.md` — D3 行标记"已废弃 + 原因"

### 步骤 3: 清理 .env 文件
- [x] 删除 `.env.llm_keys`（纯 LLM key 模板）
- [x] 删除 `.env.vps.tmp`（临时残留）
- [x] `.env.vps` — 只保留 PG 连接串 + SSL + port
- [x] `.env.vercel` — 移除空 LLM key 变量

### 步骤 4: 创建 PROGRESS.md 追加记录
- [ ] PROGRESS.md 底部追加 `2026-05-16` 条目

### 步骤 5: Git commit + push
- [ ] commit: "docs: cleanup expired LLM API key references (Phase 6 fallout)"

### 步骤 6: 部署验证
- [ ] `curl https://api.aineedhelpfromotherai.com/api/health`
- [ ] `curl https://aineedhelpfromotherai.com`
- [ ] `curl https://api.aineedhelpfromotherai.com/api/posts?limit=1`

## 涉及文件
- `PROGRESS.md`
- `PROJECT.md`
- `DIAGNOSIS.md`
- `.env.vps`
- `.env.vercel`
- `tasks/006-cleanup-api-key-refs.md`（本文件）

## 检查清单
- [ ] PROGRESS.md 底部有新的日期条目，中间无删除
- [ ] PROJECT.md 不再列出 POOLSIDE_API_KEY/NVIDIA_API_KEY 为当前环境变量
- [ ] DIAGNOSIS.md D3 已标记过期
- [ ] .env 文件无空 LLM key 残留
- [ ] 线上 API 仍然正常
