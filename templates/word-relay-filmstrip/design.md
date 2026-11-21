# word-relay-filmstrip · 净室自研

## 设计意图
**词语接力：胶片条横贯画面，旧词向左飞出胶片框，新词从右侧飞入接替，循环 2-3 次。**

适用场景：迭代叙事（草稿 → 推翻 → 重写 → 定稿）、状态演化（想法 → 验证 → 上线）、
版本/阶段轮转等需要"同一个位置上的语义被时间替换"的场景。

视觉核心：一条横向胶片条（带齿孔 + 帧号 + 中央接替槽位）横贯画面中央偏下，
**胶片本身不动**，只在胶片中央的接替槽里，旧词左飞出新词右入，把"接力"的叙事压
缩到同一视野内重复 2-3 次。胶片上下两条齿孔带强化"画面在动、胶片在演"的电影
质感；左右两侧 `INCOMING / OUTGOING` 微提示带强调方向；底部进度条 + 百分比
数字随时间线同步推进。

## 视觉语言（自建）
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底，遵循 §2.1）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作词本体与 chip/数字
- 胶片条：圆角 14 + 1px 边框 + 上下齿孔带（38px 高 radial 圆点循环）
- 中央接替槽：`760×220` 圆角 10 + 虚线外框 + accent 四角缺角（拍片角）
- 词字体：132px bold，**active** 加 22px accent 软发光
- 安全边距 96px，符合 §2.3

## 动效说明（按 §2.4 运动语法自建）
- **入场**（0.05–1.1s，power3.out / power2.out）
  - 胶片条 `clipPath inset(0 100% 0 0) → 0` 划入 0.7s
  - 眉标/标题/脚注 `fade + y±10~20` 错峰
- **首词入场**（0.55–1.1s）：`x 220 → 0, opacity 0 → 1, 0.55s, power3.out`
- **接力循环**（1.1s – 6.0s）：N 次接力（N = 总词数 - 1，受 2-3 次设置限制）
  - 每接力 slot = `perRelay ≈ 5.4 / N` 秒
  - 旧词：`x 0 → -380, opacity 1 → 0, 0.45s, power2.in`（向左飞出胶片框）
  - 新词：`x 380 → 0, opacity 0 → 1, 0.55s, power3.out`（向右飞入接替）
  - 重叠 0.06s，让"接力感"无缝衔接
- **末段**（6.0s – 7.0s）：末词 `scale 1.0 → 1.06 → 1.0, sine.inOut, 0.45s × 2`
  强化"接替完成、停留可读"
- **派生 UI 同步**（GSAP `onUpdate`）：
  - 副标序号、FRAME 编号、CYCLE 编号、底部 pct 数字与进度条 pin 全部随 `tl.time()` 实时刷新
  - INCOMING / OUTGOING 提示带仅在每个接力进行的前 55% 窗口内显示
- **总时长 7s**（meta.json `duration: 7`），符合 §2.1

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | "ITERATION · 词语接力" | 顶眉 |
| title | string | "词在飞行，含义在交接" | 主标题（首个"，"/"," 之后为 dim 样式） |
| words | string（换行分隔）| 6 个词 | 接力词，3–6 个最佳 |
| relayCount | number | 3 | 接力次数 2-3（受词数限制时取可用值） |
| accent | color | #00FF00 | 强调色（拍片角、进度条、active 发光） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 B 类中一行
   「词语接力：胶片条横贯画面，旧词向左飞出胶片框，新词从右侧飞入接替，
   循环 2-3 次」与本任务卡的功能意图描述，**未访问任何外部仓库源码**。
2. **与任何外部实现无代码可比**：DOM 结构（`.filmstrip / .perf / .slot /
   .corner / .word / .arrival-hint / .leave-hint / .progress / .pin`）为本
   模板自创；CSS 变量、关键帧、缓动函数、时序编排全部按本项目 §2.4 运动语法
   重新组织。
3. **视觉自建过程**：
   - 胶片条齿孔带用 `radial-gradient` 圆点循环 + 上下两条独立层，加 1px 横
     线分隔（这是通用"胶片/电影帧"语义，本项目其他动效没有此元素，避免撞型）
   - 中央接替槽四角 accent 缺角（`corner.tl/tr/bl/br`）—— 来自摄影取景器/
     拍片标记的语义，与现有 chip 圆形、卡片圆角都是不同图形语汇
   - 接力过程保持"胶片不动，只在槽里换词"—— 这是一种"语义绝对值守恒、相对
     值演化"的克制叙事表达，与一般"整张轮播"动效不同
4. **命名与曲线**：class 命名 `filmstrip / perf / slot / corner / word /
   relay-hint / progress / pin`，缓动 `power3.out / power2.in / power2.out /
   sine.inOut` 全部 GSAP 内置；时长 7s 与 meta.json `duration: 7` 一致。
5. **结论**：clean-room implementation，功能与「词语接力类动效」等价，
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。