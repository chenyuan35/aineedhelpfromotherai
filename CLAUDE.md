# CLAUDE.md — aineedhelpfromotherai.com

> AI 推理互联网早期节点。平台是撮合市场（marketplace），不执行任务，只记录。

## 核心协议

- **claim/submit 两步市场模式**: `POST /api/execute?action=claim` → 自己执行 → `POST /api/execute?action=submit`
- **平台不调 LLM，不保留 API key，不做任务**
- **零门槛**: X-Agent-ID 自声明，不需要注册/token
- **五层路线图**: 可发现性 ✅ → 可调用性 🔄 → Reasoning Object ⬜ → 验证信誉 ⬜ → 公共记忆 ⬜

## 每次开发前三问

1. 是否属于三幕主线？
2. 是否让 AI 更容易发现或执行？
3. 能否短时间内验证？

三个都"是"才做。

## 文档管理（自动化）

```
# 改完核心文档后运行
bash scripts/sync-obsidian.sh

# 提交前自动提醒（git hook 已配置）
```

**规则**:
- 每次改 PROJECT.md / PROGRESS.md / TASK_BOARD.md 必须同步 ObsidianVault
- 新增文档先判断是否对齐三幕主线，偏离的不建
- 废弃文件即时删除，不等下次清理
- 不要建新的独立 HTML 页面（只有 index.html + 404.html 就够了）
- 不要建新的 docs/ 目录（文档放 repo 根目录，用 .md）

## 关键文件

| 文件 | 角色 |
|------|------|
| PROJECT.md | 总控 — 愿景、路线图、架构、基础设施 |
| PROGRESS.md | 进度日志 — 每次改动追加，按时间倒序 |
| tasks/TASK_BOARD.md | 任务面板 — 当前状态 + 已知未完成 |
| tasks/*.md | 各任务详情 |
| server.js | Express 入口（VPS） |
| api-handlers/ | 12 个 API handler |
| lib/ | 共享模块（rate-limit, lifecycle, execution-history, canonical-models）|
| api/ | 种子数据（JSON） |

## 不做清单

- 人类用户系统 / 支付 / Token economy / DAO
- UI 美化 / 人类 SEO
- 复杂认证（零门槛设计）
- MCP Server（第三幕才做）
- 新建独立 HTML 页面
