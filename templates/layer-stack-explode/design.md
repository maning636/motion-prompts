# layer-stack-explode · 图层爆炸分解图（教学外壳）

深色规范风。stage perspective 1700px，tilt 容器 rotateX(56deg) rotateZ(-34deg) 等轴角（入场动效作用在外层 stage 避免覆盖 transform）；层卡 680×420 rgba(18,22,19,.94)+accent 描边，初始 z 间隔 9px，0.75s 起 stagger .12 expo.out 炸到 z 间隔 66px；中间层嵌 image 槽图；右侧 L0N→L01 层号清单 accent 序号 stagger 列出。定格爆炸态。

- 变量: title, layers, img1, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
