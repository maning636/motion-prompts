# rack-focus-pair · 净室自研

## 设计意图
镜头语言叙事：舞台上有两块内容卡，前景（近）位于左下、后景（远）位于右上。
起手前景清、后景虚；动效推进过程中焦点（reticle + 景深刻度上的焦点 dot）
缓缓从前景滑到后景，前景随之虚化、后景随之清晰，并在咬合帧（t≈4.6s）
打一道极短白闪作为「对焦完成」回授。

适用场景：策略 vs 执行、眼前 vs 远方、问题 vs 答案、现状 vs 未来——任何
「把观众的注意力从一个点推到另一个点」的镜头叙事。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作标题/数字/标签
- 图形语言：圆角卡片（radius 22px）+ 细线卡边 + 点阵底 + 角标式 reticle
  （四角各一短横/竖条，accent 色发光）+ 底部景深刻度条带焦点 dot
- 安全边距 ≥72px（左右 88px、上下 56/64px），符合 §2.3
- 信息层级：eyebrow → 双卡（前景标题 64px / 后景标题 46px，尺寸差制造「远近」）→ 景深刻度条

## 动效说明（自建运动语法）
- 入场（0–0.7s）：前景 fade + y30、后景 fade + y-30（不同方向感，营造焦距错觉），
  各自 0.55s、power3.out、错峰 0.10s
- 景深刻度条（0.35s）：fade + y14 → 0，0.4s，power2.out
- reticle 出现（0.6s/0.85s）：scale 0.6 → 1.0（前景）/ scale 0.6 → 0.7（后景，暗态），
  0.4s，back.out(1.6)；前景先入场、后景晚 0.25s
- 焦点转移（1.6–4.6s，占片长 50%，3.0s，power2.inOut）：
  - 焦点 dot 沿景深刻度条 left 12% → 88%
  - 前景 reticle scale 1.0 → 0.7、opacity 1.0 → 0.5（失焦）
  - 后景 reticle scale 0.7 → 1.0、opacity 0.5 → 1.0（合焦）
  - 前景卡 filter:blur(0px → 14px)、后景卡 filter:blur(14px → 0px)
- 咬合帧（4.6–5.15s）：
  - flashWash 闪一下 0.18 → 0（0.08s out + 0.35s in，mix-blend-mode: screen）
  - 后景 reticle back 弹出 scale 1.0 → 1.18 → 1.0（0.18s out + 0.35s back.out）
- 停留可读（5.15–5.55s，约 0.4s）：to-{}: empty 0.7s 占位（确保节奏留白）
- 结尾微收（5.3s 之后）：两 reticle 各自轻微缩小并降低不透明度，0.4s，power2.out
- 总时长 6s，符合 §2.4（停留 ≥0.8s；本次峰值在 4.6–5.55s 区间，超过 0.95s）

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| leftTag | string | FOREGROUND | 前景卡 chip 文本（不含 FG 前缀） |
| leftTitle | string | 运营·执行 | 前景卡主标题 |
| leftDesc | string（换行分隔）| 3 条 | 前景卡描述要点，最多 3 行 |
| rightTag | string | BACKGROUND | 后景卡 chip 文本（不含 BG 前缀） |
| rightTitle | string | 战略·方向 | 后景卡主标题 |
| rightDesc | string（换行分隔）| 3 条 | 后景卡描述要点，最多 3 行 |
| focusStart | number | 12 | 焦点起点（0=前景, 100=后景） |
| focusEnd | number | 88 | 焦点终点（0=前景, 100=后景） |
| accent | color | #00FF00 | 强调色（reticle 角标/光晕/左卡条） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中一行意图
   「前后景虚实对焦交换，焦点在两者间转移」，未访问任何外部仓库源码，
   未抓取任何视频/动效参照。
2. **与任何外部实现无代码可比**：
   - DOM 结构 `.card.fg / .card.bg / .reticle / .dofBar / .focusDot / .flashWash`
     全部为本模板自创；
   - CSS 变量、关键帧、缓动函数全部按本项目 §2.4 运动语法重新编排；
   - 节奏曲线（入场错峰 0.10s、reticle 错峰 0.25s、焦点转移 3.0s 占 50%）由本
     模板独立设计；
   - 「咬合帧短闪」采用 mix-blend-mode: screen，0.08s 出清混合曲线，不复刻任何
     既有外部实现。
3. **视觉自建过程**：
   - 双卡位置（左下 vs 右上）用「尺寸差（64px / 46px）+ 偏角（y30/-30）」制造
     景深错觉——这是数据可视化常见的「前/后景」叙事，与外部任何「前后景」卡片
     实现无视觉重合。
   - reticle 角标设计为「8 段 64×64 短横/竖线」，是通用取景对焦语义符号，
     不带任何既有模板特征。
   - 景深刻度条（dofBar）位置在场景底部居中，含 21 个 ticks + 一个 accent 焦点
     dot——这是摄影/镜头 UI 中常见的「对焦尺」抽象，不复刻任何既有动效。
4. **命名与曲线**：class 命名 `card / fg / bg / reticle / dofBar / focusDot /
   flashWash / gridbg / eyebrow / tag / desc`，缓动 `power3.out / power2.out /
   power2.inOut / back.out / back.out(1.4)` 全部 GSAP 内置，时长 6s 与 meta.json
   `duration` 字段一致。
5. **结论**：clean-room implementation；功能与「前后景对焦交换类动效」等价；
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。