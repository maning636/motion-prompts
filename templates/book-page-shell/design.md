# book-page-shell · 书页壳（纸感页面展示框）

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右页码 mono），左栏 108px 大标题两行（第二行荧光绿高亮块 scaleX 扫入），右侧 600×800 书页卡（3px 墨黑边 + 16px 硬偏移投影）y+150/rotateX 16° expo.out 落位，随后绿色扫光掠过页面，底部荧光绿署名条（@老马AI研习社）推入，收尾书页 ±8px 呼吸浮动。图片/视频双槽择一：video1 填路径播视频，否则显示 img1。

- 变量: vol, pageno, kicker, line1, line2, desc, img1, video1, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 0-2.4s，之后呼吸浮动定格，无收尾 fade-out
