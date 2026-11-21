# 谱系图视觉规范

## 方向

水平轴两端标注对立维度，多个对象按位置分布在轴上，适合展示模型/工具/策略的连续差异。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Axis: `rgba(244,239,231,0.25)`
- Marker fill: `rgba(0,255,0,0.15)`

## Typography

- 标题：64px，700
- 维度标签：24px，700
- 对象名：20px，600

## Layout

- 标题区 + 居中水平轴
- 两端为对立维度标签
- 4-6 个对象 marker 分布在轴上

## Motion

- 标题入场
- 轴线从左到右绘制
- marker 依次落下/弹入
- 结束前淡出

## Avoid

- 不使用 3D、阴影、渐变
- marker 不重叠
