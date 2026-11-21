# Kanban 看板视觉规范

## 方向

四列任务看板，每列显示任务卡片数，焦点列用 accent 边框高亮，适合展示 Sprint 状态和 workflow 可视化。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Column border: `rgba(244,239,231,0.12)`
- Card border: `rgba(244,239,231,0.10)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 列名：18px，700，letter-spacing 0.12em
- 卡片：20px，500
- 计数：16px，opacity 0.45

## Layout

- 标题区 + 四列网格
- 列等宽，间距 24px
- 卡片纵向堆叠，间距 14px

## Motion

- 标题入场
- 列从左到右依次弹入
- 每列卡片依次下落
- 焦点列最后微强调
- 结束前整体上移淡出

## Avoid

- 不使用拖拽动效、阴影、头像
- 列数建议 4，卡片每列 2–4 张
