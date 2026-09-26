# Phone Database — 全球覆盖矩阵（总追踪）

> 用户指令（2026-09-26）：先把数据库铺开，国家×运营商×品类全覆盖，再谈推广。
> 两级发布模型：
> - **深页（Tier 1）**：官方+社区双源证据齐全 → 独立路线页 + 进保号助手（UK pilot 标准）
> - **目录卡（Tier 2）**：基础事实（国家/运营商/号型/大致成本/状态徽章「验证中」）→ 先进目录占位，证据补齐后升级
> 纪律：目录卡只写确定事实，不允许编造成本数字；不确定就写「验证中」。
>
> **扩充机制（双通道）**：
> 1. **自动发掘**（2026-09-26 上线）：`auto-ops/phone-discovery/discover.py` 每日 11:30 自动扫 Reddit eSIMs/NoContract/prepaid/ultramobile + nodeloc + nodeseek + V2EX 最新帖，词表覆盖 40+ 国家 × 90+ 运营商 × 保号/接码/注册/上网意图词，新信号自动追加到本文档末尾「自动发掘候选」区。单运营商当日信号 ≥5 次 = 爆量热点，直接开目录卡 PR。
> 2. **主动研究**：按下方矩阵逐格推进，社区热度优先。

## 品类维度（所有国家通用）
- 保号（retention：窗口/动作/年成本）
- 接码（SMS 验证：服务接受度，对 Claude/OpenAI/WhatsApp/Telegram/Google 五条规则）
- 注册（开户/实名要求/护照可办性）
- 上网（流量/漫游/是否 data-only）

## 国家 × 运营商矩阵

