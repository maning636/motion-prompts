# bar-chart-race-smooth · 排名竞速条形图（模式特效）

深色底 #070907 + 荧光绿 #00FF00。竞速三原则照拆解文档：①数值相邻两年平滑插值 ②名次本身当平滑数值（pos 每帧向目标名次逼近 0.14）③全部挂同一根主 progress（2.8s 匀速），年份计数器 280px MiSans 荧光绿。演完定格末帧。

- 变量: title, items, data, yearStart, yearEnd, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
