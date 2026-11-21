# sc2-raster-01 · 扫描线标注聚焦

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右 P.396/400 页码 mono），左栏 kicker + 84px 大标题 + mono 状态牌（SCAN·00/01），右侧 600×800 竖版素材页（image 槽，3px 墨黑边 + 16px 硬偏移投影，-1.6° 微斜摆在纸感桌面）y+110 expo.out 落位。荧光绿 6px 扫描线（带 44px 渐隐尾迹）零缓动匀速自顶向下，1.65s 起扫、2.95s 扫到页面中部停顿：墨黑 5px 椭圆标注圈 stroke-dashoffset 描画出区域 + 引线拉出，荧光绿注释签 back.out 弹出、状态牌跳 01/01；4.0s 扫描线继续扫出底边。底部荧光绿署名条（@老马AI研习社）推入。源卡 scanline-annotate-focus 差异化：多目标取景框改单点墨圈+绿注释签、深底改纸感。

- 变量: kicker, note, img1, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 0-5.1s，之后注释定格，无收尾 fade-out
