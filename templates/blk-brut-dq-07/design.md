# 数据引用卡视觉规范

## 方向

顶部一条 ink 报告头（报告名 + 编号），下面一张白底卡放引号、引文与三枚来源胶囊。适合引用一份报告、一篇论文或一段访谈里的原话。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #3D7BFF 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，120px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 报告头 ink 底，100px 高：强调色眉标 + 44px 报告名 + 22px 编号胶囊
- 引用卡 1744px 宽，sh-l，内边距 44/52px
- 引号列 110px 宽，120px mono 字符 + 2px 文字硬投影
- 引文两行 46px / 行高 1.34；底部三枚 mono 来源胶囊
- 底部规则 + 22px 注脚；最底 20px -45° 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 报告头与报告名自上硬着陆（0.24–0.26s，power4.out）
- 编号胶囊自右上拍入并压阴影（0.24s，power4.out）
- 引用卡 0.86→1 缩放（0.3s，power3.out）
- 引号与两行引文依次自上进入（0.24–0.26s，power4.out）
- 三枚来源胶囊逐枚拍入并压阴影（0.24s，power4.out）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 引用必须是原文摘录，不改写
- 来源三项齐全：章节 / 页码 / 时间
- 引文两行合起来不超过 40 个字
- 大引号用文字硬投影

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `SOURCE / 数据引用` |
| `report` | string | 报告名（ink 报告头里的标题） | `短视频注意力结构调研` |
| `rno` | string | 报告编号（mono） | `RPT-2026-04` |
| `q1` | string | 引文第一行（14–20 字） | `观众不是在第 3 秒离开，是在第 1 句没听懂的时候离开` |
| `q2` | string | 引文第二行（14–20 字） | `两件事发生在同一个时间点，所以大多数复盘把它记成了「开头不够刺激」` |
| `src1` | string | 来源标签 1（mono） | `CHAPTER 03` |
| `src2` | string | 来源标签 2（mono） | `P.24` |
| `src3` | string | 来源标签 3（mono） | `2026.08` |
| `note` | string | 底部 mono 注脚 | `引用为原文摘录 · 未改写 · 页码可查` |
| `accent` | color | 强调色（引号 + 斜纹带） | `#3D7BFF` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
