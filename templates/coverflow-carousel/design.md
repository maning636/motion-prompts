# coverflow-carousel · 3D 封面流轮转（模式特效）

深色底 + perspective 1500px。四联映射同一条规则：rotateY=clamp(-55,-d*25,55)、scale=max(.72,1.16-|d|*.17)、z=min(|d|,5)*-130、brightness=max(.38,1-|d|*.18)、|d|>4.5 隐藏。pos 0→focus 2.5s power4.out 减速；定格 focus 0→1 0.9s：中心放大 1.12 + 金色光晕，其余压暗 + 四周 vignette。

- 变量: title, img1, img2, img3, img4, img5, img6, focusIndex, glowColor, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
