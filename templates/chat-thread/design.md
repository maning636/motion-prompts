# 对话流视觉规范

## 方向

模拟 LLM 或聊天应用的多轮对话界面。左右交替气泡，适合展示 Agent 交互、问答过程、对话式产品演示。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- User bubble: `#3A3029`
- Assistant bubble: `#211C18` with `#3A3029` border

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 消息气泡：`IBM Plex Mono`，24px，行高 1.5
- 头像标识：`IBM Plex Mono`，14px，字重 700

## 布局

- 画布安全边距：96px 112px
- 对话区域最大宽度 1240px
- 用户消息右对齐，AI 消息左对齐
- 气泡间距 28px，头像 48px
- 气泡圆角 12px，内侧小圆角指向头像

## 动画

- 标题、副标题淡入
- 每条消息依次从下方弹出
- 结尾场景淡出

## Avoid

- 不使用真实头像图片
- 不使用输入框和发送按钮
- 不使用滚动条动画
