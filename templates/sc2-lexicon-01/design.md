# sc2-lexicon-01 · 纵滚模糊词列

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 SC2 栏目 + 右 P.303/400 页码 mono），居中眉题；中央 1200×540 三行视窗词列滚轮，行高 180px、118px MEBHeiHeiTi 900 大字，首尾各垫一个空行使当前词恒居视口中央。滚动由位置量 p 驱动（每段 0.55s power4.out 高速滚动 + 0.85s 静置读词），相邻词按距离 d 实时铺垂直 blur（0→10px）、灰度（墨黑→mono 灰）与缩放（1.12→1.0），当前词清晰定格放大，落定瞬间荧光绿色块垫字 scaleX 扫入高亮、旧词高亮同步退场；视口上下各 90px 纸色渐隐遮罩让滚出的词柔和消失。底部荧光绿署名条（@老马AI研习社）推入。

- 变量: kicker, words（逗号分隔，≤6 词）, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold + IBM Plex Mono（本地硬链接）
- 动效: 动效段 0-5.4s，末词定格后保持最后一帧，无收尾 fade-out
