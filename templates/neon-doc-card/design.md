# 荧光文档清单卡

按 TEMPLATE-INGEST-STANDARD §2.5 规范：时长 duration 变量化，动效演完定格最后一帧。

- 系列：荧光绿口播包装族——近黑蓝底 `#0A0D12`，主色 `#10B981`，发光高亮 `#34D399`，辅助灰 `#9CA3AF`。
- 画面：深底上唯一一张浅色文档大卡（`#F3F4F6` 米白、20px 圆角、黑投影+轻微绿外发光），卡内顶部引导灰字 + 5 条编号清单（绿方块 + 绿色序号 + 「名称 — 说明」拆分，名称 `#111827` 粗体、说明 `#4B5563`）；卡外左上英文小标签（主色、全大写、加字距）+ 白色粗体中文标题（带列表小图标）；卡外右侧绿色圆勾 badge + 两行白字；底部居中 caption。
- 字体：标题/序号/badge首行/caption = MiSans SemiBold；卡内清单与灰色小字 = MEBHeiHeiTi（@font-face 带 `font-weight: 100 1000`，防合成加粗实心块）。
- 动画：递进构建——标题组淡入上移 → 大卡从底部升入 → 引导字+清单逐行淡入（stagger）→ badge back.out 弹入 → caption 入 → 定格。
- 防破版：所有动态文本设 max-width + overflow-wrap，清单容器 flex space-evenly 自适应行高变化；无图片素材槽。
- 禁用：琥珀橙（旧版 neon 配色）、repeat:-1、收尾出场动画。
