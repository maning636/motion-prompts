# 类比框视觉规范

## 方向

把陌生概念左右对应到熟悉事物，用 `≈` 连接，帮助观众用已知理解未知。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.45)`
- Card border: `rgba(244,239,231,0.14)`

## Typography

- 卡片标签：`IBM Plex Mono` 500，16px，letter-spacing 0.18em，大写
- 概念名：`IBM Plex Mono` 700，82px，letter-spacing -0.03em
- 概念解释：`IBM Plex Mono` 400，28px，Muted 色
- 连接符 `≈`：`IBM Plex Mono` 700，120px，accent 色
- 底部维度提示：`IBM Plex Mono` 500，22px

## Layout

- 左右两张等宽卡片，中间 56px 间隙放 `≈`
- 卡片边框 1px，圆角 8px，内边距 64px 56px
- 底部居中显示类比成立维度

## Motion

- 左卡从左侧滑入，标签、概念、解释依次淡入
- 连接符弹性缩放出现
- 右卡从右侧滑入，节奏与左卡对称
- 底部维度提示最后出现
- 结束前整体微缩放淡出

## Avoid

- 不用箭头，只用 `≈`
- 卡片内不超过 3 行解释
- 不用装饰图标或插图
