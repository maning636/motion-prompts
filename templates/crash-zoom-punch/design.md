# crash-zoom-punch · 净室自研

## 设计意图
急推镜头转场：画面快速推近（scale 1→1.25）配合冲击帧定格，适合强调金句出场。

整片讲一件事 —— 把镜头当成一个有呼吸的角色：
1. **铺陈（0–1.0s）**：取景框 + 顶/底栏 + 一张小场景卡片（establishing shot）就位，
   镜头 scale = 1.0，标准景别。
2. **急推（1.05–1.6s）**：scale 0.55s 内由 1.0 → 1.25，用 `power3.in` 让终端极速，
   速度线（4 道斜向 accent 条带）在推近过程中横向飞过，模拟「画面被拉爆」。
3. **冲击定格（1.6–1.87s）**：scale 先冲到 1.28 再回 1.25（0.09s + 0.18s），
   同时 accent 闪帧（顶部 / 底部高对比光带 + 中心辐射光）以极短峰值后回落，
   取景框角标在冲击瞬间被强调色染一下，强化「命中」感。
4. **金句登场（1.78–2.9s）**：铺陈卡片淡出，金句容器以 `clip-path inset(0 100% 0 0)` wipe
   出，内部 chip → 主行 → 短杠依次错峰入场。
5. **回拉留白（5.1–6.0s）**：镜头缓慢回拉到 1.18（power2.inOut），
   留 ≥0.8s 给金句可读。

## 视觉语言
- 深色数据风：`background #12100E` / `foreground #F4EFE7` / `accent #00FF00`，
  三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底。
- 字体：`MEBHeiHeiTi`（场景铺陈/正文）+ `MiSans SemiBold`（金句主行/数字/chip），
  与现有 split-compare / bar-chart 模板一致。
- 图形语言：圆角卡片（radius 16）、细线 L 形取景角标、克制的 accent 发光（low-intensity
  box-shadow/text-shadow）、点阵底（48px / 22px 两层）。
- 安全边距：左右 96px、顶底 56px；金句容器 1280px 居中。符合 §2.3。

## 动效说明（自建运动语法）
- 入场：scene / topbar / recmeta / frameMarks / stage 依次 `fade + y±10/±18`，
  `power2.out` / `power3.out`，0.4–0.5s。
- **急推**：`scale 1.0 → 1.25`，`power3.in`，0.55s（占片长 ≈9%）。
- **冲击定格**：`scale 1.25 → 1.28 → 1.25`，`power2.out` 0.09s + `power3.out` 0.18s，
  配合 accent 闪帧峰值 0.06s + 0.32s 收回。
- 错峰：金句内部 chip / 主行 / 短杠 0.1s 起步 stagger。
- 转场：急推段与冲击段均 ≥0.5s，使用 `power3` 系列，符合 §2.4。
- 结尾：5.1–6.0s 镜头回拉到 1.18，可读停留 ≥0.8s。
- 总时长 6s，与 `meta.json.duration` 一致。

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | "CLOSER LOOK · 焦点" | 顶部小字标题（场景标识） |
| setupText | string | "镜头里原本只有这样一段日常" | 被推近之前的铺陈画面主文 |
| punchLine | string | "但真正值得讲的就一句。" | 金句主行（视觉焦点） |
| punchLead | string | "PUNCH" | 金句上方 chip 文案 |
| accent | color | #00FF00 | 强调色（速度线/闪帧/金句 em/短杠/REC 点） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | transparent / mp4 / webm |

## 净室自查记录
1. **功能理解来源**：仅依任务卡一行功能意图「急推镜头转场：画面快速推近
   （scale 1→1.25）配合冲击帧定格，适合强调金句出场」与
   `CLEAN-ROOM-DEV-PLAN.md` §3 中「急推镜头+冲击定格（强调转场）」一行。
   **未访问任何外部仓库源码**。
2. **与任何外部实现无代码可比**：DOM 结构（`.stage / .scene / .punch /
   .punch-flash / .speedlines / .frame-marks / .recmeta / .topbar`）为
   本模板自创，关键帧与缓动曲线全部按 §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 急推只用 `scale` + `transform-origin: 50% 50%` + `power3.in`，没有
     复用 split-compare 的 rail/knob 语汇，也没有复用 bar-chart 的柱状语汇。
   - 冲击定格用「scale 微冲 + 高对比 accent 闪帧 + 取景框角标染色」三件事
     叠加表达「命中」，是本模板独有的组合方式。
   - 速度线 4 道、accent 半透带状斜向飞过；与本项目内既有模板均不重复。
   - 金句登场用 `clip-path: inset(0 100% 0 0) → 0%` 的横向 wipe，
     这是 CSS 标准属性，跟 split-compare / bar-chart 用的 `clipPath` 入场
     是同类属性但不同节奏。
4. **命名与曲线**：class 命名 `stage / establishing / punch / punch-flash /
   speedlines / frame-marks / recmeta / topbar`，缓动 `power2.out / power3.out /
   power3.in / power3.inOut / power1.out / power1.in` 全部 GSAP 内置，
   时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「急推镜头/冲击定格类转场」
   等价；任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；
   无上游 attribution，license 为 `Proprietary - FDE`。