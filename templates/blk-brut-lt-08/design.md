# 金句贴视觉规范

## 方向

把一句金句做成一张可以单独截图的卡片：左上角压一枚引号方块当视觉锚，右上角挂一枚 mono 角标，卡内三段结构把「金句 — 署名」分开。适合口播收束、金句卡、片尾定帧。

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

- 卡片定高 340px，绝对定位 left 340 / right 340 / bottom 200，几何固定
- 引号方块 120×120，left 300 / bottom 478，压住卡片左上角约 60px
- 右上角 mono 角标 right 316 / bottom 520，pill 圆角 9999px
- 卡内三段：900 大字 64px、3px 规则、mono 署名 24px，左右内边距 52px
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 卡片自下方 46px 硬着陆（0.28s，power4.out），落定瞬间阴影压 2 帧再弹回
- 金句 / 规则 / 署名错峰自左装上（0.22–0.36s，power4.out）
- 引号方块自左上盖章落位（0.8→1 单调缩放，0.24s，power3.out），压 2 帧阴影
- 右上角角标自右分五格擦出（0.30s，steps(5)）
- 引号方块与卡片反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 卡片定高固定，兄弟件靠常量坐标摆位，不依赖文字长度
- 大面积元素不做回弹弹入，引号方块用 0.8→1 单调缩放
- 引号是装饰字符，用文字硬投影撑住笔画，不加底不加边
- 署名用 mono，中文金句 letter-spacing 恒 0
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `text` | string | 金句正文（14–24 字，单行） | `你不是缺方法，是缺一个能验收的标准` |
| `au` | string | 署名行（6–14 字） | `李知遥 · 独立播客主理人` |
| `tag` | string | 右上角 mono 角标（2–6 字） | `QUOTE` |
| `accent` | color | 强调色（引号方块底） | `#FF5FA2` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
