# page-comment-cta-bookmark · 评论关键词 CTA 横幅（书签抽出式）

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右页码 mono）scaleX 扫入，中部 mono 引导行（箭头上下浮动）；底部墨黑横幅（高 150px，白字 42px CTA + 左侧 mono 栏标）从屏下 expo.out 推入，荧光绿书签条（300×196，墨黑描边）从横幅上缘 overflow 容器内 back.out(1.6) 抽出，书签上评论关键词每 0.9s 一换：先 power2.in 缩回横幅、换字、再 back.out 抽出，连换 3 个；底部荧光绿署名条（@老马AI研习社）推入定格。

- 变量: vol, pageno, cta, words, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 入场 0-1.15s，关键词轮换 1.15-3.7s，署名条 3.6s 起定格，无收尾 fade-out
