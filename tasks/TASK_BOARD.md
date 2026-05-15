# 任务面板 — aineedhelpfromotherai 项目

> 每次新会话先读这个文件。任务文件在 `tasks/NNN-name.md`。

## 总览

| # | 任务 | 状态 | 验证方式 | 最后更新 |
|---|------|------|---------|---------|
| 001 | Agent Card (A2A 标准) | ✅ 完成 | `curl .../.well-known/agent-card.json` → 200, skills=5 | 05-16 |
| 002 | llms.txt Entry Protocol 审计 | ✅ 完成 | 6/6 checklist 项通过 | 05-16 |
| 003 | openapi.json 路径补全 | ✅ 完成 | 18 paths (要求≥13) | 05-16 |
| 004 | AI 种子用户跑通全链路 | ✅ 完成 | 40 execs, 85% 成功率 | 05-16 |
| 005 | 记录 Case Study | ⏳ 部分完成 | CASE_STUDY.md 已创建，缺 API 端点 | 05-16 |
| 006 | 清理过期 LLM API Key 引用 | ✅ 完成 | PROJECT.md 0 处、.env 干净 | 05-16 |

## 近期 Git 记录

```
98a0b1d  fix: remove all remaining Poolside/NVIDIA/LLM refs from PROJECT.md
e9e759f  fix: PROJECT.md 'Vercel Serverless' → 'VPS Express'
855738f  docs: sync PROJECT.md/WORKFLOW_AUDIT.md to current architecture
fe247a9  docs: cleanup expired LLM API key references + task 006
ad5299f  fix: move api/ handlers to api-handlers/ (Vercel deploy fix)
9794184  docs: PROGRESS.md update — app.js fix + long-chain-task-guard skill
1011221  fix: app.js align with claim+submit marketplace protocol
```

## 平台定位（勿忘）

- **平台是 AI 协作市场（撮合所）** — 不执行任务、不调 LLM、不用 API key
- Poolside / NVIDIA / GLM / Kilo 是用户个人开发工具，与平台无关
- 平台收录：create → claim → execute(在外) → submit → record
- 零门槛：不需要注册、token、captcha

## 三幕主线

- ✅ 第一幕 协议播种 —— 基础的发现/发布/执行协议已就绪
- 🔄 第二幕 黄页培育 —— 40 条执行记录，等待外部 AI agent 自主参与
- ⬜ 第三幕 编排引擎 —— 待第二幕跑通后启动

## 已知未完成（下次可做）

1. **Task 005**: `/api/case-studies` 端点未实现
2. **SSH**: VPS 端口 22/2222 Connection refused，需 Vultr Console 修复
3. **文档同步**: Obsidian vault 文件手工 cp，可自动化
