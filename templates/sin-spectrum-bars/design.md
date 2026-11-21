# sin-spectrum-bars · 正弦频谱柱组件（模式特效）

深底 #070907 + 柱色变量（默认荧光绿，带同色 box-shadow glow）。柱 16×340 圆头 origin bottom，scaleY = 0.12+0.88×(0.5-0.5cos(2π·ph))，T=0.75+(i%5)*0.12、相位 (i*0.13)%1.1 错开；speed 变量乘 t。禁 CSS animation / Math.random，全部 master onUpdate。入场容器 y+opacity，演完定格跳动中帧。

- 变量: bars, color, speed, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
