# 概念等式视觉规范

## 方向

A + B = C 的教科书式等式布局，左右两侧为输入要素，右侧为结果，结果用 accent 高亮，适合表达两个要素组合产生结果。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Term border: `rgba(244,239,231,0.18)`
- Result fill: `rgba(0,255,0,0.08)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 要素名：36px，700
- 要素副释：20px，opacity 0.55
- 运算符：72px，700

## Layout

- 标题区 + 水平等式
- 等式居中，项之间间距 40px
- 结果项用 accent 边框和背景

## Motion

- 标题入场
- 左侧 A 滑入
- 加号弹出
- 左侧 B 滑入
- 等号弹出
- 结果项从右侧强调滑入
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、渐变
- 等式保持简洁三元素
