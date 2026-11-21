# 重点词放大脉冲视觉规范

## 方向

一整块 3px 取景框把画面框住，框内一行 118px 大字，其中一个词压在强调色方块里做三次有限脉冲。适合口播里需要把一个词单独拎出来强调的句子。

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

- 顶部眉标 + 右上角 26px 强调色圆点
- 取景框 1744×835px，上下左右各 3px 黑边
- 框内文字区左右各留 70px，最大 1598px 宽
- 重点词方块：内边距 20px、sh-m、高度随字号 1.14
- 底部规则 + 22px 注脚；最底 20px -45° 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与圆点自上硬着陆（0.22–0.24s）
- 取景框分 8 格从左合拢（0.36s，steps(8)）
- 框内大字自上压入（0.26s，power4.out）
- 重点词 scale 1.00→1.06 往复 3 次（0.14s，steps(2)，repeat 2 + yoyo）
- 重点词阴影换一档再换回（0.12s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 脉冲幅度不超过 1.06
- 脉冲次数封顶 3 次
- 一帧只脉冲一个词
- 取景框不做旋转、不做缩放动画

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `EMPHASIS / 重点词` |
| `pre` | string | 大标题前半（会自动接住重点词） | `真正卡住你的` |
| `kw` | string | 会脉冲放大的重点词（2–4 字） | `判断` |
| `post` | string | 大标题后半 | `，不是工具` |
| `note` | string | 底部 mono 注脚 | `脉冲次数封顶 3 次 · 本片 3 次` |
| `frameLabel` | string | 取景框左上角 mono 标签 | `ZOOM ×3` |
| `accent` | color | 重点词块 + 取景框角标 | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
