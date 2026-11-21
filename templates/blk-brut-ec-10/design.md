# 包邮四角视觉规范

## 方向

四角角标加中央焦点构图：画面四个角各压一枚包邮条件角标，中央一块强调色方牌压着巨型运费数字，四角向内收拢把视线汇到中央。适合运费为零的卖点帧，一眼看完「免运费」的全部条件。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`（中央方牌 / 右下角块 / 斜纹带）
- Corner 2: `#FFD429`
- Corner 4: `#0F0F0F` 底 + `#2FD07A` 字
- Muted: `#6B6B6B`（口径说明）

## Typography

- 运费数字：`Sarasa Gothic SC`，字重 900，280px，tabular-nums
- 数字单位：`Sarasa Gothic SC`，字重 700，48px
- 眉标：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .14em
- 角标正文：`Noto Sans SC`，字重 900，30px
- 口径说明：`Sarasa Gothic SC`，字重 700，24px

## 布局

- 画布 1920×1080，四角角标为 #stage 的直接子元素，绝对定位贴角
- 角标最大宽 720px，胶囊圆角，内含 20px 实心方点
- 中央方牌水平垂直居中，内边距 34/88/40，10px 硬阴影
- 口径说明条居中，bottom 80px
- 斜纹带贴底 20px

## 动画

- 左上与右上角标自各自角落斜向拍入（0.26s，power4.out）
- 中央方牌以 scale .86 → 1 弹入（0.3s，power3.out）
- 巨型数字与眉标错峰自上补位，方牌落定后阴影压 2 帧再弹回 10px 档
- 左下与右下角标自各自角落斜向拍入，与上方对角对称
- 口径说明与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（中央焦点上方的 mono 字）
- `bigNum` number 运费金额（元）
- `bigUnit` string 数字后的单位
- `c1` string 左上角条件
- `c2` string 右上角条件
- `c3` string 左下角条件
- `c4` string 右下角条件
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（中央色块 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 四枚角标是同一条机制的四个条件，不许再加第五枚
- 一帧只放一个费用焦点，中央方牌只放运费
- 中央方牌用 translate(-50%,-50%) 定位，动效只改 scale，不改定位
- 角标最大宽必须写死 720px，否则 fit() 量不到真实可用宽度
- 圆角只用 4px 与 9999px，不用 rotate / skew 入场