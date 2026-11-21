# 占位框视觉规范

## 方向

虚线框 + 四角 accent 标记 + 加号图标，中央显示缺失素材名、规格与负责人，作为缺素材时的兜底镜。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Frame border: dashed `rgba(244,239,231,0.25)`
- Corner / icon / owner: `#00FF00`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 素材名：44px，700
- 规格：22px，opacity 0.55
- 负责人：18px，accent 边框标签

## Layout

- 标题在左上角
- 占位框居中，1200×720px
- 四角 accent 直角标记

## Motion

- 标题入场
- 虚线框缩放进入
- 四角标记依次弹出
- 加号图标弹出
- 文字信息依次淡入
- 结束前整体上移淡出

## Avoid

- 不使用真实内容、阴影、渐变
- 保持明显的“待补”视觉语义
