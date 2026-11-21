# 韦恩图视觉规范

## 方向

三圆相交，中心交集承载“灵魂名词”，主集合用 accent 高亮，适合展示跨学科 / 跨能力角色的复合性。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Circle fill: `rgba(244,239,231,0.03)`
- Accent circle fill: `rgba(0,255,0,0.10)`
- Stroke: `rgba(244,239,231,0.18)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 集合名：28px，700
- 中心名：34px，700
- 中心副标：16px，opacity 0.5

## Layout

- 标题区 + SVG 韦恩图
- 三圆呈等边三角形分布
- 中心标签在三圆交集处

## Motion

- 标题入场
- 三圆从中心依次放大弹出
- 集合名淡入
- 中心名词弹入
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、渐变
- 集合数固定为 3
