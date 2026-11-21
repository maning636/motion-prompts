# 品牌落款卡视觉规范

## 方向

上下各一条斜纹带，中间是 52×52 logo 方块 + 中文名 + 英文名 + 一行 118px 标语 + 年份区间胶囊，底部三枚标签。适合一条片子的品牌收尾帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，118px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，118px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部 20px 斜纹带 + 3px 规则 + 右对齐 mono 标签
- 主区 874px 高，整体垂直居中，元素间距 26px
- lockup 行：52×52 logo 方块 + 76px 中文名 + 30px mono 英文名
- 标语一行 118px 居中；年份区间胶囊 22px
- 底部三枚标签（黄 / 白 / 粉）+ 右对齐 22px 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 顶部斜纹带分 8 格推出 + 顶部规则从左画出（0.28–0.34s）
- 主区自上压入（0.28s，power4.out）
- logo 方块自左上拍入并压阴影（0.24s，power4.out）
- 中文名与英文名依次落位（0.22–0.26s）
- 标语自上压入（0.28s，power4.out）
- 年份胶囊与底部三枚标签逐枚落位并压阴影（0.22–0.24s）
- 底部斜纹带分 8 格推出，两条带一起匀速滚动 40px（1.1s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- logo 方块固定 52×52，不换圆形不换无边框
- 中文名用 sans，英文名与区间用 mono
- 标语不超过 12 个字
- 标签最多三枚

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `mark` | string | 52×52 方块里的两个字符（英文缩写） | `BB` |
| `cn` | string | 中文名（2–4 字） | `积木社` |
| `en` | string | 英文名（mono，全大写） | `BLOCKBRUT` |
| `slogan` | string | 标语（一行，8–12 字） | `不圆滑，不好惹，好记` |
| `year` | string | 年份区间（mono，用 — 连接） | `2017 — 2026` |
| `t1` | string | 底部标签 1（mono） | `TEMPLATES` |
| `t2` | string | 底部标签 2（mono） | `MOTION` |
| `t3` | string | 底部标签 3（mono） | `BRUTAL` |
| `note` | string | 底部 mono 注脚 | `一条规矩一个动作 · 攒够 100 条开一次长更` |
| `accent` | color | 强调色（方块 + 斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
