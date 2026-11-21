# sc2-quadrant-01 · 四分屏平行场景

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右 P.395/400 页码 mono），中央 2×2 四分格（每格 738×348 纸白卡、3px 墨黑边 + 10px 硬偏移投影，内排 mono 序号 + 44px 标题 + 一句说明 + 150px 墨黑简笔画 SVG）。四格错拍 y+60 入场后，四路简笔画 stroke-dashoffset 并行描画（起笔各错 0.15s）；2.4s 起荧光绿 6px 粗框（带 NOW·0n 绿标签）每 1.2s expo 跳到下一格，其余格纸白叠层 0.72 压暗，第四格定格聚焦到结束。底部荧光绿署名条（@老马AI研习社）推入。源卡 quad-split-parallel-scenes 差异化：蒙太奇错拍改绿框轮焦、灰阶底改纸感卡。

- 变量: kicker, cells, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 0-6.0s，之后第四格定格聚焦，无收尾 fade-out
