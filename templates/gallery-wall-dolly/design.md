# gallery-wall-dolly · 净室自研

## 设计意图
照片墙缓慢推镜浏览（dolly-in）动效模板。画面主体是一面 3×2 的照片墙
（默认 5 张，占位符由 CSS 渐变 + 几何形状本地生成，**不使用任何外链图片**），
镜头以 `scale 1.0 → 1.25` 从远处「慢慢推近」，途中第 `focusIndex` 张照片
逐级提亮到 `brightness(1.5 → 1.9)` 并描一圈 accent 光晕，其余照片保持
`opacity: 0.4 / brightness(0.55)` 的暗调，视觉重心被自然推到焦点照片上。
底部一条说明条（kicker `03 FOCUS` + 主标题 + 副标题）+ 右下角实时读数
`1.00× → 1.25×` 强化推镜的量感。

适用场景：作品集展示、案例集导览、产品相册、内容策展开场。

## 视觉语言
- 深色画廊风：`background #0E0C0A`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作 kicker 与右下角数字
- 图形语言：3 列 × 2 行照片墙 + 单张圆角 6px + 深色投影 + 焦点强调色描边光晕
  + 舞台外围径向暗角（`radial-gradient`）把视线收拢到中央
- 安全边距 ≥72px（实际左右 padding 96px、上下 56/96px），符合 §2.3

## 动效说明（自建运动语法）
- 墙整体入场：`fromTo(#wall, {opacity:0, scale:0.96} → {opacity:1, scale:1.0}, 0.7s, power2.out)`
- 照片错峰淡入：`fromTo(#wall .photo, {opacity:0, y:12} → {opacity:0.4, y:0}, 0.5s, power2.out, stagger:0.06)`
- 焦点照片提亮：`fromTo(#wall .photo.focus, {brightness:0.55} → {brightness:1.5}, 0.6s, power2.out)`，
  推镜中段再补一拍 `1.5 → 1.9`（1.6s, power1.inOut），构成「逐级提亮」
- dolly-in 主体：`fromTo(#dollyLayer, {scale:1.0} → {scale:1.25}, 3.3s, power1.inOut)`
  占片长 ~55%（3.3 / 6），中段稳定推进，营造从容的推镜节奏
- 尾部微回弹：`to(#dollyLayer, {scale: targetScale * 0.995}, 0.8s, power2.out)`，收 4.6s 起
- 读数同步：`eventCallback("onUpdate")` 按 timeline 时间戳重算 scale，避免 pause/seek 时读数不同步
- 停留：t≈5.4s 后主视觉已停在放大态、焦点照片处于最高亮度，可读 ~1s，符合 §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | PHOTO WALL · DOLLY IN | 顶部 eyebrow，"·" 前后拆分到左/右两个 span |
| title | string | 照片墙缓慢推镜浏览 | 底部主标题 |
| subtitle | string | 焦点照片逐级提亮，其余保持暗调。 | 底部副标题 |
| photoCount | number | 5 | 显示照片数（clamp 4–6） |
| focusIndex | number | 2 | 焦点照片序号（0 起，clamp 0..n-1） |
| dollyScale | number | 1.25 | dolly-in 终态缩放（clamp 1.0–1.4） |
| accent | color | #00FF00 | 强调色（kicker / 焦点描边 / 右下读数） |
| background | color | #0E0C0A | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明 / webm / mp4 |

## 净室自查记录
1. **功能理解来源**：仅依本任务卡一句话意图
   「照片墙缓慢推镜浏览（dolly-in），焦点照片逐级提亮，其余保持暗调」，
   未访问任何外部仓库源码或设计稿。
2. **与任何外部实现无代码可比**：DOM 结构
   （`#root > #scene > .stage#wallStage > #dollyLayer > #wall > .photo.p1..p6`）
   为本模板自创；`.stage::after` 径向暗角、`.photo.focus` 描边光晕、
   `.caption .meta .scale` 右下读数均自设；缓动、时长、stagger 全部按本项目
   §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 照片占位符全部为 CSS 渐变 + `::after` 几何形（三角、圆、渐变条纹、
     横条、矩形边框），不使用任何 `<img>` 或外链 URL，符合净室纪律与
     离线可渲染要求。
   - 焦点照片的「提亮 + 描边光晕 + 右上角小圆点」是通用「选中态」语义，
     未复刻任何既有模板的视觉签名。
4. **命名与曲线**：class 命名 `wall / dollyLayer / photo / p1..p6 / focus /
   caption / kicker / scale`，缓动 `power2.out / power1.inOut / power2.inOut`
   全部 GSAP 内置，时长 6s 与 meta.json `duration` 字段一致。
5. **变量契约**：`data-composition-variables` 为单引号 JSON 数组，含
   `title / subtitle / photoCount / focusIndex / dollyScale` + 三颜色
   `accent / background / foreground` + 隐藏 `exportMode` 共 10 项，
   JS 端全部经 `setProperty("--foreground|--background|--accent")` 接线，
   CSS 端全部经 `var(--xxx, <fallback>)` 消费，双端一致。
6. **结论**：clean-room implementation，功能与「照片墙 dolly-in 焦点提亮类
   动效」等价，任何一帧的 DOM / CSS / 曲线 / 时长都不是外部实现的复刻；
   无上游 attribution，license 为 `Proprietary - FDE`。
