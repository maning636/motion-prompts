# 循环流程视觉规范

## 方向

4 个节点环形排列，箭头连接形成闭环，中心写退出条件，适合表达迭代优化与循环反馈。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Node fill: `rgba(244,239,231,0.04)`
- Accent node fill: `rgba(0,255,0,0.10)`
- Link: `rgba(244,239,231,0.14)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 节点名：22px，600
- 中心退出条件：26px，700
- 中心副标：18px，opacity 0.5

## Layout

- 标题区 + SVG 环形图
- 4 个节点均匀分布在圆周
- 弧线箭头连接，方向顺时针
- 中心放置退出条件

## Motion

- 标题入场
- 弧线箭头依次绘制
- 箭头头部依次出现
- 节点依次弹出
- 中心退出条件弹入
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、渐变
- 步骤数固定为 4
