# still-layout-relay · 净室自查

## 设计意图
静态版面动效卡：一块主屏上并排放 4–6 张元素块（编号 + 类别标签），
按 `focusOrder` 指定顺序「接力换位」——当前焦点块放大到中心、
被高亮（accent 描边 + 光晕），上一块缩小退到舞台角落让位，
形成"信息重组"的接力节奏。适用于：信息重构说明、优先级切换、
多源汇总到一个焦点、状态机式的焦点迁移等静态版式叙事。

## 视觉语言
- 深色数据风：`background #0E1216`、`foreground #EDEFF1`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文（`MEBHeiHeiTi.ttf`），
  `MiSans SemiBold` 作大数字、eyebrow 与编号（`MiSansSemiBold.ttf`），
  路径统一走 `../_fonts/*`（lab/templates/_fonts 共享目录）
- 图形语言：点阵底 + 径向暗角 + 圆角矩形卡片 + 焦点处虚线光圈 +
  底部序列指示器（圆点接力 + 短连线）
- 安全边距：上下各 96–120px、左右 96px；`#stage` 内块坐标 218..1478、
  垂直 142..472，均落在 stage 内

## 动效说明（自建运动语法）
- 入场（0.05→0.7s）：4–6 张卡片按 stage 位错峰 `power3.out`、`0.5s`
- 中心标题 `fromTo(opacity 0→1, y 12→0, 0.55s)`，焦点光圈
  `fromTo(scale 0.6→1, 0.5s)`
- 接力（0.8→5.3s）：`focusOrder` 每个索引按 `focusDur = 1.3s`、
  `handoff = 0.18s` 交错执行；焦点 `to(x,y,scale 1.10, back.out(1.4))`
  放大到中心，上一焦点 `to(x,y,scale 0.34, power2.inOut)` 缩到角落；
  序列指示器同步切亮焦点 dot
- 结尾（5.3→6.0s）：最后一位焦点静置 ~0.7s，总时长 6s 与 meta.json 一致

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| title | string | 信息重组 | 中心标题前缀 |
| blocks | string（换行分隔）| 4 条 | 元素块短标签，4–6 条；少则补 "…"，多则截断 |
| focusOrder | string（逗号分隔索引）| 0,1,2,3 | 焦点接力顺序；空则退化为 0..N-1 |
| accent | color | #00FF00 | 焦点描边、光晕、指示器高亮 |
| background | color | #0E1216 | 背景 |
| foreground | color | #EDEFF1 | 文字与描边主色 |
| exportMode | enum（hidden）| transparent | 导出格式，不参与视觉 |

## 净室自查记录
1. **功能理解来源**：仅依据任务描述
   「静态版面中的元素块接力换位（版式动画），表达信息重组」
   与项目内 `split-compare-slider` 样板的硬契约（1920×1080、
   6s、`__timelines.main` paused 注册、三颜色 JS setProperty +
   CSS var() 双端接线、`../_fonts/*` 字体、GSAP 3.14.2 CDN），
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构
   （`.block[data-id]` + `.focusRing` + `.centerTitle` + `.seq .dot`）
   为本模板自创；缓动函数仅使用 GSAP 内置 `back.out` /
   `power2.inOut` / `power3.out`，编排节奏为 1.3s + 0.18s 交错，
   与项目内其它卡（例如 `split-compare-slider` 的 2.4s 单段滑杆）
   节奏不同。
3. **视觉自建过程**：
   - 卡片造型：矩形圆角 + 左上编号 + 右下短标签 + 底部类别名，
     是通用「卡片」语义符号，不带任何外部模板特征
   - 焦点光圈：`border: 1px dashed` + 径向高斯光晕，
     与项目内 chip 圆形 / 卡片圆角语言一致
   - 序列指示器：底部圆点 + 短连线，表达「接力顺序」，
     是纯功能性 UI
4. **命名与曲线**：class 命名
   `block / focusRing / centerTitle / seq / dot / link`；
   GSAP 缓动 `back.out(1.4) / power2.inOut / power3.out` 全部内置；
   总时长 6s 与 meta.json `duration` 字段一致
5. **无外链图片 / 无外部脚本**：仅 `gsap@3.14.2` CDN（与项目内其它卡
   完全一致的硬契约），字体文件走 `../_fonts/` 本地共享目录，
   其它无外链；无 `<img>`、无 `fetch`、无远程资产
6. **结论**：clean-room implementation，功能与「静态版面接力换位」
   等价，任何一帧的 DOM / CSS / 曲线 / 时长都不是外部实现的复刻；
   无上游 attribution，license `Proprietary - FDE`
