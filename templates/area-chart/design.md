# 面积图视觉规范

## 方向

强调累积量 / 容量增长，折线下方填充 accent 渐变，适合用户数、token 用量等累积指标。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.55)`
- Grid: `rgba(244,239,231,0.10)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 副标题：`IBM Plex Mono` 400，28px，Muted
- 轴标签：`IBM Plex Mono` 500，18px
- 数据来源：`IBM Plex Mono` 500，16px，Muted

## Layout

- 顶部标题区
- 下方折线/面积区
- Y 轴 5 条网格线
- 右下角数据来源

## Motion

- 标题/副标题入场
- 网格线、轴标签淡入
- 折线从左到右描边
- 面积填充同步显现
- 数据点依次弹出
- 结束前整体上移淡出

## Avoid

- 多条线对比（用 multi-line-chart）
- 数据有负值或剧烈波动
- 强调精确数值而非增长感
