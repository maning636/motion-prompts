# transition-raindrop-loop · 多图雨滴连续轮换（模式特效）

沿用 transition-raindrop-reveal 的 radial-gradient mask 三拍（DROP 0.5s → IMPACT 0.18s → SPREAD 1.35s，羽化 14→62，glint 高光一拍，blur 16→0/scale 1.06→1 落定）。5 层叠放 L0..L4（L4=图1 回环），上层初始 mask 悬于画面外；每滴 t0=0.2+k*dropDur，计数器在 applyMask 内同步（seek-safe）。末滴 9.1s 铺满后定格首图。

- 变量: img1, img2, img3, img4, drops, dropDur, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
