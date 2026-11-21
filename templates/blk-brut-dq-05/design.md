# 简易柱状图视觉规范

## 方向

五根纯 div 柱，柱高按数值 / 最大值换算，最高那根在收尾时换成强调色并压一次阴影档。适合讲一组类目之间的对比，不引任何图表库。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，68px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 眉标 + 68px 小标题，标题区 136px
- 图表区 818px 高，底部 3px 基线，五柱等宽 300px，间距 34px
- 柱顶 40px mono 数值 + 20px 单位；柱底 30px 类别标签
- 柱色轮转黄 / 白 / 绿 / 蓝 / 纸，最高那根换强调色
- 底部规则 + 22px 口径注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与小标题自左上硬着陆（0.24–0.26s，power4.out）
- 图表区自上压入（0.28s，power4.out）
- 五柱依次自基线生长，错峰 0.14s（0.46s，power3.out）
- 柱顶数值在柱长到 0.3s 后落位（0.22s，power4.out）
- 最高那根 1 帧换强调色 + 阴影档位脉冲（0.12s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（0.8s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 柱数 3–5 根
- 柱高由数值算出，柱数与标签必须成对
- 柱顶数值用 tabular-nums
- 只有一根柱用强调色

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `BARS / 柱状图` |
| `title` | string | 柱状图上方的小标题（一行，12–18 字） | `同一批选题，五种开头的完播率` |
| `c1` | string | 第 1 根柱的类别（2–5 字） | `提问` |
| `v1` | number | 第 1 根柱的数值 | `22` |
| `c2` | string | 第 2 根柱的类别 | `反常识` |
| `v2` | number | 第 2 根柱的数值 | `41` |
| `c3` | string | 第 3 根柱的类别 | `数字` |
| `v3` | number | 第 3 根柱的数值 | `35` |
| `c4` | string | 第 4 根柱的类别 | `故事` |
| `v4` | number | 第 4 根柱的数值 | `28` |
| `c5` | string | 第 5 根柱的类别 | `清单` |
| `v5` | number | 第 5 根柱的数值 | `17` |
| `unit` | string | 柱顶数值单位 | `%` |
| `note` | string | 底部 mono 注脚（口径） | `口径：完播率 · 样本每类 12 条 · 取中位数` |
| `accent` | color | 最高那根柱 + 斜纹带 | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
