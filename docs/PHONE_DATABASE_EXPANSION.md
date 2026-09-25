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

### 🇬🇧 英国（已发布 4，待补 6+）
| 路线 | 状态 | 说明 |
|---|---|---|
| VOXI | ✅ 已发布深页 | 180 天窗口，£0.08/次 |
| giffgaff | ✅ 已发布深页 | 180 天窗口，£0.30/次，7月停号潮警示 |
| Lebara UK | ✅ 已发布深页 | 90 天窗口，社区 buffer 70 天 |
| Vodafone UK | ⚠️ hold | 无充值路径，观察中 |
| EE | ⬜ 待研究 | 英国最大运营商，PAYG 保号规则 |
| O2 UK | ⬜ 待研究 | |
| Three UK | ⬜ 待研究 | |
| Smarty / 1pMobile / ASDA / Tesco Mobile | ⬜ 待研究 | MVNO 梯队 |

### 🇺🇸 美国（素材 3，待补 2+）
| 路线 | 状态 | 说明 |
|---|---|---|
| Ultra Mobile PayGo | 🔍 研究中 | $3/月订阅制；2026-08 Reddit 确认仍可境外激活/漫游；客服口碑差需写入风险 |
| Tello | 📦 有素材 | 定制套餐 $5 起，eSIM 即时 |
| H2O Wireless PAYG | 📦 有素材 | AT&T 网络 |
| US Mobile | ⬜ 待研究 | Warp/Light Speed 双网 |
| T-Mobile / AT&T prepaid | ⬜ 待研究 | 官方预付 |

### 🇯🇵 日本（素材 2）
| Mobal Voice+Data | 📦 有素材 | 070/080/090 真号 |
| Sakura Mobile | 📦 有素材 | 护照可办 |

### 🇳🇱 荷兰
| Vodafone NL prepaid | ⬜ 待研究 | 沃达丰体系 |
| KPN / Lebara NL / Lyca NL | ⬜ 待研究 | |

### 🇩🇪 德国
| Vodafone DE (CallYa) | ⬜ 待研究 | 沃达丰体系 |
| Aldi Talk / Lidl Connect / O2 DE / Telekom prepaid | ⬜ 待研究 | 超市卡是社区热门 |

### 🇳🇿 新西兰
| Skinny (Spark 系) | ⬜ 待研究 | 中文社区神卡之一 |
| 2degrees / One NZ（原 Vodafone NZ） | ⬜ 待研究 | |

### 🇹🇭 泰国
| AIS (SIM2Fly) | ⬜ 待研究 | 旅游卡转保号经典路线 |
| TrueMove / dtac | ⬜ 待研究 | |

### 🇭🇰 香港
| 3HK / ClubSIM / SoSIM / CMHK | ⬜ 待研究 | 大陆用户最易获取 |

### 🇨🇳 中国大陆
| 三商官方卡 | 📦 有素材 | 在役证明类 |
| CMLink | 📦 有素材 | 一卡多号 |

### 🌏 其他待排
澳洲（amaysim/ALDI/Optus）、新加坡（Singtel hi!card）、马来西亚（Hotlink）、克罗地亚 A1（已有素材）

### 🔌 接码平台类（temporary-activation，独立品类页）
ActivateX / SMSPool / 5SIM（素材在库）+ SMS-Activate 等

### 📶 沃达丰体系专题
用户点名：Vodafone 横跨十几国、各国卡政策/开卡费不同 → 单独一张 Vodafone 跨体系对比页（UK/DE/NL/AU/NZ→One NZ 等，标注各国差异与开卡费）

## 节奏承诺
- 每天推进：目录卡批量上架（快）+ 深页按证据速度升级（稳）
- 数据文件：`catalog.json`（宽）→ 深数据进 `uk-directory-pilot.json` 同款 schema（后续拆分 per-country 文件，生成器兼容）
- 完成定义：矩阵每格要么有深页、要么有目录卡+状态徽章，无空白格

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
