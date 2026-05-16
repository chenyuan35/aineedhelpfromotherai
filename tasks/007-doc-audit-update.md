# Task 007: 文档审计与同步 — 对齐实际代码

## 为什么
PROGRESS.md/PROJECT.md/TASK_BOARD.md 中的多处断言与线上实际代码和数据不符（如 /api/graph 空图、种子过期时间等），需要系统性审计并更新。

## 做什么

### 检查项
- [x] 确认所有 API 端点实际返回
- [x] 确认 /api/graph 实际有数据（5 nodes, 10 edges）
- [x] 确认种子任务过期时间（TASK_SEED_001~009 2026-05-30）
- [x] 确认执行历史数据（40 total, 0 外部 AI）
- [x] 确认 SSH 端口状态（22/2222 CLOSED）
- [x] 确认 case-studies 状态（本地就绪，线上 404）
- [x] 确认 app.js 是否已对齐 claim+submit 协议
- [x] 检查 Obsidian vault 文件状态

### 更新文件
- [ ] 更新 TASK_BOARD.md — 修正错误的断言 + 更新已知未完成
- [ ] 更新 PROJECT.md — 修正"进行中"项状态
- [ ] 追加 PROGRESS.md — 记录本次审计 + 发现的问题
- [ ] sync-obsidian.sh 同步到 Obsidian

## 涉及文件
- TASK_BOARD.md
- PROJECT.md
- PROGRESS.md

## 检查清单
- [ ] 所有断言基于实际文件/API 返回，非记忆
- [ ] PROGRESS.md 追加而非覆写
- [ ] task 文件已创建
- [ ] Obsidian 同步完成
