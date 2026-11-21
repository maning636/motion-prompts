# 引文式开场视觉规范

## 方向

一张满幅强调色引文卡，左边一枚大引号装饰（文字硬投影），右边两行引文加署名块。适合开场引一句别人的话、或者引一期旧内容里被观众记住的那句。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #3D7BFF 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，120px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 3px 规则
- 引文卡 1744px 宽，sh-xl（10px），内边距 46/56px
- 引号列 120px 宽，120px mono 字符 + 2px 文字硬投影
- 引文两行 62px / 行高 1.26；署名块 64px 头像方块 + 32px 姓名 + 22px mono 职务
- 底部规则 + 22px 出处注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与顶部规则自左进入（0.24–0.28s，power4.out）
- 引文卡 0.86→1 缩放（0.3s，power3.out）
- 引号与两行引文依次自上进入（0.24–0.26s）
- 署名块落定，头像阴影压 2 帧再弹回（0.08s，steps(2)）
- 底部规则从右画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 引文一字不改地引用
- 一帧只压一块引文卡
- 大引号用文字硬投影，不用 box-shadow
- 引文两行合起来不超过 30 个字

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `PULLQUOTE / 引文开场` |
| `q1` | string | 引文第一行（12–18 字） | `你不是在拍视频，` |
| `q2` | string | 引文第二行（12–18 字） | `你是在替陌生人省一次犹豫` |
| `whoTx` | string | 署名（中文姓名 / 账号名） | `老陈` |
| `role` | string | 身份（mono 英文 / 职务） | `CREATOR · 12 万粉` |
| `note` | string | 底部 mono 注脚（出处） | `引自第 9 期口播 · 03:12` |
| `accent` | color | 引号色（蓝） | `#3D7BFF` |
| `card` | color | 引文卡填充色 | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
