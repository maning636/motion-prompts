# parallel-items-with-host · 净室自研

## 设计意图
主讲人位 + 并行条目同屏推进的讲解卡。左侧一枚主讲人锚点（首字圆环 +
姓名 + 身份 chip），右侧 3–4 个条目卡按 2×2 网格铺开：先错峰入场，
随后按序高亮「当前讲到」——accent 光晕、scale 1.0→1.04→1.0、边框变
accent，讲过的条目回退到半透明暗调。底部脚注实时显示 `01 · 目标` 与
进度 `1 / 4`。适用场景：直播要点、方案路演、清单讲解。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字/首字/标题加粗
- 图形语言：点阵底 + 圆角主讲人卡 + 头像双圈（内实心圆 + 外虚线圆）+
  条目 2×2 网格 + 底部进度条与脚注 pill
- 安全边距 ≥72px（实际左右 padding 96px、上下 56–108px），符合 §2.3
- 无外链图片：头像用首字圆环，非位图

## 动效说明（自建运动语法）
- 入场：eyebrow `fade + y-8 0.4s`、主标题 `fade + y16 0.5s power3.out`
- 主讲人卡：`opacity 0 → 1 + x -32 → 0 + scale 0.96 → 1.0 / 0.55s power3.out`
- 头像外圈：`rotation 0 → 360 / 12s / ease:none`（贯穿全程的缓慢自转）
- 头像内圈光晕：`boxShadow 呼吸 / 1.4s sine.inOut / yoyo repeat:3`
- 条目错峰入场：`opacity 0 + x 24 → 0 / 0.5s power3.out / stagger 0.14s`
- 高亮推进：从 1.6s 起，每条约 1.05s
  - `scale 0.96 → 1.04 / 0.35s back.out(1.6)`（新条目 pop）
  - `scale 1.04 → 1.00 / 0.6s power2.inOut`（回稳）
  - 旧条目通过 `classList.remove/add` 从 `.active` 切到 `.past`（`opacity .55`）
- 每条激活时同步刷新：底部进度条 fill 宽度、脚注 `01 · 目标`、`1 / 4`
- 结尾：最后一条保持高亮，整体留 ~0.9s 可读，总时长 6s，符合 §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| hostName | string | 林川 | 主讲人姓名（同时决定头像首字） |
| hostRole | string | 产品负责人 · 十年一线 | 身份 chip 文案 |
| title | string | 四点并行推进 | 主标题 |
| items | string（换行分隔）| 4 条 | 并行条目，最多 4 条；空行会被过滤 |
| accent | color | #00FF00 | 强调色（头像光晕 / 高亮边框 / 进度条） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 关键 DOM id / class
- `#root` 1920×1080 根、`#scene` 主 stage
- `#host` 主讲人卡、`#avatarLetter` 首字、`#hostName`、`#hostRoleTxt`
- `#items` 2×2 网格、`.item` 单条目、`.item.active` 当前讲到、
  `.item.past` 已讲、`.item.future` 未讲
- `.foot .fill` 每卡底部进度条填充
- `#nowIdx` `#nowItem` 脚注当前序号与文案

## 净室自查记录
1. **功能理解来源**：仅依任务卡的一句话意图
   「主讲人位 + 3-4 个并行条目同屏推进，当前讲到哪条哪条点亮」，
   未访问任何外部仓库源码或参考动效。
2. **与任何外部实现无代码可比**：
   - DOM 结构（`.stage / #host / .avatar-ring.outer / #items / .item /
     .item.active / .foot .fill`）为本模板自创；
   - 双圈头像造型（内实线 + 外虚线，外圈慢速旋转）是本卡专属的「主讲
     人锚点」语义，不套用他卡。
3. **视觉自建过程**：
   - 头像用首字圆环而非位图，规避外链图片红线；
   - 条目 2×2 网格 + 顶部序号 + 底部进度条，让「当前讲到」有两条视觉线
     索（active 边框 + 进度条填充）；
   - 讲过的条目 `.past { opacity: .55 }`，配合 accent 变灰，形成
     「已讲 → 当前 → 未讲」三态梯度。
4. **命名与曲线**：class 命名 `host / avatar / item / active / past /
   future / fill`；缓动 `power3.out / power2.inOut / back.out(1.6) /
   sine.inOut / none` 全部 GSAP 内置；时长 6s 与 meta.json `duration`
   一致。
5. **三变量接线自查**：
   - JS 端 `setProperty("--foreground" / "--background" / "--accent")`
   - CSS 端 `var(--xxx, #默认值)` 全量带兜底
   - `data-composition-variables` 单引号 JSON 数组，含 `exportMode`
     hidden 隐字段
6. **禁止项自查**：
   - 无外链图片、无 web 请求、无外部字体加载（仅 CDN 上的 GSAP，与
     全库契约一致）；
   - 未改动 `motion-library / lab/catalog.json / 其他卡`；
   - 无 `attribution` 上游，license 为 `Proprietary - FDE`。
7. **结论**：clean-room implementation，任何一帧的 DOM/CSS/曲线/时长都
   不是外部实现的复刻。
