# sc2-roster-01 · 列表逐行显影

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 SC2 栏目 + 右 P.392/400 页码 mono），居中 52px 眉题大标题 + mono 参数行。中央 1180px 纸面列表面板（白底 + 3px 墨黑边 + 14px 硬偏移投影）携 5 行骨架灰条（圆点 + 双灰条 + 页码条）expo.out 入场；随后逐行显影，每行 0.55s 一拍：骨架层 scaleX 收向右侧淡出，真实内容（墨黑圆形编号头像 + 标题 MEBHeiHeiTi 900 + 说明 MiSans + 行尾 mono 页码 P.0x/05）从 blur(8px) 显影到清晰。hlRow 行在文字显影后整行垫荧光绿色块 scaleX 扫入，说明与页码转墨黑。全程面板另有 12→-10px 线性慢漂移（与逐行显影解耦的第二层运动），时间轴盖满 6s 定格，无收尾 fade-out。底部荧光绿署名条（@老马AI研习社）。

- 变量: vol, pageno, kicker, rows（标题|说明，分号分隔，最多 6 行）, hlRow, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 面板入场 0.55s，逐行显影 1.05s 起 stagger 0.55s，漂移 0.6-6.4s 贯穿，定格收尾
