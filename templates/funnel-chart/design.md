# 漏斗图视觉规范

## 方向

4 层漏斗，每层标注阶段名与转化率，适合展示用户转化、销售漏斗或筛选过程。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Layer fill: `rgba(244,239,231,0.06)`
- Accent layer fill: `rgba(0,255,0,0.12)`
- Border: `rgba(244,239,231,0.18)`

## Typography

- 标题：64px，700
- 阶段名：24px，700
- 转化率：18px，600，accent

## Layout

- 标题区 + 居中漏斗
- 4 层梯形自上而下收窄
- 每层左侧阶段名，右侧转化率

## Motion

- 标题入场
- 漏斗层从上到下依次展开
- 转化率数字淡入
- 结束前淡出

## Avoid

- 不使用 3D、阴影、渐变
- 层数固定为 4
