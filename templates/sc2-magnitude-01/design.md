# sc2-magnitude-01 · 数值错落充能

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 SC2 栏目 + 右 P.302/400 页码 mono），居中眉题；3-4 张 372×480 纸感数值卡（白底 + 3px 墨黑边 + 10px 硬投影）从底部 y+260 错峰升起（0.28s/张，expo.out），落位后数值从 0 以 power2.out 充能跳到真值（千分位格式化，1.4s），卡底荧光绿刻度线 scaleX 扫入；全部落定后最大者荧光绿描边 + 绿影替换黑影 + back.out 轻微放大 1.045 定格。底部荧光绿署名条（@老马AI研习社）推入。

- 变量: kicker, items（标签|数值，分号分隔，≤4 项）, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold + IBM Plex Mono（本地硬链接）
- 动效: 动效段 0-3.8s，胜者定格后保持最后一帧，无收尾 fade-out
