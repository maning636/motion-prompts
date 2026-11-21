# chapter-nav-player · 章节导航播放器（教学外壳）

深色设计规范文档风 #0E100F + 荧光绿 #00FF00。顶部导航节点列由章节数组生成（圆点 mono 序号+章节名，当前章绿底黑字+glow，节点间 96×2 细线 scaleX 展开）；左侧 accent 幽灵大序号 300px + CHAPTER 0X/0N kicker + 76px 标题 + mono 英标 + 解说；右侧 1000×630 演示窗（image 槽 cover + 底部压暗渐变 + 四角取景框 back.out 弹入 + 窗顶 ● CHAPTER 0X · LIVE DEMO 小字）。元素 0.2–1.3s 依序入场后定格。

- 变量: chapters, current, title, sub, desc, img1, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
