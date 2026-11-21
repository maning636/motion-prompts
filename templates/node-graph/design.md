# 节点图视觉规范

## 方向

5-7 个节点通过线条连接成网络，适合展示路由、工作流或关系拓扑。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Node fill: `rgba(244,239,231,0.05)`
- Accent node fill: `rgba(0,255,0,0.12)`
- Link: `rgba(244,239,231,0.15)`

## Typography

- 标题：64px，700
- 节点名：18px，600

## Layout

- 标题区 + 居中 SVG 网络图
- 节点均匀分布，线条连接相邻节点
- 核心节点用 accent 高亮

## Motion

- 标题入场
- 节点依次弹出
- 连线依次绘制
- 结束前淡出

## Avoid

- 不使用 3D、阴影、渐变
- 节点数 5-7 个
