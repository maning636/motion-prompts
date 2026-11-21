# 并行 / 汇合流程视觉规范

## 方向

顶部 Coordinator 同时分叉到多个并行 Worker，底部汇合为 Merge 节点，强调并发与同步等待。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Border: `rgba(244,239,231,0.18)`
- Link: `rgba(244,239,231,0.14)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 副标题：24px，opacity 0.55
- 节点名：22px，600

## Layout

- 标题区 + SVG 流程区
- Coordinator 居中顶部，Worker 横向等距排列，Merge 居中底部
- 节点框 200–280×72px，连线用 path 绘制

## Motion

- 标题入场
- 节点依次缩放弹出
- 连线从上游到下游依次生长
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、glow
- Worker 数建议 2–5，过多会拥挤
