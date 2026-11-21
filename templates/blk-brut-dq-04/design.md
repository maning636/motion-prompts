# 进度占比条视觉规范

## 方向

四条占比条，上行是标签与百分比，下行是 track 与填充条，填充条用 B.in.grow 从 0 拉开。适合讲时间分配、预算分配、流量来源这类构成关系。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，76px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 眉标 + 76px 小标题，标题区 149px
- 占比区 805px 高，四条，条间 3px 实线
- 每条：38px 900 字重标签 + 52px mono 百分比；track 44px 高，填充条 38px
- 四条填充色分别为强调色 / 黄 / 绿 / 蓝
- 底部规则 + 22px 口径注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与小标题自左上硬着陆（0.24–0.26s，power4.out）
- 占比区自上压入（0.28s，power4.out）
- 四条自左 56px 拍入，错峰 0.26s（0.24s，power4.out）
- 每条到位后填充条用 grow 拉到目标百分比（0.5s，power3.out）
- 最后一条 track 阴影档位脉冲一次（0.12s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（0.8s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 占比合计必须等于 100%
- 宽度为 0 的填充条只能用 grow，不能用 wipe
- 每条一行标签，不做两行
- 四条封顶，不做第五条

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `SHARE / 占比条` |
| `title` | string | 占比条上方的小标题（一行，12–18 字） | `一周的时间都花在哪儿了` |
| `l1` | string | 第 1 条标签（4–8 字） | `写稿` |
| `p1` | number | 第 1 条占比（0–100） | `34` |
| `l2` | string | 第 2 条标签 | `拍摄` |
| `p2` | number | 第 2 条占比（0–100） | `26` |
| `l3` | string | 第 3 条标签 | `剪辑` |
| `p3` | number | 第 3 条占比（0–100） | `22` |
| `l4` | string | 第 4 条标签 | `改标题` |
| `p4` | number | 第 4 条占比（0–100） | `18` |
| `note` | string | 底部 mono 注脚（口径） | `口径：上周实际计时 · 四舍五入到整数 · 合计 100%` |
| `accent` | color | 强调色（第 1 条填充 + 斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
