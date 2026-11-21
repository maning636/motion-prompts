# 树状图视觉规范

## 方向

根节点 → 分支 → 叶子节点的三层树状结构，适合展示分类、层级与继承关系。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Node fill: `rgba(244,239,231,0.05)`
- Accent node fill: `rgba(0,255,0,0.12)`
- Link: `rgba(244,239,231,0.18)`

## Typography

- 标题：64px，700
- 节点名：20px，600

## Layout

- 标题区 + 居中树状图
- 根节点在顶部
- 第二层 2 个分支
- 第三层 4 个叶子

## Motion

- 标题入场
- 根节点先出现
- 连线向下绘制
- 子节点依次弹出
- 结束前淡出

## Avoid

- 不使用 3D、阴影、渐变
- 保持三层结构
