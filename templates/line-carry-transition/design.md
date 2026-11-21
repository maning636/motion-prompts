# line-carry-transition · 净室自研

## 设计意图
一条发光细线（强调色 #00FF00）从画面左侧外部切入，沿水平方向扫过整个画面，
带动前后两个场景完成切换：旧场景在线到时整体淡出并被右侧剪除；新场景随线
扫到中线时入场、错峰就位；线最终停下，成为新场景上下两端的装饰分隔（带两
端圆点端帽 + 呼吸发光）。整张卡用「线到之处」这一个动作讲清「场景切换」。

适用场景：章节切换、前后对比切换、视角切换、文案/故事里"上一拍 / 下一拍"。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字与 chip 加粗
- 图形语言
  - **carryLine**：3px 高、强调色 + 双层 box-shadow 发光、圆角 2px；
    头部 14px 实心亮点（线头"撞针"），尾部 280px 渐隐拖尾
  - **decorLine**：1px 高、强调色、横贯全宽，两端各带 64px 渐细短横与 12px 圆点端帽
  - 旧 / 新场景各自 `chip + title + subtitle + 4 行 points`，新场景序号标与短杠用强调色
- 安全边距 ≥72px（实际 padding 96/120），符合 §2.3

## 动效说明（自建运动语法）
- **0.05–0.6s** 旧场景入场：`fade + y28`、`power3.out`、0.55s
- **0.25–0.65s** 旧要点错峰：`stagger 0.08s`、`x:-16 → 0`、power2.out
- **1.20–2.25s** 发光线横扫：`left -320px → 2240px`、`power2.inOut`、1.05s
- **1.65–2.20s** 旧场景随线切出：opacity `1→0` + `clip-path: inset(0 0 0 0 → 0 0 0 100%)`、
  power3.in，从右往左剪除（"线到之处"切除）
- **2.25–2.85s** 新场景随线切入：`fade + y28 → 0`、`power3.out`、0.6s
- **2.45–2.95s** 新要点错峰入场：`stagger 0.08s`、`x:+16 → 0`、power2.out
- **2.85–3.40s** 线停止横贯变装饰：`carryLine opacity → 0`、
  `decorLine scaleX 0 → 1` (transformOrigin 50% 50%)、端点圆点 `scale 0 → 1, back.out(1.6)`
- **3.60–5.80s** 装饰分隔呼吸：`opacity 0.65 ↔ 1`、`sine.inOut`、yoyo repeat 1
- **4.00s 以后** TC 时码浮现并随 timeline.time 实时刷新
- 总时长 6s，结尾留 ≥1.0s 可读，符合 §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | SCENE SWEEP · 转场 | 顶部右侧眉标 |
| oldTitle | string | 旧场景 · 上一拍 | 旧场景主标题 |
| oldSubtitle | string | 信息 A · 已成过去 | 旧场景副标题 |
| oldPoints | string（换行分隔）| 3 条 | 旧场景要点，最多 4 行 |
| newTitle | string | 新场景 · 下一拍 | 新场景主标题 |
| newSubtitle | string | 信息 B · 即将揭晓 | 新场景副标题 |
| newPoints | string（换行分隔）| 3 条 | 新场景要点，最多 4 行 |
| linePosition | number | 50 | 分隔线最终位置（0=顶,100=底） |
| accent | color | #00FF00 | 强调色（线 / 新场景序号标 / 短杠） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「一条线贯穿画面带动场景切换」与本任务卡的功能意图描述，未访问任何
   外部仓库源码或 GitHub 上的同类动效实现。
2. **与任何外部实现无代码可比**：
   - DOM 结构（`#carryLine / #decorLine / #decorCapL / #decorCapR / .scene.old / .scene.new`）
     与 class 命名全部为本模板自创。
   - 横扫线轨迹 `left -320 → 2240`、`power2.inOut`、1.05s 是按本项目
     §2.4 运动语法（"全屏运动 ≥0.5s 用 power3.inOut"这一行的横向版本）
     自选编排，不复制任何已知模板的曲线/时长/分段。
   - "线到之处旧内容切除"用 `clip-path: inset(0 0 0 0 → 0 0 0 100%)`
     与 opacity 同步淡出配合，是从我们自己的运动语法（fade+y、stagger、
     clip-path 切入场）派生，不复用既有 wipe/scan-line 模板的入场链。
3. **视觉自建过程**：
   - **线头小亮点 + 线尾渐隐拖尾**：纯自创，作为"横扫"的运动语义符号，
     不依赖任何既有素材；颜色全部走 `var(--accent)` 兜底。
   - **decorLine 两端圆点端帽 + 渐细短横**：从我们 chip/序号标的"圆点 + 短杠"
     视觉语汇派生，与项目内其他动效保持一致。
   - 旧 / 新场景的 chip + title + points 排版与 split-compare-slider 是
     同一套信息层级（eyebrow → chip → 主标题 → subtitle → 要点），但本卡
     主体是**贯穿画面的线**，分屏排版是副产物，不是 split 类的复制。
4. **曲线与时长**：所有缓动 (`power3.out / power2.inOut / power3.in /
   power2.in / back.out / power2.in`) 都是 GSAP 内置；总时长 6s 与 meta.json
   `duration` 一致；结尾留 ≥1s 可读。
5. **验收期代码修正**：实现初期 `$("#decorLine").style.top = ...` 这类
   调用在 `$ = id => getElementById(id)` 下会因 id 含 `#` 返回 null 而
   在页面加载阶段抛 `TypeError`，导致 timeline.main 未注册。把 `$` 改为
   `id => querySelector(id.startsWith("#") ? id : "#"+id)` 兼容两种
   写法（GSAP timeline 内的 `#carryLine` 等 selector 仍走 GSAP 内部）。
   此修正纯属于"JS 接线 bug fix"，与运动语法/视觉/时长/分镜无关。
6. **结论**：clean-room implementation，功能与"线条横扫 / 场景切换类动效"
   等价，任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游
   attribution，license 为 `Proprietary - FDE`。