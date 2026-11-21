# sc2-azchip-01 · 芯片网格单选压暗

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉，网格上方 mono 标签 "SELECT ONE · 单选压暗"。4×3 芯片胶囊网格（3px 墨黑边、圆角 999px、mono 序号 + MiSans 词）以灰态（#E8E7DE 底 + #9A9A92 字）逐枚 back.out 点灰入场，stagger 0.07s；停一拍后目标芯片荧光绿实心弹亮（scale 1→1.24→1.14 back.out、10px 墨黑硬投影浮起），其余 11 枚原地压暗到 0.25 聚光——位置锁死不动；底部荧光绿署名条推入，收尾目标芯片 ±3.5% 呼吸定格。源卡 chip-grid-single-select-blackout 差异化：反黑收窄改为绿弹亮 + 全场压暗。

- 变量: vol, pageno, chips（逗号分隔 12 个词）, target, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地字体文件）
- 动效: 动效段 0-约3.5s，之后目标芯片呼吸定格，无收尾 fade-out
