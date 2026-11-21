# Hub & Spoke 视觉规范

## 方向

中心 Hub 圆环，外围 6 个 Spoke 辐射分布，重点 Spoke 用 accent 连线与圆点高亮，适合展示中心化系统与工具集成。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Spoke dot default: `rgba(244,239,231,0.18)`
- Line default: `rgba(244,239,231,0.12)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- Hub 名：32px，700
- Spoke 名：26px，500

## Layout

- 标题区 + 辐射图
- Hub 居中，Spoke 均匀分布在圆周
- 连线从 Hub 指向每个 Spoke

## Motion

- 标题入场
- Hub 从中心弹出
- 连线依次从中心向外生长
- Spoke 依次弹出
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、曲线
- Spoke 数建议 4–6
