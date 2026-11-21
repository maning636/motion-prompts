# 日期期号卡视觉规范

## 方向

期号压在强调色方块上，旁边竖排一行 mono 日期，下面两行 112px 大字写本期主题，右上角挂一枚年份区间胶囊。适合每一期口播的固定片头。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #3D7BFF 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，170px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，170px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 3px 规则 + 右上 22px 区间胶囊
- 期号区 240px 高：强调色方块（170px 期号）+ 竖排日期列
- 主题区 612px 高，两行 112px / 行高 1.14
- 底部规则右对齐 + 22px 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标、区间胶囊与顶部规则依次进入（0.24s，power4.out）
- 期号方块 0.86→1 缩放并压阴影（0.28s，power3.out）
- 竖排日期自右上拍入（0.26s，power4.out）
- 主题区自上压入，两行自左上斜撞入（0.28s，power4.out）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 期号用 EP.000 形式，不用中文数字
- 日期与年份区间一律用 mono
- 年份区间用 — 连接，不用 ~ 或 至
- 主题不超过两行

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `ISSUE / 期号卡` |
| `issueNo` | string | 期号（mono，建议 EP.001 形式） | `EP.012` |
| `date` | string | 日期（mono） | `2026.10.13` |
| `topicA` | string | 本期主题第一行（8–12 字） | `为什么你的画面` |
| `topicB` | string | 本期主题第二行（8–12 字） | `总比句子慢一拍` |
| `period` | string | 右上角区间 pill（mono） | `2025 — 2026` |
| `note` | string | 底部 mono 注脚 | `每周二更新 · 攒够 12 期就开一期长篇` |
| `accent` | color | 强调色（期号色块 + 斜纹带） | `#3D7BFF` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
