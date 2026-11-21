# 热力图视觉规范

## 方向

二维矩阵强度图，用色块深浅表示数值大小。适合展示时间×维度、特征×样本等密集分布。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 行列标签：`IBM Plex Mono`，字重 500，18px
- 单元格数值：`IBM Plex Mono`，字重 700，18px

## 布局

- 画布安全边距：96px 112px
- 热力图尺寸：1480×600
- 每行左侧 80px 行标签
- 顶部 50px 列标签
- 单元格间距 6px，圆角 4px

## 动画

- 标题、副标题淡入
- 行列标签依次出现
- 单元格按阅读顺序弹出，带轻微回弹
- 结尾场景淡出

## Avoid

- 不使用 3D 或投影
- 不使用复杂图例
- 单元格颜色仅使用 accent 透明通道
