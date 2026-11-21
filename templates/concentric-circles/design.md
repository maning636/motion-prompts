# 同心圆视觉规范

## 方向

3 层同心圆，由内到外依次展开，适合表达嵌套范围、影响力层级或系统边界。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Ring fill: transparent
- Ring stroke: `rgba(244,239,231,0.18)`
- Accent ring stroke: var(--accent)

## Typography

- 标题：64px，700
- 层级标签：22px，700

## Layout

- 标题区 + 居中同心圆
- 3 个圆环从内到外半径递增
- 每层右侧或下方标注标签

## Motion

- 标题入场
- 圆环从中心向外依次绘制/放大
- 标签依次弹出
- 结束前淡出

## Avoid

- 不使用 3D、阴影、渐变
- 圆环数固定为 3
