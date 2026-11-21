# source-converge · 净室自研

## 设计意图
多源汇聚 / 溯源总结叙事模板。4–6 个来源标签（图标 + 文字，如「新闻·路透」/
「报告·艾瑞」/「实验·A/B」/「访谈·一线」）从画面四周（左上 / 右上 / 左 / 右 /
下左 / 下右）依次错峰淡入，随后沿虚线连向画面正中的「结论点」（大圆 + 大数字 /
关键词）依次飞入并融入，中央点呼吸放大高亮，把「多条线索 → 一个结论」的
溯源叙事在一帧一分钟内讲完。

适用场景：调研溯源、竞品结论汇总、多证据支撑的观点表达、报告总结页。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文，`MiSans SemiBold` 作数字与 chip 加粗
- 图形语言：
  - 中央结论点为「三层同心圆环（外虚线 / 中外框 / 内细线）+ 中心光晕 +
    大字数字/关键词 + 上下小字」的组合靶点，视觉重量最高
  - 来源标签为圆角胶囊，左侧圆形小 icon（accent 底色 22%），后接
    `SRC·0X` 编号 + 中文名，视觉重量轻
  - 连线用虚线（`stroke-dasharray: 2 6`，accent 55% 混合），从源位置向
    中央点，暗示「路径」而非实体箭头
- 安全边距：左右 96px，上下 56px eyebrow / 56px caption，中心点半径 230px，
  四周标签最小 x=240、最大 x=1680，均不撞边

## 动效说明（自建运动语法）
- **阶段 A · 铺场（0.1–1.6s）**
  - `#coreGlow` opacity 0 → 0.6（`power2.out`，0.6s）—— 光晕先出来作视觉锚
  - `#center`  `back.out(1.4)` scale 0.86→1.0、opacity 0→1（0.55s）——
    中央靶点弹入
  - 连线 `opacity 0→1` 错峰 0.09s（0.45s each）
  - 来源标签 `opacity 0→1 + scale 0.94→1 + x/y ±0.6·偏移` 错峰 0.14s，
    单条 0.5s（`power3.out`）
- **阶段 B · 汇聚（2.0–4.2s）**
  - 每个来源标签 `gsap.to(x:dx, y:dy, scale:0.35, opacity:0)`，
    错峰 0.22s、单条 0.9s（`power3.in`）—— 直线飞入中央并缩小消融
  - 每条汇聚到达瞬间中央数字 `scale 1.0↔1.08` 微脉冲（`power2.out`，yoyo）
  - 对应连线 `opacity → 0.35`（`power2.inOut`）—— 已合并的路径淡化
- **阶段 C · 高亮（4.2–6.0s）**
  - `#center` scale 1.0↔1.06 呼吸 2 轮（`sine.inOut`，yoyo）
  - `#coreGlow` opacity 0.6→1.0 再回落 0.85
  - 结尾回弹到 1.0 / 0.85，剩余约 0.55s 停留可读

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| centerLabel | string | 结论 | 中央小标签（大写字符距） |
| centerValue | string | 5 | 中央大字数字 / 关键词（220px） |
| sources | string（换行分隔） | 4 条 | 4–6 条来源标签，最多 6 行 |
| caption | string | 多源溯源 · 汇聚为结论 | 底部说明文案 |
| accent | color | #00FF00 | 强调色（连线/光晕/大数字/胶囊 icon） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明 / webm / mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「多条来源线索（图标 / 标签）从四周汇聚成中央一点（溯源 / 总结叙事）」
   与本任务卡的功能意图描述，未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.source / #center / #centerLabel /
   #centerValue / #lines / .particle / .eyebrow / .caption`）为本模板自创；
   CSS 变量、GSAP 缓动与错位时长全部按本项目 §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 中央靶点为「三层同心圆 + 中心光晕 + 大字数字」的组合——这是
     本模板自建的「汇聚锚点」符号，与库内其它卡（如 chip、卡片、比例条）
     的视觉语言一致但结构独立。
   - 来源胶囊采用「圆 icon + SRC·0X + 中文名」的组合，是本项目 chip 家族的
     变体（本项目 chip 语言 = 圆角 999px + 边线 + MiSans SemiBold）。
   - 连线为虚线（`2 6` 节奏），语义是「路径」而非「箭头」——避免与
     库内 `tc-converging-arrows`、`board-flow-arrows` 等箭头卡的视觉重复。
   - 图标只用纯字符「●」+ CSS 圆形容器，未引用任何外链图片、字体图标库。
4. **命名与曲线**：class 命名 `source / center / core / ring / caption /
   eyebrow / lines`，缓动 `power3.out / power3.in / power2.out / power2.inOut /
   back.out / sine.inOut` 全部 GSAP 内置，时长 6s 与 meta.json `duration` 字段
   一致。
5. **红线遵守**：无外链图片、无外链字体、无外部库依赖（仅 GSAP 3.14.2 CDN，
   与其他卡完全一致）；未修改 `motion-library`、`lab/catalog.json`、其他卡文件。
6. **结论**：clean-room implementation，功能与「多源汇聚 / 溯源总结」类动效
   等价，任何一帧的 DOM / CSS / 曲线 / 时长都不是外部实现的复刻；无上游
   attribution，license 为 `Proprietary - FDE`。
