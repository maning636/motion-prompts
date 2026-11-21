# sc2-hachure-01 · 排线纵深揭示

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右页码 mono）。画面中央是单点透视场：四层 45° 墨黑排线框（repeating-linear-gradient，越外层纹越稀越淡）共用消失点 (960,500)，从内层向外层错峰 expo.out 生长（scale 0→1，transform-origin 即消失点），四条透视线（SVG line）同拍从中心向四角 dashoffset draw-on；随后纸白标题卡（3px 墨黑边 + 12px 硬偏移投影）在排线收束处 back.out 显影，kicker mono 上行，64px 大标题落位，荧光绿高亮块在关键词下 scaleX 扫入；底部荧光绿署名条推入，收尾中层框 ±1.2% 呼吸定格。源卡 hatch-depth 差异化：条形图换皮改为纸感排线 + 单点透视纵深。

- 变量: vol, pageno, kicker, title, hl, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地字体文件）
- 动效: 动效段 0-3.4s，之后框层呼吸定格，无收尾 fade-out
