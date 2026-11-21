# 列表项逐条拍入视觉规范

## 方向

整宽列表，每行一枚 52×52 编号方块加一行 42px 文案，行尾一枚实心方块当就位记号，四行错峰拍入。适合把一串要点、检查项、或者一组并列建议摆到画面上。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，82px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 眉标 + 82px 小标题，标题区 197px
- 列表区 723px 高，4 行，行间 3px 实线，顶部 3px 实线
- 行内：64px 编号方块 + 42px 文案 + 26px 行尾方块
- 奇数行的编号方块用强调色，偶数行用白底
- 底部规则 + 22px 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与小标题自左上硬着陆（0.24–0.26s，power4.out）
- 列表顶边分 8 格画出（0.36s，steps(8)）
- 四行逐条自左 60px 撞入，错峰 0.16s（0.26s，power4.out）
- 每行编号方块落定瞬间阴影压 2 帧再弹回（0.08s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 条目控制在 3–5 条
- 每条只讲一个动作
- 行尾记号只做实心方块，不换图标
- 行高按文案长度自适应，不压字号

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `CHECKLIST / 逐条拍入` |
| `title` | string | 列表上方的小标题（一行，12–18 字） | `一条片子开拍前，我固定检查这四件事` |
| `i1` | string | 第 1 条文案（8–16 字） | `第一句话能不能独立成立` |
| `i2` | string | 第 2 条文案 | `画面里有没有第二个重心` |
| `i3` | string | 第 3 条文案 | `结尾有没有留下一个具体动作` |
| `i4` | string | 第 4 条文案 | `静音看一遍还看得懂吗` |
| `note` | string | 底部 mono 注脚 | `条目 3–5 条 · 每条一个动作` |
| `accent` | color | 强调色（编号方块 + 斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
