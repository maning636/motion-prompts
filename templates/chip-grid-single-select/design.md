# chip-grid-single-select · 设计说明

## 1. 设计意图

一张用于"单选决策展示"的净室动效卡。屏幕上排布 N 个芯片/标签（默认 5 个：数据接入 / 语义抽取 / 知识图谱 / 向量检索 / 推理执行），动效以一次"扫描"扫过所有芯片，每经过一项就把该项短暂点亮一次；扫描结束后，被选中的那一项放大并用强调色描边，其余芯片统一压暗；最后底部弹入一枚 SELECTED 徽标，把最终选择显性化。目的是让"从多选项里挑一个"这个决策过程被可视化为一个明确的动作序列，而不是静态并列。

## 2. 视觉语言

- **画幅**：1920×1080，安全边距：上下 96px、左右 96px，标题顶部留白 168px。
- **色调**：深色数据风。默认 `background #12100E`、`foreground #F4EFE7`、`accent #00FF00`。强调色不采用饱和蓝紫，保持库内一致。
- **字体**：数字与加粗标题用 `MiSans SemiBold`；正文与芯片文字用 `MEBHeiHeiTi`；兜底 `PingFang SC / Microsoft YaHei / sans-serif`。
- **背景**：极浅点阵（48px 网格），opacity 0.55，不喧宾夺主。
- **眉标**：小尺寸大写字距 0.24em，前置一个 accent 发光圆点，右侧放"chip · grid · single-select"分类标签。
- **芯片**：胶囊状圆角矩形（radius 18px），左侧两字符数字序号（tabular-nums），中间标签文字，右侧圆形勾选圈。未选中态：白 14% 描边 + 4% 白色底；脉动态：accent 70% 描边 + 弱光晕；选中态：accent 实描边 + 10% accent 底 + 双圈光环 + 勾选 svg 显色；压暗态：opacity 0.28 + 饱和度降 60%。
- **底部**：左侧"SELECTED"胶囊徽标（内含选中项文字），右侧计数器 `SCAN i / N`。

## 3. 动效说明（自建运动语法）

总时长 6s，GSAP `timeline({ paused: true })`，缓动函数组合如下：

| 段 | 时间区间 | 时长占比 | 缓动 | 动作 |
| --- | --- | --- | --- | --- |
| 入场 | 0.05 – 0.90s | ≈13% | `power3.out` / `power2.out` | 眉标从上方淡入 → 标题淡入 → 副标淡入 → 网格容器显示 |
| 扫描 | 0.55 – 2.20s | ≈27% | `power3.out`（入场）+ CSS 类切换（亮起） | 芯片逐个入场并亮起；亮起保持 0.5s；计数器同步递增 |
| 选定 | 2.20 – 3.35s | ≈19% | `back.out(1.8)` + `sine.inOut` | 选中项 scale 从 0.94 弹到 1.05，再微呼吸回 1.02；其他芯片错峰压暗（power2.out） |
| 徽标 | 3.00 – 3.60s | ≈10% | `back.out(1.6)` | 底部 SELECTED 胶囊从下弹入 |
| 停留 | 3.60 – 6.00s | ≈40% | — | 最终态静置 ≥2.4s，可读性充足 |

主推进段（扫描 + 选定 + 徽标）合计占约 56%，符合 40–60% 区间。入场与停留各约占 13% 与 40%，收尾留白宽裕。所有运动参数（stagger 0.16s、单芯片入场 0.34s、脉动保持 0.5s、选定弹入 0.55s、压暗错峰 0.04s）均为本卡独立设定，未复用其他卡的常量。

## 4. Schema 字段表

| id | type | label | default | 说明 |
| --- | --- | --- | --- | --- |
| eyebrow | string | 眉标 | SELECT · ONE | 顶部左侧眉标，大写小字距 |
| heading | string | 主标题 | 单选决策演示 | 主标题文字 |
| subheading | string | 副标题 | 逐一亮起 → 最终项高亮放大 → 其余压暗 | 副标题一行说明 |
| chips | string | 芯片标签 | 每行一个，最多 9 个 | 换行分隔的标签列表；不足 3 个自动补齐 |
| selectedIndex | number | 最终选中项 | 3 | 1-based 索引，越界自动 clamp |
| columns | number | 网格列数 | 3 | 2–4，其余取整后 clamp |
| accent | color | 强调色 | #00FF00 | 描边、光晕、勾选圈、计数高亮 |
| background | color | 背景色 | #12100E | 页面底色 |
| foreground | color | 文字色 | #F4EFE7 | 标题、芯片文字、结果标签 |
| exportMode | enum | 导出模式 | transparent | 隐藏字段，仅运行时消费 |

三颜色字段与全库一致，全部通过 `html.style.setProperty` 写入 `:root`，CSS 侧全部用 `var(--xxx, #默认兜底)` 消费；`color-mix(in srgb, ...)` 用于透明度衍生色，兼容现代 Chromium。

## 5. 净室自查记录

本卡严格遵循 clean-room 契约：

- **需求输入**：仅以任务卡一句话意图为准（"芯片/标签网格中单项依次亮起，最终选中项高亮放大，其余压暗"）。
- **未访问任何外部仓库**：编写过程未拉取、未比对、未阅读任何外部模板仓库、示例站、GitHub gist、CodePen 或第三方动效库。
- **未读取 lab 目录其他卡的产物内容**（除任务卡明确指定的 `split-compare-slider/index.html` 与 `_selftest_split_compare.py` 两份样板，用于校准 schema/自检框架结构；仅结构对齐，不复制其视觉或动效）。
- **未跑任何 web 搜索 / fetch**：所有命名、数值、缓动、颜色配比均为自建。
- **命名原创**：DOM 类名（`gridbg / eyebrow / header / grid / chip / idx / lab / tick / pulse / selected / dimmed / footer / res / counter`）、CSS 变量（`--foreground / --background / --accent`）、schema 字段（`eyebrow / heading / subheading / chips / selectedIndex / columns`）均为本卡独立命名。
- **缓动原创**：具体缓动组合、时长分配、stagger、错峰比例（`0.16 / 0.34 / 0.5 / 0.55 / 0.04`）为独立设定。
- **无外部依赖**：仅 GSAP CDN `gsap@3.14.2` + 本地 `_fonts/*.ttf`，无图片、图标包、字体 CDN、动画库。

## 6. 结论

本卡为 **clean-room implementation**，只依任务卡一句话意图 + 全库通用契约自建。

- **attribution**: `clean-room`
- **license**: `Proprietary - FDE`
- **status**: `ready`
