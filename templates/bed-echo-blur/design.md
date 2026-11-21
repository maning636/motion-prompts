# bed-echo-blur · 净室自研

## 设计意图
主内容（eyebrow + 主标题 + 副文 + 关键数字 + 单位说明）清晰居中；背后三层「同内容的放大 + 高斯模糊 + 漂移」副本，依次错峰入场并各自不同方向缓慢漂移，营造纵深残影与回声感。前景与背景视觉重量对比形成「前景沉、背景远」的层级。适用场景：强调关键数据/标题的纵深镜头、品牌镜头需要层次感的开场/转场。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字与 eyebrow 加粗
- 图形语言：圆角 18 卡片 + 1px 内描边 + 低强度 accent 外发光；点阵底统一
- 安全边距 ≥72px（角标 88/56，卡片 880×~640 内填），符合 §2.3

## 动效说明（自建运动语法）
- 入场：主前景 `fade + y30 + clip-path 底部裁切 18% → 0`，`power3.out`，0.7s，0.10s 起
- 主前景内文字层 stagger：eyebrow（x -16, 0.4s）→ h1（y 18, 0.55s）→ sub（y 14, 0.45s）→ keyrow（y 14, 0.5s）
- 关键数字 `scale 0.92 → 1.0` 用 `back.out(1.6)` 强调手感
- 残影层（far → mid → near）错峰 0.18s 入场：每层起始偏移 = `drift × (-1)`、起始 scale = `1 + 0.06 × (i+1)`、稳定 scale = `1 + 0.035 × (i+1)`；入场后接 `sine.inOut` 慢漂移到对称位（6.5 / 5.4 / 4.2s），三层不同方向
- 主前景呼吸：`scale 1.0 ↔ 1.025`，`sine.inOut`，1.6s × 2（yoyo），2.4s 起
- 角标 4 个角落淡入 + x±10 微位移，错峰 0.05s
- 结尾：关键数字回到 1.0，停留 ~1.6s 可读（总时长 6.5s）

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | DEPTH · 03 | 顶部眉题（仅 tail 部分会替换 eyebrow 行） |
| title | string | 纵深不是特效，是信息层级 | 主标题 |
| subtitle | string | 把同一个画面推到背景里做残影，前景反而更沉 | 副标题 |
| keyNumber | string | 6.5x | 关键数字（accent 色，92px 等宽） |
| unit | string | 视觉深度倍增 | 数字右侧单位说明 |
| ghostCount | number | 3 | 残影层数（1-3，越远模糊越强、漂移越慢） |
| ghostBlur | number | 28 | 单层模糊强度（px），远层乘 1.6、中层 1.0、近层 0.55 |
| ghostDrift | number | 48 | 残影漂移基础距离（px），far/mid/near 三层方向不同 |
| accent | color | #00FF00 | 强调色（数字、eyebrow b、角标前景外发光） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 一行意图
   「背景内容回声式模糊残影：主内容清晰居中，背景层是同内容的放大模糊虚影缓慢漂移，营造纵深感」，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.ghost-layer / .ghost-card / .hero / .keyrow / .corner`）为本模板自创；CSS 变量、关键帧、缓动函数全部按本项目 §2.4 运动语法重写。
3. **视觉自建过程**：
   - 残影层用 `filter: blur()` + 偏移 `transform: translate() + scale()` 表达「远-近」三档纵深；不是用 opacity 蒙版也不是用 text-shadow；远层 blur 系数 1.6×、近层 0.55×，呼应人眼对远景的散焦。
   - 主前景与残影的样式分两套（`.hero h1 / .hero .sub / .hero .key` vs `.ghost-card h1 / .ghost-card .sub / .ghost-card .key`），用 `color-mix()` 调透明度，避免引入多个 CSS 变量，遵循 §2.1。
   - 角标放在四角的视觉约定来自 §2.3 安全边距 >72px 的纪律，而不是借鉴外部卡。
4. **命名与曲线**：class 命名 `ghost-layer / ghost-card / hero / keyrow / corner`，
   缓动 `power3.out / power2.out / back.out / sine.inOut / power2.inOut` 全部 GSAP 内置，
   时长 6.5s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「纵深残影类镜头动效」等价，
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。