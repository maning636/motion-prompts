# transition-raindrop-reveal · 雨滴扩散转场（模式特效）

蒙版作用在上层图（NEXT）。三拍：DROP 竖椭圆 rx24/ry46 origin top 落下 0.5s → IMPACT 收圆 0.18s（落点高光只亮一拍）→ SPREAD 同一个圆荡开铺满 1.35s，羽化 14→62（CSS radial-gradient mask 软边带）。SETTLE：blur 16→0 / scale 1.06→1.00 轻落定。演完定格新图全屏。

- 变量: img1, img2, dropX, dropY, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
