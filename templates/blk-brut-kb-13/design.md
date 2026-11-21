# 小字注脚加大标题视觉规范

## 方向

顶部只留一行 22px 的极小 mono 注脚，中部是两行右对齐的 176px 大字，底部一枚胶囊标签压在 3px 规则上。适合口播里需要「先给一个出处，再给结论」的段落。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #3D7BFF 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，176px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，176px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部注脚行 y=44，右端一枚 22×22 实心方块
- 标题区垂直居中并右对齐，最大行宽 1400px
- 两行 176px / 行高 1.08
- 底部一行：规则 + 30px 落款 + 22px 胶囊标签
- 右侧 28px 竖向斜纹条，绝对定位贴边不进 flex 流
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 顶部注脚与方块自上硬着陆（0.22–0.24s）
- 标题区自上压入，两行自右上斜撞入，错峰 0.18s（0.28s）
- 底部规则从右画出（0.3s，power4.out）
- 落款与标签自右拍入（0.24s，power4.out）
- 右侧竖纹条分 8 格自右向左推出（0.36s，steps(8)）
- 竖纹条匀速滚动 40px（1.1s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 竖纹条必须绝对定位，height:100% 放进 flex 列会吃掉整行
- 注脚不超过 30 个字符
- 右对齐标题保持两行，不做居中混排
- 胶囊标签不超过 10 个字符

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `note` | string | 顶部极小 mono 注脚（出处 / 期号） | `VOICE / 口播 · 第 12 期 · 02:41 处` |
| `titleA` | string | 大标题第一行（6–9 字，右对齐） | `你缺的不是` |
| `titleB` | string | 大标题第二行（6–9 字，右对齐） | `第二个账号` |
| `tag` | string | 底部胶囊标签（2–6 字） | `START OVER` |
| `byline` | string | 底部落款（中文短句） | `同一个选题，第一条总是最像样` |
| `accent` | color | 强调色（标签 + 右侧竖条纹） | `#3D7BFF` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
