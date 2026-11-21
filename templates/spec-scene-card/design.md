# spec-scene-card · 设计规范场景卡（教学外壳）

深色规范风旗舰版式。左上 180px accent 幽灵编号（opacity .14）+ SCENE 0X/11 + 62px 中标题 + mono 英标；右上时间码双行 mono 小字；左 560×560 参数面板（名称/accent 值逐行 x 入场）；右 1130×560 LIVE 窗（image 槽 + ● LIVE RESULT 签 + 取景框角标）；底部时间轴条 DROP/IMPACT/SPREAD 三段绿阶 + HOLD 灰段 scaleX stagger 展开。定格全要素。

- 变量: sceneNo, title, en, params, img1, timeRange, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
