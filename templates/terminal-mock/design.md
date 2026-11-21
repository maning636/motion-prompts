# 终端 Mock 视觉规范

## 方向

模拟 CLI 终端窗口，命令 + 打字机光标 + 元数据输出，适合演示 CLI 工具、API 调用。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.45)`
- Terminal border: `rgba(244,239,231,0.18)`

## Typography

- 终端内文字：`IBM Plex Mono` 400，24px，line-height 1.6
- Prompt：`IBM Plex Mono` 700，24px，accent 色
- 光标：12×24px accent 色块，1s blink
- 窗口标题：`IBM Plex Mono` 400，15px，Muted
- 元数据：`IBM Plex Mono` 400，16px，Muted

## Layout

- 终端窗口居中，宽度 1400px
- 顶部 traffic-light 三点 + 标题
- 命令行 `$` prompt + 命令 + 光标
- 输出区换行保留
- 底部 tokens/延迟/成本元数据

## Motion

- 终端窗口从下方弹入
- 命令逐字打出（打字机效果）
- 输出区淡入
- 光标在命令打完后隐藏
- 元数据最后出现
- 结束前整体上移淡出

## Avoid

- 输出超过 12 行
- 使用真实滚动条
- 命令过长导致折行混乱
