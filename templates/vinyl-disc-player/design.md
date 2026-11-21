# vinyl-disc-player · 碟片播放器场景（模式特效）

深底 #0d0f0d + 金 #f3d394 + 纸白（原型 acceptance/vinyl-prototype-ref.html 移植）。同封面四用：放大铺底（brightness .76 + tint + vignette）、底部 scaleY(-1) 镜面倒影（blur 2.5 + 横向细纹 + mask 渐隐）、556px 方形封面、556px 半透明碟（opacity .82 + repeating-radial 同心纹 + conic 高光）。hub 为多层 radial 透明 CD 环 + backdrop blur 2.4 + 非对称乳白高光（mix-blend screen）。0.6.x 契约禁 CSS infinite：全部运动挂主 paused timeline 的 master onUpdate 按 t 确定性求值——碟 14s/圈匀速、歌词 2s/行上滚当前句金色 36px 光晕（cur/near 类切换）、56 柱 scaleY 确定性周期相位、倒影细纹 4.8s 往返；6s 约推进 3 行后定格末帧，无 fade-out。

- 变量: img1, song, artist, lyrics, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