### 🇬🇧 英国（已发布深页 4 + 后台 MNO 卡 3）
| 路线 | 状态 | 说明 |
|---|---|---|
| VOXI | ✅ 已发布深页 | 180 天窗口，£0.08/次 |
| giffgaff | ✅ 已发布深页 | 180 天窗口，£0.30/次，7月停号潮警示 |
| Lebara UK | ✅ 已发布深页 | 90 天窗口，社区 buffer 70 天 |
| Vodafone UK | ⚠️ hold | 无充值路径，观察中 |
| Three UK | 🗂️ 后台卡 (Batch E, PR #236) | 官方 180 天活动规则；**Wi-Fi Calling 不算活动**（官方明确） |
| O2 UK Classic | 🗂️ 后台卡 (Batch E) | 6 个月活动规则；2p 短信算活动（Classic 资费）；legacy 321 需通话 |
| EE | 🗂️ 后台卡 (Batch E) | 180 天 + 90 天可恢复冬眠 = 270 天硬线，最宽容 MNO |
| Smarty | ❌ 排除 | 无真 PAYG（仅月包），矩阵标注 not-a-fit |
| 1pMobile / ASDA / Tesco Mobile | ⬜ 待研究 | MVNO 梯队 |

### 🇺🇸 美国（后台 3 条，证据齐，PR #234）
| 路线 | 状态 | 说明 |
|---|---|---|
| Ultra Mobile PayGo | 🗂️ 后台卡 guideEligible | 官方双页证据：$3/月=100分钟+100短信+100MB；漫游中国收短信 $0.10、发 $0.50；Wi-Fi Calling 支持；年成本 $36 |
| Tello PAYG | 🗂️ 后台卡 guideEligible | 官方购买页+中国漫游费率（漫游收短信 1¢）；官方 3 个月活动政策（2017-09 起）+ HowardForums 社区实践：每 ~80 天发 1 条短信 ≈ $0.06/年 |
| H2O PAYG | 🗂️ 后台卡 observation | $10/90天 或 $100/365天 阶梯；**中国漫游未确认 → 目录卡 only** |
| US Mobile | ⬜ 待研究 | Warp/Light Speed 双网 |
| T-Mobile / AT&T prepaid | ⬜ 待研究 | 官方预付 |

### 🇯🇵 日本（后台 3 条，PR #235）
| Mobal Japan Voice | 🗂️ 后台卡 guideEligible | ¥1,430/月；**入境短信全球免费**（官方）；外国人友好护照办理；真 070/080/090 |
| povo 2.0 | 🗂️ 后台卡 hold | 0 日元基本费 + 180 天 topping 规则（¥500/年）；**但需日本在留 eKYC → 海外用户不适用**，作参考卡 |
| Sakura Mobile | 🗂️ 后台卡 hold | ¥2,980/月起 + ¥5,500 开通费；premium 英文服务；性价比低于 Mobal |

### 🇳🇱 荷兰（后台 1 条，PR #237）
| KPN Prepaid | 🗂️ 后台卡 guideEligible | 官方社区员工确认：**余额永久有效**，6 个月用一次（短信/通话/流量/充值均可）；接收不算活动 |
| Vodafone NL prepaid | ⬜ 待研究 | 沃达丰体系 |
| Lebara NL / Lyca NL | ⬜ 待研究 | Lebara 页面 JS 挡，需真浏览器 |

### 🇩🇪 德国（后台 2 条，PR #236）
| Aldi Talk | 🗂️ 后台卡 guideEligible | **官方 2026-01-01 生效活动窗 PDF**：€5→4个月、阶梯制；窗口过后 2 个月被动可接 → 停机；€15/年 |
| Vodafone DE (CallYa) | 🗂️ 后台卡 hold | 官方 FAQ：**90 天不用即停机**（最严主流市场）+ 短信警告 + 4 周异议期；德国 VideoIdent 门槛 |
| Lidl Connect / O2 DE / Telekom prepaid | ⬜ 待研究 | |

### 🇳🇿 新西兰（后台 2 条，PR #235）
| Skinny (Spark 系) | 🗂️ 后台卡 guideEligible | 官方 12 个月充值规则；NZ$10/年；无实名制 |
| 2degrees | 🗂️ 后台卡 hold | 抓到的是 2024-10 前旧条款，需重抓 |

### 🇹🇭 泰国（后台 1 条，PR #235）
| AIS SIM2Fly | 🗂️ 后台卡 guideEligible | 官方 365 天漫游 eSIM 2,699 泰铢（15+15GB）；可境外激活 |
| TrueMove / dtac | ⬜ 待研究 | |

### 🇭🇰 香港（后台 3 条，PR #235）
| ClubSIM | 🗂️ 后台卡 guideEligible | 官方 365 天续购窗口 + 社区确认 **HK$6 短信包/年保号** = 全球已知最低之一；护照可办 |
| SoSIM | 🗂️ 后台卡 guideEligible | 官方充值阶梯：$100→180天 / $200→365天；过期可在 App 找回号码 |
| 3HK DIY | 🗂️ 后台卡 guideEligible | 官方 ≥$100 充值自动延期；eSIM 全程线上 |
| CMHK | ⬜ 待研究 | |

### 🇲🇾 马来西亚（后台 1 条，PR #236）
| Hotlink Pantas | 🗂️ 后台卡 guideEligible | **官方 365 天 Active Period Pass RM2 = 全球保号成本地板**；Maxis 网络 |

### 🇮🇹🇪🇸🇸🇬 意大利/西班牙/新加坡（后台 3 条，PR #238）
| TIM Italy | 🗂️ 后台卡 guideEligible | 官方 12 个月有效期（充值重置），第 13 个月只收不发；€5/年 |
| Movistar ES | 🗂️ 后台卡 guideEligible | 官方社区 KB：6 个月充值续期 |
| Singtel hi! Prepaid | 🗂️ 后台卡 **负面知识** | **IMDA 2024-07-15 起护照注册仅 30 天有效**，延期须本人到店 → 海外保号不可行，标注 avoid-route |

### 🇨🇦🇫🇷🇨🇭🇲🇽🇮🇳（后台 5 条，PR #239）
| SpeakOut 7-Eleven CA | 🗂️ 后台卡 hold | $25 券/365天；仅实体卡+加拿大购买 |
| Telcel Amigo MX | 🗂️ 后台卡 hold | 官方生命周期：活跃期 1-60 天按充值面额；$50 激活 |
| Jio IN | 🗂️ 后台卡 hold | TRAI 规范 90 天不充值即注销；eKYC 门槛 |
| Orange Mobicarte FR | 🗂️ 后台卡 observation | Orange Holiday 旅游卡 7-30 天有效期 → 确认不适合保号；Mobicarte 条款待抓 |
| Sunrise CH | 🗂️ 后台卡 observation | CHF 10 起充；12 个月有效期待官方确认 |

### 🇨🇳 中国大陆
| 三商官方卡 | 📦 有素材 | 在役证明类 |
| CMLink | 📦 有素材 | 一卡多号 |

### 🌏 其他待排
澳洲 amaysim/ALDI/Optus、克罗地亚 A1（已有素材）、波兰/葡萄牙/爱尔兰/阿联酋/土耳其（自动发掘候选池）

### 🔌 接码平台类（temporary-activation，独立品类页）
ActivateX / SMSPool / 5SIM（素材在库）+ SMS-Activate 等

### 📶 沃达丰体系专题
用户点名：Vodafone 横跨十几国、各国卡政策/开卡费不同 → 单独一张 Vodafone 跨体系对比页。已沉淀各国数据点：UK（hold 无充值路径）/ DE CallYa（90 天最严窗）/ NL（待研究）→ 素材足够后开工

## 进度快照（2026-09-26 晚）
- **后台路线总数：26 条 / 15 市场**（英国 7、美国 3、日本 3、香港 3、德 2、新 2、泰 1、马 1、意 1、西 1、新加坡 1、加 1、墨 1、印 1、法 1、瑞 1）
- 状态分布：guideEligible（证据齐可发深页）12 条 / observation-hold（需补证据）9 条 / 负面知识 2 条（Singtel、Orange Holiday）
- 已发布深页仍 4 条（全 UK）——后台→前台需要目录卡渲染器（等 PR #233 合并后开）
- 证据纪律：每条后台卡都有官方/社区来源 ID，证据 JSON 存 auto-ops/phone-discovery/evidence/

## 工作日志
- 2026-09-26 建矩阵；Batch A 美国线研究启动（PayGo 2026-08 存活确认）

---

## 自动发掘候选（每日 11:30 cron 自动追加，ID dfa8cbf7）

### 2026-09-26 首批信号（12 条，来源 Reddit eSIMs/NoContract）
- 🇮🇹 **意大利** — "Best esim for Italy"（旅游 eSIM 需求）→ 矩阵已列（TIM/Iliad），信号确认需求真实
- 🇮🇳 **印度 Airtel** — 用户投诉国际漫游不可靠 → 新国家候选：印度（Airtel/Jio）
- 🇲🇽 **墨西哥** — "Best esim for mexico?" → 新国家候选：墨西哥（Telcel/AT&T MX）
- 🇨🇦 **加拿大** — 旅行 eSIM 询问（叠加厦门中转）→ 矩阵已列（SpeakOut），信号确认
- 🇺🇸 **Verizon 网络廉价 prepaid** — "affordable prepaid on Verizon-network" → US 上网品类信号
- 🇬🇧 **UK×3** — "best eSIM for UK"×2 + LycaMobile UK 误激活求助（⚠️ 激活地域限制证据点，Lyca 目录卡可加此坑）
- 🌏 **亚洲多国环线** — 台湾/韩国/中国/香港 一卡多国需求（Sosh/国际选项）→ 数据卡品类信号
- 🇯🇵 **日本** — 美国人在日本用 eSIM → 矩阵已列（Mobal/Sakura），信号确认
- ⚠️ Saily 差评帖 → 数据卡品类口碑证据点（expressvpn 系，佣金高但体验存疑）

结论：首批信号与既有矩阵高度吻合（UK/JP/CA/TH 需求实锤），新增候选 **印度、墨西哥** 入矩阵。

---
