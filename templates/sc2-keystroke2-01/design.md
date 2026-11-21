# sc2-keystroke2-01 · 纸感打字代码块

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 SC2 栏目 + 右 P.301/400 页码 mono），居中眉题，中央 1300×640 墨黑代码块卡片（3px 墨黑边 + 16px 硬偏移投影）y+90 expo.out 落位；mono 命令逐字敲入（0.055s/字，光标方块恒亮不闪），回车后光标熄灭一拍，结果行以荧光绿 mono 逐行 y+12 上浮展开（行间 0.45s），收尾光标复亮、卡片 ±6px 呼吸一次定格。底部荧光绿署名条（@老马AI研习社）推入。

- 变量: kicker, cmd, results（分号分隔结果行）, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold + IBM Plex Mono（本地硬链接）
- 动效: 动效段 0-4.5s，之后定格最后一帧，无收尾 fade-out
