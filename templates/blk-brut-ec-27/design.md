# 产地卖点档案视觉规范

## 方向

整版换色构图：满版强调黄底上居中一枚近黑大方块压着产地超大字与坐标，底部一条反白数据带平铺海拔、降水、日照三格。适合把产地讲成一个有坐标、有数据的档案对象。

## Palette

- Background: `#FFD429`（整版底，符合「满版底只允许 yellow / pink」）
- Foreground: `#0F0F0F`
- Seal block: `#0F0F0F` 底 + `#FFD429` 字 + 10px 白色硬阴影
- Data band: `#0F0F0F` 整块反白
- Data card: `#FFFFFF` 底 + 8px 黄色硬阴影
- Muted: `#6B6B6B`（数据格标签）
- Accent: `#2FD07A`（斜纹带 / 口径注释）

## Typography

- 产地名：`Noto Sans SC`，字重 900，172px
- 坐标：`Sarasa Gothic SC`，字重 700，32px，letter-spacing .14em
- 印章顶字：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .16em
- 数据值：`Sarasa Gothic SC`，字重 900，88px，tabular-nums
- 数据标签：`Sarasa Gothic SC`，字重 700，22px，letter-spacing .14em

## 布局

- 画布 1920×1080，顶部反白条 66px，底部斜纹带 20px
- 中央方块 620×620px 居中，内部四层：顶字 / 3px 分隔 / 产地名 / 3px 分隔 / 坐标 / 机构
- 底部数据带 padding 30/72/34，三格等宽，格间距 24px
- 每格两段：标签行 + 数值行（数值 + 单位）
- 口径注释放在顶部反白条右端

## 动画

- 顶部反白条落下，眉标与口径注释错峰补位
- 大方块以 scale .86 → 1 弹入（0.3s，power3.out）
- 产地名、坐标依次自上补位，方块落定后阴影压 2 帧再弹回 10px 白影
- 三格数据卡自下错峰落位，各带一次阴影压 2 帧再弹回 8px 白影
- 斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `place` string 产地名称（大方块里的超大字）
- `coord` string 坐标（mono 一行）
- `alt` number 海拔（米）
- `rain` number 年降水量（毫米）
- `sun` number 年日照时长（小时）
- `altLabel` string 数据格一标签
- `rainLabel` string 数据格二标签
- `sunLabel` string 数据格三标签
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（斜纹带 / 坐标字）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 满版底只允许 yellow 或 pink，不许用 blue / green 做整版底
- 深底上的方块与数据卡硬阴影必须换白
- 三格数据标签用 mono，数值也用 mono，二者不许换成 sans
- 坐标写成 mono + 大字距，不加圆角胶囊
- 不用 rotate / skew 入场，不用 back.out / elastic / bounce