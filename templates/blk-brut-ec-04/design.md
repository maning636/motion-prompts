# 拼单价贴纸视觉规范

## 方向

贴纸风：上方两行中文大标题，中部三枚胶囊贴纸加一枚裸字符重音，下方一整块反白价格条同时压着成团人数方块与巨型拼单价。适合团购、拼团、砍价类带货画面。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`（人数方块底 / 斜纹带）
- Sticker pink: `#FF5FA2`
- Sticker yellow: `#FFD429`
- Price bar: `#0F0F0F`（整块反白）
- Star: `#3D7BFF` + `2px 2px 0` 文字硬投影

## Typography

- 主标题：`Noto Sans SC`，字重 900，120px，两行
- 贴纸：`Noto Sans SC`，字重 700，30px
- 拼单价：`Sarasa Gothic SC`，字重 900，216px，tabular-nums
- 成团人数：`Sarasa Gothic SC`，字重 900，104px
- 眉标：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .14em

## 布局

- 画布 1920×1080
- 顶部标题区 padding 52/88/0，下沿 3px 实线
- 贴纸行高约 112px，左右内边距 88px，胶囊最大宽 520px 防长文案顶破 ★
- 底部价格条占满剩余高度，横向三段：210px 人数方块 + 价格 + 右对齐说明
- 斜纹带 20px 压在最下沿

## 动画

- 标题区落下，标题两行错峰拍入（0.26s，power4.out）
- 四枚贴纸 / 裸字符依次斜向拍入（0.24s，错峰 0.1s）
- 价格条自下方硬落位（0.28s，power4.out）
- 人数方块斜向拍入，落定后阴影压 2 帧再弹回 8px 白影
- 价格数字与右侧说明错峰补位
- 斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `title` string 主标题（中文大字，两行）
- `lineB` string 主标题第二行（中文大字）
- `eyebrow` string 眉标（mono + 大字距）
- `st1` string 第一枚贴纸文案
- `st2` string 第二枚贴纸文案
- `st3` string 第三枚贴纸文案
- `price` number 每人拼单价（元）
- `people` number 成团人数（人）
- `note` string 价格条下方的说明（一行 mono）
- `accent` color 强调色（价格条底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 一排贴纸里只允许一枚裸字符重音件
- 深底上的方块阴影必须换白，不许沿用黑影
- 圆角只用 4px 与 9999px
- 不用 rotate / skew 入场，不使用 opacity 淡入当入场手段
- 一帧只放一个价格焦点，不叠加第二个优惠