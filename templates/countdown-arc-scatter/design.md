# countdown-arc-scatter · 净室自研

## 设计意图

「倒计时：弧形刻度聚合收拢成数字，数字跳变时旧数字散开、新数字聚合，制造紧迫感」。

模板的核心叙事目标是**「时间正在流逝，且每一秒都有分量」**。视觉走弧形
刻度盘路线：屏幕中央 36 个细长刻度（默认）均匀围成圆环；圆心放主数字。
数字跳变时分两段动画——

1. **散开段**：当前数字先轻微缩小淡出；同时从数字中心位置向圆周飞出 36
   颗同色粒子（accent 色），粒子到位后整圈刻度全部点亮、变 accent 色，
   形成「这一秒的余光」。
2. **收拢段**：弧形刻度被反向收回——粒子从刻度位置向圆心聚拢、缩小、
   消失；同时新数字从 0.6 倍缩放回弹到 1.0 倍（`back.out(1.4)`），覆盖
   在粒子之上。

两段循环交替推进数字 10→9→8→…→0（或任意 start→end），配合底部脉冲
小圆点（呼吸式 scale 0.85↔1.15）和红色进度条推进，把「一秒一秒」的可
视化推到画面级别。

适用场景：限时活动、产品发布倒计时、节点截止、提示词倒计时、教学中的
时间轴演示等。

## 视觉语言

- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`，
  三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字、chip 与底部步数
- 图形语言：圆角刻度（radius 2px）+ 同心圆虚线/实线环 + 屏幕四角十字
  角标 + 顶部 chip `01 / 03` 步数标记
- 安全边距 ≥72px（顶部 eyebrow top:56 + 96 padding、底部 footnote bottom:64
  + 96 padding），符合 §2.3

## 动效说明（自建运动语法，全部 §2.4 范围内）

| 段 | 内容 | 缓动 | 时长 |
|---|---|---|---|
| 入场 | 标题 fade + y24 | power3.out | 0.5s |
| 入场 | eyebrow fade + y-12 | power2.out | 0.4s |
| 入场 | chip scale 0.85→1.0 | back.out(1.4) | 0.35s |
| 入场 | 弧形外圈 scale 0.85→1.0 | power3.out | 0.7s，stagger 0.1 |
| 入场 | 初始数字 scale 0.55→1.0 | back.out(1.6) | 0.7s |
| 散开 | 旧数字 fade + scale 1.0→0.85 | power2.in | 0.25s |
| 散开 | 粒子从中心 → 弧形 tick | expo.out | 0.9s，36 stagger |
| 收拢 | 粒子从弧形 tick → 中心，scale 1→0.2 | power3.in | 0.85s |
| 收拢 | 刻度 scale 1→0.2、淡出 | power3.in | 0.85s，random stagger |
| 收拢 | 新数字 scale 0.6→1.0 | back.out(1.4) | 0.45s |
| 全程 | 脉冲点 scale 0.85↔1.15（呼吸） | sine.inOut | 0.6s × N（yoyo + repeat） |
| 结尾 | 进度条从 0 → 100% | power1.inOut | DIGIT_DUR - 1.6s |

总时长 6s（meta.json `duration`），数字步数默认 3 步（10→9→8），单步约 2s。

## schema 字段

| id | type | 默认 | 说明 |
|---|---|---|---|
| startValue | number | 10 | 倒计时起始数字 |
| endValue | number | 0 | 倒计时结束数字 |
| ticksPerDigit | number | 36 | 每步弧形刻度数量（8–72） |
| digitLabel | string | 倒计时 | 顶部 chip 文本 |
| caption | string | 时间正在流逝 | 底部说明文案 |
| accent | color | #00FF00 | 强调色（刻度/粒子/数字尾色） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录

1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md §3` 中的一行意图
   「倒计时：弧形刻度聚合收拢成数字，数字跳变时旧数字散开、新数字聚合，
   制造紧迫感」与本任务卡的功能意图描述，**未访问任何外部仓库源码**。
2. **与任何外部实现无代码可比**：
   - DOM 结构（`.dial / .tick / .num-host / .digit / .progress / .pulse-dot /
     .corner / .vignette`）均为本模板自创。
   - 运动语法：散开段 `expo.out`（粒子飞向弧形）、收拢段 `power3.in`
     （粒子+刻度回中心），与项目内既有「fade+y 位移 / power3.inOut /
     back.out」体系对齐，未参考任何外部动效库的分镜编排。
   - 数字散开/聚合使用「中心点 ↔ 圆周上等分刻度」的极坐标算法，是
     `Math.cos / sin` 直接计算，没有任何「transform-path / motion-lite
     path animation」的影子。
4. **视觉自建过程**：
   - 圆角刻度 + 同心圆虚线环 + 四角十字角标——「科技仪表盘」语言，与
     项目内其他数据可视化模板（柱状图 / 弧形对比 / 概念卡）的圆角、细
     线框语言一致。
   - 数字尺寸 380px、letter-spacing -0.04em，与项目内 big-number-card
     走同一种「极大号数字 + 紧凑字距」配方。
   - 粒子散开用 36 颗同色 accent 圆点 box-shadow 微光晕；不使用任何
     Canvas / SVG 路径，保持「DOM 粒子」风格（与全库技术契约一致）。
5. **命名与曲线**：class 命名 `dial / tick / dial-ring / num-host /
   digit / progress / pulse-dot / corner / vignette`，缓动函数全部
   GSAP 内置，时长与 meta.json `duration` 一致。
6. **结论**：clean-room implementation, functionality inspired by public
   "countdown-tension" recipe-card taxonomy only；任何一帧的 DOM/CSS/
   曲线/时长都不是外部实现的复刻；无上游 attribution，license 为
   `Proprietary - FDE`。