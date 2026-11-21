# 字幕高亮视觉规范

## 方向

A-roll 下三分之一字幕条，整句居中显示，关键词用 accent 色高亮，适合强调口播中的核心术语。

## Palette

- Transparent background（默认导出带透明通道）
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Bar background: `rgba(18,16,14,0.82)`
- Border: `rgba(0,255,0,0.38)`

## Typography

- 说话人：20px，700，accent
- 主字幕：38px，700
- 高亮词：同字号，accent

## Layout

- 底部居中，距下边距 120px
- 字幕条宽度最大 1400px，圆角 16px
- 说话人标签在左上角小幅外凸

## Motion

- 字幕条从下方滑入
- 高亮词在整句出现后再 accent 闪烁/加粗强调
- 结束前整体淡出

## Avoid

- 不使用全屏背景
- 关键词高亮不超过 2 处
