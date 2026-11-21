# footage-glyph · 视频填充文字开场（模式特效）

文字是蒙版上的透明区域（VIDEO × MASK，SVG mask：白底 + 黑色字形）。静态 video 标签带默认 src（0.6.x 视频槽三硬要求），场景无提前淡出。锚点字母定中，其余 ±1500px 两侧 power3.out 归位 1.15s；1.8s 起上下两半（clip-path 各半）反向退场；2.2s 起 scale→1.055 推近。定格纯视频画面。

- 变量: word, video1, anchorIndex, splitAmount, pushScale, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
