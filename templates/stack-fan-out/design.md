# stack-fan-out · 净室自研

## 设计意图
「一叠卡片从中心扇形展开成横排，展开顺序带错峰，最后一张可高亮」——
一摞卡片先叠在画面中下方的枢轴点（`.fanorigin`）上，标题与 eyebrow 错峰下落，
随后卡片按 `stagger` 间隔沿水平弧落位展开成扇形；最后一张卡片被强调色描边 +
数值用强调色 + 缓慢呼吸，自然将视觉重心引向横排末端。适用于方案对比、选项罗列、
能力梯度、版本演进等叙事。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字与 chip 加粗
- 图形语言：圆角卡片（radius 14）、半透明白底 + 边框、点阵底、枢轴圆点 +
  短细线作为扇形落位前的视觉中心；末位卡片用 accent 边框 + accent 数值 +
  微弱 box-shadow 发光
- 安全边距 ≥72px（实际左右 padding 96px、上下 96px 标题区），符合 §2.3

## 动效说明（自建运动语法）
- 入场：eyebrow `fade+y -10 → 0`，0.4s `power2.out`；hd `fade+y18 → 0`，
  0.55s `power3.out`，比 eyebrow 晚 0.1s
- 折叠态：弧形枢轴点 + 枢轴线淡入（0.35s + 0.35s `power2.out`），作为视觉中心
- 卡片入场：所有卡片整体 `opacity 0 → 1`，stagger 0.04s，0.35s `power2.out`；
  GSAP 用 `gsap.set` 把基态（`x:0 y:0 rotate:0 scale:.86 opacity:0`）写到
  inline transform，确保后续 `.to(...)` 起点与基态对齐
- 扇形展开：GSAP 直接驱动每张卡的 `x / y / rotation / scale`，每张卡依序
  `0.55s power3.out` 落位 + `0.32s back.out(1.6)` 微弹稳定，stagger 默认 0.09s
  （可调 0.04–0.18s）；不依赖 CSS class 切换，因为 GSAP 写 inline transform
  会盖 CSS 的复合 transform（自实现踩坑记录）
- 末位高亮：`scale 1.0 → 1.05 → 1.0` 呼吸（1.2s `sine.inOut` + yoyo），
  在 2.8s 起 1 轮，5.2s 收尾回 1.0
- 弧形枢轴淡出：1.4s `power2.out`（卡片展开后任务完成）
- 脚注 pctVal：随卡片展开实时从 0 推到 N
- 总时长 6s，结尾留 ≥1s 可读（呼吸收尾在 5.2s–5.7s），符合 §2.4

## 几何
- 扇形原点在画面中下方（`.fanorigin` left:50%, bottom:260px）
- 弧半径 x 方向 420px，弧顶 y 上抬 48px（`ARC_LIFT_Y = -48`）
- 卡片均匀分布在 `[-fanSpan/2, +fanSpan/2]` 角度区间内（`fanSpan` 默认 90°）
- 卡片尺寸 200×260，圆角 14px，旋转中心 50% 50%（几何中心，避免端部卡
  旋转后底部角点下沉到画面外）
- 卡片先定位到 `.fanorigin` 中心（offsetParent 偏移换算），再由 GSAP 平移到
  极坐标落位点

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| title | string | 卡片扇形展开 | 主标题 |
| subtitle | string | 从叠 stack 到横排，错峰入场 + 末位高亮 | 副标题 |
| cardCount | number | 5 | 卡片数量（4–7） |
| cardLabels | string（竖线分隔） | 方案A…方案E | 卡片标题 |
| cardValues | string（竖线分隔） | 32%…89% | 卡片副值 |
| fanSpan | number | 90 | 扇形展开跨度（度，40–140） |
| staggerSec | number | 0.09 | 错峰间隔（秒，0.04–0.18） |
| highlightLast | enum | true | 末位高亮开关（true / false） |
| accent | color | #00FF00 | 强调色（末位卡片边框/数值/呼吸光晕） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「stack-fan-out — 一叠卡片从中心扇形展开成横排，展开顺序带错峰，最后一张
   可高亮」与本任务卡的功能意图描述，未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.fanstage / .fanorigin / .fcard /
   .cardhead / .cardlab / .cardval / .arc / .footnote`）为本模板自创；
   CSS 变量 `--fx / --fr / --fy` 记录每张卡的目标极坐标（仅作 GSAP 读取
   用的中转），动画全部由 GSAP timeline 驱动；关键帧、缓动函数、stagger
   间隔全部按本项目 §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 卡片叠态：所有 fcard 基态 `scale(.86) + translate(0,0) rotate(0)`，
     看起来像一摞卡片叠在枢轴上 —— 这是「stack」的通用语义，不带任何
     既有模板特征。
   - 扇形展开：用极坐标一次性写入 5–7 张 CSS 变量，GSAP 直接 `.to(x/y/rotation)`
     替代「+ open class」的方式（自实现踩坑记录 —— GSAP 写 inline transform
     会盖 CSS 复合 transform，导致基态 CSS 失效，故改为 GSAP 全程接管）。
   - 枢轴视觉中心：`.arc`（圆点 + 短细线）在卡片入场前后承担视觉中心任务，
     卡片展开后淡出；样式与现有模板的「圆角把手 + 细线」一致（参见
     split-compare-slider 的 `.rail / .cap`）。
   - 末位高亮：用 `accent` 边框 + 数值色 + box-shadow 发光，呼吸用 GSAP
     `scale yoyo + sine.inOut`，不引入 CSS keyframes（动画统一在 timeline 中）。
4. **命名与曲线**：class 命名 `fanstage / fanorigin / fcard / cardhead /
   cardlab / cardval / arc / footnote`；缓动 `power2.out / power3.out /
   back.out / sine.inOut` 全部 GSAP 内置；时长 6s 与 meta.json `duration`
   字段一致。
5. **结论**：clean-room implementation，功能与「扇形展开 / 卡片高亮 / 错
   峰」等价；任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游
   attribution，license 为 `Proprietary - FDE`。