# 思维导图视觉规范

## 方向

中心主题 + 6 个一级分支向外辐射，适合系统拆解、知识图谱类内容。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.45)`

## Typography

- 顶部标签：`IBM Plex Mono` 500，22px，letter-spacing 0.18em，大写
- 中心主题：`IBM Plex Mono` 700，32px，背景色反白
- 分支文字：`IBM Plex Mono` 500，28px

## Layout

- 画面中心 220px 圆形节点
- 6 个分支均匀分布在半径 340px 的圆周上
- 连线 2px accent 色

## Motion

- 顶部标签入场
- 中心节点弹性缩放出现
- 连线从中心向分支描边
- 分支节点依次弹出
- 结束前整体微缩放淡出

## Avoid

- 分支超过 8 个
- 分支文字过长（最多 4 字）
- 添加二级子项（当前模板仅支持一级）
