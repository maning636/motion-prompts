# page-gray-cards-stamp · 灰卡点亮入场组（盖章式）

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右页码 mono）scaleX 扫入，眉题下 72px 大标题（荧光绿高亮块 scaleX 扫入）；一排 3-4 张灰底条目卡（#E4E3DB + 灰边）y+60 错峰垫底入场，1.5s 起逐张推进：当前卡翻白底 + 墨黑边 + 10px 硬偏移投影点亮，卡内分隔线扫成荧光绿，随后荧光绿「已验证」印章保持 rotate -8° 从 scale 2.4 back.out(2.2) 盖章式砸入，卡片附 5px 上下顿震；全部盖完底部荧光绿署名条（@老马AI研习社）推入定格。

- 变量: vol, pageno, kicker, items, stamp, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 入场 0-1.5s，逐张点亮盖章 1.5-5.1s，署名条收尾定格，无收尾 fade-out
