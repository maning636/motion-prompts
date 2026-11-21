# 音频波形视觉规范

## 方向

用于口播/播客类视频的声音可视化。标题区 + 条形波形，强调声音与画面节奏同步。

## Palette

- Background: `#12100E`
- Accent: `#00FF00`
- Foreground: `#F4EFE7`

## Typography

- 标题：`IBM Plex Mono`，72px，Bold
- 副标题：`IBM Plex Mono`，28px，Regular，透明度 0.55

## 布局

- 标题区居上，波形区居下
- 波形条宽度 14px，圆角 7px
- 默认 32 根条，横向居中排列

## 动画

- 标题与副标题依次上移淡入
- 波形条从中心向两侧弹性生长
- 生长完成后进入循环波动

## Avoid

- 不使用渐变色
- 不使用复杂背景
