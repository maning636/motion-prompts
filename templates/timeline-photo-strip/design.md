# timeline-photo-strip · 净室自研

## 设计意图
横向时间轴 + 照片条推进模板。5 个节点（卡片 + 编号 + 标签 + 说明）从左到右
均分排布；时间从 0 → 1 在节点间顺序推进，已经过去的节点被「压暗成灰」+
轻微缩小，**当前**节点「微放大 + accent 光圈 + 强调色数字编号」，未来节点保持
低透明 + 灰度滤镜但仍可见可读。底部一条横向 track 从左到右填充 accent 色，
并在脚注实时刷新百分比与当前 STEP。

适用场景：项目历程、产品演进、用户旅程、阶段复盘等需要逐项点亮的叙事。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`；
  三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作编号 / 标签 / chip 加粗
- 图形语言：
  - 圆角卡片（radius 14）+ 1px 细线边框 + 阴影
  - 卡内抽象「相片感」用 radial-gradient + 斜向高光带 + 右上 stamp 标签 +
    底部全大写字距拉开的 glyph 模拟「已冲洗的底片」
  - track 用 accent 色发光 + 节点 dot 在 done/current/future 三态下分别
    用灰 / accent + 光圈 / 灰表达
  - 已过去卡：`grayscale(1) brightness(.62) + scale(.96)`
  - 当前卡：无滤镜 + `scale 1.0..1.08` 弧形脉动 + accent 边框 + 大光晕
- 安全边距：左右 96px，顶部 eyebrow/title 自带 64–200px 留白，
  底部脚注 96px，符合 §2.3

## 动效说明（自建运动语法，符合 §2.4）
- **入场**：
  - eyebrow fade+y14 0.45s（power2.out）
  - 标题 wipe（clipPath） 0.7s（power3.out）
  - 副标题 fade+y10 0.45s（power2.out）
  - 主舞台 fade+y18 0.55s（power3.out）
- **节点错峰**：每个 col 的 photo `opacity+y+scale .94→1` 0.55s，
  stagger 0.12s；meta fade+y10 0.4s 紧跟其后
- **推进（核心）**：
  - 用一个空 tween 占位 3.4s，在 onUpdate 里按 `tl.time()` 计算
    0..N 段进度；根据 `k = floor(raw)` 给 col 打 done / current / future
    class，根据 `local = raw - k` 计算当前 photo 的微放大
      - `scale = 1 + 0.08 * (1 - |local - 0.5| * 2)`
      - 即 local=0.5 时 scale=1.08，到 local=0 或 1 时回到 1.0；
        自然形成「进入 → 放最大 → 离开 → 缩回」的弧形
  - 另起一个同步空 tween，在 onUpdate 里叠加 `+ sin(local·π) * 0.02`
    的小幅呼吸，让"现在"的卡始终比"刚过去的"更显眼
  - trackFill 宽度 = `(k + local) / N * 100%`，脚注 % / STEP / 名称
    全部实时同步
- **停留**：最后一节点定格 current + scale 1.06 + 脚注 100%，
  停留约 0.9s 可读
- **淡出**：scene opacity 1→0，0.45s（power2.in），最后 0.45s

总时长 6s（与 meta.json `duration` 一致）。

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| title | string | 从一个想法到一套系统 | 主标题 |
| eyebrow | string | PATH · 历程 | 顶头小标签，`·`/`-`/`\|` 分隔：前半为强调标签、后半为说明 |
| time1..time5 | string | 01..05 | 节点编号（卡内 stamp + meta） |
| label1..label5 | string | 做一次 / 存模板 / … | 节点标签（主标题） |
| caption1..caption5 | string | 一行说明 | 节点下方一行短说明 |
| accent | color | #00FF00 | 强调色（track / 当前节点边框 / 当前编号 / 光晕） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明 / mp4 / webm |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「横向时间轴上照片节点依次点亮，已过的节点压暗成灰，当前节点展开微放大」
   与本任务卡的功能意图描述；未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.stage / .track / .track-fill /
   .nodes / .col / .nodot / .photo / .stamp / .glyph / .meta / .footnote`）
   全部为本模板自创；CSS 关键帧、缓动函数（power2.out / power3.out / power2.in）
   与 timeline 编排（stagger 0.12s + 空 tween 推进 + onUpdate 计算子进度）
   均按本项目 §2.4 运动语法独立编排。
3. **视觉自建过程**：
   - 「照片卡」用纯 CSS 抽象表达：radial 高光 + 斜向高光带 + 右上 stamp +
     底部全大写字距 glyph 模拟「已冲洗的底片 / 数码相框」质感，不依赖任何
     外部素材或网络图。
   - 三态（done / current / future）通过 class 切换表达：done = grayscale
     + brightness + 缩到 0.96；current = 无滤镜 + accent 边框 + 光圈 +
     微放大；future = 半灰 + 低透明，但轮廓仍可见以提示「接下来会发生」。
   - 进度反馈用 track-fill 长度 + 脚注百分比 + STEP 编号三处同步刷新，避免
     「数字停滞但视觉在动」的常见穿帮。
4. **命名与曲线**：class 命名 `col / photo / stamp / glyph / track / track-fill /
   nodot / meta / footnote`；缓动 `power2.out / power3.out / power2.in` 均为
   GSAP 内置；时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「时间轴 + 照片节点依次点亮」类
   动效等价；任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游
   attribution，license 为 `Proprietary - FDE`。
