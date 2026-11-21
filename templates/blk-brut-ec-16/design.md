# 库存告急满版条视觉规范

## 方向

满版反白告急构图：整屏近黑底，中部一整条满宽强调色告急条压着巨型告急大字，右接一枚反白剩余件数块，下方三格紧急数据平铺。适合断货、售罄、批次断供这类强压力帧。

## Palette

- Background: `#0F0F0F`（整屏反白）
- Foreground: `#FFFFFF`
- Accent: `#FF5FA2`（告急条底 / 数据值 / 斜纹带）
- Alarm strip: `#FF5FA2` 底 + `#0F0F0F` 字
- Number block: `#0F0F0F` 底 + accent 字 + 8px 白色硬阴影
- Data cell: 透明底 + 白色 3px 描边

## Typography

- 告急大字：`Noto Sans SC`，字重 900，176px
- 剩余件数：`Sarasa Gothic SC`，字重 900，160px，tabular-nums
- 数据值：`Sarasa Gothic SC`，字重 900，60px，accent 色
- 数据键：`Sarasa Gothic SC`，字重 700，24px，letter-spacing .14em
- 眉标：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .14em

## 布局

- 画布 1920×1080，上下各一条 20px 斜纹带
- 眉标行 padding 34/72/28
- 告急条满宽（不是卡片），padding 34/72/40，左右两段：巨型字 + 数字块
- 三格数据区 padding 34/72/0，格间共享边框，右列补右边框
- 底部说明 padding 28/72/32

## 动画

- 顶部斜纹带分格擦出（steps(8)）
- 眉标行落下
- 告急条自画外左侧整条横穿切入（x −200px）
- 告急大字与数字块错峰自上补位，数字块斜向砸入后阴影压 2 帧再弹回 8px 白影
- 三格数据自下逐格硬落位（纯位移，opacity 恒为 1）
- 说明行与底部斜纹带依次收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（反白画面上的 mono 字）
- `alarm` string 满宽告急条上的大字
- `leftNum` number 剩余件数
- `k1` string 第一格键
- `v1` string 第一格值
- `k2` string 第二格键
- `v2` string 第二格值
- `k3` string 第三格键
- `v3` string 第三格值
- `note` string 底部说明（一行 mono）
- `accent` color 强调色（告急条底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 一帧只放一个紧急焦点：剩余件数，三格数据只是它的口径
- 深底上所有描边与硬阴影必须换白，不许沿用 ink
- 告急条是满宽色块不是卡片，不许加 4px 圆角
- 三格之间共享边框，不许每格都画四条边
- 不用 rotate / skew 入场，不用 back.out / elastic / bounce