# parallax-album-intro · 视差滑动相册开场（模式特效）

目录栏 560×1080 #f8f5ed + 36px 网格，x:-560 推入 expo.out 0.62s 后锁死。相框 1120×630：x:240→0 + scale 0.92→1 + blur 12→0 三联动 expo.out 0.78s；同源背景 blur 20px + 暗 wash rgba(7,9,10,.3)，x:46→0 + scale 1.18→1.1 sine.out 1.78s（1/5 位移、2 倍时长 = 视差）。切换点 1.8/4.1/6.4s（interval 2.3），目录行 0.42→1 点亮。

- 变量: title, prompt, items, img1, img2, img3, img4, interval, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
