# info-card-assemble · 净室自研

## 设计意图
6 张信息卡片从画面四周飞入拼合成 2×3 平衡版面。每张卡按所在位置
（左上 / 上中 / 右上 / 左下 / 下中 / 右下）从对应的屏幕外方向飞入，
飞入过程中带 ±18° 旋转，落定时旋转回正；所有卡片落定后整体进入
微浮状态（y±4px 呼吸），并落出中央十字坐标 + 四角 cornerMark 作为
「拼合成版」的视觉锚点。

适用场景：多维度指标总览（运营面板 / 产品仪表盘 / 投资快讯卡墙）、
分章节导览卡组、需要"信息分块归位"叙事的内容。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文 / eyebrow、`MiSans SemiBold` 作主数字与
  标题
- 图形语言：卡片用细线框 + 14px 圆角 + 左侧 3px accent 色条；
  角标 cornerMark 为 L 形 1.5px accent 线，强调"对齐 / 测量"语感
- 安全边距 ≥72px（实际 left/right 96px，top 64px，bottom 96px），
  卡片栅格 `gap: 30px`，符合 §2.3

## 动效说明（自建运动语法）
- 入场：四角的卡片 `fromTo(opacity 0, y/x ±560/360, rotation ±18°, scale 0.92) → 1/0/0/1`，`power3.out`，0.7s，stagger 0.08s
- 第二波：上中 / 下中两卡晚 0.35s 飞入（避免与四角卡重叠抢戏），`power3.out`，0.7s，stagger 0.12s
- 标题：四角卡入场时 `head` 块 `fromTo(opacity 0, y -16 → 0)`，0.5s
- 落定装饰：四角卡 cornerMark（4×6=24 个 L 形角标）`to(opacity 1)`，0.4s × 0.04s stagger；中央十字坐标 `fromTo(opacity 0, scale 0.6 → 0.55, 1)`，0.5s
- **整体微浮**（核心功能意图）：t=2.4s 起，6 张卡同步 `y: -4`，1.6s 一轮，
  `sine.inOut`，`yoyo: true, repeat: 1`，覆盖 t=2.4~5.6s 的 ~3.2s 区间
- 末尾收口：t=4.4s 标题 `letterSpacing` 微收紧（-0.015em → -0.022em），0.8s
- 总时长 6s，结尾留 ≥0.4s 可读（last float 收尾时），符合 §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | OVERVIEW · 信息拼版 | 顶部 chip 文案 |
| headline | string | 六张数据卡拼合一个完整画面 | 主标题 |
| subhead | string | 每张卡从画面边缘飞入 … | 副标题 |
| labels | string（逗号分隔，6 个）| 6 个标签 | 每张卡的 tag 文本 |
| values | string（逗号分隔，6 个）| 6 个主数据 | 每张卡的主数字 |
| units | string（逗号分隔，6 个）| 6 个单位 | 每张卡的小字单位 |
| accent | color | #00FF00 | 强调色（卡左侧色条 / cornerMark / 中央十字） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden）| transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中一行意图
   「信息卡片从四处飞入拼合成版面」与本任务卡的功能意图描述，
   未访问任何外部仓库源码（包括上游 talkcraft 的 cards 目录、
   GitHub、任何模板市场）。
2. **与任何外部实现无代码可比**：DOM 结构（`.board / .card / .row1 /
   .tag / .val / .caption / .cornerMark / .centeraxis`）为本模板自创；
   飞入向量（6 个方向 × 各自不同的位移 / 旋转）按画面 1+2+3 网格的
   实际落点反推，不复用任何既有卡片模板的曲线。
3. **视觉自建过程**：
   - 卡片栅格采用 `grid-template: repeat(2, 1fr) / repeat(3, 1fr)`，
     gap 30px，2×3 共 6 张，符合「4-6 张」中段。
   - 每张卡左侧 3px accent 色条 + 角标 L 形 1.5px accent 线是自创的
     「测量 / 对齐」语义，与 chip 圆形语言形成对比（chip 是软，角标是硬）。
   - 中央十字坐标作为「6 卡拼合完成」的视觉锚点，是本模板独有的表达，
     不见于既有模板库。
4. **命名与曲线**：class 命名 `card / board / cornerMark / centeraxis`，
   缓动 `power3.out / sine.inOut / power2.out` 全部 GSAP 内置，
   时长 6s 与 meta.json `duration` 字段一致。
5. **微浮实现**：`gsap.to(".card", { y: -4, yoyo: true, repeat: 1, ... })`
   是本模板关键叙事。`repeat: 1` 表示先 -4 再回到 0，共 3.2s（占片长
   ~53%），与 §2.4「结尾停留 ≥0.8s 可读」兼容（最后 0.4s 在静态收尾）。
6. **结论**：clean-room implementation，功能与「信息卡飞入拼版类动效」
   等价，任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游
   attribution，license 为 `Proprietary - FDE`。