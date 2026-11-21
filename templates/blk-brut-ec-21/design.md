# 成分对比表视觉规范

## 方向

成分表格构图：三行成分各配两条横向对比条，我方实色条在上、行业斜纹条在下，行尾一枚倍数片说明领先或落后倍数。适合成分党、面料对比这类把参数差异变成可读条长的画面。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`（我方条 / 斜纹带）
- 我方条: `#2FD07A` 实色
- 行业条: 45° ink/white 斜纹实色
- 倍数片: `#0F0F0F` 底 + accent 字 + 6px 黑色硬阴影
- Track: 纸色底 + 45° 疏纹槽

## Typography

- 主标题：`Noto Sans SC`，字重 900，64px
- 成分名：`Noto Sans SC`，字重 900，34px
- 数值：`Sarasa Gothic SC`，字重 900，38px，tabular-nums
- 倍数片：`Sarasa Gothic SC`，字重 900，32px
- 眉标 / 图例：`Sarasa Gothic SC`，字重 700，26px / 22px

## 布局

- 画布 1920×1080，顶部纸底标题行含两枚图例胶囊，下沿 3px 实线
- 表格区三行等高，行间共享 3px 边框
- 每行四段：成分名（定宽 300px）+ 条组（自适应）+ 倍数片（定宽 200px）
- 条组内上下两条，每条 = 条槽（自适应）+ 数值（定宽 210px 右对齐）
- 条槽高 34px，底部说明 padding 22/72/28，斜纹带 20px

## 动画

- 标题行落下，标题与两枚图例错峰补位
- 三行自左画外依次切入（每行 0.16s）
- 每行两条对比条用 B.in.grow 从 0% 长出，行内错开 0.12s
- 倍数片自右侧拍入，说明行与斜纹带收尾
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（顶部纸底行上的 mono 字）
- `title` string 主标题（中文大字，一行）
- `m1` string 第一项名称
- `o1` number 第一项我方数值
- `b1` number 第一项行业基准
- `m2` string 第二项名称
- `o2` number 第二项我方数值
- `b2` number 第二项行业基准
- `m3` string 第三项名称
- `o3` number 第三项我方数值
- `b3` number 第三项行业基准
- `unit` string 数值单位（% / mg）
- `note` string 底部口径说明（一行 mono）
- `accent` color 强调色（我方条 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：条宽按「同行两者较大值」归一化到 100%；倍数片按 `ours / base` 得出，落后时显示 `−百分比`。

## Avoid

- 同行两条必须共用一把尺（以较大值为满格），不许各按自己的最大值归一化
- 倍数必须由两个数值算出，不允许手动再写一遍
- 底槽永远是纸色 + 斜纹，填充永远是实色或 45° 斜纹，不靠深浅区分
- width:0 的条必须用 B.in.grow，不能用 wipe
- 一帧只放一组成分对比，不叠第四行