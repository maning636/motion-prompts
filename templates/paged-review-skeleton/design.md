# paged-review-skeleton · 分页项目测评骨架（杂志测评页）

整页即一张杂志测评页：纸白 #F6F5EF + 36px 细网格，顶部细线页眉（栏目 + 页码），左栏 88px 大标题（关键词荧光绿高亮块扫入）+ mono meta 行 + 条目区（灰 0.35 垫底，逐条 0.55s 间隔翻亮、左侧绿条 scaleY 同步），右栏 520×693 配图页（墨黑细边 + 14px 硬偏移投影 + FIG 图注）。条目全部点亮后，结论条（白卡 + 绿「结论」标签）scale 1.22 / rotate -3.5° 盖章式砸入，底部荧光绿署名条推入。

- 变量: vol, pageno, kicker, title, titleHl, meta, items, img1, verdict, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 标题/配图 0-1.3s，条目翻亮 1.7s 起，结论盖章其后，无收尾 fade-out
