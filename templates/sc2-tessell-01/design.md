# sc2-tessell-01 · 马赛克格重构

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 SC2 栏目 + 右 P.304/400 页码 mono）；中央 1400×740 信息页卡（白底 + 3px 墨黑边 + 16px 硬偏移投影）上覆 6×4 马赛克格阵列（纸白/浅灰/荧光绿杂色 + 2px 墨黑描边）。节拍：格块以对角线距离错峰 back.out 浮现（初始 scale 0.9 留缝）→ 全部格块 scale 0.9→1 格缝收拢 → 沿对角线错峰 rotateY -95° 翻面淡出（0.09s/格，transformPerspective 1600）露出信息页 → 页内眉题、96px 大标题（尾部荧光绿高亮词色块 scaleX 扫入）、两行说明依次 y+34 上浮落定。底部荧光绿署名条（@老马AI研习社）推入。

- 变量: kicker, title, hl（高亮词）, desc（；分两行）, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold + IBM Plex Mono（本地硬链接）
- 动效: 动效段 0-4.6s，信息页落定后保持最后一帧，无收尾 fade-out
