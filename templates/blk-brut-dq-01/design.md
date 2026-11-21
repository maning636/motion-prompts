# 单数据大字卡视觉规范

## 方向

左侧一张强调色数据卡做整数跳数，右侧一张白底卡给出「为什么」，底部写清统计口径。适合口播里抛出一个数字并当场解释它怎么来的。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，200px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，200px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 右上 mono 来源胶囊
- 主体 863px 高：左卡 900px 宽（200px 数字 + 56px 单位 + 38px 说明），右卡自适应
- 右卡含 22px 眉标 + 38px 900 字重结论 + 22px 口径
- 底部 3px 规则 + 22px 口径注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与主体自上硬着陆（0.24–0.28s，power4.out）
- 数据卡 0.86→1 缩放（0.3s，power3.out）
- 数字 steps(16) 整数跳数（1.3s）
- 数据卡阴影档位脉冲一次（0.12s，steps(2)）
- 右卡内容自左错峰进入（0.22–0.26s）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（0.8s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 口径必须写在画面上，不靠口播补充
- 数字用 tabular-nums，位宽稳定
- onUpdate 里不做 DOM 测量
- 计数器早收尾，后面留静止尾巴

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `STAT / 单数据卡` |
| `num` | number | 大数字（mono 整数跳变） | `73` |
| `unit` | string | 数字右侧单位（1–3 字） | `%` |
| `lab` | string | 数字下方说明（中文，用 sans） | `的观众在前三秒就划走了` |
| `sub` | string | 卡片下方副句（一行短句） | `留存不是靠画面，是靠第一句话有没有把话说完` |
| `note` | string | 口径注脚（mono，写明统计口径） | `口径：2026 年 9 月 · 自有账号后台 · 样本 42 条` |
| `src` | string | 右上角来源标签 | `SOURCE / 后台` |
| `accent` | color | 强调色（数据卡底 + 斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
