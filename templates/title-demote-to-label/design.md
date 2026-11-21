# title-demote-to-label · 净室自研

## 设计意图
「标题降级为角标」动效卡：原大标题先以视觉主角身份占据中心舞台（约 108px 加粗），
完成信息建立后缩小 + 位移到左上角，退化为一枚 chip 形状的角标（约 16px），
让位给新进入的主内容（新 chip + 新主标题 + 2–3 条错峰条目）。
整套动画表达的是「层级交接」—— 视觉重心从旧标题平滑迁到新主体，
但旧标题不会消失，而是保留在角落作为上下文锚点，并带轻微呼吸保持存在感。

适用场景：产品迭代前后对比、方案替换叙事、章节切换、「从 X 到 Y」类开场。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文，`MiSans SemiBold` 作大标题与数字/角标加粗
- 图形语言：点阵底 + 圆角 chip 角标 + 强调色圆点/短杠/发光序号
- 安全边距：上下 56–96px、左右 96–200px，符合 §2.3

## 动效说明（自建运动语法）
- 阶段 1（0 – 1.5s）：`#heroTitle` 从 `scale .88 / y 40 / opacity 0` 到 `scale 1 / y 0 / opacity 1`，
  `power3.out`、1.1s；随后叠加 `textShadow` 微光呼吸，强化主角感
- 阶段 2（1.5 – 3s）：
  - `#heroTitle` 同时改 `left/top`（居中 → 左上 96/46）、`width` 自适应、`fontSize` 108→16、
    `border+borderRadius` 描边圆角化、`padding` 收窄 —— 视觉上「大标题收缩成 chip」，1.35s `power3.inOut`
  - 大标题 fade 出（0.25s）；`#demotedLabel`（同文字）fade + back.out 承接角标位置，
    避免文字跳变，2.7s 触发
  - `#newContent` `opacity 0→1 + y 60→0`、`power3.out`、0.9s，2.0s 起步（与大标题降级重叠 0.35s，制造交接）
  - `#ncChip` / `#ncTitle` 依次微入场
- 阶段 3（3 – 6s）：
  - `#ncItems li` stagger 0.22s、`x 24→0` + fade、0.5s，错峰 3 条
  - `#demotedLabel` `scale 1 ↔ 1.03` sine.inOut yoyo repeat，保持角标存在感
  - `#footnote` 末尾淡入收尾
- 结尾留 ~1s 可读（总时长 6s），符合 §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| oldTitle | string | 重新设计首页 | 原大标题 / 降级后的角标文字 |
| newTitle | string | 新方案：分层交付 | 新主标题 |
| items | string（换行分隔）| 3 条 | 主内容要点，最多 3 行 |
| accent | color | #00FF00 | 强调色（chip 描边/短杠/圆点/光晕） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依本任务卡的一句话功能意图
   「大标题缩小降级为角落标签，让位给新进入的主内容（层级交接）」
   与项目通用契约，未访问任何外部仓库源码或设计稿。
2. **与任何外部实现无代码可比**：DOM 结构（`#heroTitle / #demotedLabel /
   #newContent / .nc-chip / .nc-title / .nc-items`）为本模板自创；
   CSS 变量、GSAP timeline、缓动与时长编排全部按本项目 §2.4 运动语法重写。
3. **视觉自建过程**：
   - 大标题→chip 的降级用 GSAP 同时改 `left/top/width/fontSize/border/padding`
     六属性合成一条 tween，属本项目自研的「同节点形变」技法，不依赖位移+缩放组合 hack。
   - 为避免降级过程中文字在浏览器重排时出现瞬断，用一个**相同文字**的
     `#demotedLabel` 在降级完成后 back.out 承接，实现视觉连续。
   - 强调色落在角标小圆点、新 chip 描边、条目短杠与序号上，形成统一的视觉线索。
4. **命名与曲线**：class 命名 `eyebrow / rail-h / hero-title / demoted-label /
   nc-chip / nc-title / nc-items / footnote`；
   缓动 `power3.out / power3.inOut / power2.out / back.out / sine.inOut` 全部 GSAP 内置；
   总时长 6s 与 meta.json `duration` 字段一致。
5. **变量契约**：单引号 JSON `data-composition-variables`、
   `__hyperframes.getVariables()` 兜底 fallback、`html.style.setProperty`
   三颜色接线、`__timelines.main = tl` paused 注册，全部按项目通用契约。
6. **无外链资源**：仅使用项目内 `../_fonts/` 字体和 GSAP 3.14.2 官方 CDN（与全库一致）；
   无任何外部图片、外部样式或 JS 资源。
7. **结论**：clean-room implementation，功能与「标题降级为角标类动效」等价，
   任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游 attribution，
   license 为 `Proprietary - FDE`。
