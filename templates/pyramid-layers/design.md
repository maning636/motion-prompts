# 金字塔层级视觉规范

## 方向

三层金字塔，顶层最窄并强调，逐层向下变宽，适合战略 / 方法 / 执行等层级结构表达。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Layer fill: `rgba(244,239,231,0.03)`
- Accent layer fill: `rgba(0,255,0,0.12)`
- Stroke: `rgba(244,239,231,0.18)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 层名：26px，700
- 层描述：18px，opacity 0.55
- 层级编号：16px，opacity 0.3

## Layout

- 标题区 + SVG 金字塔
- 金字塔居中，宽 760px
- 每层高度相等，顶部对齐中心

## Motion

- 标题入场
- 金字塔层从上往下依次展开
- 文字与编号依次淡入
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、渐变
- 层数建议 3，最多 4
