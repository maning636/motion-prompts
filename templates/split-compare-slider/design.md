# split-compare-slider · 净室自研

## 设计意图
左右分屏对比叙事模板。中间一根竖向滑杆（顶帽 + 把手 + 底帽），从 `startPosition`
缓缓滑向 `endPosition`，揭示左右两个方案（默认 A vs B）的差异。两侧 chip +
主标题 + 要点列表错峰入场，强调色（默认荧光绿）落在右侧方案的序号标与把手
光晕上，把视觉重心从左侧「传统做法」逐步推向右侧「AI 协作流」。

适用场景：A/B 方案对比、新旧方法对比、迁移前后对比。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字与 chip 加粗
- 图形语言：点阵底 + 圆角把手 + 细线轨 + 顶/底圈帽；左半灰条、右半强调色短杠
- 安全边距 ≥72px（实际左右 padding 96px、上下 96/120px），符合 §2.3

## 动效说明（自建运动语法）
- 入场：左右半分别 `fade + y30`、`power3.out`、0.55s
- 错峰：要点列表 `stagger 0.08s`、`power2.out`、0.42s、单条 `x±18` 微位移
- 滑杆：`fromTo(opacity 0 → 1, 0.35s)`，再 `to(left, 2.4s, power2.inOut)` 占片长 ~40%
  （2.4 / 6 ≈ 40%），左→右推进；把手 `scale 0.85 → 1.0 → 1.06（呼吸）→ 1.0`
- 停留：t≈4.4s 后把手轻微回弹到 1.0，脚注百分比随滑杆位置实时刷新
- 结尾留 ~1.2s 可读（总时长 6s），符合 §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| leftLabel | string | 方案 A | 左侧 chip 与脚注文案 |
| leftTitle | string | 传统做法 | 左侧主标题 |
| leftPoints | string（换行分隔）| 4 条 | 左侧要点，最多 4 行 |
| rightLabel | string | 方案 B | 右侧 chip 与脚注文案 |
| rightTitle | string | AI 协作流 | 右侧主标题 |
| rightPoints | string（换行分隔）| 4 条 | 右侧要点，最多 4 行 |
| startPosition | number | 28 | 滑杆起始位置（0–100） |
| endPosition | number | 72 | 滑杆终点位置（0–100） |
| accent | color | #00FF00 | 强调色（把手/右序号标/光晕） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「左右分屏对比，中间可拖滑杆揭示两侧差异」与本任务卡的功能意图描述，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.half.left / .half.right / .rail / .knob / .cap / .points / .footnote`）为本模板自创；
   CSS 变量、关键帧、缓动函数全部按本项目 §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 把手造型为「圆形 + 黑色十字」—— 这是通用「拖拽」语义符号，不带任何
     既有模板特征。
   - 顶/底圈帽 + 细线轨，模拟「滑道」感，与项目内其他动效（chip 圆形、卡片圆角）一致。
   - 左右两侧要点序号用 `01–04` 等宽数字（MiSans SemiBold）+ 短杠引导，
     右侧短杠用 accent，左侧用灰，对比引导视觉重心。
4. **命名与曲线**：class 命名 `half / rail / knob / cap / points / footnote`，
   缓动 `power3.out / power2.inOut / back.out / sine.inOut` 全部 GSAP 内置，
   时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「对比滑块类动效」等价，
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。
