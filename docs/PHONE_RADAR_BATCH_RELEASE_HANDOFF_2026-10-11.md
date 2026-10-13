# 2026-10-11 项目整体交接与统一发布策略

> 本文是 **2026-10-11 时点交接证据**，不替代 GitHub `main` / 真实生产环境。新会话必须严格依序读取 `AGENTS.md`、`PROJECT_CONTEXT.md` 顶部 checkpoint、`docs/MASTER_PLAN.md`、`docs/OPERATING_WORKFLOW.md`、`docs/CURRENT_EXECUTION_QUEUE.md`、`docs/SESSION_EXECUTION_PROTOCOL.md`，然后看 GitHub Issue #487。本地未合并的本文件也**不是**已生效的 main 指令。

## A. 截止时事实和分层

- GitHub `main` **163fd5c98a2cf87b4954cfcfadbada94f6347336**（`git ls-remote origin refs/heads/main` 只读核对）。直接读取 main 数据：**160 routes、899 sources、324 events、36 named-app observations**。文件头部 checkpoint 有历史递进数据，不要把较早数字当成当前 main。
- Vercel 最新已知 production 部署 READY：`dpl_46iGWM7FTbn6d6QGuCYqbsyvbbce`，对应 **989c6e4e93038431622aa269a18212a2a51430e8**，**落后于 main**。线上仍旧，不能把下文暂存功能称为“上线”。
- PR [#482](https://github.com/chenyuan35/aineedhelpfromotherai/pull/482) **OPEN**，搜索/中文匹配/数据缺口查询，head `3980a03c8c2151b08191fc83a76e71ad4ac2f1a8`，base `main`；PR [#486](https://github.com/chenyuan35/aineedhelpfromotherai/pull/486) **OPEN**，社区证据整合，head **809fb5d42a2b363674981a1f0972dc60de60b521**，base #482 分支。不要误以为二者已 merge，也不要单独重复合并其来源旧 PR。#486 上次 Vercel 检查显示 build-rate-limit，**当前免费额度是否恢复未经过新的允许部署测试验证**。
- 唯一现存 **LOCAL-only** 代码批次：设备 `qwenpaw-sbs-prod-h2grp` 的一次性隔离 worktree `/tmp/phone-batch-review-20261010`，分支 `phone-freeze-batch-local-only-20261010`，基于 #486 head。四个本地提交（未 push）：`2ffc71b`→`d71e759`→`3ed375b`→**`bbbd3363b6647e0eea841598c60434f368dff2e3`**。这是 disposable observer，不可作为唯一长期代码副本/生产依赖；如主机已不存在，须依据 Issue #487 的原始来源、差异说明和测试规范重新构建；**上次完整源代码补丁远端备份未成功，切勿谎称已备份，也不可绕过拦截机制。**
- 暂存批次（从本地源数据和生成器核对）：**160 routes、906 sources、332 events、39 named-app observations**；公开比较与索引边界维持 **135 comparison / 3 indexable route details / 31 sitemap URLs**，无批量 SEO 新页。此数字不是 main / 生产。
- 其他产品：AI Reset Radar 是已进行价值复审的存量工具，部分保留/改造、部分降级，**不批量新增 reset 页**；Relay Exit Risk 属于数据积累实验，缺少可验证搜索增长信号；Phone Radar 是主增长产品。阶段 **P0–P5 基本建设完成；P6 证据深度持续进行；P7 Authority/Distribution 试验；P8 AdSense 收入优化尚未到优先阶段**。切勿用“160/160”宣称覆盖真实全球需求的90%或100%。

## B. 同一批次已完成但未上线（测试全部在本地）

1. **证据数据库**：基于 #486 再增加 **2 个不同 1pMobile Reddit 原帖、2 件非应用运营事件、1 条不同作者的美国运通 Amex 验证短信失败**（当事人表示其它 OTP 仍能收到，不是银行普遍失败）；原帖与作者去重，不能制造样本成功率、国外新开户/收码保证。修复 11 条线路原始社区链接因“只取前8条”完全看不见的前端问题。
2. **费用真实性**：历史 global-directory 与最新 normalized 年保号费 **61 可比较项中15处不同**，其中6条属于旧可展示候选。差异可能是产品 cohort / 短信充值与网页充值 / 门槛 / 时间造成，**不自动采用更便宜值**。Tello PAYG 条件性帐户短信 $10/90天≈$40/年 vs 普通网页 $20/90天≈$80/年；单独 $5/月产品不可混淆，第一次激活须美国境内。旧市场表格价格矛盾标记 COST REVIEW，冲突项排除“最便宜”排序/费用图。
3. **证据评级**：旧市场 app 徽章曾存在根据原始报告条数推算 OTP 成功率的路径，未保证独立原帖、同一 App+Operation；现改为使用标准化独立来源评级，不足样本不展示百分比。原帖来源在旧比较卡也优先展示。
4. **已有前端**：保留 SEO URL、不新增近重复页，修复低价收码指南、香港 ClubSIM/SoSIM、日本 Mobal Voice Lite（日本境内用，**不是海外验证码产品**）、英国 VOXI/giffgaff/Lebara 冲突和旧版 Tello 指南；明确**购卡+证件→首次激活→真实漫游→具体应用 SMS→保号/号码回收**不同阶段。5个指南链接可使用原 Phone hub `?route=<id>` 直达160条证据详情（包括 HOLD/后台不推荐边界）。135-row 老目录改用 normalized 数据与研究标签；修复 320px 手机上整页宽513px 横向溢出，内部表格独立滚动。
5. **实名／护照专项**：原先 5 条 “not-required / no KYC” **全部不可靠**（Sunrise CH 已明示有效 ID、HOT Mobile IL 撤回说法、SpeakOut CA 仅 no credit check、Telemach SI 为 EU 漫游优惠的住所关联、Vodafone NL 没证明免实名）。新的160路线身份状态是**69**明确有身份核验规则记录、**5**仅特定路径“报告不查验照片证件”、**75**未核实清楚、**11**缺合格记录；护照维度独立是**32**有特定路径接受护照的资料、**43**只是出现护照字眼但**不能推断是新开户**、**85**无护照依据。**0条**可以保证任意国籍无证件匿名开户。香港 OFCA HKID与非HKID/有效护照规则、HKSAR/BN(O) 排除需保留；新加坡 Singtel/StarHub 游客护照仅短期，后续需当地有效ID。前端新增 Identity/passport 筛选、证据详情、风险提示并保留原始KYC字句。完整160行证件审核在暂存 `docs/PHONE_IDENTITY_REQUIREMENTS_AUDIT_2026-10-11.md`。
6. **QA**：最后一次 `npm run phone:data:check`、`npm run build --prefix frontend`、`node scripts/test-phone-number-public-release.mjs`、`git diff --check` 全通过；新增身份、费用、来源、指南、深链回归覆盖。Chromium 实测 **320/375/390/1280px** 证件筛选，无整页溢出、无 JS 异常；8条身份案例原始来源/护照条件/HOLD/Unknown正确；目录与指南的其他宽度复测也通过。生成数据已一致。**上述均非 production QA**。

## C. 运营和增长进度：对数据保持诚实

- First-party Windsor.ai Search Console `sc-domain:aineedhelpfromotherai.com`，最新返还的 **2026-10-01—08 总计127 impressions / 2 clicks**（Oct8已修订至5 impressions，Oct9/10截至最近读数仍没有可用行；低量级+报表延迟，不能据一日推趋势）。Phone 页面独立 Google 点击非常少，无法认定有 SEO winner。更早9月中旬网站整体曝光明显高于10月首周；诊断爬取/匹配/用户价值、不要批量新增页面。
- Windsor.ai `googleanalytics4` property `553896884`，2026-09-25—10-10 取数返回空数组，**不可断言零访问、零转化**。线上页面可见 GA4 标签 `G-FYKKNKRE58`，但仍须检查其连接到同一 property、实时事件是否到达、跳转来源分类、隐私同意/拦截和 API/connector 的查数有效性。
- Metricool Threads `@minonoig`：两条确实指向本站的 Cursor/Claude 贴文分别约60/111 views；大部分账号帖子和本站没有直接关联。Gmail 旧个人化 Cursor 投递 **5封（9/13三封、9/22两封）**，无独立确认的回信/编辑链接。没有可验证稳定 referral/AI citation；**浏览量≠SEO流量**。
- 现阶段优先补首页→任务选择→有证据候选→证据展开→保存/提醒的合法匿名事件漏斗；度量 Phone 真实使用，区分 Google organic、social/referral、AI referrals、direct/repeat；未有稳定曝光/使用前不投付费推广、不盲目调 AdSense/RPM。
- 宣发优先**先做证据和真实有用的回答**：研究有独立搜索/论坛需求的问题（低价保号≠能境外新号激活≠银行短信），允许链接的社区才发有原始用户证据的答案；已发送过的邮箱/社区不重复打扰；不宣传未上线新功能，不买垃圾外链，不把 Threads 观看量算自然搜索成果。

## D. 未完成任务优先级、执行顺序和停止条件

**P0 — 不丢代码，且不浪费部署次数。** 核验 qwenpaw scratch worktree 是否还存在；检查四个本地提交、`git status`（tracked clean），将来源数据/修复补丁**通过被允许且安全的持久方式备份**，不能未经用户允许将代码推上可能触发 Vercel 的远程分支，也不能绕开先前补丁内容的安全阻断。若主机消失按 Issue #487 重建/测试。冻结一个整合 release candidate，明确 parent #482→#486→本地批次；额度恢复后统一为**一个基于最新 main 的发布PR和一次 merge**，避免堆叠PR逐个 merge 导致多个自动 Vercel 生产构建。
**P1 — 有证据的数据库质量而非凑满“覆盖率”。** 优先评估已有候选中真实需求明确的线路，搜集针对**同一个SKU**真实购卡、实际付款国、护照国籍/可用证件、当地地址或居留、首次激活所在国家、漫游收码、具体 App 操作、失败/退款和回收生命周期的独立原帖；一作者交叉发布不得视为独立来源。当前 **86条身份未核实/未知** 是补证队列而非“可以无证件购买”；32条“护照特定路径”仍需逐条核对与目标买家相同操作与国籍。不再大面积查同质官网或制造新 route。逐个核对15处费用/充值口径，任何未解决矛盾明确显示而非猜价格。
**P2 — 完整前端审核。** 继续核对340/375/390/1280px，低价列表、160条详情、135对比、实名/护照筛选、HOLD/后台 warnings、来源优先级、对冲案例、无匹配结果、键盘可访问、失败态，顶部视觉比例和LCP/JS负载；只有证据支持时补真正改变用户决策的信息。页面用户可见英文；优先在现有URL优化。
**P3 — 先修测量再宣发。** GA4 property/measurement ID 实时校验、关键匿名互动事件、UTM/referral/Google 搜索来源区分。检查已发 outreach 是否有新的编辑响应；按社区规则准备1–2篇真实源引证的实用解释，不批量发、不给站内未上线功能导流；发布后才能发与实际产品一致的内容。
**P4 — 免费额度正常恢复才统一发布。** 不做一小项一个PR/Preview：选一个可复现且来源安全的统一分支，核对最新 main 与 #482/#486 是否变更并按依赖顺序重整，再跑完整 DB/generator/site/build、公开与索引边界严格 **135 comparison / 3 detail / 31 sitemap**、身份等级、source author dedupe、320–1280px 浏览器和失败态门禁。然后以**一个基于最新main、包含#482+#486+所有本地修复的统一候选PR**申请**一次正常 exact-head CI / Eval / Vercel Preview**；若再次 quota 402，则停止重试回 P1–P3，而不是花钱升级。**不要分别merge #482、#486 再merge第三个修复PR，否则GitHub→Vercel自动生产构建可能消耗多次免费额度。** 全门禁 PASS 后只合并统一候选PR一次、预期触发一次 production deploy；旧堆叠PR仅在确认其全部内容已整合后标记superseded或关闭；独立核验 apex/www、Phone JSON、160条、细则可见、来源链接、31 sitemap、GA4事件、移动端/桌面和必要回滚点。生产 dirty worktree 不得 reset/discard。
**P5 — 稳定数据再决定产品/SEO/变现。** 无稳定 impressions 检查抓取、索引、SERP意图和独立价值；有 impressions 无 clicks 看标题/摘要与首屏；有 clicks 使用弱改任务入口/证据/UX；出现winner 优先加深现有URL，再决定最多1–2种真实不同相邻工具。AdSense 收入策略等有稳定合法流量再推进。

### 时间规划的条件触发（不是虚构截止日期）

- **额度受限期间**：执行P0–P3，不冒进部署；每一个真实研究原帖记URL/作者/操作/日期/冲突/核验状态；每天把已确认数据写入 #487 和工作日志。
- **候选发布冻结前**：可用、可检验、可重建的源码和零失败 QA 都满足；未核实项目显示 UNKNOWN，不强行全部补齐才能上线。
- **额度实际可用后**：只开一次经过准备的构建验收窗口；构建未通过或恢复状态未确认，不推进 merge/production。
- **上线后**：独立线上可见性与分析事件核对，再分不同渠道对比一至数周数据，决定继续深化现有URL、投放有用社区回复还是保持稳定。不要设定臆测增长率或CTR目标。

## E. 给下一会话的首要执行指令

1. 按照 **GitHub main 上六文件的指定顺序重新读取**，而不是把这份手册/聊天/记忆当主事实。
2. 检查 #487 最新 handoff、#482/#486 当前状态与 Vercel 可读状态；核验是否仍在 `bbbd336...` 本地 worktree 和实际测试。
3. 优先解决**一次性发布批次的代码持久性风险**，但未经授权不 push 代码；可以继续安全的社区KYC/支付实测补证、数据库/前端审计、测量与宣发准备。
4. 未见额度恢复、没有完整 QA 和正常发布许可，不反复触发构建；改动仍集中在同一整合批次。每轮事实与下一条件写入 [GitHub #487](https://github.com/chenyuan35/aineedhelpfromotherai/issues/487) 并更新项目日记。
5. 不要将当前暂存身份KYC/价表/深链称为上线；不要把整库的官方身份文字“required”自动当成已验证中国护照买家的首次注册成功。
