# 荧光绿圆形头像小窗（PiP overlay）

按 TEMPLATE-INGEST-STANDARD §2.5 规范：双 image 槽 + duration 变量化，动效演完定格最后一帧。

- 风格：荧光绿口播包装族——近黑蓝底 `#0A0D12`，主色 `#10B981` 圆环描边 + 外发光（rgba(16,185,129,…)），禁琥珀橙。
- 基底：imgBg 槽有图时铺满（object-fit:cover）并加 `rgba(10,13,18,.72)` 压暗层，空槽保持深黑底。
- 小窗：左下角圆形框（直径 280px，left:72 / bottom:108），5px 圆环描边 + 双层外发光；圆内 imgAvatar 槽 cover 裁切，空槽显示内联 SVG 人物剪影（深灰 `#1F242C` 底 / `#3A414D` 剪影）。
- 发光色由 ringColor 变量在 JS 里换算 rgba 派生，换色即换整套描边+发光。
- 动画：0.3s 圆窗从下方 140px 滑入 + 淡入（0.6s）→ 圆环呼吸发光两次（0.55s × repeat:3 yoyo，有限次）→ 定格。
- 字体：本模板无文案，仍按暗色系规则硬链接 MEBHeiHeiTi / MiSans SemiBold 备用。
