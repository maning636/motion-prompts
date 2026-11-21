# 警示语画面视觉规范

## 方向

ink 满版底，左侧一枚 150×150 强调色警示方块，右侧超大警示语加两条 3px 分隔的说明。适合口播里点出一个最容易犯的错。

## Palette

- Background: `#0F0F0F`
- Foreground: `#FFFFFF`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，132px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，132px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 右上三枚 24px 警示灯方块
- 主体两栏，间距 64px：左栏 150px 宽，右栏自适应
- 警示语 132px / 行高 1.14；下方说明行 34px，两条之间 3px 实线
- 底部 3px 纸色规则 + 22px 注脚；最底 20px 纸色斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标自上硬着陆（0.24s，power4.out）
- 警示灯三格硬闪三次（模 8，每格 1 帧）
- 主体与警示语自上进入（0.28s，power4.out）
- 警示方块 0.86→1 缩放（0.26s，power3.out）
- 两条说明行自左错峰 0.14s 拍入（0.22s，power4.out）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 警示语只留一条落点
- 说明行不超过 3 条
- 警示符只用纯字符，不用图标字体
- 深底上所有描边换成纸色

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `WARNING / 警示` |
| `mark` | string | 警示方块里的字符（1 字） | `!` |
| `lab` | string | 警示方块下方 mono 标签 | `MOST COMMON MISTAKE` |
| `warn` | string | 超大警示语（一行，8–12 字） | `别把特效当内容` |
| `r1` | string | 说明第 1 行 | `转场越多，观众越记不住你说了什么` |
| `r2` | string | 说明第 2 行 | `一帧里有两个重心，两个都记不住` |
| `note` | string | 底部 mono 注脚 | `警示件只留一条落点 · 不叠三条以上` |
| `accent` | color | 强调色（警示块 + 斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
