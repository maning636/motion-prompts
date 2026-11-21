# neon-media-tilt · 荧光绿斜角媒体展示框

- 系列：荧光绿口播包装族（overlay 类）。基底 imgBg 槽：有图 object-fit:cover 铺满 + 55% 黑色压暗层；留空则 #0A0D12 深黑底 + 暗角。
- 媒体框 760×560，居中于左/右半屏（layout 变量），填充 #12161C、圆角 16px、1px 主色描边 + 外发光（rgba(16,185,129,...)）+ 轻微下投影。
- 媒体内容：imgMedia 图片槽 cover 填充；留空显示 CSS 假文档（白色卡片 #F5F6F7 + 灰色横线段落），保证空槽画面完整。
- 动作：父容器 perspective:1200px，框体从 rotationY 24° + 侧方位移 + 透明飞入，归位保持 6° 微斜角定格（左半屏正角、右半屏负角，朝向屏幕中轴），随后 caption 淡入。
- 字体：标题/caption 用 MiSans SemiBold，辅助文字 MEBHeiHeiTi（@font-face 带 font-weight: 100 1000），无第三款字体。
- 颜色：主色 #10B981、高亮 #34D399、浅色点缀 #A7F3D0；禁琥珀橙；无红色元素（无否定语义）。
- 时长：duration 变量，动效段约 2.5 秒，演完定格最后一帧，tl.set 占满 data-duration 防黑帧。
