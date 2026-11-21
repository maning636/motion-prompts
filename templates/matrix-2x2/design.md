# 2x2 矩阵视觉规范

## 方向

十字轴把画面分成四象限，每个对象按两个维度坐标落入对应位置，适合模型 / 产品 / 策略定位。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Axis: `rgba(244,239,231,0.18)`
- Grid: `rgba(244,239,231,0.08)`
- Quadrant label: `rgba(244,239,231,0.25)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 副标题：24px，opacity 0.55
- 轴端标签：18px，opacity 0.5
- 象限标签：20px，700
- 对象标签：20px，600

## Layout

- 标题区 + 矩阵区
- X 轴在底部，Y 轴在左侧
- 象限标签分布四角
- 对象用圆点 + 右侧名称标注

## Motion

- 标题入场
- 轴线从原点向外生长
- 网格淡入
- 象限标签淡入
- 对象点依次弹出
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、渐变
- 对象建议 4–8 个
