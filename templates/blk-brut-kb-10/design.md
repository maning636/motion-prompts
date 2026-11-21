# 提问式开场视觉规范

## 方向

上半纸底放两行问句加一枚 180×180 问号方块，下半整块换成 ink 底放答案，答案晚一拍落定。适合知识口播的前三秒设问：先问，再给结论。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #3D7BFF 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，130px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，130px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标行 y=46
- 问句区占 791px，两行 130px / 行高 1.12，问号方块右置 180×180
- 3px 实线分隔问与答
- 答案区整块 ink 底 203px：mono 眉标 26px + 52px 答案行
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标自上硬着陆（0.24s，power4.out）
- 问句区自上压入，两行错峰 0.16s（0.26s，power4.out）
- 问号方块 0.86→1 缩放并压阴影（0.26s，power3.out）
- 分隔线分 8 格从左推出（0.34s，steps(8)）
- 答案区自下 48px 硬压入（0.28s，power4.out）
- 答案眉标与答案行依次落位（0.22–0.26s）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 问句两行合起来不超过 22 个字
- 答案不超过 18 个字
- 问号方块只用纯字符，不用 SVG 图标
- 答案区整块换底色，不叠半透明蒙版

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `QUESTION / 提问开场` |
| `q1` | string | 问句第一行（8–11 字） | `你有没有想过，` |
| `q2` | string | 问句第二行（8–11 字） | `为什么你剪到第 8 版才顺` |
| `alab` | string | 答案区 mono 眉标 | `ANSWER / 答案是` |
| `ans` | string | 答案（一行，10–16 字） | `因为前七版你都在改画面，没改句子` |
| `accent` | color | 问号方块 + 斜纹带 | `#3D7BFF` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
