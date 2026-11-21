# 会员价三栏视觉规范

## 方向

左中右三栏并排：左栏白底日常价、中栏抬高压强调色的会员价、右栏反白给出省下多少。中间一栏整体上移并换 10px 硬阴影，视觉重心自动落在会员价上。适合会员体系、订阅权益类带货对比。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`（中间一栏整块底）
- Right column: `#0F0F0F` + `#FFD429` 数字
- Left column: `#FFFFFF` 卡面 + `#6B6B6B` 价格
- Footer: `#0F0F0F` 整块反白

## Typography

- 主标题：`Noto Sans SC`，字重 900，56px
- 栏标题：`Noto Sans SC`，字重 900，30px
- 价格：`Sarasa Gothic SC`，字重 900，124px（右栏 104px），tabular-nums
- 栏脚注：`Sarasa Gothic SC`，字重 700，24px，letter-spacing .1em

## 布局

- 画布 1920×1080，顶部眉标行约 134px
- 三栏主体 padding 40/72/46，栏间距 26px，各栏等宽
- 中栏 margin-top −34px、margin-bottom 14px，形成抬高错落
- 底部反白条约 84px + 斜纹带 20px

## 动画

- 眉标行与主标题依次落位
- 三栏自下方硬落位（0.28–0.3s，power4.out），中栏最后落、落得最重
- 各栏金额在栏落定后自上补位，错峰 0.28s
- 会员栏落定后阴影在 8px / 10px 两档间 steps 跳一次（模 9）
- 底部反白条与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `title` string 主标题（顶部眉标行下的一行大字）
- `eyebrow` string 眉标（mono + 大字距）
- `dayLabel` string 第一栏标签
- `memberLabel` string 第二栏标签
- `saveLabel` string 第三栏标签
- `dayPrice` number 日常价（元）
- `memberPrice` number 会员价（元）
- `vipNote` string 第三栏下方的小字（会员门槛）
- `accent` color 强调色（中间一栏底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：`saveAmt = dayPrice − memberPrice`，`offPct = round((1 − memberPrice / dayPrice) × 100)`。

## Avoid

- 省额与折扣率必须由两个价算出，不单独填
- 三栏只允许中间一栏抬高，不许三栏都做错落
- 阴影只在 8px / 10px 档位间 steps 跳
- 圆角只用 4px 与 9999px
- 不使用 rotate / skew 入场，不用 back.out / elastic / bounce