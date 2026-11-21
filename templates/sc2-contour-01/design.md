# sc2-contour-01 · 描边字充填

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右 P.393/400 页码 mono），中央 300px MEBHeiHeiTi 900 空心巨字（4px 墨黑 -webkit-text-stroke、透明芯）scale 1.35→1 expo.out 急缓收缩落位、立住一拍；随后每字内叠的荧光绿充填层 clip-path inset 自底向上收起，逐字 stagger 0.22s 像液面涨满，充满后整体 scale 1.03 一顿定格；说明行与底部荧光绿署名条（@老马AI研习社）推入，收尾巨字 ±8px 呼吸浮动。源卡 outline-word-fill 差异化：瞬时白切改绿液面充填、深底改纸感。

- 变量: kicker, word, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 0-4.2s，之后呼吸浮动定格，无收尾 fade-out
