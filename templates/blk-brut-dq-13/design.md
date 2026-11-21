# 二维码关注收尾卡视觉规范

## 方向

ink 满版底，左边一行 132px 大字加账号名，右边一张 460×460 的二维码位（纯 div 拼的方格）。适合一条口播结束时的扫码引导。

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

- 顶部 20px 纸色斜纹带 + 眉标 + 3px 规则
- 主体 812px 高：左文右码，间距 88px
- 文字区 1744px 中的左半：大字 132px + 30px mono 账号名
- 二维码位 460×460，纸色描边 + sh-w（深底阴影换白），内含 9×9 方格
- 底部三枚标签 + 22px 注脚；最底 20px 纸色斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 顶部斜纹带分 8 格推出（0.34s，steps(8)）
- 眉标与顶部规则自左进入（0.24–0.28s，power4.out）
- 大字自左上斜撞入、账号名自上进入（0.22–0.28s）
- 二维码位自右分 8 格推出（0.4s，steps(8)）
- 底部三枚标签逐枚拍入并压阴影（0.22–0.24s，power4.out）
- 底部斜纹带分 8 格推出后，两条带一起匀速滚动 40px（1.2s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 二维码方格由行列坐标算出，绝不用 Math.random
- 二维码位必须注明是占位图
- 深底上所有描边换成纸色
- 标签最多三枚

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `SCAN ME / 扫码关注` |
| `big` | string | 中间的大字（一行，4–8 字） | `扫一下，关注我` |
| `handle` | string | 账号名（mono） | `@积木社BLOCKBRUT` |
| `t1` | string | 底部标签 1（mono） | `每周二` |
| `t2` | string | 底部标签 2（mono） | `AI 与自媒体` |
| `t3` | string | 底部标签 3（mono） | `不发广告` |
| `note` | string | 底部 mono 注脚 | `二维码位为占位图 · 请替换成自己的码` |
| `accent` | color | 强调色（斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
