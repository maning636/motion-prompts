# 大字海报视觉规范

## 方向

全屏大字章节封面 / 标题镜头。用字体本身的尺度和字重对比做视觉锤，不加装饰性插图。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.55)`

## Typography

- 主标题：`IBM Plex Mono` 700，210px，大写，letter-spacing -0.04em
- 强调词：`IBM Plex Mono` 700 italic，同尺寸，accent 色
- 副标题：`IBM Plex Mono` 400，36px，Muted 色
- 章节编号：`IBM Plex Mono` 500，20px，letter-spacing 0.22em，大写

## Layout

- 画面安全边距：96px
- 主标题居左，占据画面中心偏上
- 章节编号 + 1px  hairline 位于顶部
- 底部 72px 宽 accent 短杠作为节奏锚点

## Motion

- 编号与顶线先入场
- 主标题从下方 60px 滑入
- 副标题滞后 0.5s 入场
- 底部短杠最后弹出
- 结束前 0.6s 整体上移淡出

## Avoid

- 不使用背景图、纹理、渐变
- 不在主标题区域叠加其他元素
- 不使用描边字或阴影
