# 时间线视觉规范

## 方向

一条 3px 轴线配四个节点方块，节点文字上下交错排在轴线两侧，轴线分 8 格从左画出。适合把一段经历、一次改造、一条产品线讲成有先后关系的四个节点。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #3D7BFF 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，68px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 眉标 + 68px 小标题，标题区 136px
- 时间线区 818px 高：上排 200px + 轴线 34px + 下排 200px
- 四列等宽 436px，上排在第 2、3 列，下排在第 1、4 列
- 轴线 3px 贯穿；节点方块 34×34 压在轴上
- 底部规则 + 22px 注脚；最底 20px -45° 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与小标题自左上硬着陆（0.24–0.26s，power4.out）
- 时间线区自上压入（0.28s，power4.out）
- 轴线分 8 格从左画出（0.5s，steps(8)）
- 四个节点方块逐个 0.86→1 缩放，错峰 0.18s（0.22s，power3.out）
- 节点方块落定阴影压 2 帧再弹回（0.08s，steps(2)）
- 上下文字自相反方向错峰进入（0.24s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 节点固定 3–4 个
- 上下交错必须严格交替
- 年份一律用 mono
- 轴线只画一次，不做循环滚动

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `TIMELINE / 推进轴` |
| `title` | string | 时间线上方的小标题（一行，12–18 字） | `这个账号真正转型的四个节点` |
| `y1` | string | 节点 1 年份（mono） | `2024.03` |
| `e1` | string | 节点 1 事件（6–10 字） | `开始日更` |
| `y2` | string | 节点 2 年份（mono） | `2024.11` |
| `e2` | string | 节点 2 事件 | `第一次破万粉` |
| `y3` | string | 节点 3 年份（mono） | `2025.08` |
| `e3` | string | 节点 3 事件 | `砍掉日更` |
| `y4` | string | 节点 4 年份（mono） | `2026.10` |
| `e4` | string | 节点 4 事件 | `固定两条一周` |
| `note` | string | 底部 mono 注脚 | `节点 3–4 个 · 上下交错排布` |
| `accent` | color | 强调色（节点方块 + 斜纹带） | `#3D7BFF` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
