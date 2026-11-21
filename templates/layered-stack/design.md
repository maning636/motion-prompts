# 分层堆栈视觉规范

## 方向

7 层横向条带从下到上堆叠，聚焦层用 accent 边框和背景高亮，适合系统架构 / OSI / AI 应用栈讲解。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Layer border: `rgba(244,239,231,0.14)`
- Focus layer fill: `rgba(0,255,0,0.10)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 层名：26px，600
- 层级编号：18px，opacity 0.4

## Layout

- 标题区 + 堆栈区
- 7 层等宽条带，垂直居中排列
- 聚焦层高度略大

## Motion

- 标题入场
- 层从下到上依次从左侧滑入
- 聚焦层最后微放大强调
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、渐变
- 层数建议 5–7
