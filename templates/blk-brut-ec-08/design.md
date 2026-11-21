# 第二件半价视觉规范

## 方向

满宽上下两格：第一件原价白底、第二件半价压强调色，两格各占半屏高度，右下角一枚半价方章压住画面，反白规则条收尾。适合两件装、多件装、组合优惠的直给型促销画面。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`（第二格底 / 斜纹带 / 顶部标签）
- Row one: `#FFFFFF` 卡面 + `#6B6B6B` 数字
- Stamp: `#0F0F0F` 底 + `#FFD429` 字 + 白色硬阴影
- Rule bar: `#0F0F0F` 整块反白

## Typography

- 主标题：`Noto Sans SC`，字重 900，34px
- 行标签：`Noto Sans SC`，字重 900，30px
- 金额：`Sarasa Gothic SC`，字重 900，184px（第二格 248px），tabular-nums
- 货币符号：`Sarasa Gothic SC`，字重 900，64px
- 方章：`Sarasa Gothic SC`，字重 900，96px

## 布局

- 画布 1920×1080，顶部反白条约 96px
- 主体上下两格等分，格间 3px 实线，左右内边距 72px
- 每格四段：标签胶囊 + 货币符号 + 金额 + 右侧说明
- 半价方章 200×200px，绝对定位在右下（right 88 / bottom 52）
- 底部反白规则条 + 斜纹带 20px

## 动画

- 顶部条落下，眉标与标题错峰补位
- 第一格自左画外、第二格自右画外对向切入（各 0.28s，power4.out）
- 两格标签与金额依次自上补位
- 方章自左下斜向砸入，落定后阴影压 2 帧再弹回 8px 白影
- 反白规则条与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（右上角的一行字）
- `dayLabel` string 第一行标签
- `halfLabel` string 第二行标签
- `dayPrice` number 单件原价（元）
- `note` string 底部规则说明（一行 mono）
- `accent` color 强调色（第二行底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：`halfPrice = dayPrice / 2`。

## Avoid

- 半价必须由原价算出来，不允许单独再填一次
- 深底上的方章阴影必须换白，不许沿用黑影
- 一帧只放一个优惠点，不叠加第二处折扣
- 圆角只用 4px 与 9999px
- 不使用 rotate / skew 入场，不用 opacity 淡入当入场手段