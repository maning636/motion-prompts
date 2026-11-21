# 二维码角标视觉规范

## 方向

二维码角标要能被长期挂在角落，所以三件事一次做完：二维码位、扫码之后能拿到什么、一句行动提示。格阵由行列坐标算出来而不是随机点，保证每次渲染完全一致。

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

- 标题条 left 96 / bottom 536，360×96，强调色底
- 二维码位 left 96 / bottom 152，360×360，白底 + 3px 黑边，内边距 26px
- 格阵 7 列 × 7 行，每格 38px，格距 5px，三块 3×3 定位角用 ::after 画内芯
- 说明条 left 96 / bottom 76，360×64，ink 底黄字
- 三段竖向排列，段间缝 24px 与 17px
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 二维码位自右分六格擦出（0.32s，steps(6)）
- 标题条自左 64px 拍入（0.26s，power4.out），压 2 帧阴影
- 方格逐格自左上角装到位（0.18s，power4.out，stagger 0.014s）
- 说明条自左分六格擦出（0.30s，steps(6)），文字错峰自右装上
- 三层错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 格阵绝不用 Math.random，每次渲染必须长得一模一样
- 定位角用 ::after 画内芯，不用 clip-path 造形状
- SVG 若有必须同时给 width 与 height
- 每个字都压在不透明色块上，深底 footage 上照样读得清
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `cap` | string | 二维码下方大字（4–8 字） | `扫码进群` |
| `note` | string | mono 补充说明（6–14 字） | `关注领完整资料` |
| `accent` | color | 强调色（说明条底 / 定位角块） | `#2FD07A` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
