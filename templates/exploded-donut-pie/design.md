# exploded-donut-pie · 挤出环形爆炸饼图（模式特效）

深色底 #080A08。SVG viewBox 860：底座整环下移 26px 深色金属体充挤出厚度，每扇区外侧壁 path（shade .22）+顶面（accent 明度梯度 1.0/.55/.8/.4…），金属外圈 linearGradient 灰白渐变 stroke。旋入 rotation -150→0 scale .55→1 power3.out 1.1s；扇区沿角平分线外移 34px+上抬 10px back.out(1.8) 顺时针 stagger .16；引导线 polyline + 标签 + accent 百分比 2.15s 起 stagger .12 浮出。定格末帧。

- 变量: title, data, labels, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
