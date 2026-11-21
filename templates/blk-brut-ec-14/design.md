# 仅剩 N 件视觉规范

## 方向

大字加满宽库存条构图：上部反白标签条报已售比例，中部左侧标语与右侧巨型剩余件数方块并置，下部一整条横贯画面的库存条按已售比例向右生长。适合断货预警、限量抢购的库存压力帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（巨型数字块 / 库存条填充 / 斜纹带）
- Remaining box: `#FF5FA2` 底 + 10px 黑色硬阴影
- Track: 纸色底 + 45° 疏纹槽
- Top bar: `#0F0F0F` 整块反白

## Typography

- 剩余件数：`Sarasa Gothic SC`，字重 900，300px，tabular-nums
- 单位：`Sarasa Gothic SC`，字重 700，52px
- 主标语：`Noto Sans SC`，字重 900，104px
- 已售比例：`Sarasa Gothic SC`，字重 900，34px
- 口径说明：`Sarasa Gothic SC`，字重 700，24px

## 布局

- 画布 1920×1080，顶部反白条 70px，底部斜纹带 20px
- 中部左右布局：左标语块自适应，右数字方块定尺寸（内边距 28/56/34）
- 库存条高 56px，左右内边距 72px，槽与填充都在 3px 黑边内
- 图例行 padding 0 22px，margin-top 20px

## 动画

- 顶部反白条落下，眉标与已售比例错峰补位
- 主标语自左上拍入，副句自上补位
- 巨型数字方块以 scale .86 → 1 弹入，落定后阴影压 2 帧再弹回 10px 档
- 库存条用 B.in.grow 从 0% 长到已售比例（width:0 的件不能用 wipe）
- 图例与口径说明依次补位，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（巨型数字左侧的一行大字）
- `total` number 总库存（件）
- `sold` number 已售件数（件）
- `unit` string 数字后的单位
- `note` string 底部口径说明（一行 mono）
- `accent` color 强调色（巨型数字块 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：`remain = total − sold`，`pct = round(sold / total × 100)`，库存条填充宽度取该百分比。

## Avoid

- 剩余件数与已售比例必须由 total / sold 算出，不允许单独再填
- 已售钳制在 0 与总库存之间，不出现负剩余
- 库存条底槽永远是纸色 + 斜纹，填充永远是实色，不靠深浅区分
- 一帧只放一个焦点：剩余件数，比例只作为它的证据
- 圆角只用 4px 与 9999px，不用 rotate / skew 入场