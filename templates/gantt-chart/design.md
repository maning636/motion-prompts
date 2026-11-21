# 甘特图视觉规范

## 方向

左侧任务列表 + 右侧时间轴条带，用条带长度表示起止周，关键里程碑用圆点标注，适合项目排期与 Sprint 规划。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Bar default: `rgba(244,239,231,0.14)`
- Grid: `rgba(244,239,231,0.06)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 副标题：24px，opacity 0.55
- 任务名：20px，500
- 周标签：18px，opacity 0.45

## Layout

- 标题区 + 甘特图主体
- 左侧任务列 240px，右侧图表区自适应
- 每行 72px，条带高 28px 居中

## Motion

- 标题入场
- 周标签依次下落
- 任务名从左侧滑入
- 条带从左到右生长
- 里程碑弹出
- 结束前整体上移淡出

## Avoid

- 不使用渐变、阴影、3D
- 周数建议 6–10，任务建议 5–8
