# unit-grid-proportion · 净室自研

## 设计意图
一个 rows×cols 的单元方阵（默认 10×10 = 100 格）按 categories 给出的百分比
逐格点亮，每格 = 1/N，恰好表达构成比例。右侧 legend 用同一组颜色与百分比
数字滚动呼应。强调色（默认荧光绿）落在第一个分类（最大占比），其余分类
沿用 MiSans SemiBold 的等宽数字与中性色阶。

适用场景：用户/收入/时间构成的占比可视化；任何「整体由 N 类构成」叙事。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量 JS `setProperty` + CSS `var()` 双端接线带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字/标题/脚注
- 图形语言：点阵底 + 圆角卡片（radius 12）+ 圆角小单元（radius 6）+ 单元格
  轻微发光（`box-shadow 28%` 透明度）
- 安全边距 96px（左/右）+ 64px（上 eyebrow），主区域四周留白充足，符合 §2.3

## 动效说明（自建运动语法）
- 入场（0.05–0.95s）：eyebrow 上移淡入 → 标题/副标题/total 错峰下落淡入，
  `power2.out / power3.out`、0.4–0.55s
- 网格整体淡入（0.55s，0.4s）
- 单元格按 idx 顺序 stagger 点亮（0.7s 起步，每格 0.014s，单格 0.32s，
  `power2.out`），从首格到尾格约 1.7s（100 格），约在 t≈2.42s 全部点亮
- legend 行错峰入场（`power2.out`、0.4s、stagger 0.1s），紧随其后百分比数字
  从 0 滚动到目标值（`power2.out`、0.9s、stagger 0.08s）
- 结尾呼吸：t≈4.4s 起所有单元 `scale 1.0↔1.04` 呼吸（`sine.inOut`、1.2s、
  yoyo+repeat=1），并停留 ≥1s 可读，符合 §2.4
- 末尾留 ~1.2s 可读时间，总时长 6s 与 meta.json `duration` 一致

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| title | string | 用户构成占比 | 主标题 |
| subtitle | string | 按来源渠道拆解的 100 个样本单元 | 副标题 |
| rows | number(4–10) | 10 | 行数 |
| cols | number(4–10) | 10 | 列数 |
| categories | string（换行分隔，每行 `名称,颜色,百分比`） | 5 类合计 100% | 分组定义 |
| accent | color | #00FF00 | 强调色 |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

合计单元格数 = rows × cols，cats 按百分比折算成单元数后补差，保证 `sum = TOTAL`。
余下未分类的格子用中性深灰 (#1F1E1B) 占位。

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「单元网格按占比点亮，表达构成比例」与本任务卡的功能意图描述，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.grid / .cell / .legend /
   .legend-row / .head / .eyebrow / .footnote`）为本模板自创；
   CSS 变量、关键帧、缓动函数全部按本项目 §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 单元格按 `idx` 顺序 stagger 点亮（不是按分组聚合点亮的传统 waffle chart），
     形成「从左上逐格蔓延」的视觉动线，配合 stagger 0.014s 让节奏更密集。
   - 右侧 legend 使用「色块 + 名称 + 滚动百分比」三段式，颜色直接
     `style.setProperty('--row-color', cat.color)`，每个色条自带 box-shadow 发光。
   - 单元格的 `box-shadow` 强度通过 `color-mix(in srgb, var(--cell-color) 28%, transparent)`
     计算，使每种自定义色都能产生同款柔和发光，避免硬编码颜色导致发光失控。
4. **命名与曲线**：class 命名 `grid/cell/legend/legend-row/head/eyebrow/footnote`，
   缓动 `power2.out / power3.out / sine.inOut` 全部 GSAP 内置，
   时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「占比点亮类动效」等价，
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。
