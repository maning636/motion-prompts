# 成分卖点标牌视觉规范

## 方向

成分标牌横排构图：顶部反白条与大标题行，下方四枚成分标牌并排，每枚顶部一条 16px 分类色条，中部压着含量大数字，下方成分名与说明。适合把成分表变成四张可一眼扫完的标牌。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`（第一枚标牌顶条 / 斜纹带）
- Card 2 bar: `#FF5FA2`
- Card 3 bar: `#2FD07A`
- Card 4 bar: `#3D7BFF`
- Card fill: `#FFFFFF` + 8px 黑色硬阴影
- Muted: `#6B6B6B`（编号与说明）

## Typography

- 主标题：`Noto Sans SC`，字重 900，72px
- 含量数字：`Sarasa Gothic SC`，字重 900，132px，tabular-nums
- 含量单位：`Sarasa Gothic SC`，字重 700，44px
- 成分名：`Noto Sans SC`，字重 900，40px
- 编号：`Sarasa Gothic SC`，字重 700，22px，letter-spacing .14em

## 布局

- 画布 1920×1080，顶部反白条 66px，大标题行下沿 3px 实线
- 标牌区 padding 32/72/34，四牌等宽，牌间距 24px
- 每牌四段：16px 色条 + 编号 + 含量行 + 成分名 + 说明
- 底部说明 padding 0/72/22，斜纹带 20px

## 动画

- 顶部反白条落下，眉标补位
- 大标题行落下，标题自左上拍入
- 模 2 硬着陆：四枚标牌自下错峰落位（每枚 0.12s），纯位移 opacity 恒为 1
- 四组含量数字自上补位，第一枚标牌落定后阴影压 2 帧再弹回 8px 档
- 成分名与说明行分两批错峰自上补位
- 底部说明与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（中文大字，一行）
- `c1` string 第一格成分名
- `n1` number 第一格含量（%）
- `d1` string 第一格说明
- `c2` string 第二格成分名
- `n2` number 第二格含量（%）
- `d2` string 第二格说明
- `c3` string 第三格成分名
- `n3` number 第三格含量（%）
- `d3` string 第三格说明
- `c4` string 第四格成分名
- `n4` number 第四格含量（%）
- `d4` string 第四格说明
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（第一格顶条 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 四枚标牌顶部色条必须一牌一色，不许四牌同色
- 含量数字只填一次，单位是固定 `%`，不许把单位写进变量
- 一屏只放四个成分，不叠第五枚标牌
- 圆角只用 4px 与 9999px，标牌不做阴影漂浮动画
- 不用 rotate / skew 入场，不用 back.out / elastic / bounce