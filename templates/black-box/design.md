# 黑盒图视觉规范

## 方向

输入 → 带问号的黑盒 → 输出，强调中间过程不可解释，适合讲解 LLM / 神经网络等黑盒系统。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Box fill: `rgba(0,255,0,0.06)`
- IO border: `rgba(244,239,231,0.18)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 问号：120px，700
- IO 标签：28px，600
- 黑盒副标：18px，opacity 0.6

## Layout

- 标题区 + 水平流程图
- 输入框、箭头、黑盒、箭头、输出框横向居中排列

## Motion

- 标题入场
- 输入框从左侧滑入
- 箭头依次出现
- 黑盒弹入，问号放大
- 输出框从右侧滑入
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、内部流程细节
