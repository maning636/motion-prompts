# 浏览器 Mock 视觉规范

## 方向

干净的浏览器窗口镜头，模拟网页落地页或博客文章。用于展示产品界面、网页内容、URL 结构。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- Bright muted: `#6B7280`
- Panel: `#211C18`
- Line: `#3A3029`

## Typography

- 页面标题：`IBM Plex Mono`，字重 600，18px，大写，字间距 0.12em
- 大标题：`IBM Plex Mono`，字重 700，64px
- 正文：`IBM Plex Mono`，字重 400，28px，Bright muted 色
- URL 地址栏：`IBM Plex Mono`，15px，Muted 色

## 布局

- 浏览器窗口宽度 1520px，居中
- 圆角 12px，细边框
- 头部高度 56px，三个系统圆点 + URL 输入框
- 内容区 padding 60px 80px
- 配图区域可选，默认显示占位文字

## 动画

- 浏览器窗口从下方淡入
- URL 地址栏文字打字机效果
- 页面标题、大标题、正文段落依次出现
- 配图区域最后上滑出现
- 结尾场景淡出

## Avoid

- 不使用真实浏览器截图，保持矢量风格
- 不使用滚动动画
- 不使用阴影或 glow
