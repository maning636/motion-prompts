# 多选题贴视觉规范

## 方向

多选题贴的难点是「题和答案必须同时在场」。所以题条独占一行，选项三行几何完全一致，正确的那行整块换色并在右端挂一枚选中方块，读完一眼就知道选哪个。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#2FD07A`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 题条 left 96 / bottom 600，1728×128，白底 + 3px 黑边
- 三行选项 left 96，bottom 444 / 296 / 148，各 1728×132，行距 16px
- 每行内：88px ink 编号方块 + 900 选项文字（自适应）+ 右端选中标记
- 选中标记为 44px ink 方块 + 28px mono 文字
- 正确行整块换强调色底，字色恒 ink
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 题条自左分六格擦出（0.32s，steps(6)），压 2 帧阴影
- 三行选项自左依次落位（0.24s，power4.out），错峰 0.16s，各压 2 帧阴影
- 三行文字错峰自左装上（0.20–0.76s，power4.out）
- 选中标记自右分五格擦出（0.28s，steps(5)）
- 模 3 按下反馈：正确行位移 6px + 阴影 2px，1 帧完成再弹回
- 三行错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 三行几何必须完全对称：等宽等高，行距固定 16px
- 正确行用整块换底色，不用半透明蒙版
- 编号方块恒 ink 底 yellow 字，不随强调色变
- 按下反馈的位移量恒等于阴影偏移量
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `q` | string | 题目（10–20 字，单行） | `下面哪一个不是判断题的标准？` |
| `a` | string | 选项 A（4–12 字） | `能不能讲清楚` |
| `b` | string | 选项 B（4–12 字） | `有没有具体例子` |
| `c` | string | 选项 C（4–12 字） | `有没有人点赞` |
| `mark` | string | 正确项标记（2–5 字） | `选它` |
| `accent` | color | 强调色（正确项整块底） | `#2FD07A` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
