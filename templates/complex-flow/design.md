# 复杂流程视觉规范

## 方向

6-9 步线性 pipeline 流程图，可标每步耗时并高亮核心 cluster。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.5)`
- Track / border: `rgba(244,239,231,0.10~0.18)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 节点名：`IBM Plex Mono` 700，24px，大写
- 耗时：`IBM Plex Mono` 500，16px
- 步骤编号：`IBM Plex Mono` 500，14px，letter-spacing 0.12em

## Layout

- 标题区 + 流程区
- 节点横向等距分布，节点框 220×120px
- 节点之间用基线连接
- 高亮节点边框和背景用 accent 色

## Motion

- 标题入场
- 基线从左到右生长
- 节点依次从下方弹入
- 高亮节点保持 accent 状态
- 结束前整体上移淡出

## Avoid

- 步骤数建议 5-7，过多会拥挤
- 不使用 3D 管道、弯曲连线
- 不添加图标装饰
