# petal-mask-rotate · 花瓣蒙版旋转换场（模式特效）

构图三段：全屏压暗底图（brightness .55 + bgZoom 1.05 视差不硬推）+ 左侧标题区（大标题/英文小标/逗号两行文案/分割线/署名）+ 右半部局部花瓣窗口（圆形区圆心 68% 宽、52% 高，直径 62% 画面高，细白圈描边，窗口外保持压暗底图）。r=R·(0.60+0.40·cos(p·θ)) 八瓣路径，mask userSpaceOnUse 钉在窗口、内部 g 旋转 360°/2s 匀速——窗口在扫、窗里景物不动；内外两圈同角同速（内圈 smallScale 0.62 实边、外圈羽化 19.5 + 发散 7.6）。新图 pushLag 0.28s 晚半拍 y:1080→0 与旋转同终点（power2.out），推的是窗口内图像、蒙版原地。描边=同路径 stroke 作遮罩露新图像素，换图自动取色。到位定格末帧，无 fade-out。

- 变量: img1, img2, title, enTitle, desc, sign, petals, spinDur, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
