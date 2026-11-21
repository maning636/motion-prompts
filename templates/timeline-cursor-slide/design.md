# timeline-cursor-slide · 固定光标时间尺（模式特效）

深色底 #060806 + 荧光绿 #00FF00。刻度尺 div 由 JS 按起止年份生成（每年小刻度 22px、5 年大刻度 46px+mono 年份），translateX = 光标X - (当前年-起始年)*64px，挂主 progress 2.5s power1.inOut；光标为白色渐变竖线 origin bottom scaleY 生长 0.9s + 底部 radial 光晕 screen 混合。演完定格末帧。

- 变量: yearStart, yearEnd, title, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
