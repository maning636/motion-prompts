# 环形图视觉规范

## 方向

4 块以内的占比构成图，中心数字成为视觉锚，右侧图例辅助阅读。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted tiers: `rgba(244,239,231,0.55)` / `0.30` / `0.14`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 中心数字：`IBM Plex Mono` 700，72px，accent 色
- 中心标签：`IBM Plex Mono` 500，22px，Muted 色
- 图例文字：`IBM Plex Mono` 500，24px
- 图例百分比：`IBM Plex Mono` 700，24px

## Layout

- 左侧标题区
- 中间 520×520 环形图
- 右侧图例，4 项以内
- 环形 stroke 36px，圆角线帽

## Motion

- 标题入场
- 各段弧形依次描边展开
- 中心数字缩放弹入
- 图例依次从右侧滑入
- 结束前整体上移淡出

## Avoid

- 分段超过 4 块
- 使用饼图替代环形图
- 图例超过 4 项
