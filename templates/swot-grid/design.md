# SWOT 四宫格视觉规范

## 方向

2×2 战略分析网格，S/O 用 accent 色传递正向，W/T 用中性色，整体保持编辑感。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.5)`
- Cell border: `rgba(244,239,231,0.12)`
- Positive cell border: accent 28% 透明度

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 副标题：`IBM Plex Mono` 400，28px，Muted 色
- 字母 S/W/O/T：`IBM Plex Mono` 700，72px
- 象限名：`IBM Plex Mono` 500，18px，letter-spacing 0.16em，大写
- 列表项：`IBM Plex Mono` 400，24px

## Layout

- 顶部标题区 + 下方 2×2 网格
- 网格高度 720px，gap 24px
- 每个 cell 内边距 36px 40px
- S/O 字母用 accent 色，W/T 用 foreground

## Motion

- 标题先入场
- 四个 cell 依次从下方弹入，错位 0.15s
- 每格内部：字母 → 象限名 → 列表项依次淡入
- 结束前整体上移淡出

## Avoid

- 不用圆点列表，统一用短横线前缀
- 不用竖线分隔
- 每格不超过 4 条
