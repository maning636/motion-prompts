# book-page-turn · 书页翻页转场（沿书脊掀起）

纸白 #F6F5EF + 36px 细网格底，顶部细线页眉 + 底部荧光绿署名条。中央 600×800 双页叠放（3px 墨黑边 + 18px 硬偏移投影）：A 页在上、B 页压暗垫底。翻页段 A 页 transform-origin 左书脊 rotateY -12°→-104°（先压后掀两段速），卷边阴影同步亮起，B 页压暗层渐消 + scale 1.025 回弹；落定后荧光绿书签带 back.out 从右缘抽出。配 ⟲ 翻页提示（翻页前淡出）。

- 变量: vol, pageno, hint, imgA, imgB, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 入场 0-0.8s，翻页 1.15-2.6s，书签 2.6s，之后呼吸定格，无收尾 fade-out
