# 时序图视觉规范

## 方向

标准 UML 时序图：顶部参与者，垂直虚线生命线，水平消息箭头。用于展示 API 调用、交互流程、多系统协作。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- Actor fill: `#211C18`
- Actor stroke: `#3A3029`
- Lifeline: `#3A3029`
- Message: Accent

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 参与者：`IBM Plex Mono`，字重 600，20px
- 消息标签：`IBM Plex Mono`，字重 500，18px

## 布局

- 画布安全边距：96px 112px
- 图表区域：1696×640
- 参与者均匀分布
- 参与者框 160×48，圆角 6px
- 生命线为虚线，从参与者框底部延伸至底部

## 动画

- 标题淡入
- 参与者框与名称依次出现
- 生命线逐条淡入
- 消息箭头与标签按顺序出现
- 结尾场景淡出

## Avoid

- 不使用激活条（activation bar）
- 不使用阴影或 glow
- 消息箭头不超过 8 条
