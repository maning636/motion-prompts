# 升级前后对比视觉规范

## 方向

上下前后对比：升级前行白底、升级后行压强调色，两行结构完全对称，中间一条满宽实线加一枚上升箭头方块作为分界。每行各列两个指标，升级侧多挂一枚提升片。适合产品迭代、配方升级类的前后叙事。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`（升级后行 / 箭头方块 / 斜纹带）
- Before row: `#FFFFFF` 底 + `#6B6B6B` 数值
- Arrow block: `#0F0F0F` 底 + accent 字 + 6px accent 硬阴影
- Gain chip: `#0F0F0F` 底 + `#FFD429` 字 + 4px 白色硬阴影

## Typography

- 主标题：`Noto Sans SC`，字重 900，38px
- 前后行标签：`Noto Sans Cap SC`，字重 900，44px
- 指标名：`Noto Sans SC`，字重 700，30px
- 指标值：`Sarasa Gothic SC`，字重 900，124px，tabular-nums
- 提升片：`Sarasa Gothic SC`，字重 900，30px

## 布局

- 画布 1920×1080，顶部反白条 74px，底部斜纹带 20px
- 两行等分主体高度，行内三段：标签列（定宽 260px）+ 两个指标列（等宽，左侧 3px 竖线分隔）
- 中间分隔行高度为 0，只画一条 3px 实线，箭头方块 120×120px 跨在实线上
- 底部说明 padding 24/72/28

## 动画

- 顶部反白条落下，眉标与主标题错峰补位
- 升级前自上、升级后自下夹向中间落位（各 0.28s，power4.out）
- 中间分隔线 scaleX 从 0 展开，箭头方块以 scale .86 → 1 弹入
- 两行标签与四个数值错峰补位（升级侧反向入场，方向与前侧相反）
- 两枚提升片依次补位，说明行与斜纹带收尾
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（黑条上的一行 900 白字）
- `beforeLabel` string 升级前行的标签
- `afterLabel` string 升级后行的标签
- `metric` string 第一指标名称
- `beforeVal` number 升级前数值
- `afterVal` number 升级后数值
- `metric2` string 第二指标名称
- `beforeVal2` number 升级前第二项数值
- `afterVal2` number 升级后第二项数值
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（升级后行 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：`rise1`（翻倍或增减）、`rise2`（百分点差）。

## Avoid

- 提升幅度必须由前后两个数算出，不允许手动再写一遍结论
- 两行结构必须完全对称，只允许换底色与字重
- 深色件上的阴影必须换白，不许沿用黑影
- 分隔行高度为 0，只画实线，不做两行留白
- 不用 rotate / skew 入场，不用 opacity 淡入当入场手段