# 报告结论卡视觉规范

## 方向

ink 满版底：顶部报告编号胶囊 + 一行 96px 报告名，下面三条编号 + 68px 结论逐条自左撞入。适合引用一份报告的结论页。

## Palette

- Background: `#0F0F0F`
- Foreground: `#FFFFFF`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，96px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标（强调色）+ 报告编号胶囊 + 3px 纸色规则
- 报告名一行 96px / 行高 1.14
- 结论区三行，每行 64px 编号方块 + 68px 结论，行间 3px 纸色实线
- 底部 3px 纸色规则 + 22px 注脚 + 右对齐 22px 署名
- 最底 20px 纸色斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标、编号胶囊与顶部规则依次进入（0.24s，power4.out）
- 报告名区自上压入，大字自左上斜撞入（0.28s，power4.out）
- 三条结论逐条自左 70px 撞入，错峰 0.22s（0.26s，power4.out）
- 每条编号方块落定阴影压 2 帧再弹回（0.08s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 结论固定 3 条
- 每条结论不超过 20 个字
- 结论必须标明来自哪份报告
- 深底上描边与斜纹换成纸色

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `CONCLUSION / 报告结论` |
| `rno` | string | 报告编号（mono pill） | `RPT-2026-07` |
| `title` | string | 报告名（一行，14–20 字） | `内容供给侧调研 · 第三期结论` |
| `c1` | string | 第 1 条结论（一行，12–18 字） | `产量已经不是瓶颈，稳定更新才是` |
| `c2` | string | 第 2 条结论 | `选题重复三次以上才会形成记忆点` |
| `c3` | string | 第 3 条结论 | `能被记住的系列都有一句固定的口头禅` |
| `org` | string | 署名机构（mono） | `内容观察室 · 2026.10` |
| `note` | string | 底部 mono 注脚 | `结论为原报告摘要 · 全文见报告页` |
| `accent` | color | 强调色（编号块 + 斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
