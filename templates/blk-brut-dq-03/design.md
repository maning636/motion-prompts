# 三项数据横排视觉规范

## 方向

三张数据卡横排，规范要求的「一排三张必须不同色」：黄 / 白 / 强调色，每张落位后自己的数字才开始跳。适合一次把三组指标摆到画面上。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，118px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，118px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 眉标 + 72px 小标题，标题区 144px
- 横排区 808px 高，三卡等宽 485px，间距 28px
- 每卡：118px 数字 + 34px 单位 + 30px 标签，标签区带 3px 上边线
- 底部规则 + 22px 口径注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与小标题自左上硬着陆（0.24–0.26s，power4.out）
- 横排区自上压入（0.28s，power4.out）
- 三张卡依次自上落位，错峰 0.16s（0.26s，power4.out）
- 每张卡落位后自己的数字 steps(12) 跳数（0.9s）
- 标签在数字跳完后 0.9s 落位（0.22s，power4.out）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（0.8s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 一排只放 3 张卡，超过就拆条
- 三张卡必须不同色
- 一帧只跳一个数字
- 三张卡单位一致

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `METRICS / 三项横排` |
| `title` | string | 三张卡上方的小标题（一行，12–18 字） | `一周里真正影响播放的只有这三项` |
| `n1` | number | 第 1 个数字（mono 整数跳变） | `3` |
| `u1` | string | 第 1 个单位 | `条` |
| `l1` | string | 第 1 个标签（中文） | `固定节拍的更新条数` |
| `n2` | number | 第 2 个数字（mono 整数跳变） | `41` |
| `u2` | string | 第 2 个单位 | `秒` |
| `l2` | string | 第 2 个标签（中文） | `单条视频的制作耗时` |
| `n3` | number | 第 3 个数字（mono 整数跳变） | `68` |
| `u3` | string | 第 3 个单位 | `%` |
| `l3` | string | 第 3 个标签（中文） | `能删掉的镜头占比` |
| `note` | string | 底部 mono 注脚（口径） | `口径：近 30 天 · 同账号全部作品 · 含未破万播放` |
| `accent` | color | 强调色（第 3 张卡 + 斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
