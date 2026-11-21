# 数字加短句视觉规范

## 方向

左边一张强调色数据卡做整数跳数，右边三行短句逐条从左拍入，每条配一枚 52×52 mono 编号方块。适合用一个数字立论、右侧再补三条理由的口播段落。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #2FD07A 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，190px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，190px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标行 y=46
- 数据卡 720px 宽：190px mono 数字 + 44px 单位 + 32px 说明
- 右侧三行各 52px 编号方块 + 38px 文案，行间 3px 实线
- 底部规则 + 22px 口径注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与主体自上硬着陆（0.24–0.28s，power4.out）
- 数据卡自左上斜撞入（0.28s，power4.out）
- 数字 steps(14) 整数跳数（1.1s）
- 数据卡阴影档位脉冲一次（0.12s，steps(2)）
- 右侧三行逐条自左撞入，错峰 0.12s（0.22s，power4.out）
- 底部规则从右画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 60px（1.2s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 数字用 tabular-nums，位宽必须稳定
- 计数器早于其它动画收尾，后面必须留静止尾巴
- onUpdate 里不做任何 DOM 测量
- 短句每条不超过 14 个字

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `COUNTER / 数字 + 短句` |
| `num` | number | 大数字（mono 整数跳变） | `7` |
| `unit` | string | 数字右侧单位（1–3 字） | `版` |
| `lab` | string | 数字下方说明（中文，用 sans） | `才剪出一条能发的片子` |
| `l1` | string | 右侧短句第 1 行 | `第一版是在证明自己行` |
| `l2` | string | 右侧短句第 2 行 | `第七版是在替观众省时间` |
| `l3` | string | 右侧短句第 3 行 | `第八版你终于开始删句子` |
| `note` | string | 底部 mono 注脚（口径） | `单位：版 · 同一条片子的实际迭代次数` |
| `accent` | color | 数字卡底色 + 斜纹带 | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
