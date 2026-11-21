# 限时价单卡视觉规范

## 方向

满版居中单卡：整屏只放一张带 10px 硬阴影的大卡，卡内三段——标题行、强调色价格区、开始/截止/限量三格平铺。适合限时秒杀、开抢倒计时类价格卡，主体单一、焦点不散。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（卡片价格区底 / 斜纹带 / 顶部标签）
- Card fill: `#FFFFFF`
- Deadline cell: `#FF5FA2` 文字
- Muted: `#6B6B6B`（三格编号 chip）

## Typography

- 主标题：`Noto Sans SC`，字重 900，44px
- 价格：`Sarasa Gothic SC`，字重 900，264px，tabular-nums
- 货币符号：`Sarasa Gothic SC`，字重 900，88px
- 三格值：`Noto Sans SC`，字重 900，40px
- 三格键：`Sarasa Gothic SC`，字重 700，22px，letter-spacing .14em

## 布局

- 画布 1920×1080
- 顶部反白通栏 70px，左右内边距 72px
- 主体居中，卡宽 1280px，四角 4px，10px 硬阴影
- 卡内三段：标题行 padding 24/48、价格区 padding 34/48/40、三格平铺 padding 26/20
- 三格之间靠 3px 实线分隔，最右一格无右边框
- 底部说明条约 70px + 斜纹带 20px

## 动画

- 顶部通栏自画外上方落下，标签/眉标/注释错峰补位
- 大卡以 scale .86 → 1 弹入（0.3s，power3.out）
- 标题自左上拍入，价格数字自上补位
- 三格逐格从上落下（0.2s，错峰 0.09s，模 7 分格揭示）
- 卡片落定后阴影压 2 帧再弹回 10px 档
- 底部说明条与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `title` string 主标题（卡片顶部一行大字）
- `eyebrow` string 眉标（顶部黑条上的 mono 字）
- `tag` string 顶部黑条左端的胶囊标签
- `note` string 顶部黑条右侧注释
- `price` number 限时价（元）
- `startText` string 三格 · 开始
- `endText` string 三格 · 截止
- `quotaText` string 三格 · 限量
- `footText` string 底部说明（一行 mono）
- `accent` color 强调色（卡片价格区底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 一帧只放一个价格焦点，三格里不放第二处折扣
- 阴影只在 6px / 8px / 10px 档位间 steps 跳
- 圆角只用 4px 与 9999px，不做撕角 / 券形缺口
- 不使用 rotate / skew 入场，不用 opacity 淡入当入场手段
- 大面积卡片的起始缩放不超过 0.86