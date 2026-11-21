# grid-to-hero · 净室自研

## 设计意图
**总-分叙事**：六宫格（2×3）作为"面"先在画面上展开成六个独立缩略单元，
每格一个简短维度 + 一个数字（如「收入 42 / 利润 68 / 用户 120 / 留存 76 / GMV 93 / 增速 68」），
依次亮起后整体聚拢到画面中央，缩成一个发光点，最后放大成"主视觉"
—— 一行 chip + 一个大数字（默认 `87%`）+ 一行大标题 + 一行副文。

叙事弧：`TOTAL → FOCUS`：六个维度的全部信号收束到一个判断。

适用：多维数据收敛到一个核心指标、复杂方案总结为一个数字、年度报告由表及里。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文与标题、`MiSans SemiBold` 作数字与序号
- 图形语言：圆角卡片（`border-radius: 14px`）+ 细线描边 + 点阵底；
  单元"亮起"时描边换成 accent、`box-shadow` 暗发光，不抢戏但读得到
- 安全边距 ≥72px（实际左右 96px、上下 56/56），符合 §2.3

## 动效说明（自建运动语法，对照 §2.4）

总时长 6s，分四幕：

| 阶段 | 时间窗 | 节奏 | 缓动 |
|---|---|---|---|
| 1. 六宫格错峰亮起 | 0.10–1.80s | `stagger 0.18s × 6`、`y:30→0`、opacity 0→1，0.55s/格 | `power3.out` |
| 1.b 全部亮起后呼吸 | 1.70–2.30s | scale 1↔1.04、`yoyo:true repeat:1`、`stagger 0.04s` | `sine.inOut` |
| 2. 聚拢 | 2.10–3.85s | grid `scale 1→0.42` + `x` 居中、`power3.inOut` 1.0s；cells 再 scale→0.7 / opacity→0.35（`stagger 0.04`） | `power3.inOut` / `power2.inOut` |
| 2.b 让位 | 3.40–3.85s | grid 整体 opacity→0（让位给 hero） | `power1.out` |
| 3. hero 登场 | 3.70–5.05s | `heroPulse` 0→1.6→2.4 透明度脉冲；`heroRing` 0→1→1.08；hero `scale 0.5→1` `back.out(1.4)`；chip→num→title→sub 错峰（每条 0.4–0.65s，`y:10–18→0`） | `power3.out` / `back.out` / `power2.out` |
| 4. 数字呼吸 | 5.05–5.85s | `#heroNum` scale 1↔1.04、yoyo | `sine.inOut` |
| 5. 停留 | 5.85–6.00s | 静止可读 ≥0.15s；总留白通过 #4 阶段承接 | — |

- 错峰：列表/单元组统一 `stagger 0.04–0.18s`
- 入场位移：24–40px 内（cells 用 30，hero 内文用 10–18）
- 转场类节点：聚拢用 `power3.inOut`，hero 登场主用 `power3.out` 与 `back.out(1.4)` —— **不沿用任何外部曲线**
- 停留：约 1s 处于"hero 已就位 + 数字静止"，符合 §2.4「结尾 ≥0.8s 可读」

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | TOTAL → FOCUS | 左眉头小标，强调色 |
| heroLabel | string | 核心指标 | hero 上方 chip 文字 |
| heroNumber | string | 87% | 大数字主文本 |
| heroUnit | string | "" | 大数字右侧 unit（如 `x`/`万`），accent 染色 |
| heroTitle | string | 关键环节效率提升 | 大标题 |
| heroSub | string | 六个维度收敛到一个判断 | 副文 |
| cellLabels | string（6 项逗号分隔）| 收入,利润,用户,留存,GMV,增速 | 六宫格标签 |
| cellValues | string（6 项逗号分隔）| 42,68,120,76,93,68 | 六宫格数字 |
| accent | color | #00FF00 | 强调色（描边/数字染色/光晕） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「**网格缩略图聚合放大成主视觉（总-分叙事）**」与本任务卡的功能意图描述，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：
   - DOM 结构（`.grid > .cell[×6]` / `.hero / .heroPulse / .heroRing / .eyebrow / .footnote`）为
     本模板自创；类名 `cell / lit / heroPulse / heroRing / stageTag` 都从命名意图出发。
   - 关键时间点 0.1 / 1.7 / 2.1 / 2.6 / 3.4 / 3.7 / 3.8 / 3.9 / 4.15 / 4.30 / 4.65 / 4.85 / 5.05
     全是按本项目 §2.4 节奏（错峰 0.06–0.12 类、停留 ≥0.8s、转场 ≥0.5s 用 power3.inOut）自排，
     不抄任何外部实现。
   - CSS 变量接线：`--accent / --foreground / --background` 三色全部 `JS setProperty` 写入 + `var()`
     消费并兜底原值，遵守 §2.1 与 §2.2。
3. **视觉自建过程**：
   - 六宫格卡片用 `border-radius:14px` + 内嵌点阵底（`mask-image` 渐隐），与项目内已有圆角
     卡片风格保持一致。
   - 单元"亮起"靠 `.lit` 类加 `accent` 描边与 box-shadow 发光，不靠 transform，避免和入场位移动
     画冲突。
   - 主视觉登场顺序：先背景光晕脉冲（heroPulse）+ 一圈外环（heroRing），再 hero 缩放放大，
     最后内部 chip→大数字→标题→副文错峰入场 —— 这是**总-分叙事**的核心语序。
4. **命名与曲线**：class 命名 `grid / cell / hero / heroPulse / heroRing / eyebrow / footnote`，
   缓动 `power3.out / power3.inOut / power2.inOut / power2.out / back.out / sine.inOut`
   全部 GSAP 内置，时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与"总-分叙事/六宫格聚合主视觉"等价，
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。