# scanline-annotate · 净室自研

## 设计意图
扫描线动效模板：一条水平高亮横条从上至下扫过整块主体区域，扫到每一条
条目时该条目被点亮（accent 描边 + 背景色 + 序号方块填色），右侧同步
弹出一条 `.annotation` 标注解读。整片像一次"扫描解读"过程：先扫、边扫
边读，最后停在底部收束，右上角状态由 READY → SCANNING → DONE 切换，
底部脚注百分比与扫描线位置同步。

适用场景：报告解读、诊断清单、审计结果、KPI 复盘。

## 视觉语言
- 深色数据风：`background #0B0F14`、`foreground #EEF3FA`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字 / eyebrow / 状态
- 图形语言：顶头细刻度尺 + 点阵底 + 圆角条目 + 左侧小圆点节点 +
  右侧小圆点连横线到 annotation；扫描线是 accent 渐变横条 + 上/下
  模糊光晕
- 安全边距：左右 96px、上 56px、下 52px，符合 §2.3

## 动效说明（自建运动语法）
- 入场：eyebrow / title / status `fade + y14`、`power3.out`、0.5s、
  `stagger 0.08s`
- 刻度尺淡入 0.5s
- 条目灰态入场：`x -18 → 0`、`power3.out`、0.5s、`stagger 0.08s`
- 扫描线淡入 0.25s，随后 `top: 0 → endY`、`duration 3.6s`、`ease "none"`
  （线性扫过），占片长 3.6 / 6 = 60%
- 每条被扫到时（按 item 中线 y 计算触发时间）：
  - 添加 `scanned` class（描边 + 背景 + 序号填色）
  - `scale 0.97 → 1.0`（0.42s，`power3.out`）
  - 对应 annotation `opacity 0→1, x 24→0`（0.42s，`power3.out`）
- 扫描线扫完 → 短暂停顿 0.35s → `opacity → 0` 收束
- `onUpdate` 回调：底部百分比 `0..100` 与状态文本（READY/SCANNING/DONE）
  实时派生，保证 pause/seek 时 UI 一致
- 尾段 0.35s 主体轻微透明度收拢

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | SCAN · REPORT | 眉签（首段为 accent，其余灰） |
| title | string | 深度扫描 · 4 处待解读 | 主标题 |
| items | string | 4 行 | 每行「主文案 \| 标注解读」，`\n` 分隔，最多 4 行 |
| accent | color | #00FF00 | 强调色（扫描线/序号/描边/光晕） |
| background | color | #0B0F14 | 背景色 |
| foreground | color | #EEF3FA | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依本任务卡的一行意图「扫描线自上而下扫过画面，
   扫到的条目逐条点亮并弹出标注解读」，未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构（`.ticks / .eyebrow / .title /
   .status / .stage > .col-left > .item + .col-right > .annotation /
   .scanwrap > #scanLine / .footnote`）为本模板自创；CSS 变量、扫描线
   的 `top` 直动、item/annotation 一一对应的触发时间算法全部按本项目
   §2.4 运动语法重新编排。
3. **视觉自建过程**：
   - 扫描线造型为「accent 渐变横条 + 上下模糊光晕」——通用的"扫描"
     视觉符号，不带任何既有模板特征。
   - 条目左侧小圆点节点 + 右侧连线到 annotation，模拟"扫描触点 → 解读"
     的因果链。
   - 顶部刻度尺是"扫描台/示波器"隐喻，与项目内其他数据风模板（网格底、
     chip、圆角卡片）语言一致。
4. **命名与曲线**：class 命名 `scanLine / items / annotation / col-left /
   col-right / scanwrap / ticks / status`，缓动 `power3.out / power2.out /
   power1.in / none` 全部 GSAP 内置；时长 6s 与 meta.json `duration`
   字段一致。
5. **结论**：clean-room implementation，功能与「扫描线解读类动效」等价，
   任何一帧的 DOM / CSS / 曲线 / 时长都不是外部实现的复刻；无上游
   attribution，license 为 `Proprietary - FDE`。
