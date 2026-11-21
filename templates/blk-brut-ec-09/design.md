# 买即赠三格视觉规范

## 方向

商品加赠品网格构图：上部一条整宽主商品卡压住画面，下部三格赠品卡并排，每格顶部一条 16px 分类色条，下方一条反白赠品说明收尾。适合买赠、加赠、赠品组合类带货画面。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（主商品色块 / 赠品一色条 / 斜纹带）
- Gift 2 bar: `#2FD07A`
- Gift 3 bar: `#3D7BFF`
- Qty chip: `#0F0F0F` 底 + `#FFD429` 字 + 白色硬阴影
- Foot bar: `#0F0F0F` 整块反白

## Typography

- 主标题：`Noto Sans SC`，字重 900，40px
- 主商品名：`Noto Sans SC`，字重 900，48px
- 赠品名：`Noto Sans SC`，字重 900，46px
- 赠品编号：`Sarasa Gothic SC`，字重 700，22px，letter-spacing .14em
- 数量片：`Sarasa Gothic SC`，字重 900，28px

## 布局

- 画布 1920×1080，顶部反白条 78px
- 主商品条整宽，左右内边距 72px，内含 96px 色块 + 商品名 + 右对齐说明
- 赠品区标题行 padding 24/72/16，中部 3px 实线拉通
- 赠品三格并排，格间距 26px，格内 16px 色条 + 居中内容
- 底部反白说明条 + 斜纹带 20px

## 动画

- 顶部条落下，主标题与眉标错峰补位
- 主商品条自左画外切入，色块斜向拍入后阴影压 2 帧再弹回
- 赠品区标题自上拍入
- 三格赠品自下错峰落位（每格 0.12s，模 2 硬着陆，opacity 恒为 1）
- 赠品名与数量片依次补位
- 反白说明条与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（顶部反白条上的一行大字）
- `goodsName` string 主商品名称
- `goodsNote` string 主商品说明（一行）
- `giftTitle` string 赠品区标题
- `gift1` string 第一件赠品名称
- `gift2` string 第二件赠品名称
- `gift3` string 第三件赠品名称
- `giftQty` number 每种赠品数量（件）
- `note` string 底部说明（一行 mono）
- `accent` color 强调色（赠品一色条 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：三格的 `× N` 与合计件数 `3 × giftQty`。

## Avoid

- 每种赠品的数量只填一次，三格与合计都由它推出
- 三格赠品顶部色条必须一格一色，不许三格同色
- 深底上的数量片阴影必须换白
- 圆角只用 4px 与 9999px
- 不使用 rotate / skew 入场，不用 back.out / elastic / bounce