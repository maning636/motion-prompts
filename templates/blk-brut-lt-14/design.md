# 弹幕贴视觉规范

## 方向

弹幕贴的读感来自「话在不断冒出来」，所以三条评论的右端与宽度全都错开，出现的顺序也刻意打乱（第一条、第三条、第二条）。适合把精选观众留言挂在直播画面上。

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

- 三条评论 right 96 / 150 / 120，bottom 560 / 436 / 312，行高 112px
- 每条由 106px 头像方块 + 自适应文字区两段构成
- 头像方块三块分别用 accent / yellow / blue，形状完全一致
- 文字区两行：21px mono 署名 + 36px 900 正文
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 三条评论按 1→3→2 的顺序依次自右分六格擦出，每条间隔 0.34s
- 每条落定瞬间阴影压 2 帧再弹回原档
- 正文自右 24px 装上（0.20s，power4.out）
- 三个头像底色按固定节奏 tl.set 硬切轮转两次
- 三层错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 头像方块的编号从署名里取数字派生，署名改了头像跟着改，不留第二个真源
- 三条评论的右端与宽度必须互不相同，否则读成一条整齐的栏
- 评论块恒为白底，不做半透明毛玻璃
- 出场顺序必须与画面顺序错开，才读得出「不断冒出来」
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `n1` | string | 第一条评论署名（2–6 字） | `观众 0371` |
| `t1` | string | 第一条评论（10–20 字） | `这句我昨天就收藏了，太实用` |
| `n2` | string | 第二条评论署名 | `观众 1284` |
| `t2` | string | 第二条评论（10–20 字） | `已经按这个标准重做了一遍选题` |
| `n3` | string | 第三条评论署名 | `观众 5590` |
| `t3` | string | 第三条评论（10–20 字） | `第三种方法我试了，交付快一半` |
| `accent` | color | 强调色（头像方块底） | `#FF5FA2` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
