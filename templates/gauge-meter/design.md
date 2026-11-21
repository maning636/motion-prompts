# 仪表盘视觉规范

## 方向

半圆形仪表盘，用指针位置或填充弧长表示单一指标。适合健康度、完成率、评分等关键单值。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `#6B7280`
- Bright muted: `#6B7280`
- Track: `#211C18`

## Typography

- 标题：`IBM Plex Mono`，字重 700，72px
- 副标题：`IBM Plex Mono`，字重 400，32px，Muted 色
- 数值：`IBM Plex Mono`，字重 700，120px
- 单位：`IBM Plex Mono`，字重 500，36px
- 分区标签：`IBM Plex Mono`，22px，Muted 色

## 布局

- 标题居中
- 仪表盘宽度 720px，半圆朝上
- 轨道背景色 `#211C18`
- 低 / 中 / 高 三段弧线
- 底部三个分区标签均匀分布

## 动画

- 标题、副标题淡入
- 三段弧线依次点亮
- 数值从 0 滚动到目标值
- 结尾场景淡出

## Avoid

- 不使用 3D 仪表盘
- 不使用阴影或 glow
- 不使用复杂纹理
