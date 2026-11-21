# 霓虹手机阵列升起

按 TEMPLATE-INGEST-STANDARD §2.5 规范：时长 duration 变量化，动效演完定格最后一帧。

- 风格：荧光绿口播包装族——近黑蓝底 `#0A0D12`，手机机身填充 `#12161C`，圆角 52px；1px 主色描边 + box-shadow 外发光（rgba(16,185,129,...)）。主色 `#10B981`，发光高亮 `#34D399`，浅色点缀 `#A7F3D0`/`#D1FAE5`/`#6EE7B7` 用于假 UI 色块，辅助灰 `#9CA3AF`。禁琥珀橙，全片无橙色。
- 布局：顶部居中大标题（白色粗体 + 绿色高亮词带下划线光条）→ 下方 4 台 iPhone 样机（320×660，竖向圆角矩形 + 刘海）排成一列、底部出血裁切，中间两台落位稍高（top 436 vs 520），呈浅拱形。
- 字体：标题/假 UI 数字与小标题 = MiSans SemiBold；假 UI 注释小字 = MEBHeiHeiTi。全模板仅此两款字体，硬链接自 templates 根目录，无系统字体回退。
- 标题高亮实现：titleAccent 作为 titleCn 的子串拆分三段渲染，高亮词不在标题中时自动附加在后，任意文案不破版；标题 max-width 1600px 自然换行，无 `<br>`。
- 屏幕槽位：默认 CSS 假 UI（灰白小卡 + 细条，4 台内容各异）；imgScreen1~4 填图后 object-fit:cover 铺满屏幕盖住假 UI。
- 动画：标题淡入上移 → 4 台手机从左到右 stagger（0.16s 步进）从底部升起 640px 落位 → 定格。无 repeat:-1、无收尾出场；tl.set 补齐到 data-duration 防黑帧。
