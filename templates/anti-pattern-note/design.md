# anti-pattern-note · 反例警示双卡（教学外壳）

深色规范风。双卡 830×660：错误侧 #171110 + #FF5147 描边/顶条/✗印章，正确侧 #0F1710 + accent 描边/顶条/✓印章；顶部 250px 图槽条（image×2，占位图兜底画面仍完整），印章盖在图右上。卡从 ±80px 撞入，顶条 scaleX 展开，印章 scale 0→1 带 ±18° 回旋 back.out(2.2) 盖章。定格双卡对照。

- 变量: title, wrong, correct, img1, img2, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
