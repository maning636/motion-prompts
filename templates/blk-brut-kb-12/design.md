# 双行对撞标题视觉规范

## 方向

ink 满版底，上行大字自左撞入、下行大字自右撞入，中间留一枚 120×120 白底方块放对比符。适合「A 并不等于 B」这一类判断句，撞在一起的那一帧就是记忆点。

## Palette

- Background: `#0F0F0F`
- Foreground: `#FFFFFF`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，170px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，170px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标行 y=46（强调色）
- 对撞区占 869px，上行左对齐 + 方块，下行右对齐
- 两行 170px / 行高 1.1，下行用强调色
- 对比符方块 120×120，纸色描边 + sh-w（深底阴影换白）
- 底部 20px 纸色斜纹带 + 落款行
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 底部斜纹带分 8 格推出（0.34s，steps(8)）
- 眉标自上硬着陆（0.24s，power4.out）
- 上行自左 120px 撞入、大字自左上斜撞入（0.26–0.28s）
- 对比符方块 0.86→1 缩放（0.24s，power3.out）
- 下行自右 120px 撞入、大字自右上斜撞入（0.26–0.28s）
- 对比符阴影档位脉冲一次（0.12s，steps(2)）
- 斜纹带匀速滚动 60px（1.2s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 对撞符号只用一个字符
- 下行必须和上行同字号，制造对等关系
- 深底上所有描边与斜纹换成 paper 色
- 两行合起来不超过 18 个字

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `DUEL / 双行对撞` |
| `a` | string | 上行大字（一行，6–9 字） | `效率工具` |
| `b` | string | 下行大字（一行，6–9 字） | `判断力` |
| `vs` | string | 中间的实心方块字符（1 字） | `≠` |
| `sub` | string | 底部反白落款句 | `工具决定你做得多快，判断决定你做得对不对` |
| `accent` | color | 对撞方块 + 斜纹带 | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
