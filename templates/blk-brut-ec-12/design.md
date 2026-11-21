# 七天无理由视觉规范

## 方向

上数字下条款构图：上半部一整块强调色巨型天数额，右接 900 大字标语；下半部三行条款横条逐行落位。适合把「七天无理由」从一句承诺拆成三条可核查条款的画面。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`（巨型数字块 / 标语区 / 斜纹带）
- Number block: `#0F0F0F` 底 + `#FFD429` 字 + 8px 白色硬阴影
- Term row: `#FFFFFF`
- Term number: `#0F0F0F` 底 + `#FFD429` 字

## Typography

- 巨型数字：`Sarasa Gothic SC`，字重 900，248px，tabular-nums
- 标语：`Noto Sans SC`，字重 900，88px
- 副句：`Noto Sans SC`，字重 700，32px
- 条款正文：`Noto Sans SC`，字重 700，36px
- 条款序号 / 标记：`Sarasa Gothic SC`，字重 900 28px / 700 26px

## 布局

- 画布 1920×1080，顶部反白条 66px
- 巨型数字区 padding 34/72/38，左侧数字块（ink 底 8px 白影），右侧标语两行
- 条款区 padding 34/72/30，三行等高，行间共享 3px 边框
- 每行结构：64px 序号方块 + 条款正文 + 右对齐 mono 标记
- 底部说明条 + 斜纹带 20px

## 动画

- 顶部条落下，巨型数字区自下硬落位
- 数字块斜向拍入，落定后阴影压 2 帧再弹回 8px 白影
- 标语与副句错峰自上补位
- 三行条款自左画外依次切入（间隔 0.16s），正文行内错峰补位
- 说明条与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（顶部黑条上的 mono 字）
- `days` number 无理由天数（天）
- `title` string 巨型数字右侧的大字标语
- `subText` string 大字下方的一行副句
- `t1` string 条款第一行
- `t2` string 条款第二行
- `t3` string 条款第三行
- `note` string 底部说明（一行 mono）
- `accent` color 强调色（巨型数字块 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 天数只填一次，巨型数字与单位由它推出
- 深底上的数字块阴影必须换白，不许沿用黑影
- 三行条款共用一条边线，不许每行都画双线
- 圆角只用 4px 与 9999px
- 不使用 rotate / skew 入场，不用 back.out / elastic / bounce