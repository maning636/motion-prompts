# sc2-selector-01 · 选择器滚筒

纸白 #F6F5EF + 36px 细网格底；顶部细线页眉（左 VOL/栏目 + 右 P.394/400 页码 mono），左栏 kicker + 84px 大标题，右侧 640×740 纸感滚筒卡（3px 墨黑边 + 16px 硬偏移投影）y+120 expo.out 落位。卡内 5 行视口候选词列整体 translateY 逐格滚动，每步 power4.out 急减速吸附 + 格间静止 0.43s；按 |i−pos| 三通道距离衰减（透明度 1→0.5→0.16、缩放、模糊，仅焦点行带绿方块对勾），上下白色渐变遮罩自然消隐。停在目标词瞬间，荧光绿 6px 左右半框从两侧 expo 咬合、整框 0.1s 弹亮 + scale1.05 一顿定格。底部荧光绿署名条（@老马AI研习社）推入。源卡 picker-carousel-feature-cycle 差异化：药丸改绿咬合框、白灰改纸感绿黑白。

- 变量: kicker, options, target, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 0-4.8s（随 target 位置浮动），之后定格，无收尾 fade-out
