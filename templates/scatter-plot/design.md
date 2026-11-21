# 散点图视觉规范

## 方向

编辑感的数据相关性镜头。散点展示两组连续变量的关系，辅以趋势线提示相关方向。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- Line: `#3A3029`

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 轴标签：`IBM Plex Mono`，字重 500，18px
- 轴标题：`IBM Plex Mono`，字重 600，22px
- 点标签：`IBM Plex Mono`，字重 600，16px

## 布局

- 画布安全边距：96px 112px
- 图表区域：1696×640
- 坐标轴留白：左 100px、右 60px、下 80px、上 40px
- 网格线：淡色细线，先出现后显数据

## 动画

- 坐标轴与网格线淡入
- 散点从 r=0 弹性放大，尺寸随 Y 值轻微变化
- 点标签在点放大后上滑出现
- 趋势线最后淡入
- 结尾场景淡出

## Avoid

- 不使用气泡 3D 效果
- 不使用阴影或 glow
- 不使用彩色渐变
