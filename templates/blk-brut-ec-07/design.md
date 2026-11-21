# 满减券卡视觉规范

## 方向

左券右说明构图：左侧一张 860px 宽的大额满减券面，上下两块用 3px 虚线撕口隔开；右侧三行使用规则加一枚唯一 CTA 按钮。适合讲清「满减怎么凑、能不能叠加」的机制类促销画面。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（券面下半块 / 斜纹带 / 顶部标签）
- Coupon upper: `#FFFFFF`
- CTA: `#2FD07A`
- Number chip: `#FFD429`
- Muted: `#6B6B6B`

## Typography

- 主标题：`Noto Sans SC`，字重 900，64px
- 券面金额：`Sarasa Gothic SC`，字重 900，196px，tabular-nums
- 券面键：`Sarasa Gothic SC`，字重 700，30px，letter-spacing .14em
- 规则正文：`Noto Sans SC`，字重 700，30px
- CTA：`Noto Sans SC`，字重 900，36px

## 布局

- 画布 1920×1080，顶部反白通栏 66px
- 主体左右布局：券面定宽 860px，右侧说明列占余量，间距 56px
- 券面等分上下两块，两块之间 3px 虚线撕口
- 规则三行，行间 3px 实线，行首 48px 序号方块
- 底部说明条 + 斜纹带 20px

## 动画

- 顶部通栏落下，标签与眉标错峰补位
- 券面自左侧斜向拍入（0.3s，power4.out），落定后阴影压 2 帧再弹回 10px 档
- 上下两块金额自上依次补位
- 右侧标题自右画外切入，三行规则错峰跟进（每行 0.1s）
- CTA 拍入后做一次按钮按下反馈（位移 6px = 阴影偏移量，阴影同步减半到 3px，1 帧硬切）
- 斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（右侧说明列顶部的大字）
- `threshold` number 门槛金额（元）
- `minus` number 每满门槛减免（元）
- `rule1` string 规则第一行
- `rule2` string 规则第二行
- `rule3` string 规则第三行
- `cta` string 按钮文案（唯一一处 CTA）
- `accent` color 强调色（券面底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 一帧只放一个优惠机制，CTA 全画面只出现一次
- 减免金额钳制在 0 与门槛之间，不出现「满 100 减 300」
- 券面撕口用 3px 虚线，不用 clip-path 撕边造型
- 按钮按下位移量恒等于阴影偏移量，不用补间
- 圆角只用 4px 与 9999px，不用 back.out / elastic / bounce