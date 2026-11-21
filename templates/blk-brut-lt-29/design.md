# 规格参数贴视觉规范

## 方向

规格参数贴的读法是「并列对比」，所以三列几何必须完全对称：等宽等高、行距一致、编号方块形状一致。参数值是画面主角，标签只负责说明它是什么。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#3D7BFF`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 三列 left 96 / 680 / 1264，bottom 200，各 560×300，列距 24px
- 列内两段：68px 编号方块 + 30px mono 标签、52px 900 参数值
- 三个编号方块分别用 yellow / accent / green，形状完全一致
- 编号方块 68×68，3px 黑边 + 4px 直角
- 参数值中文用 sans 900，含数字的规格用 mono
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 三列自左依次分六格擦出（0.32s，steps(6)），错峰 0.18s，各压 2 帧阴影
- 三列标签自下 22px、参数值自下 26px 错峰装上（power4.out）
- 三个编号方块自上 20px 错峰装上（0.20s，power4.out）
- 三列错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 三列几何必须完全对称：等宽等高、列距固定
- 编号方块形状三列一致，只有底色轮转
- 参数值单行不换行，靠 data-fit 收口
- 中文参数 letter-spacing 恒 0
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `l1` | string | 规格一标签（2–5 字） | `材质` |
| `v1` | string | 规格一值（3–10 字） | `进口铜版纸` |
| `l2` | string | 规格二标签（2–5 字） | `尺寸` |
| `v2` | string | 规格二值（3–10 字） | `210 × 148` |
| `l3` | string | 规格三标签（2–5 字） | `重量` |
| `v3` | string | 规格三值（3–10 字） | `480 克` |
| `accent` | color | 强调色（第二列色块底） | `#3D7BFF` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
