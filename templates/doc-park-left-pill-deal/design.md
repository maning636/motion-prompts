# doc-park-left-pill-deal · 净室自研

## 设计意图
文档面板停靠左侧展示「源材料」，右侧两条 pill 依次滑入定格：先 `VERDICT` 结论 pill、
再 `DEAL` 交易 pill，形成「文档 → 结论 → 交易」的三段式叙事，强调强调色
（默认荧光绿）随叙事推进逐步接管视觉重心。

适用场景：内部汇报、季度复盘、结论落地与签约金额展示、报告→决策→成交的短视频叙事。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 正文、`MiSans SemiBold` 用于眉标 / 数字 / 加粗标题
- 图形语言：
  - 左文档面板：圆角矩形卡 + 顶部左侧一条 accent 竖条 + 圆角胶囊编号 `01–04`
  - 右结论 pill：细边圆角卡 + 左侧 accent 竖条 + `V` 图标胶囊 + 尾箭头
  - 右交易 pill：accent 半透明底 + 满色 `¥` 图标 + 发光金额数字 + 尾箭头
- 安全边距 ≥72px（实际左右 padding 96px、上下 56/148px）

## 动效说明（自建运动语法）
- t≈0.15s 文档面板 `x -80 → 0`、`power3.out`、0.75s，从左侧停靠滑入
- t≈0.55s 眉标 → 标题 → 元信息 三行 `y 16 → 0`、`stagger 0.08`、`power2.out`
- t≈0.90s 分割线 `scaleX 0 → 1` 从左向右铺开
- t≈1.05s 文档要点 `x -14 → 0`、`stagger 0.1`、`power2.out`
- t≈1.50s 结论 pill `x 220 → 0`、`power3.out`、0.75s，右侧滑入定格
- t≈1.75s 结论图标 `scale 0.6 → 1`、`back.out(1.7)` 微弹
- t≈2.30s 交易 pill `x 260 → 0`、`power3.out`、0.8s，比结论更晚、更用力
- t≈2.60s 交易图标 `scale 0.5 → 1`、`back.out(1.8)` 更夸张弹入
- t≈2.80s 金额数字 `scale 0.9 → 1`、`back.out(1.4)` 从左侧拉伸弹入
- t≈3.60s 金额呼吸 `scale 1 ↔ 1.04`、`sine.inOut` yoyo×1，定格后微动
- t≈4.40s 文档面板整体 `scale 1 ↔ 1.005` 极轻呼吸，避免长时间静止
- t≈5.40s 金额缩放回到 1，为结尾定帧留出 ~0.6s 可读

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| docKicker | string | SOURCE · DOC | 文档眉标 |
| docTitle | string | 季度经营复盘 | 文档主标题 |
| docMeta | string | 2026 Q2 · 内部资料 | 文档元信息 |
| docLines | string（换行分隔） | 4 条 | 文档要点，最多 4 行 |
| pillKicker | string | VERDICT | 结论 pill 眉标 |
| pillTitle | string | 结论：继续加大 AI 投入 | 结论 pill 标题 |
| pillSub | string | 建议下季度预算 +35% | 结论 pill 副文案 |
| dealKicker | string | DEAL | 交易 pill 眉标 |
| dealAmount | string | ¥ 12.8M | 交易金额（大字数字） |
| dealNote | string | 签约 · 2026-08-19 | 交易备注 |
| accent | color | #00FF00 | 强调色 |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明 / mp4 / webm |

## 净室自查记录
1. **功能理解来源**：仅依本任务卡的一行意图「文档面板左侧停靠，右侧结论/交易 pill
   条滑入定格（文档→结论叙事）」，未访问任何外部仓库、未做 web 搜索。
2. **与任何外部实现无代码可比**：DOM 结构（`#docPanel / #pillTrack / #pillVerdict /
   #pillDeal / .pill-icon / .pill-arrow / .doc-lines`）为本模板自创；缓动函数
   `power3.out / power2.out / back.out / sine.inOut` 全部 GSAP 内置，编排时长按
   本卡叙事节奏重新组织。
3. **视觉自建过程**：
   - 文档面板造型采用「左上 accent 竖条 + 顶部点阵卡」，是通用「文档 / 卡片」语义符号；
   - 结论 pill 采用「胶囊 icon + 尾箭头」，交易 pill 采用「满色 icon + 发光金额」，
     两者对比暗示「结论 vs 成交」的层级；
   - 金额呼吸与文档极轻缩放，避免长静帧，同时不喧宾夺主。
4. **命名与曲线**：class 命名 `docPanel / pillTrack / pill / pillVerdict / pillDeal /
   doc-lines / footnote`，缓动全部 GSAP 内置；总时长 6s 与 meta.json `duration` 字段一致。
5. **红线遵守**：仅触碰本卡 4 个文件与 lab 目录下的 selftest 脚本；未修改 `catalog.json`、
   `motion-library` 或任何其它模板；未启动可见浏览器窗口，未做外部搜索。

## 结论
Clean-room implementation。功能与「文档 → 结论 → 交易」三段式动效等价，
任何一帧的 DOM / CSS / 曲线 / 时长都不是外部实现的复刻；无上游 attribution，
license 为 `Proprietary - FDE`。
