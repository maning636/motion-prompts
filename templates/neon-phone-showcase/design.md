# 手机发光展示卡（荧光绿口播包装族）

按 TEMPLATE-INGEST-STANDARD §2.5 规范：时长 duration 变量化，动效演完定格最后一帧。

- 风格：荧光绿暗底——近黑蓝底 `#0A0D12`，主色 `#10B981` 描边+外发光，高亮 `#34D399`，浅色点缀 `#A7F3D0`；白色粗体中文标题，`#9CA3AF` 系灰色辅助；英文小标签全大写加字距。禁用琥珀橙。
- 版式：左上文案区（英文小标签 + 中文大标题关键词绿色高亮 + 带手机线性图标的步骤行）；右侧 iPhone 样机（390:844、圆角 60px、顶部刘海、绿色描边+外发光）。
- 屏幕：`imgScreen` 留空时显示内置 CSS 迷你 dashboard 假 UI（浅色底 + 白色小卡 + 灰色/绿色细条）；填图片路径时 `object-fit:cover` 铺满屏幕盖住假 UI。
- 字体：标题/步骤行 = MiSans SemiBold；`MEBHeiHeiTi` @font-face 带 `font-weight: 100 1000`（防合成加粗坑）。
- 动画：标题区依次入场 → 手机右滑入并 rotate 4deg→0 归位 → 屏幕内容淡入 → 定格微浮（yoyo 有限次 repeat:3，禁 repeat:-1）。
- 素材槽：`imgScreen`（image，手机屏幕截图）。
