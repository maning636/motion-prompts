# 多线对比视觉规范

## 方向

2-3 条折线同图对比同一指标，强调谁领先、谁追赶，适合模型 benchmark / 产品增长。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Series 2: `rgba(244,239,231,0.70)`
- Series 3: `rgba(244,239,231,0.35)`
- Grid: `rgba(244,239,231,0.10)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 副标题：`IBM Plex Mono` 400，28px，Muted
- 轴标签：`IBM Plex Mono` 500，18px
- 图例：`IBM Plex Mono` 500，18px

## Layout

- 顶部标题 + 图例右上角
- 折线区占主体
- Y 轴 5 条网格线
- 数据点 5px 圆，带背景色描边

## Motion

- 标题/副标题入场
- 网格线、轴标签依次淡入
- 每条线依次从左到右描边绘制
- 数据点沿线弹出
- 图例最后出现
- 结束前整体上移淡出

## Avoid

- 超过 3 条线
- 线条颜色相近
- 数据点 < 4 个
