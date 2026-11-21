# cream-webcam-overlay

- 构图：Canvas 底 + 10px Ink 外框；角落一枚 Paper 圆形摄像头贴纸（4px Ink 描边 + 硬投影），四角可选（top-right 默认），遵守 120/74/168 安全区；mono 角标 CAM 01。
- 动效：外框淡入 → 圆形 back.out(1.4) 弹性落位 → 一次 1.035 强调 → Lime 小三角指示器最后弹出锁定 → 5.5s 整体淡出 0.28s。
- 变量：position / size / borderWidth / showPip（已丢弃 accent/background/foreground 颜色变量，奶油调色板固定）。
- 字体：camera mask 与角标用 IBM Plex Mono 20px 元数据层级；无 @font-face、无本地 ttf。
