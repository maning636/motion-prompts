# 排名列表视觉规范

## 方向

ink 满版底，五行排行，每行是名次方块 + 标签 + 占比条 + 数值，五行逐条自左撞入。适合把一组同类内容或一批选项排出名次。

## Palette

- Background: `#0F0F0F`
- Foreground: `#FFFFFF`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，68px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 眉标（强调色）+ 68px 小标题，标题区 136px
- 排行区 826px 高，五行，行间 3px 纸色实线
- 每行：62px 名次方块 + 300px 标签 + 自适应 track + 44px 数值
- track 高 26px，填充条 20px；第一名用强调色
- 底部 3px 纸色规则 + 22px 注脚；最底 20px 纸色斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与小标题自左上硬着陆（0.24–0.26s，power4.out）
- 排行区自上压入（0.28s，power4.out）
- 五行逐条自左 64px 撞入，错峰 0.16s（0.24s，power4.out）
- 每条到位后占比条用 grow 拉到相对最大值的百分比（0.46s，power3.out）
- 第一名名次方块阴影档位脉冲一次（0.12s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（0.8s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 排行固定 3–5 条
- 占比条以第一名为 100% 基准
- 名次方块不改圆角
- 深底上所有描边换成纸色

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `TOP5 / 排行榜` |
| `title` | string | 排行榜上方的小标题（一行，12–18 字） | `同题材里最能扛住推荐的五条` |
| `r1` | string | 第 1 名标签（4–8 字） | `拆账号` |
| `n1` | number | 第 1 名数值 | `92` |
| `r2` | string | 第 2 名标签 | `改开头` |
| `n2` | number | 第 2 名数值 | `78` |
| `r3` | string | 第 3 名标签 | `做合集` |
| `n3` | number | 第 3 名数值 | `64` |
| `r4` | string | 第 4 名标签 | `砍时长` |
| `n4` | number | 第 4 名数值 | `47` |
| `r5` | string | 第 5 名标签 | `换封面` |
| `n5` | number | 第 5 名数值 | `31` |
| `unit` | string | 数值单位 | `分` |
| `note` | string | 底部 mono 注脚（口径） | `口径：近 30 天 · 同类内容 · 综合指数满分 100` |
| `accent` | color | 第 1 名色块 + 斜纹带 | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
