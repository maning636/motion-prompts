# 状态机视觉规范

## 方向

环形状态布局，节点为圆，转换关系为曲线箭头。用于展示状态流转、生命周期、事件驱动模型。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Node fill: `#211C18`
- Node stroke: `#3A3029`
- Arrow: `#3A3029`

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 状态文字：`IBM Plex Mono`，字重 600，20px

## 布局

- 画布安全边距：96px 112px
- 图表区域：1696×620
- 节点沿圆周均匀分布
- 节点半径 52px
- 箭头使用二次贝塞尔曲线避开节点

## 动画

- 标题淡入
- 节点依次弹出
- 箭头描边动画绘制
- 第一个状态高亮为 active
- 结尾场景淡出

## Avoid

- 不使用 3D
- 不使用自循环箭头
- 状态数建议 3–6 个
