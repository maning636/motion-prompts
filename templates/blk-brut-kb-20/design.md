# 小标题加正文块视觉规范

## 方向

左列两枚小标题标签，右列两块白底正文块用竖向遮罩揭示落定，两组错峰推进。适合「一句小标题 + 一段证据」这种最常见的口播卡片。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #2FD07A 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，64px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 64px 主标题同行
- 主体 838px 高，两列间距 56px
- 左列 460px：两枚标签，26px 色块 + 34px 小标题
- 右列：两块白底正文卡，38px 文案，遮罩高度自适应
- 底部规则 + 22px 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与主标题自左上硬着陆（0.24s，power4.out）
- 主体自上压入，左右两列自相反方向撞入（0.26s，power4.out）
- 第一组：标签落位 + 正文块竖向遮罩揭示（0.5s，power4.out）
- 第二组错峰 0.38s 重复同一套动作
- 标签落定阴影压 2 帧再弹回（0.08s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 一组只配一块正文
- 正文块最多两块
- 遮罩揭示只走 translateY
- 左列小标题不超过 8 个字

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `BLOCK / 小标题 + 正文块` |
| `title` | string | 主标题（一行，12–18 字） | `一个段落只放一个信息` |
| `h1` | string | 左侧小标题 1（4–8 字） | `标题给结论` |
| `b1` | string | 右侧正文块 1（18–30 字） | `观众滑动的时候只读标题，标题必须自己站得住。` |
| `h2` | string | 左侧小标题 2（4–8 字） | `正文给证据` |
| `b2` | string | 右侧正文块 2（18–30 字） | `正文的作用是让标题可信，不是让标题变长。` |
| `note` | string | 底部 mono 注脚 | `竖向遮罩揭示 · 自上而下` |
| `accent` | color | 强调色（小标题色块 + 斜纹带） | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
