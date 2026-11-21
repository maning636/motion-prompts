# 决策树视觉规范

## 方向

三层树状决策图：根节点 → 两个一级分支 → 四个二级分支 → 四个叶子结论。用于展示多条件判断的收敛过程。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Node fill: `#211C18`
- Node stroke: `#3A3029`
- Leaf fill: Accent

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 节点文字：`IBM Plex Mono`，字重 600，20px
- 叶子文字：`IBM Plex Mono`，字重 700，20px，深色背景

## 布局

- 画布安全边距：96px 112px
- 图表区域：1696×620
- 根节点居中顶部
- 一级分支左右分布
- 二级分支均匀展开
- 叶子结论底部，accent 填充

## 动画

- 标题淡入
- 节点按层级依次弹出
- 连接线以描边动画连接父子节点
- 结尾场景淡出

## Avoid

- 不使用 3D
- 不使用阴影或 glow
- 叶子结论不超过 4 个
