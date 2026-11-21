# split-60-40-story · 净室自研

## 设计意图
60/40 非对称分屏叙事模板。画面左右按权重切分：左侧 60% 容纳主叙事
（eyebrow → chip → 大标题 → 4 条要点 → 底部 meta），右侧 40% 容纳辅助信息
栏（chip → 比例核心词 60/40 → 比例可视化条 → 副文案 → meta 块）。
主次**错峰入场**：左半场 ~0.18s 起步，要点 0.45s 后开始错峰；右半场
晚一拍 0.75s 入场，比例数字 1.05s 用 `back.out` 弹一下，比例条从左段
扫开再接右段，最后副文案 / meta 在 ~2.2s 全部就位。

适用场景：A/B 不对等信息的层级叙事（结论 vs 证据）、主数据 + 辅助指标
同屏展示、信息可视化主视觉与图例分栏。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字与 chip 加粗
- 图形语言：左列要点的左侧 22×2 短杠 + accent 光晕、右列中缝 1px 渐变
  竖线（accent 从 22%~78% 处亮起，两端渐隐），比例可视化条 60/40
  圆角胶囊
- 权重体现：左标题 76px、左要点 28px、右比例数字 132px、右副文案 24px
  —— 主次字号差一眼可读
- 安全边距：左右 96px，上下 padding 168/200px，符合 §2.3

## 动效说明（自建运动语法）
- 入场：左/右列分别 `fade + y28`、`power3.out`、0.55s；右列晚 0.57s 起步
- 错峰：左要点列表 `stagger 0.10s`、`power2.out`、0.45s、单条 `x -22`
  微位移（更明显强调左主重）
- 比例数字：`fromTo(scale 0.9→1.0, back.out(1.6), 0.55s)` 弹入；随后
  `scale 1.0↔1.04` 用 `sine.inOut` 呼吸 2 轮（共 ~2.2s），结尾回弹 1.0
- 比例条：左段 `scaleX 0→1, power3.out, 0.7s` → 右段 `scaleX 0→1, 0.55s`
  —— 一前一后，节奏上"先讲主、再补辅"
- 结尾：t≈4.7s 比例数字回到 1.0，之后停留 ~1.3s 可读（总时长 6s），符合 §2.4
- 顶头 eyebrow 与底脚 footnote 在 0.05s/0.9s 早入场并常驻，作为版式锚

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| leftLabel | string | 主叙事 | 左 chip 文案 |
| leftEyebrow | string | 主标题 / CORE NARRATIVE | 左标题上方 eyebrow 小字 |
| leftTitle | string | 把 60% 的注意力给结论，把 40% 留给证据 | 左主标题（76px） |
| leftPoints | string（换行分隔） | 4 条 | 左要点，最多 4 行 |
| rightLabel | string | 辅助信息 | 右 chip 文案 |
| rightHeadline | string | 60 / 40 | 右栏核心比例（支持 `60/40` 形式） |
| rightSub | string | 非对称权重 · 信息层级 | 右栏副文案 |
| rightMeta | string（换行分隔） | viewbox / 字号 meta | 右栏底部 meta |
| accent | color | #00FF00 | 强调色（短杠/序号/比例条/呼吸） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中一行意图
   「60/40 非对称分屏：左侧 60% 主叙事（大标题+要点），右侧 40% 辅助
   信息栏，主次错峰入场，结尾停留可读」与本任务卡的功能意图描述，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.col.left / .col.right /
   .ratio / .bar-vis / .points / .left-foot / .right-meta / .eyebrow /
   .footnote`）为本模板自创；CSS 变量、关键帧、缓动函数全部按本项目
   §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 60/40 切分由 `left:96px / width:1056px` 与 `right:96px / width:672px`
     配合 1px 渐变中缝达成；中缝用 `linear-gradient` 在 22%~78% 处亮起
     accent，两端渐隐，避免硬切断感。
   - 比例可视化用 60/40 圆角胶囊，左段为 accent 渐变、右段为灰，体现
     「主重辅轻」权重比；图例随主结构错峰出场。
   - 主次权重由**字号差**承担（左 76 / 28 vs 右 132 / 24），并非依赖
     任何既有模板特征。
4. **命名与曲线**：class 命名 `col / chip / title / points / ratio /
   bar-vis / left-foot / right-meta / eyebrow / footnote`，缓动
   `power3.out / power2.out / power2.inOut / back.out / sine.inOut`
   全部 GSAP 内置，时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「60/40 非对称分屏叙事
   类动效」等价，任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；
   无上游 attribution，license 为 `Proprietary - FDE`。
