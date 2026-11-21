# 网格地图视觉规范

## 方向

大规模节点网格，用颜色映射 active / idle / error 三类状态，顶部汇总数字，适合 GPU 集群 / 服务拓扑监控。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Active: `#00FF00`
- Idle: `rgba(244,239,231,0.25)`
- Error: `#C0392B`
- Empty: `rgba(244,239,231,0.08)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 统计数字：36px，700
- 统计标签：16px，opacity 0.5

## Layout

- 标题区 + 状态汇总 + 节点网格
- 网格居中，每格 28px，间距 8px
- 列数可配置

## Motion

- 标题与汇总依次入场
- 节点网格逐个缩放弹出
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、连线
- 总节点建议 36–72
