# 运费险四格视觉规范

## 方向

四象限网格构图：2×2 四格售后说明，每格一枚强调色序号方块压着标题与说明行，格与格之间靠 3px 实线分隔。适合把一条服务保障拆成四个可核查要点的画面。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`（序号方块字 / 斜纹带）
- Cell fill: `#FFFFFF`
- Number block: `#FFFFFF` 底 + 6px 黑色硬阴影
- Muted: `#6B6B6B`（说明行）

## Typography

- 主标题：`Noto Sans SC`，字重 900，40px
- 格标题：`Noto Sans SC`，字重 900，44px
- 格序号：`Sarasa Gothic SC`，字重 900，44px
- 格说明：`Noto Sans SC`，字重 500，28px
- 眉标：`Sarasa Gothic SC`，字重 700，24px，letter-spacing .14em

## 布局

- 画布 1920×1080，顶部反白条 82px
- 主体 2×2 网格填满剩余高度，右列与下排去掉重复边框
- 每格 padding 34/56，左侧 104px 序号方块，右侧标题 + 说明两行
- 底部说明条 + 斜纹带 20px

## 动画

- 顶部反白条落下，眉标与主标题错峰补位
- 四格按左上→右上→左下→右下依次斜向拍入（每格 0.28s，power4.out）
- 每格序号方块先落，标题再落，说明行最后落（错峰 0.1s）
- 底部说明条与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（顶部黑条上的 mono 字）
- `title` string 主标题（黑条上的一行 900 白字）
- `k1` string 第一格标题
- `d1` string 第一格说明
- `k2` string 第二格标题
- `d2` string 第二格说明
- `k3` string 第三格标题
- `d3` string 第三格说明
- `k4` string 第四格标题
- `d4` string 第四格说明
- `note` string 底部说明（一行 mono）
- `accent` color 强调色（四格序号块 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 序号方块固定 104px、白底黑边 4px 直角，不许换色换形换圆角
- 四格文案长度上限：一行标题 + 一行说明，超出靠 fit() 缩放
- 四格是同一条保障的四个要点，不许再塞第五格
- 圆角只用 4px 与 9999px
- 不使用 rotate / skew 入场，不用 opacity 淡入当入场手段