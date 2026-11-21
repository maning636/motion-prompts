# page-mechanism-notes · 机制条目+配图页（侧便签翻亮）

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右页码 mono）scaleX 扫入，左上 62px 标题；右栏 520×693 竖版配图页（3px 墨黑边 + 16px 硬偏移投影）y+120 expo.out 落位；左栏 3 张机制条目卡（灰底垫底 x-40 错峰入场），1.7s 起每 1.25s 逐条翻亮：卡面翻白 + 墨黑边 + 8px 硬投影、左侧 8px 荧光绿条 scaleY 同步升起，同拍一张荧光绿小便签（NOTE 编号 + 注解，墨黑描边 + 硬投影、rotate -2°）以左缘为轴 rotateY -90°→0 back.out 翻出，没入条目与配图之间；底部荧光绿署名条（@老马AI研习社）推入定格。

- 变量: vol, pageno, title, items, notes, img1, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 入场 0-1.7s，逐条翻亮+便签 1.7-5.45s，署名条 5.7s 起定格，无收尾 fade-out
