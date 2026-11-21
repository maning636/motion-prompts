# 光谱轴视觉规范

## 方向

一根水平轴，两端为对立极，中间 marker 标注当前位置，适合表达某事物在两个极端之间的连续位置。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Axis: `rgba(244,239,231,0.18)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 极端标签：28px，600
- Marker 标签：22px，700
- Marker 数值：16px，opacity 0.5

## Layout

- 标题区 + 居中轴
- 轴线贯穿画面，两端标签对齐
- Marker 圆点 + 上方标签 + 下方数值

## Motion

- 标题入场
- 轴线从左到右生长
- 两端标签依次落下
- Marker 弹出并带弹性
- 标签与数值淡入
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、渐变
- 不标过多中间刻度
