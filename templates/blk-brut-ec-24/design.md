# 版本阶梯对比视觉规范

## 方向

阶梯双档构图：两档底边对齐左右并置，普通版矮一截白底、旗舰版抬高压强调色并带推荐角标，两档各列三行权益。适合版本、档位、套餐之间的取舍说明。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`（旗舰版整块底 / 差价块 / 斜纹带）
- 普通版: `#FFFFFF` 底 + 8px 黑色硬阴影
- 旗舰版: accent 底 + 10px 黑色硬阴影
- 名称条: `#0F0F0F` 底 + accent 字
- 推荐角标: `#0F0F0F` 底 + accent 字 + 4px 白色硬阴影

## Typography

- 主标题：`Noto Sans SC`，字重 900，60px
- 差价块：`Sarasa Gothic SC`，字重 900，34px，ink 底 accent 字
- 版本名：`Noto Sans SC`，字重 900，38px
- 价格：`Sarasa Gothic SC`，字重 900，132px，tabular-nums
- 权益行：`Noto Sans SC`，字重 700，30px

## 布局

- 画布 1920×1080，顶部纸底标题行（含差价块），底部反白长脚注 + 斜纹带 20px
- 阶梯区 padding 34/72/38，两档底边对齐，普通版 height 76%、旗舰版 100%
- 每档四段：名称条、价格行、配置说明行、权益列表
- 权益列表占剩余高度，三行等高，行间共享 3px 边框
- 推荐角标在旗舰版名称条内右端

## 动画

- 标题行落下，标题与差价块错峰补位
- 两档自下方硬落位，普通版先、旗舰版后且行程更长（0.3s，power4.out）
- 两档落定后阴影各压 2 帧再弹回原档
- 版本名与价格错峰补位，推荐角标自右侧拍入
- 权益列表左右反向切入（普通版从左、旗舰版从右），行间错峰 0.08s
- 底部反白脚注与斜纹带收尾
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（顶部纸底行上的 mono 字）
- `title` string 主标题（中文大字，一行）
- `basicLabel` string 普通版名称
- `flagLabel` string 旗舰版名称
- `basicPrice` number 普通版价格（元）
- `flagPrice` number 旗舰版价格（元）
- `basic1` string 普通版第一行权益
- `basic2` string 普通版第二行权益
- `basic3` string 普通版第三行权益
- `flag1` string 旗舰版第一行权益
- `flag2` string 旗舰版第二行权益
- `flag3` string 旗舰版第三行权益
- `bestTag` string 旗舰版右上角标
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（旗舰版底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：`diff = flagPrice − basicPrice`，显示在标题行的差价块。

## Avoid

- 差价必须由两个价算出，不允许手动再写一遍
- 两档高度必须成比例（76% / 100%），不许随便给两个高度
- 深色名称条与推荐角标上的硬阴影必须换白
- 权益行数两档必须一致，不许一边多一行
- 不用 rotate / skew 入场，不用 back.out / elastic / bounce