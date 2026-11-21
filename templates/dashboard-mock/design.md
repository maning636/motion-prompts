# 仪表盘 Mock 视觉规范

## 方向

模拟数据仪表盘界面，含顶部 KPI 卡片与底部迷你趋势图，适合演示实时指标监控。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Card background: `rgba(244,239,231,0.04)`
- Card border: `rgba(244,239,231,0.12)`
- Positive: `#A8C9BF`

## Typography

- 标题：64px，700
- KPI 数值：56px，800
- KPI 标签：18px，600
- 图表标签：14px

## Layout

- 标题区 + 3 个 KPI 卡片横向排列
- 下方一个迷你趋势图卡片

## Motion

- 标题入场
- KPI 卡片依次弹入
- 数值滚动/淡入
- 趋势图绘制
- 结束前淡出

## Avoid

- 不使用真实数据
- 不添加复杂交互元素
