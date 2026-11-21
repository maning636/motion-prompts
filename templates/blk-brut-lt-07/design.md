# 嘉宾介绍条视觉规范

## 方向

把「嘉宾介绍」从一行小字升级成一个正经的下三分之一条：左边一个能换照片也能换首字的头像位，右边三层信息带把身份、姓名、一句介绍分开。适合访谈开场、连线、课程嘉宾介绍。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#FF5FA2`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 头像方块绝对定位 left 96 / bottom 152，320×320，3px 黑边 + 4px 直角
- 信息带 left 448 / bottom 152，宽 1376px 高 320px，底对齐头像块
- 信息带三段：ink 身份行 88px 高、强调色姓名行 122px 高、白底介绍行 110px 高
- 段间用 margin-top:-3px 吃掉重复边，靠 3px 实线分隔
- 姓名 900 大字 96px，身份 mono 24px，介绍 700 大字 34px
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 头像块自左 70px 拍入（0.26s，power4.out），落定瞬间阴影压 2 帧再弹回
- 信息带自右 70px 拍入，错峰 0.1s，各自压 2 帧阴影
- 身份 / 姓名 / 介绍 / GUEST 角标错峰自左装上（0.20–0.38s，power4.out）
- 头像块阴影档位脉冲一次（4×0.06s，steps(2)）
- 头像大字做一段匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 头像位是定尺方块，data-fit 的参照框必须指定成它自己
- 头像块的形状不随字号变：正方 + 3px 黑边 + 4px 直角
- GUEST 角标用 mono yellow，不加底不加边
- 三层信息带的颜色顺序不随强调色变化：ink → 强调色 → white
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `mark` | string | 头像位大字（1–2 字） | `李` |
| `nm` | string | 嘉宾姓名（2–4 字） | `李知遥` |
| `role` | string | 身份 / 头衔（6–14 字） | `独立播客主理人 · 12 期播客` |
| `bio` | string | 一句介绍（14–24 字） | `把复杂方法讲成能落地的三步` |
| `accent` | color | 强调色（姓名块 / 头像位底） | `#FF5FA2` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
