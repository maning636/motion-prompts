# 代码编辑器视觉规范

## 方向

模拟代码编辑器窗口，含文件头、行号、语法高亮与当前行 accent 高亮，适合演示代码片段和教学。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Editor border: `rgba(244,239,231,0.18)`
- Line highlight: `rgba(0,255,0,0.10)`

## Typography

- 文件名：16px，600
- 语言：14px，opacity 0.45
- 代码：24px，行高 1.7
- 行号：24px，opacity 0.35

## Layout

- 居中编辑器 1400px 宽
- 顶部窗口标题栏 + 三圆点
- 左侧行号 72px，右侧代码区

## Motion

- 编辑器整体弹入
- 标题栏淡入
- 行号依次出现
- 代码行从左滑入
- 高亮行闪烁后稳定
- 结束前整体上移淡出

## Avoid

- 不使用真实滚动、光标闪烁、复杂语法解析
- 代码建议 6–8 行
