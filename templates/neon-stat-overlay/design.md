# 荧光绿数字大字压屏（stat overlay）

按 TEMPLATE-INGEST-STANDARD §2.5 规范：imgBg image 槽 + duration 变量化，动效演完定格最后一帧。

- 风格：荧光绿口播包装族——近黑蓝底 `#0A0D12`，主色 `#10B981`，发光高亮 `#34D399`，禁琥珀橙。
- 基底：imgBg 槽有图时 object-fit:cover 铺满 + 55% 黑色压暗层；空槽深黑底 + 径向暗角（vignette 层始终存在，压四角聚焦中央数字）。
- 中央超大数字：MEBHeiHeiTi 280px 纯白 + 三层绿色 text-shadow 发光；从 0 递增至 numTo（GSAP tween 对象属性 + onUpdate 写 textContent，paused 时间线内同步完成，可寻帧）。
- 下方：MEBHeiHeiTi 46px 白字标签（padding 260px 内自然换行，防破版），再下 560px 绿色进度横条（暗绿 track + 发光 fill，scaleX 从左展开）。
- 动画：0.4s 数字递增 1.2s → 1.7s 标签淡入上移 0.4s → 2.0s 横条展开 0.7s → 定格；末端 tl.set 占满 data-duration 防黑帧。
- 字体：数字/标签用 MEBHeiHeiTi（@font-face 带 font-weight: 100 1000，防合成粗体白块），硬链接自 templates 根目录；MiSans SemiBold 备用。
