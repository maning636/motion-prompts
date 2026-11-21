# 分支流程视觉规范

## 方向

单一条件判断 → 两个分支路径的流程图。用于展示 if/else、权限判断、简单决策逻辑。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- Node fill: `#211C18`
- Node stroke: `#3A3029`
- Decision stroke: Accent

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 节点文字：`IBM Plex Mono`，字重 600，24px
- 判断文字：`IBM Plex Mono`，字重 700，22px
- 分支标签：`IBM Plex Mono`，字重 500，20px

## 布局

- 画布安全边距：96px 112px
- 流程从上到下：根节点 → 判断菱形 → 左右两个结果节点
- 根节点与结果节点为圆角矩形
- 判断节点为菱形，accent 描边
- 连接线带描边动画

## 动画

- 标题淡入
- 根节点出现
- 连接线向下绘制
- 判断菱形弹出
- 分支标签与结果节点依次出现
- 结尾场景淡出

## Avoid

- 不使用 3D
- 不使用超过两个分支
- 不使用阴影或 glow
