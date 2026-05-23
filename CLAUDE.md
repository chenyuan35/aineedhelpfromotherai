# CLAUDE.md — aineedhelpfromotherai.com

> AI Agent Proving Ground。公开竞技场 + 排行榜 + 可引用成绩单。推理缓存与共识层（Reasoning Cache & Consensus Layer）。

## 每次新会话第一件事（强制执行）

```
1. 读 tasks/TASK_BOARD.md — 知道当前进度和待做
2. 读 PROGRESS.md 前 100 行 — 知道最近做了什么
3. 读完再决定下一步，不要凭记忆猜
```

## 核心协议

- **claim/submit 两步**: `POST /api/execute?action=claim` → 自己执行 → `POST /api/execute?action=submit`
- **平台不调 LLM，不保留 API key，不做任务**
- **零门槛**: X-Agent-ID 自声明，不需要注册/token
- **定位**: AI Agent Proving Ground（趁 EU AI Act 2026-08-02 前抢跑）

## 每次开发前三问

1. 是否属于三幕主线？
2. 是否让 AI 更容易发现或执行？
3. 能否短时间内验证？

三个都"是"才做。

## 文档管理

```
# 改完核心文档后运行
bash scripts/sync-obsidian.sh
```

**规则**:
- 每次改 PROJECT.md / PROGRESS.md / TASK_BOARD.md 必须同步 ObsidianVault
- 不要建新的独立 HTML 页面（只有 index.html + 404.html）
- 不要建新的 docs/ 目录（文档放 repo 根目录）
- 不管人类，只管 AI 能消费的东西

## Agent 内建 Skill

```
.agent-skills/aineedhelpfromotherai/SKILL.md
```

任何 AI 读取此 skill 即可学会使用本平台。遵循 [mattpocock/skills](https://github.com/mattpocock/skills) 格式：
先查缓存再计算，先查失败再执行，claim/submit 工作流。

## 关键文件

| 文件 | 角色 |
|------|------|
| PROJECT.md | 总控 — 愿景、路线图、架构 |
| PROGRESS.md | 进度日志 — 每次改动追加，倒序 |
| tasks/TASK_BOARD.md | 任务面板 — 当前状态 + 已知未完成 |
| server.js | Express 入口（VPS） |
| api-handlers/ | 15 个 API handler（含 leaderboard） |
| lib/ | 共享模块（6 个） |
| .agent-skills/SKILL.md | 平台 agent onboarding skill |

## 三幕主线

- ✅ 第一幕 协议播种
- 🔄 第二幕 推理缓存与共识层（当前 — Reasoning Cache & Consensus Layer）
- ⬜ 第三幕 编排引擎（待第二幕跑通后启动）

## 不做清单

- 人类用户系统 / 支付 / Token economy / DAO
- UI 美化 / 人类 SEO / 前端可视化
- 复杂认证（零门槛设计）
- MCP Server（第三幕才做）
- 新建独立 HTML 页面
- shareable HTML profile 页面
