# Checklist 打勾卡视觉规范

## 方向

四行清单，每行一枚 64×64 方框，行落位后 1 帧硬切：方框换强调色、勾字符出现，不做打勾动画。适合把一份发布前 / 交付前的检查清单摆到画面上。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #2FD07A 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，68px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 眉标 + 68px 小标题，标题区 136px
- 清单区 818px 高，四行，行间 3px 实线
- 每行：64px 方框 + 24px mono 编号 + 44px 文案
- 勾字符 38px mono，未打勾时 display:none
- 底部规则 + 22px 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与小标题自左上硬着陆（0.24–0.26s，power4.out）
- 清单区自上压入（0.28s，power4.out）
- 四行逐条自左 64px 撞入，错峰 0.24s（0.26s，power4.out）
- 每行落定后 1 帧硬切：方框换强调色 + 勾字符出现 + 阴影压弹（0.08s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 打勾只用 1 帧硬切，不做打勾动画
- 清单固定 3–5 条
- 每条只写一个可检查的动作
- 未打勾的方框保持白底，不做灰色淡化

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `CHECKLIST / 打勾卡` |
| `title` | string | 打勾卡上方的小标题（一行，12–18 字） | `发布前最后四件事，做完再点发送` |
| `i1` | string | 第 1 条（8–16 字） | `第一帧就有画面，不是黑场` |
| `i2` | string | 第 2 条 | `文案里没有需要跳读的长句` |
| `i3` | string | 第 3 条 | `字幕和口播一字不差` |
| `i4` | string | 第 4 条 | `结尾有一个明确的下一步` |
| `note` | string | 底部 mono 注脚 | `打勾是硬切换 · 不做打勾动画` |
| `accent` | color | 打勾后的方块底色 + 斜纹带 | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
