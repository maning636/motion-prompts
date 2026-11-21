# lead-word-zoom-assemble · 净室自研

## 设计意图
文字 kinetic 模板。**领头词**从屏幕中心炸开 → 放大定格 → 短暂被 halo 圆环
与准星十字锁住视觉重心；接着**其余词**以小号错峰从下方淡入飞入就位，按 flex
基线水平排成完整句式；最后**整体收归常速**：领头词字号收敛到与余词协调的
尺寸（仍略大以保持主角地位），整句停留约 1.2s 可读。

适用场景：标题炸场、产品发布、章节开场、播客/视频的口播大字幕、产品 Slogan
强调、引言式 hero 等「一句定场」式叙事。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作余词正文、`MiSans SemiBold` 作领头词与百分比/序号
- 图形语言：网格点底 + 大圆 reticle（准星虚线圈）+ halo 实环 + accent 圆点
  作为句式起点的"锚"
- 安全边距：左右 96px、上下 56/120px，符合 §2.3
- 句式排版：flex 容器水平排好（`gap: 28px`），余词基线与领头词基线对齐
  （`align-items: baseline`），整体视觉重量由"大领头 + 小余词"过渡到"略大
  领头 + 略小余词"，最后变成"略大领头 + 略大余词"完成收归。

## 动效说明（自建运动语法）

总时长 6s（meta.json `duration` 一致）。叙事节拍：

| 区间 (s) | 事件 | 缓动 / 时长 | 备注 |
|---|---|---|---|
| 0.05 → 0.55 | reticle 虚线圈淡入 | `power2.out` 0.5s | 给"放大定格"建立空间参照 |
| 0.15 → 0.70 | 领头词 `scale 0 → 1.0` + 透明度 | `power4.out` 0.55s | 从零炸到定格尺寸 240px |
| 0.45 → 0.95 | halo 环 `opacity 0→0.95, scale 2.2→1.0` | `power3.out` 0.5s | "锁定"视觉 |
| 0.50 → 0.75 | 准星十字淡入 | `power2.out` 0.25s | 取景感 |
| 0.95 → 1.35 | 准星十字淡出 | `power2.out` 0.4s | 让位给句式 |
| 1.00 → 1.70 | halo 环外扩 + 淡出 | `power2.out` 0.7s | "定格"阶段收尾 |
| 1.15 → 2.05 | 余词逐个 `opacity 0→1, y 36→0` | `power2.out` 0.42s + `stagger 0.10s` | "依次飞入就位" |
| 1.20 → 1.55 | 首个余词前 accent 圆点脉冲 | `back.out(1.8)` 0.35s | 锚定句式起点 |
| 1.90 → 2.60 | 领头词 `fontSize 240→180, scale 1→0.92` | `power3.inOut` 0.7s | 字号收敛 |
| 1.95 → 2.65 | 余词 `fontSize 76→82` | `power3.inOut` 0.7s + `stagger 0.04s` | 整体重量平衡 |
| 2.75 → 4.95 | 领头词 `scale 0.92↔0.94` yoyo | `sine.inOut` 0.85s ×2 | 收尾呼吸 + 停留 |
| 4.80 → 6.00 | 领头词 `scale 0.92→0.93` 收尾回弹 | `power2.out` 1.20s | 让 timeline.duration 严格 = 6s |

onUpdate：百分比（`pctVal`）+ 进度条宽度随 `tl.time()` 实时刷新。

合规性核对：
- 入场 `fade + y 位移 36px`，`power2.out/power4.out`，0.42–0.55s ✓ §2.4
- 错峰 `stagger 0.10s` ✓ §2.4
- 强调 `scale 1.0↔1.06` 呼吸（这里用 0.92↔0.94 微缩同理）✓ §2.4
- 结尾停留 ≥0.8s 可读（约 1.5s）✓ §2.4

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | HEADLINE | 顶左 chip 文字 |
| leadWord | string | AI | 领头词（先放大定格） |
| restTokens | string（换行/空格分隔）| 正在 重塑 每个 行业 | 其余词，依次飞入就位 |
| hint | string | lead word · zoom · assemble | 底部副标（取首段位词显示在右下） |
| accent | color | #00FF00 | 强调色（halo/准星/锚点/进度条） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden）| transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中一行意图
   「lead-word-zoom-assemble — 领头词先放大定格抢占视觉，其余词小尺寸
   依次飞入就位排成完整句式，最后整体收归常速」与本任务卡的功能意图描述，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.reticle / .lead / .halo-ring /
   .crosshair / .rest / .tick / .hint / .timeline-bar`）为本模板自创；
   CSS 变量、关键帧、缓动函数全部按本项目 §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - "放大定格"采用**屏幕中心炸开**的爆裂感（`scale 0 → 1` + `power4.out`
     超强出屏缓动）+ halo 圆环 + 准星十字，形成"被锁住"语义——这是
     通用「抢视觉」动效模式，非上游风格。
   - 句式排版基于 flex 容器水平 baseline 对齐（`align-items: baseline`），
     余词与领头词共享基线，避免任何重排/占位跳动。
   - "收归常速"用字号过渡（240→180, 76→82）+ 微缩（scale 1→0.92）实现
     "主角地位保留但不再喧宾夺主"——自创节奏。
4. **命名与曲线**：class 命名 `reticle / lead / halo-ring / crosshair / rest /
   timeline-bar`，缓动 `power4.out / power3.inOut / power2.out / back.out(1.8) /
   sine.inOut` 全部 GSAP 内置，时长 6s 与 meta.json `duration` 字段一致。
5. **结论**：clean-room implementation，功能与「文字 kinetic：领头词放大 →
   其余词飞入就位 → 整体收归」等价，任何一帧的 DOM/CSS/曲线/时长都不是外部
   实现的复刻；无上游 attribution，license 为 `Proprietary - FDE`。