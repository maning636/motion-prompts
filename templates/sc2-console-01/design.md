# sc2-console-01 · 仪表盘荧光扫描高亮

墨黑 #141414 深色场 + 纸白文字；顶部细线页眉（纸白 2px 线 scaleX 扫入，左 VOL/栏目 + 右页码 mono）。中央 1500px 宽行情面板（3px 纸白边 + 16px 黑色硬偏移投影）expo.out 升起，6-8 行数据行（mono 序号 + MiSans 名称 + 迷你柱组 + 描边胶囊）逐行点亮；荧光绿扫描带（半透明绿渐变 + 上下绿线）从面板行区顶部匀速下扫，扫到 target 行瞬间：该行胶囊荧光绿实心弹亮（scale 1→1.14→1.06 back.out 回弹、文案切 LOCKED）、行体右移 14px，其余行压暗到 0.4，扫描带隐去；底部荧光绿署名条推入，收尾胶囊 ±4% 呼吸定格。源卡 dashboard-glow-highlight-pill 差异化：横向光斑巡游改为纵向匀速扫描 + 绿荧光点名。

- 变量: vol, pageno, rows（分号分隔 6-8 行）, target, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地字体文件）
- 动效: 动效段 0-约3.4s，之后胶囊呼吸定格，无收尾 fade-out
