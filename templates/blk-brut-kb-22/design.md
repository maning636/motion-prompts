# 步骤条视觉规范

## 方向

横向四列步骤，列与列之间是 3px 实线，每列一枚 52×52 编号方块加标题与说明，四步依次落位。适合把一套方法拆成三到四步讲清楚。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #2FD07A 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，72px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 眉标 + 72px 主标题，标题区 144px
- 步骤区 1744×768px，顶部 3px 实线，列间 3px 竖线
- 每列内边距 26/24px，内容垂直居中
- 列内：52px 编号方块 + 40px 步骤标题 + 26px 说明
- 底部规则 + 22px 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与主标题自左上硬着陆（0.24–0.26s，power4.out）
- 步骤条顶边分 8 格画出（0.36s，steps(8)）
- 四步逐列自上落位，错峰 0.22s（0.26s，power4.out）
- 每步内部编号方块、标题、说明再错峰 0.04–0.06s
- 编号方块落定阴影压 2 帧再弹回（0.08s，steps(2)）
- 底部规则从左画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 步骤固定 3–4 步
- 每步只写一个动作
- 步骤说明不超过 12 个字
- 编号方块永不改色改圆角

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `STEPS / 步骤条` |
| `title` | string | 主标题（一行，12–18 字） | `把一条口播拆成四步，就不容易讲乱` |
| `s1` | string | 第 1 步标题（4–8 字） | `先定一句话` |
| `d1` | string | 第 1 步说明（10–18 字） | `写不出这一句就别开机` |
| `s2` | string | 第 2 步标题 | `再拆三个动作` |
| `d2` | string | 第 2 步说明 | `每个动作只干一件事` |
| `s3` | string | 第 3 步标题 | `挑一个能拍的` |
| `d3` | string | 第 3 步说明 | `拍不了的整段删掉` |
| `s4` | string | 第 4 步标题 | `最后才配画面` |
| `d4` | string | 第 4 步说明 | `顺序反了就会返工` |
| `note` | string | 底部 mono 注脚 | `步骤 3–4 步 · 每步一个动作` |
| `accent` | color | 强调色（当前步编号块 + 斜纹带） | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
