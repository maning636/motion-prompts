# flying-words · 净室自研

## 设计意图
文字 kinetic type 模板。8 个关键词（默认「从 / 碎片 / 到 / 系统 ／
从 / 复制 / 到 / 重组」）分别从画面 8 个方位（左上、右上、左中、右中、
左下、右下、中上左、中上右）沿不同入射角度飞入，错峰落入主标题的两行
字位。落位后整体淡出，露出两行主文案（强调词着 accent 色 + 短下划线）
与副标题，形成「散 → 聚 → 落定」的三段叙事。

适用场景：口号发布、对比项宣言、主张立意、品牌主张片头。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MiSans SemiBold` 作主标题（厚重展示风），`MEBHeiHeiTi` 作副
  标题与正文。`MiSans SemiBold` 作 eyebrow / chip / 数字
- 图形语言：点阵底（56×56）+ 圆角发光源点 + 入射尾迹短弧 + 落位闪光
  圆环；主标题强调词带短下划线 + 阴影光晕
- 安全边距 ≥72px（左右 96px、上下 56/56px），符合 §2.3

## 动效说明（自建运动语法）
| 段落 | 时间 | 内容 |
|---|---|---|
| 源点点亮 | 0.05–0.30s | 6 个源点 `fromTo(opacity 0→1, scale 0→1)`，stagger 0.05s |
| 词飞入 | 0.35–3.60s | 8 个词依次飞入，stagger 0.30s；每个 `fromTo(opacity 0→1, scale .7→1, rotation ±8°→0°)`，power3.out 0.75s；尾迹 `scaleX 0→.55→0` 0.7s；落位闪光 `width 0→90→220` 0.6s |
| 词淡出 | ~3.95–4.30s | 8 词 stagger 0.04s 同时淡出，0.35s power2.in |
| 主标题揭示 | 4.10–4.80s | headline `fromTo(opacity 0→1, y 18→0, clipPath inset(100%→0%))`，power3.out 0.7s |
| 强调下划线 | 4.50–5.05s | `.lead::after` 触发 CSS `animation under-grow` 0.55s |
| 副标题入场 | 5.00–5.55s | subtitle `fromTo(opacity 0→1, y 12→0)`，power2.out 0.55s |
| 源点点淡出 | 4.20–4.60s | 源点点淡出避免干扰主标题 |
| 主标题呼吸 | 4.20–5.80s | `letterSpacing -0.02em ↔ -0.005em`，sine.inOut 1.6s yoyo×1 |

- 全部时长 6s，留 ~1.2s 静态可读，符合 §2.4
- 入场缓动：power3.out（飞入）/ power2.out（尾迹、源点）
- 错峰：stagger 0.30s（飞入组），0.05–0.08s（强调/淡出组）

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| word1..word8 | string | 从/碎片/到/系统/从/复制/到/重组 | 8 个飞入词的文案（前 4 为上行、后 4 为下行） |
| leadWord | string | 重组 | 备用强调词位（视觉主标题第 4、第 8 词自动着 accent） |
| subtitle | string | 把零散的信息流，聚成可复用的资产 | 主标题揭示后的副标题 |
| eyebrow | string | FLYING WORDS · 文字动效 | 顶头右侧 |
| accent | color | #00FF00 | 强调色（强调词 / 尾迹 / 源点 / 下划线） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「关键词从四周飞入汇成句」与本任务卡的功能意图描述（6–8 个关键词、
   入射角度各异、汇合后整体定格）。未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.source-dot / .word / .trail /
   .spark / .headline / .subtitle / .stage-inner`）为本模板自创；8 词的
   入射点位 / 入射角 / 错峰编排按本项目 §2.4 运动语法独立设计；缓动
   `power3.out / power2.in / sine.inOut` 全部 GSAP 内置。
3. **视觉自建过程**：
   - 8 词分为 8 个入射方向（4 角 + 左/右中 + 中上左/右），全部从屏幕
     外/外圈起跳，落点对齐主标题两行的字位（line1: 从 / 碎片 / 到 /
     系统；line2: 从 / 复制 / 到 / 重组）。
   - 每个词带 80px 短弧尾迹（accent）+ 半径 90→220px 的落位炸开圆环
     （accent），用 0.18+0.42s 的两段衔接完成「尖峰→余韵」。
   - 主标题揭示用 `clipPath inset(0 0 100% 0) → 0%` 的「自下而上擦除」
     而非 fade，强调「汇合后整体定格」的视觉语义。
   - 强调词（line1 第 4 词、line2 第 4 词）下方 6px 短下划线 + box-shadow
     光晕，与强调色统一。
4. **命名与曲线**：class 命名 `word / trail / spark / source-dot / headline /
   lead`，缓动 `power3.out / power2.out / power2.in / sine.inOut`，时长
   6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「关键词飞入汇成主句类
   动效」等价；任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无
   上游 attribution，license 为 `Proprietary - FDE`。