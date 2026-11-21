# hero3d-float-cards · 3D 浮动卡片开场（3D Hero 验证）

纯黑底 + 正绿强调（暗色系）。perspective 1400px，4 卡 translateZ -60..140 散布，标题 z 220 最前；wrapper rotateX 16→5 / rotateY -18→6 模拟运镜 2.6s 后定格。验证 CSS 3D 在渲染管线的出片正确性。

- 变量: title, cards, accent, img1, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
