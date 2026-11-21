# Sankey 流图视觉规范

## 方向

左右流向图，展示资源、流量或用户从一个分类向另一个分类的转移。节点为竖条，连接线为曲线。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- Node fill: `#211C18`
- Node stroke: `#3A3029`

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 节点名称：`IBM Plex Mono`，字重 600，22px
- 节点数值：`IBM Plex Mono`，字重 500，16px

## 布局

- 画布安全边距：96px 112px
- 图表区域：1696×640
- 左侧源节点、右侧目标节点
- 节点竖条宽 24px，圆角 4px
- 曲线连接，线宽按流量比例

## 动画

- 标题、副标题淡入
- 节点竖条从上向下生长
- 节点文字随后出现
- 连接线以描边动画方式绘制
- 结尾场景淡出

## Avoid

- 不使用 3D 或阴影
- 不使用多色连接，统一 accent 色
- 节点不过多（建议源≤4，目标≤3）
