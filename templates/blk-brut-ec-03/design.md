# 券后账三行视觉规范

## 方向

三行阶梯式价格瀑布：第一行日常价、第二行减免项、第三行券后到手价，三行宽度逐级收窄像一段往下的台阶，数字右对齐、末行压强调色加重音。适合讲清「这张券到底省在哪一步」的带货账目卡。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`（末行色块 / 斜纹带）
- Minus row: `#FF5FA2`（减免数字）
- Row fill: `#FFFFFF`（前两行白底卡）
- Muted: `#6B6B6B`（行内编号 chip）

## Typography

- 主标题：`Noto Sans SC`，字重 900，48px
- 行标签：`Noto Sans SC`，字重 700，38px（末行 44px / 900）
- 行内编号：`Sarasa Gothic SC`，字重 700，22px，letter-spacing .12em
- 金额：`Sarasa Gothic SC`，字重 900，76px（末行 128px），tabular-nums

## 布局

- 画布 1920×1080，顶部反白标题条约 124px
- 主体 `ladder` 占剩余高度，纵向居中，行间距 22px
- 第一行满宽、第二行 84% 宽、第三行满宽且抬高内边距至 32/44
- 底部说明条约 70px + 斜纹带 20px

## 动画

- 反白标题条自画外上方落下（0.26s，power4.out）
- 三行各自从左侧画外依次切入（各 0.28s，power4.out，间隔 0.36s）
- 每行金额在行落定后自上补位（0.24–0.26s）
- 末行落定后阴影在 8px / 10px 两档间 steps 跳一次（模 9）
- 说明条自下拍入，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `title` string 主标题（反白顶部条上的 900 白字）
- `eyebrow` string 眉标（黑条上的 mono 字）
- `basePrice` number 日常价（元）
- `coupon` number 减免金额（元）
- `couponName` string 减免项名称
- `nowLabel` string 到手行标签
- `note` string 底部口径说明（一行 mono）
- `accent` color 强调色（到手行色块 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：`nowPrice = basePrice − coupon`。

## Avoid

- 到手价必须由日常价与券额算出，不允许单独再填一次
- 减免金额钳制在 0 与日常价之间，不出现负到手价
- 阴影只在 8px / 10px 档位间 steps 跳，不做连续缩放
- 圆角只用 4px 与 9999px
- 不使用 rotate / skew 入场，不用 back.out / elastic / bounce