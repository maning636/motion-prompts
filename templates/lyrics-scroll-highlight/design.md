# lyrics-scroll-highlight · 歌词上滚高亮组件（模式特效）

深底 #0B0C0B 通用。窗口 1240×430 居中，webkit-mask 上下 22% 渐隐；行高变量（--lh），1.8s/行匀速 translateY，当前句 accent 色 800 字重 scale 1.12 + 同色光晕，相邻句 .66 白。全部运动挂 master onUpdate 按 t 求值，禁 CSS animation。演完定格当前句。

- 变量: lyrics, accent, lineHeight, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
