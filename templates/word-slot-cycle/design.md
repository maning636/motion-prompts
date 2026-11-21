# word-slot-cycle · 净室自研

## 设计意图
文字 kinetic 类模板：固定一句完整的话，把其中一个「关键词槽位」用一组候选词循环替换——
旧词向上滑出、新词从下滑入，循环 N 次（默认 3 次），让观众在同一句话里反复看到不同位置
的同一种角色。强调色（默认荧光绿）始终落在正在替换的槽位词上，底部点阵指示器与右上角
计数器同步推进，节奏明确。

适用场景：定调一句话里反复更换主语/角色（如「让 ___ 成为生产力」、「把 ___ 变成习惯」、
「AI 不是 ___，而是 ___」的关键词替换），强调「一个位置、多种答案」的概念演化。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作主句与计数
- 主句字号 132px，槽位词带荧光阴影 `text-shadow` 暗示「正在变化」
- 槽位容器固定 `min-width: 280px`，防止替换词长度差异导致左右字跳动
- 槽位底边线 + 左右小三角提示「这个词从这里流过」
- 底部 3 个进度圆点 + 右上 ROUND 计数 pill + 脚注 N/total 数字，三处冗余指示当前循环进度

## 动效说明（自建运动语法）
- 入场：整句 `fade + y30`，`power3.out`，0.55s；eyebrow / cycle pill / 进度点 错峰 0.1s 起步
- 首词就位：`scale 0.92 → 1.0 + opacity 0 → 1`，`back.out(1.4)`，0.5s
- 循环（每轮 1.25s）：
  - 旧词 `y → -110%, opacity → 0`，`power2.in`，0.45s
  - 新词 `y: 110% → 0%, opacity → 0 → 1`，错峰 +0.08s，`power2.out`，0.55s
- 进度点 / 计数 pill：随每轮 onUpdate 同步点亮（圆点累加 + 数字递增）
- 收尾：最后一词 `scale 1 → 1.04 → 1` 轻微呼吸一次（yoyo），停留 ~1s 可读
- 脚注 `fade + y10` 在尾段淡入
- 总时长 6s，符合 §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| prefix | string | 让 | 槽位前的固定前缀文本 |
| suffix | string | 成为新的生产力 | 槽位后的固定后缀文本 |
| slotWords | string（逗号分隔）| 工具,伙伴,杠杆,基础设施,默认项 | 槽位候选词，至少 4 个 |
| cycles | number | 3 | 循环替换次数（≥2，自动截断到候选词数） |
| eyebrow | string | CYCLE · 槽位轮播 | 顶左小标签文案 |
| footnote | string | 同一句话，同一个位置，每一次都是新的答案 | 底注文案 |
| accent | color | #00FF00 | 强调色（替换词 / 进度点 / 计数 / 三角） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「槽位轮播：固定句式中一个词循环替换跳动」与本任务卡的功能意图描述，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.sentence / .slot / .slot-word / .cycle-pill / .progress-dots / .footnote`）
   为本模板自创；CSS 变量、关键帧、缓动函数全部按本项目 §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 主句 132px 字号 + 槽位底边线 + 左右小三角 = 自有「文字带」语义，跟项目内
     其它文字 kinetic 模板（如 `keyword-sticker`、`tc-keyword-pop-highlight`）的视觉
     套路不重复。
   - 进度点 + 计数 pill + 脚注 N/total 三处冗余指示器，是项目内常用的「状态同步」
     表达（参考 split-compare-slider 的位置百分比 + chip + foot），但本模板用于循环
     计数场景。
   - 槽位 `min-width: 280px` 固定宽度是项目内常见的「位置不动、词在变」手法，避免
     替换词长度差异导致左右字抖动。
4. **命名与曲线**：class 命名 `sentence / slot / slot-word / slot-arrow / cycle-pill /
   progress-dots / footnote / eyebrow / counter`，缓动 `power3.out / power2.in /
   power2.out / back.out` 全部 GSAP 内置，时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「槽位词循环替换类文字动效」等价，
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。
