# 堆叠柱形图视觉规范

## 方向

展示部分构成随分类变化的镜头。每根柱形由多个系列堆叠而成，顶部显示总计，便于比较总量与结构。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- Line: `#3A3029`

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 轴标签：`IBM Plex Mono`，字重 500，20px
- 柱顶总计：`IBM Plex Mono`，字重 700，24px
- 图例：`IBM Plex Mono`，18px，Muted 色

## 布局

- 画布安全边距：96px 112px
- 图表区域：1696×600
- 柱形宽度占 slot 的 50%
- 图例位于图表区域右上角
- 柱形圆角 4px

## 动画

- 标题、副标题、图例依次淡入
- 网格线与 Y 轴标签出现
- 每根柱形的各段从底部向上堆叠增长
- 分类标签和总计标签最后出现
- 结尾场景淡出

## Avoid

- 不使用 3D 柱形
- 不使用阴影或 glow
- 不使用渐变填充
