# 预售尾款视觉规范

## 方向

水平进度轴构图：中部一整条横向定金与尾款两段进度轴，轴上两个节点方块标出已付与待付，下方左右两块金额卡并置。适合预售、新品预定这类分两次付款的时间压力帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`（尾款块 / 尾款节点 / 截止块阴影 / 斜纹带）
- 已付段: `#2FD07A`
- 尾款块: `#FFD429` 底 + 8px 黑色硬阴影
- Deadline block: `#0F0F0F` 底 + `#FFD429` 字 + 6px accent 硬阴影

## Typography

- 主标题：`Noto Sans SC`，字重 900，72px
- 金额：`Sarasa Gothic SC`，字重 900，170px，tabular-nums
- 块标签：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .12em
- 节点方块：`Sarasa Gothic SC`，字重 900，32px
- 截止时间：`Sarasa Gothic SC`，字重 900，32px
- 口径说明：`Sarasa Gothic SC`，字重 700，24px

## 布局

- 画布 1920×1080，顶部反白条 66px，底部斜纹带 20px
- 标题行 padding 32/72/26，下沿 3px 实线
- 进度轴 padding 48/72/34，槽高 40px，节点方块 80px 用 margin-top −20px 压在轴上
- 节点行左右分置，左端左对齐、右端右对齐
- 金额区 padding 0/72/32，两块等宽、间距 34px
- 底部说明 padding 0/72/24

## 动画

- 顶部反白条与标题行依次落位
- 进度轴自上拍入，已付段用 B.in.grow 从 0% 长到已付比例
- 两个节点方块斜向拍入，标签错峰补位
- 两块金额卡自下依次落位，金额自上补位，各自带一次阴影压弹
- 说明行与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（中文大字，一行）
- `deadline` string 尾款截止时间
- `depositLabel` string 定金块标签
- `balanceLabel` string 尾款块标签
- `deposit` number 已付定金（元）
- `fullPrice` number 商品全款（元）
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（尾款块 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：`balance = fullPrice − deposit`，进度轴已付比例 `round(deposit / fullPrice × 100)`。

## Avoid

- 尾款与已付比例必须由定金 / 全款算出，不允许同一个数填两遍
- 定金钳制在 0 与全款之间，不出现负尾款
- width:0 的已付段必须用 B.in.grow，不能用 wipe（wipe 改 clip-path 但条子没宽度）
- 一帧只放一个付款焦点，不叠加第二个金额优惠
- 圆角只用 4px 与 9999px，不用 rotate / skew 入场