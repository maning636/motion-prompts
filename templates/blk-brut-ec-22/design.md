# 参数对比表视觉规范

## 方向

满版参数表：表头行加四行参数左右两列并置，第三行整行压强调色并带一枚高亮角标，是全表唯一重音。适合把一组参数压成一屏可读的横评表。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`（高亮行 / 顶部标签 / 斜纹带）
- 数据行: `#FFFFFF` 底
- 普通版值: `#6B6B6B`
- 高亮角标: `#0F0F0F` 底 + accent 字 + 6px 白色硬阴影

## Typography

- 主标题：`Noto Sans SC`，字重 900，38px
- 参数名：`Noto Sans SC`，字重 900，36px（高亮行 42px）
- 普通版值：`Sarasa Gothic SC`，字重 700，52px，mute 色
- 旗舰版值：`Sarasa Gothic SC`，字重 900，64px（高亮行 96px），tabular-nums
- 表头键：`Sarasa Gothic SC`，字重 700，24px，letter-spacing .14em

## 布局

- 画布 1920×1080，顶部反白条 74px，底部斜纹带 20px
- 表头行 64px，mono 键名，与数据行的 sans 参数名成对出现
- 数据区四行等高，行间共享 3px 边框
- 每行三段：参数名（定宽 620px）+ 普通版值 + 旗舰版值，两值均右对齐等宽
- 高亮行 position: relative，角标绝对定位在右上角

## 动画

- 顶部反白条落下，眉标与主标题错峰补位
- 表头行与两枚键名依次补位
- 模 7 分格揭示：四行自左画外依次硬切入，第三行高亮行最后落、落得最重
- 每行参数名与两个数值错峰补位
- 高亮行落定后阴影压 2 帧再弹回 10px 档，角标随后拍入
- 底部说明与斜纹带收尾
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（黑条上的一行 900 白字）
- `leftLabel` string 表头左列名
- `rightLabel` string 表头右列名
- `k1` string 第一行参数名
- `k2` string 第二行参数名
- `k3` string 第三行参数名
- `k4` string 第四行参数名
- `a1` string 第一行普通版值
- `a2` string 第二行普通版值
- `a3` string 第三行普通版值
- `a4` string 第四行普通版值
- `b1` string 第一行旗舰版值
- `b2` string 第二行旗舰版值
- `b3` string 第三行旗舰版值
- `b4` string 第四行旗舰版值
- `hotLabel` string 高亮行的角标
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（高亮行 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 一张表只允许一行重音，不许两行都压强调色
- 表头用 mono 键名，数据行用 sans 参数名与 mono 数值，三者不许混成一种字体
- 深色角标上的硬阴影必须换白
- 两列数值必须右对齐等宽，方便纵向扫读
- 不用 rotate / skew 入场，不用 back.out / elastic / bounce