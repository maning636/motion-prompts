# 来源引用贴视觉规范

## 方向

资讯类内容最容易被质疑的就是「这话哪来的」。所以来源引用贴把引文和出处拆成两块：左边整块蓝底给原话，右边 ink 块给机构名，中间用 3px 虚线撕口分开，一眼分得清哪句是引的、哪句是我们说的。

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

- 引文卡 left 120 / bottom 200，1180×320，整块蓝底 + 3px 黑边
- 卡内四段：24px mono 眉标、40px 引号、56px 900 引文、3px 规则、24px mono 出处
- 蓝底上的文字恒用 white，引号靠文字硬投影撑住笔画
- 出处块 left 1336 / bottom 200，364×320，ink 底，阴影走白
- 出处块内三段：26px mono 标签、150px 黄色 3px 虚线撕口、44px 机构名
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 引文卡自左 80px 拍入（0.28s，power4.out），压 2 帧阴影
- 眉标 / 引号 / 引文 / 规则 / 出处错峰自左装上（0.18–0.48s，power4.out）
- 出处块自右分六格擦出（0.32s，steps(6)），压 2 帧阴影
- 机构名自下 24px 装上（0.22s，power4.out）
- 机构名在 ink 底上按固定节奏白↔黄硬切，收尾停在白
- 两块反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 蓝底属于明度中的颜色，上面放字必须用 white，不许放黄色小字
- ink 底上的件阴影走白（§7.2 规则 B）
- 引号是装饰字符，用文字硬投影撑住笔画，不加底不加边
- 撕口是 3px 虚线元素，恒为 ink 或块自身底色
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 蓝卡上的 mono 眉标（4–12 字） | `SOURCE / 出处` |
| `quote` | string | 引文（12–22 字，单行） | `知识密度决定复购，不决定涨粉` |
| `by` | string | 原始出处（8–20 字） | `2026 内容行业访谈 · 第 7 位受访者` |
| `src` | string | 来源块标签（2–6 字） | `来源` |
| `srcname` | string | 来源名（4–12 字） | `新榜研究院` |
| `accent` | color | 强调色（蓝卡上的引号 / 来源块） | `#3D7BFF` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
