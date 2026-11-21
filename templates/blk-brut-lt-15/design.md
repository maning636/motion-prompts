# 比分贴视觉规范

## 方向

比分的读法是「谁大谁小」，所以中间那根比两侧更高的 ink 竖柱是整个构图的支点：视线先落在竖柱上，再分向两侧读两个数。适合赛事解说、数据对决、比分播报。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#FFD429`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 两侧队伍卡 left 96 / 1164，bottom 200，各 660×288，几何对称
- 中柱 left 766，bottom 200，388×400，比两侧高出 112px
- 队内两段：mono 队名 32px + 140px mono 比分数字
- 中柱内三段：76px VS、150px 白色 3px 规则、26px 回合说明
- 领先方队伍卡整块换强调色底，字色恒 ink
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 左右两块自两侧对撞入位（0.26s，power4.out），错峰 0.12s，各压 2 帧阴影
- 中柱自上方 70px 压下（0.28s，power4.out），压 2 帧阴影
- 队名自各自方向装上，中柱三段错峰自上下装上
- 双方比分 steps(11) 同时整数跳到终值，展示窗口写死 1.1s
- 三块错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 比分数字用 mono + tabular-nums，位宽稳定
- 中柱必须比两侧高，构图的支点靠高度差建立
- ink 底上的文字恒用 white / yellow，不放 ink
- onUpdate 里只写 textContent，不做任何 DOM 测量
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `an` | string | 左侧队名（2–8 字） | `主队` |
| `av` | string | 左侧比分（1–3 位数） | `128` |
| `bn` | string | 右侧队名（2–8 字） | `客队` |
| `bv` | string | 右侧比分（1–3 位数） | `96` |
| `vs` | string | 中段 mono 标签（2–6 字） | `VS` |
| `note` | string | 中段下方说明（2–8 字） | `第 3 回合` |
| `accent` | color | 强调色（领先方色块） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
