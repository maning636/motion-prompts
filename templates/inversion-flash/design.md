# 反白闪屏视觉规范

## 方向

瞬间黑 ↔ 白反白切换，用于段落切换的修辞停顿或强调一句话的重音。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`

## Typography

- 重锤短句：`IBM Plex Mono` 700，140px，letter-spacing -0.03em

## Layout

- 文字绝对居中
- 安全边距 160px

## Motion

- 文字先轻微缩放入场
- 在指定时间点（默认 0.5s）用 `steps(1)` 瞬间反白
- 反白持续约 0.18s 后切回
- 整体 1.5s 后淡出

## Avoid

- 每支视频使用不超过 2 次
- 不连续使用
- 短句不超过 10 个中文字
