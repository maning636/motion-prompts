# 泳道图视觉规范

## 方向

横向泳道流程图，每条泳道代表一个角色，步骤按时间顺序从左到右排列。适合展示跨角色协作、RACI、多团队流程。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- Lane line: `#3A3029`
- Step fill: `#211C18`
- Step stroke: `#3A3029`
- Connector: `#5A4840`

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 角色标签：`IBM Plex Mono`，字重 600，18px
- 步骤文字：`IBM Plex Mono`，字重 600，18px

## 布局

- 画布安全边距：96px 112px
- 图表区域：1696×640
- 每条泳道等高
- 左侧 120px 角色标签
- 步骤框 180×56，圆角 6px
- 步骤之间用箭头连接

## 动画

- 标题淡入
- 泳道线出现
- 步骤按顺序弹出
- 连接线描边绘制
- 第一个步骤高亮
- 结尾场景淡出

## Avoid

- 不使用 3D
- 不使用阴影或 glow
- 步骤不超过 8 个
