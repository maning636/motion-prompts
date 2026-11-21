# toc-sidebar-spotlight · 纸感目录栏聚灯（教学外壳）

沿用 parallax-album-intro 目录栏语言：560×1080 #f8f5ed + 36px 网格 + 右侧硬投影，x:-560 推入 expo.out 0.62s 锁死；行 opacity .42，聚灯序列每 0.3s 一行 0.42→1（accent 左条 scaleY 同步），非当前行 0.24s 后压回，当前行保持。右侧暗舞台：420px accent 幽灵序号（.1）+ NOW 0X/0N + 92px 当前章名，聚灯到位时浮出。定格当前行点亮。

- 变量: items, current, title, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
