# 数据卖点巨卡视觉规范

## 方向

双数据巨卡构图：整屏近黑底，两张并排巨卡各压一个巨型数据与一条占比条，左卡黄底近黑字、右卡蓝底白字，两卡一色一变。适合销量、复购率这类成对出现的数据背书。

## Palette

- Background: `#0F0F0F`（整屏反白）
- Foreground: `#FFFFFF`
- Accent: `#FFD429`（左卡整块底 / 斜纹带 / 顶部标签）
- Card B: `#3D7BFF` 底 + 白字
- Track: 纸色底 + 45° 疏纹槽
- Fill A: `#0F0F0F` 实色；Fill B: `#FFFFFF` 实色

## Typography

- 主标题：`Noto Sans SC`，字重 900，40px
- 数据数字：`Sarasa Gothic SC`，字重 900，236px，tabular-nums
- 数据单位：`Sarasa Gothic SC`，字重 700，44px
- 卡片标签：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .12em
- 说明行：`Noto Sans SC`，字重 700，28px

## 布局

- 画布 1920×1080，上下各一条 20px 斜纹带
- 眉标行 padding 36/72/30
- 双卡区 padding 6/72/34，两卡等宽，卡间距 34px
- 每卡四段：标签行 + 数值行 + 说明行 + 占比条（占比条 margin-top:auto 撑底）
- 占比条高 34px，描边用 currentColor，两卡各自取自身字色
- 口径说明 padding 0/72/26

## 动画

- 顶部斜纹带分格擦出（steps(8)）
- 眉标行落下，眉标与主标题错峰补位
- 两张巨卡自左右画外对向切入，落定后阴影各压 2 帧再弹回 10px 白影
- 标签、巨数、说明行依次错峰补位
- 两条占比条用 B.in.grow 从 0% 长出，行间错开 0.12s
- 底部斜纹带分格擦出 + 说明行收尾
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（反白画面上的 mono 字）
- `title` string 主标题（反白画面上的中文大字）
- `n1` number 已售件数（件）
- `l1` string 第一张卡标签
- `d1` string 第一张卡说明
- `p1` number 本批次售出比例（%）
- `n2` number 复购率（%）
- `l2` string 第二张卡标签
- `d2` string 第二张卡说明
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（第一张卡底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：`n1 ≥ 10000` 时自动换算成「万」并改写单位；两条占比条宽度分别取 `p1` 与 `n2`。

## Avoid

- 万位换算与单位改写由数字自动完成，不允许手动把「8.6 万件」写进变量
- blue 底必须配白字，blue 上的阴影必须换白
- 占比条底槽永远是纸色 + 斜纹，填充永远是实色，不靠深浅区分
- width:0 的占比条必须用 B.in.grow，不能用 wipe
- 一帧只放两个数据，不叠第三张巨卡