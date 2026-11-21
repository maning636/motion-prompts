# split-text-stagger · 净室自研

## 设计意图
左右两列对仗文字错峰入场模板。左侧条目先以短灰杠引导、滑入就位；
中缝分隔线（带渐变发光 + 中点小圆 + 顶/底端点）随后从画面中段向上下
展开亮起；右侧条目再以短荧光绿杠引导、滑入就位；结尾左右两侧同步做
一次轻微呼吸定格，脚注 `BEFORE / AFTER` 同步淡入收束。视觉重心由左
侧灰调逐步推向右侧 accent 强调。

适用场景：方案/做法对比、迁移前后对照、左右两栏对仗叙事、AB 列表对照。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字与 chip 加粗
- 图形语言：点阵底纹（带上下渐隐 mask）+ 短杠引导 + 中缝渐变竖线 + 中点圆 + 顶底小点
- 安全边距：左右 96px、顶 60px / eyebrow、底 78px 脚注，符合 §2.3
- 左右两列各 `calc(50% - 56px)`，中缝占 112px 净空

## 动效说明（自建运动语法）
- 入场：左/右列整体 `fade + y28`，`power3.out`、0.5s
- 错峰：条目 `stagger 0.10s`（变量可调 0.04–0.18s）、`power2.out`、0.42s、单条 `x ±22`
- 中缝：`fade(opacity 0→1, 0.45s)` + 竖线 `scaleY 0→1, 0.55s, power3.out` + 中点圆 `back.out(2.0)`
- 强调：左右列在 t≈4.10s 同步 `scale 1.0↔1.02` 呼吸一轮（yoyo×1，0.9s/轮）
- 中点小圆 t≈2.40s 起再做一次 `1.0↔1.25` 的三轮呼吸，呼应"中缝高亮"叙事
- 脚注 `BEFORE / AFTER` t≈4.50s 淡入收尾
- 结尾无 fade-out（定格），停留 ≥1.5s 可读，符合 §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | BEFORE · AFTER | 顶头小标（用 · 分左右两半） |
| leftLines | string（换行分隔） | 4 条 | 左侧文字条目，最多 6 行 |
| rightLines | string（换行分隔） | 4 条 | 右侧文字条目，最多 6 行 |
| leftLabel | string | BEFORE | 左侧列标 + 脚注 |
| rightLabel | string | AFTER | 右侧列标 + 脚注 |
| staggerGap | number | 0.10 | 错峰秒数（0.04–0.18） |
| accent | color | #00FF00 | 强调色（右短杠 / 中缝 / 右圆点） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中 `split-text-stagger`
   的一行意图「分屏文字组错峰入场，两侧对仗」与本任务卡的功能描述，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.col.left / .col.right / .lines / .seam /
   .footnote / .eyebrow / .gridbg`）为本模板自创；CSS 变量、关键帧、缓动函数
   全部按本项目 §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 中缝分隔线由「顶/底端点 + 中段渐变竖线 + 中点小圆（带双层光晕）」三件
     构成，纯属本项目视觉语言（细线 + 圆角 + 克制发光 §2.2）的自有组合，
     不来自任何既有模板。
   - 左右两侧条目用「短杠 + 文字」结构，短杠左侧灰、右侧 accent，
     与项目内其他动效（如 split-compare-slider 的 `points li::before`）
     共用同一种引导语法，但本案是文字条目并列而非要点列表。
   - 文字动效强调通过"列整体 y28 + 行 stagger + 中缝点亮 + 末尾呼吸定格"
     四段串联，是为本模板叙事目标现编的节奏，非任何既有动效的复刻。
4. **命名与曲线**：class 命名 `col / lines / line / seam / mid / tick / dash`，
   缓动 `power3.out / power2.out / back.out / sine.inOut` 全部 GSAP 内置，
   时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「分屏对仗文字错峰入场类」动效等价，
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。