# 工艺卖点工序轴视觉规范

## 方向

横向工序轴构图：三道工序左中右并排铺满一行，工序之间各嵌一枚箭头方块，每道工序含序号方块、名称、说明与一枚参数片。适合把制作过程讲成一条可读的流水线。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`（序号方块字 / 箭头方块底 / 斜纹带）
- Step fill: `#FFFFFF` + 8px 黑色硬阴影
- Step name bar: 纸色底 + 3px 实线
- Param chip: `#0F0F0F` 底 + accent 字 + 4px accent 硬阴影
- Muted: `#6B6B6B`（工序说明）

## Typography

- 主标题：`Noto Sans SC`，字重 900，64px
- 工序名：`Noto Sans SC`，字重 900，40px
- 工序序号：`Sarasa Gothic SC`，字重 900，38px
- 工序说明：`Noto Sans SC`，字重 500，28px，行高 1.6
- 参数片 / 箭头：`Sarasa Gothic SC`，字重 900，26px / 52px

## 布局

- 画布 1920×1080，顶部反白条 66px，大标题行下沿 3px 实线
- 工序轴 padding 34/72/38，五段等分：三道工序 + 两枚箭头块（箭头块定宽 132px）
- 每道工序四段：工序头条（序号 + 名称）+ 正文区（说明 + 参数片）
- 序号方块 88×88px，压在工序头条左侧，带 6px 硬阴影
- 箭头方块 104×104px，垂直居中于工序区

## 动画

- 顶部反白条落下，眉标与注释错峰补位
- 大标题行落下，标题自左上拍入
- 三道工序自左画外依次切入（各 0.3s，power4.out）
- 两枚箭头方块跟在各自工序之后落位，各带一次阴影压 2 帧再弹回 6px 档
- 工序序号方块斜向拍入，工序名 / 说明 / 参数片分三批错峰补位
- 底部说明与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（中文大字，一行）
- `s1` string 第一道工序名
- `s1d` string 第一道工序说明
- `s1t` string 第一道工序参数
- `s2` string 第二道工序名
- `s2d` string 第二道工序说明
- `s2t` string 第二道工序参数
- `s3` string 第三道工序名
- `s3d` string 第三道工序说明
- `s3t` string 第三道工序参数
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（工序参数片 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 一条轴只放三道工序，不叠第四段
- 工序说明用 sans 不用 mono，参数片用 mono 不用 sans，两者不许互换
- 箭头用字符 `→`，不用 SVG 图标、不用旋转
- 序号方块固定 88px、白底黑边 4px 直角，不许换形换色
- 不用 rotate / skew 入场，不用 opacity 淡入当入场手段