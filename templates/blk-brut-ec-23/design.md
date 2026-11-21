# 规格选择宫格视觉规范

## 方向

规格宫格构图：上下两组选择器，上组四枚颜色方格、下组五枚尺码方格，选中项整块换强调色并挂一枚对勾角标。适合选色、选尺码、选套餐这类「引导用户选一个」的交互帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（选中格 / 斜纹带 / 顶部标签）
- 未选中格: `#FFFFFF` 底 + 6px 黑色硬阴影
- 选中格: accent 底 + 10px 黑色硬阴影
- 对勾角标: `#0F0F0F` 底 + accent 字

## Typography

- 主标题：`Noto Sans SC`，字重 900，38px
- 格内主文案：`Noto Sans SC`，字重 900，44px
- 格内编号 / 尺码表：`Sarasa Gothic SC`，字重 700，22px，letter-spacing .12em
- 组标签：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .14em
- 对勾：`Sarasa Gothic SC`，字重 900，32px

## 布局

- 画布 1920×1080，顶部反白条 74px，底部斜纹带 20px
- 两组等分主体高度，组间 3px 实线，组内 padding 24/72/0
- 每组两段：标签行（标签 + 3px 拉通实线）+ 方格行
- 颜色组四格等宽，尺码组五格等宽，格间距 26px
- 对勾角标 60×60px 绝对定位在选中格右上角，圆角只在左下 4px

## 动画

- 顶部反白条落下，眉标与主标题错峰补位
- 第一组自上拍入，四枚颜色格自下逐格硬落位（每格 0.09s）
- 第二组随后自上拍入，五枚尺码格自下逐格硬落位（每格 0.08s）
- 选中项落定后阴影在 6px / 10px 两档间 steps 跳一次（模 9）
- 底部说明与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（黑条上的一行 900 白字）
- `g1Label` string 第一组标签（颜色）
- `c1` string 第一个颜色
- `c2` string 第二个颜色
- `c3` string 第三个颜色
- `c4` string 第四个颜色
- `g2Label` string 第二组标签（尺码）
- `s1` string 第一个尺码
- `s2` string 第二个尺码
- `s3` string 第三个尺码
- `s4` string 第四个尺码
- `s5` string 第五个尺码
- `selColor` string 当前选中的颜色（须与上面的颜色之一同名）
- `selSize` string 当前选中的尺码（须与上面的尺码之一同名）
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（选中格 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 选中态由「选中项」变量与格内文案比对得出，不另加一个高亮开关变量
- 每组只允许一枚选中项，不允许多选高亮
- 一组只放一组维度（颜色或尺码），不混装
- 选中格只通过换底色与阴影档位区分，不做 scale 弹入
- 圆角只用 4px 与 9999px，不用 rotate / skew 入场